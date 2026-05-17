import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { createSupabaseClient, getUser } from '../lib/supabase.js';
import { getRoastPrompt } from '../lib/prompts.js';

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { postText, goals, creatorMix } = req.body;
    
    if (!postText || !postText.trim()) {
      return res.status(400).json({ error: 'Post text is required' });
    }

    if (!goals || goals.length === 0) {
      return res.status(400).json({ error: 'At least one goal is required' });
    }

    // Get user from token
    const user = getUser(req.token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get roast prompt
    const prompt = getRoastPrompt(postText, goals, creatorMix || []);

    // Call Claude API
    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Extract JSON response
    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';
    let analysis;
    
    try {
      // Try to parse JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      console.error('Failed to parse Claude response:', responseText);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    if (!analysis) {
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    // Save roast to Supabase
    const supabase = createSupabaseClient(req.token);
    const { data, error } = await supabase.from('roasts').insert({
      user_id: user.id,
      original_text: postText,
      composite_score: Math.round(analysis.compositeScore || 0),
      hook_score: Math.round(analysis.scores?.hook || 0),
      clarity_score: Math.round(analysis.scores?.clarity || 0),
      authority_score: Math.round(analysis.scores?.authority || 0),
      engagement_score: Math.round(analysis.scores?.engagement || 0),
      format_score: Math.round(analysis.scores?.format || 0),
      goal_alignment_score: Math.round(analysis.scores?.goalAlignment || 0),
      cta_score: Math.round(analysis.scores?.cta || 0),
      originality_score: Math.round(analysis.scores?.originality || 0),
      format_detected: analysis.formatDetected,
      summary: analysis.summary,
      weaknesses: analysis.weaknesses,
      key_insight: analysis.keyInsight,
      improvement_suggestion: analysis.improvement,
      goals: goals.map(g => g.id),
      creator_mix: creatorMix || []
    }).select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save roast' });
    }

    // Update streak
    await updateStreak(user.id, supabase);

    // Update leaderboard
    await updateLeaderboard(user.id, analysis.compositeScore, supabase);

    res.json({
      roastId: data?.[0]?.id,
      analysis: {
        compositeScore: analysis.compositeScore,
        scores: analysis.scores,
        formatDetected: analysis.formatDetected,
        summary: analysis.summary,
        weaknesses: analysis.weaknesses,
        keyInsight: analysis.keyInsight,
        improvement: analysis.improvement
      }
    });
  } catch (error) {
    console.error('Roast error:', error);
    res.status(500).json({ error: error.message });
  }
});

async function updateStreak(userId, supabase) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data: streak } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (!streak) {
    // Create new streak
    await supabase.from('streaks').insert({
      user_id: userId,
      current_streak: 1,
      best_streak: 1,
      last_roast_date: today
    });
  } else {
    const lastDate = streak.last_roast_date;
    const today_date = new Date();
    const last_date = new Date(lastDate);
    const diffDays = Math.floor((today_date - last_date) / (1000 * 60 * 60 * 24));

    let newStreak = streak.current_streak;
    if (diffDays === 1) {
      newStreak = streak.current_streak + 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }

    await supabase
      .from('streaks')
      .update({
        current_streak: newStreak,
        best_streak: Math.max(newStreak, streak.best_streak),
        last_roast_date: today
      })
      .eq('user_id', userId);
  }
}

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
