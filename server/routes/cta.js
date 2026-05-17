import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { getUser } from '../lib/supabase.js';
import { getCTAPrompt } from '../lib/prompts.js';

const router = express.Router();
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

router.post('/', async (req, res) => {
  try {
    const { goal, offer, audience, postContext } = req.body;

    if (!goal) {
      return res.status(400).json({ error: 'Goal is required' });
    }

    // Get user from token
    const user = getUser(req.token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get CTA prompt
    const prompt = getCTAPrompt(goal, offer, audience || 'Your audience', postContext || 'LinkedIn post');

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
    let result;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      result = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (e) {
      console.error('Failed to parse Claude response:', responseText);
      return res.status(500).json({ error: 'Failed to parse AI response' });
    }

    if (!result || !result.ctas) {
      return res.status(500).json({ error: 'Invalid AI response format' });
    }

    // Sort by score
    const sortedCTAs = result.ctas.sort((a, b) => b.score - a.score);

    res.json({
      ctas: sortedCTAs,
      topCTA: sortedCTAs[0]
    });
  } catch (error) {
    console.error('CTA error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
