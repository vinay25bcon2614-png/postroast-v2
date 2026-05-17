import Anthropic from '@anthropic-ai/sdk';
import { createSupabaseClient, getUser } from '../lib/supabase.js';
import { getRewritePrompt } from '../lib/prompts.js';

const client = new Anthropic();

export async function handleRewrite(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUser(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { postText, goals, creatorMix, roastId } = req.body;

    if (!postText || !goals || !creatorMix) {
      return res.status(400).json({ error: 'Missing required fields: postText, goals, creatorMix' });
    }

    // Get the authenticated Supabase client
    const supabase = createSupabaseClient(token);

    // Fetch roast data if roastId is provided
    let scores = null;
    if (roastId) {
      const { data: roastData, error: roastError } = await supabase
        .from('roasts')
        .select('scores')
        .eq('id', roastId)
        .eq('user_id', user.id)
        .single();

      if (roastError) {
        console.error('Roast fetch error:', roastError);
        return res.status(404).json({ error: 'Roast not found' });
      }

      scores = roastData?.scores;
    }

    // Fetch user's style DNA if available
    const { data: dnaData } = await supabase
      .from('style_dna')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Build the prompt
    const prompt = getRewritePrompt(postText, goals, scores, creatorMix, dnaData);

    // Call Claude API
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const rewriteContent = response.content[0].text;

    // Parse rewrite response (should contain improved post and notes)
    let rewriteData = {
      rewrittenPost: rewriteContent,
      improvements: []
    };

    // Try to extract structured data if available
    if (rewriteContent.includes('IMPROVED POST:')) {
      const parts = rewriteContent.split('IMPROVED POST:');
      if (parts[1]) {
        const improved = parts[1].split('\n\n')[0].trim();
        rewriteData.rewrittenPost = improved;
        
        // Extract improvements
        if (rewriteContent.includes('KEY IMPROVEMENTS:')) {
          const impPart = rewriteContent.split('KEY IMPROVEMENTS:')[1];
          const improvements = impPart.split('\n').filter(line => line.trim().startsWith('-'));
          rewriteData.improvements = improvements.map(imp => imp.trim());
        }
      }
    }

    // Save rewrite to database if roastId is provided
    if (roastId) {
      await supabase
        .from('roasts')
        .update({ 
          rewrite: rewriteData.rewrittenPost,
          rewrite_improvements: rewriteData.improvements,
          updated_at: new Date().toISOString()
        })
        .eq('id', roastId)
        .eq('user_id', user.id);
    }

    res.json({
      success: true,
      rewriteId: roastId,
      rewrite: rewriteData
    });

  } catch (error) {
    console.error('Rewrite error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate rewrite' });
  }
}

export default handleRewrite;
