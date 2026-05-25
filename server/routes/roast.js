/**
 * POST /api/roast
 * Score and rewrite a LinkedIn post using Claude
 */
import express from 'express'
import Anthropic from '@anthropic-ai/sdk'
import { getCurrentUser, getOrCreateUserProfile, checkRoastLimit, incrementRoastCount, updateUserStreak, updateLeaderboardEntry, saveRoast } from '../lib/database.js'

const router = express.Router()
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

/**
 * Roasting prompt builder
 */
function buildRoastPrompt(post, goals, creatorMix = [], styleDNA = null) {
  const goalsText = goals.join(', ')
  
  let prompt = `You are a LinkedIn post strategist and copywriter. Analyze this LinkedIn post using this structured evaluation framework.

POST TO ANALYZE:
"${post}"

TARGET GOALS: ${goalsText}

Please score this post on these 8 dimensions (0-100 each):
1. Hook Quality - Does it grab attention immediately?
2. Clarity - Is the core message clear and easy to understand?
3. Authority - Does it establish credibility or expertise?
4. Engagement - Does it invite comments/reactions?
5. Originality - Is it fresh or generic?
6. CTA Strength - Is the call-to-action clear?
7. Structure - Is it well-organized and easy to follow?
8. Viral Potential - Could it get high reach/impressions?

Also identify:
- What creator's style does this most resemble? (Walsh, Hormozi, Acosta, Bartlett, Rachitsky, McCormick)
- Suggested format classification
- Top 3 weaknesses
- Top 3 strengths
- Suggested rewrite that improves the weakest dimension

Respond ONLY with valid JSON (no markdown, no code blocks):
{
  "scores": {
    "hook": 0,
    "clarity": 0,
    "authority": 0,
    "engagement": 0,
    "originality": 0,
    "cta": 0,
    "structure": 0,
    "viral_potential": 0,
    "overall": 0
  },
  "format_detected": "string",
  "creators_matched": ["Walsh", "Hormozi"],
  "strengths": ["strength1", "strength2", "strength3"],
  "weaknesses": ["weakness1", "weakness2", "weakness3"],
  "rewrite": "improved post text here",
  "reasoning": "brief explanation of the rewrite"
}
`

  if (styleDNA) {
    prompt += `\n\nUSER'S WRITING STYLE (based on analysis of their previous posts):
- Tone tendency: ${styleDNA.tone_score}/1
- Storytelling: ${styleDNA.storytelling_score}/1
- Vulnerability: ${styleDNA.vulnerability_score}/1
- Humor: ${styleDNA.humor_score}/1
- Authority emphasis: ${styleDNA.authority_score}/1

Incorporate their natural style into the rewrite.`
  }

  return prompt
}

router.post('/', async (req, res) => {
  try {
    const { post, goals, mode = 'full', styleDNA } = req.body

    // Validation
    if (!post || !post.trim()) {
      return res.status(400).json({ error: 'Post text is required' })
    }

    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({ error: 'At least one goal is required' })
    }

    if (post.length > 5000) {
      return res.status(400).json({ error: 'Post too long (max 5000 characters)' })
    }

    // Get current user
    let user
    try {
      user = await getCurrentUser(req)
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    // Get or create user profile
    await getOrCreateUserProfile(user.id)

    // Check roast limit
    const { allowed, used, limit } = await checkRoastLimit(user.id)
    if (!allowed) {
      return res.status(429).json({
        error: `Daily limit reached (${used}/${limit})`,
        used,
        limit,
        upgrade_available: true
      })
    }

    // Build Claude prompt
    const prompt = buildRoastPrompt(post, goals, [], styleDNA)

    // Call Claude
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    })

    // Extract response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : ''
    
    let analysis
    try {
      // Remove markdown code blocks if present
      let jsonText = responseText
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.slice(7)
      }
      if (jsonText.startsWith('```')) {
        jsonText = jsonText.slice(3)
      }
      if (jsonText.endsWith('```')) {
        jsonText = jsonText.slice(0, -3)
      }
      
      analysis = JSON.parse(jsonText.trim())
    } catch (e) {
      console.error('Failed to parse Claude response:', responseText)
      return res.status(500).json({ error: 'Failed to parse AI response' })
    }

    // Validate response
    if (!analysis.scores || typeof analysis.scores.overall !== 'number') {
      console.error('Invalid analysis structure:', analysis)
      return res.status(500).json({ error: 'Invalid AI response format' })
    }

    // Save roast to database
    const roastData = {
      original_post: post,
      goals,
      scores: analysis.scores,
      rewrite: analysis.rewrite,
      rewrite_prompt: prompt,
      format_detected: analysis.format_detected,
      creators_used: analysis.creators_matched || []
    }

    const savedRoast = await saveRoast(user.id, roastData)

    // Update streak, usage, and leaderboard
    await Promise.all([
      incrementRoastCount(user.id),
      updateUserStreak(user.id),
      updateLeaderboardEntry(user.id, analysis.scores.overall)
    ])

    res.json({
      roast_id: savedRoast.id,
      scores: analysis.scores,
      format_detected: analysis.format_detected,
      creators_matched: analysis.creators_matched,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      rewrite: analysis.rewrite,
      reasoning: analysis.reasoning
    })
  } catch (error) {
    console.error('Roast API error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

async function updateLeaderboard(userId, score, supabase) {
  const { data: existing } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (existing) {
    await supabase
      .from('leaderboard_entries')
      .update({
        avg_score: (existing.avg_score * existing.total_posts + score) / (existing.total_posts + 1),
        total_posts: existing.total_posts + 1,
        last_roast_date: new Date().toISOString()
      })
      .eq('user_id', userId);
  } else {
    await supabase.from('leaderboard_entries').insert({
      user_id: userId,
      avg_score: score,
      total_posts: 1,
      best_score: score,
      opted_in: false
    });
  }
}

export default router;
