import Anthropic from '@anthropic-ai/sdk';
import { createSupabaseClient, getUser } from '../lib/supabase.js';

const client = new Anthropic();

export async function handleStyleDNA(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUser(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const supabase = createSupabaseClient(token);

    // Get user's recent roasts to analyze voice
    const { data: recentRoasts, error: roastError } = await supabase
      .from('roasts')
      .select('content, scores, insights')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (roastError) {
      return res.status(400).json({ error: 'Failed to fetch roasts for analysis' });
    }

    // Check if user has enough posts for analysis
    const postCount = recentRoasts?.length || 0;
    
    if (postCount < 5) {
      return res.status(400).json({
        error: 'Insufficient data',
        message: `Need at least 5 posts for Style DNA analysis. You have ${postCount}.`
      });
    }

    // Analyze voice patterns from posts
    const voiceAnalysis = await analyzeVoicePatterns(recentRoasts);

    // Check if user has full Style DNA (10+ posts)
    const isFullDNA = postCount >= 10;
    const dnaMatureness = isFullDNA ? 'complete' : 'partial';

    // Prepare DNA data
    const styleDNA = {
      user_id: user.id,
      post_count: postCount,
      maturity_level: dnaMatureness,
      voice_traits: voiceAnalysis.traits,
      tone: voiceAnalysis.tone,
      patterns: voiceAnalysis.patterns,
      strengths: voiceAnalysis.strengths,
      areas_for_improvement: voiceAnalysis.improvements,
      updated_at: new Date().toISOString()
    };

    // Check if style DNA exists
    const { data: existingDNA } = await supabase
      .from('style_dna')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (existingDNA) {
      // Update existing DNA
      await supabase
        .from('style_dna')
        .update(styleDNA)
        .eq('user_id', user.id);
    } else {
      // Create new DNA record
      await supabase
        .from('style_dna')
        .insert([styleDNA]);
    }

    res.json({
      success: true,
      styleDNA,
      maturity: {
        level: dnaMatureness,
        postCount,
        nextMilestone: isFullDNA ? 'Analysis Complete' : `${10 - postCount} more posts for complete analysis`
      }
    });

  } catch (error) {
    console.error('Style DNA error:', error);
    res.status(500).json({ error: error.message || 'Failed to analyze style DNA' });
  }
}

async function analyzeVoicePatterns(roasts) {
  // Extract text from roasts
  const texts = roasts.map(r => r.content).join('\n\n');

  // Use Claude to analyze voice patterns
  const prompt = `Analyze the following LinkedIn posts to identify the writer's unique voice and style patterns.

POSTS:
"""
${texts}
"""

Provide your analysis in JSON format with these fields:
{
  "traits": ["list", "of", "key", "voice", "traits"],
  "tone": "dominant tone (e.g., 'professional', 'conversational', 'authoritative', 'playful')",
  "patterns": ["writing pattern 1", "pattern 2"],
  "strengths": ["what this voice does well"],
  "improvements": ["areas to develop"]
}

Be specific and actionable.`;

  try {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [{ role: 'user', content: prompt }]
    });

    const analysisText = response.content[0].text;
    
    // Extract JSON from response
    const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error('Claude analysis error:', error);
  }

  // Fallback analysis
  return {
    traits: ['authentic', 'emerging'],
    tone: 'professional',
    patterns: ['post-response pattern developing'],
    strengths: ['authentic voice', 'engagement'],
    improvements: ['consistency', 'storytelling depth']
  };
}

export default handleStyleDNA;
