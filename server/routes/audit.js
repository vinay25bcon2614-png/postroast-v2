import { createSupabaseClient, getUser } from '../lib/supabase.js';

export async function handleAudit(req, res) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await getUser(token);
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { postText } = req.body;

    if (!postText) {
      return res.status(400).json({ error: 'Missing required field: postText' });
    }

    // Quick audit checks before posting
    const audit = {
      length: postText.length,
      hasHashtags: /#\w+/.test(postText),
      hasMention: /@\w+/.test(postText),
      hasLink: /https?:\/\//.test(postText),
      hasCTA: /dm|reply|comment|share|click|learn more|check out|visit/i.test(postText),
      paragraphCount: postText.split('\n\n').length,
      wordCount: postText.split(/\s+/).length,
      readabilityScore: calculateReadability(postText),
      issues: [],
      suggestions: []
    };

    // Generate audit issues and suggestions
    if (audit.length < 50) {
      audit.issues.push('Post is too short - aim for 50-150 characters minimum');
    }
    if (audit.length > 3000) {
      audit.issues.push('Post is very long - consider breaking into thread');
    }
    if (!audit.hasCTA) {
      audit.suggestions.push('Consider adding a call-to-action (DM, reply, visit link)');
    }
    if (audit.wordCount < 15) {
      audit.suggestions.push('Post is short - add more context or explanation');
    }
    if (!audit.hasHashtags) {
      audit.suggestions.push('Consider adding 2-3 relevant hashtags');
    }

    res.json({
      success: true,
      audit
    });

  } catch (error) {
    console.error('Audit error:', error);
    res.status(500).json({ error: error.message || 'Failed to audit post' });
  }
}

function calculateReadability(text) {
  // Simple Flesch Reading Ease approximation
  const sentences = text.split(/[.!?]+/).length;
  const words = text.split(/\s+/).length;
  const syllables = countSyllables(text);
  
  if (words === 0) return 0;
  const score = 206.835 - 1.015 * (words / sentences) - 84.6 * (syllables / words);
  return Math.max(0, Math.min(100, Math.round(score)));
}

function countSyllables(text) {
  const words = text.toLowerCase().match(/\b\w+\b/g) || [];
  let count = 0;
  
  words.forEach(word => {
    count += word.match(/[aeiouy]/g)?.length || 0;
  });
  
  return Math.max(1, count);
}

export default handleAudit;
