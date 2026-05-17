import express from 'express';
import { createSupabaseClient, getUser } from '../lib/supabase.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // Get user from token
    const user = getUser(req.token);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const supabase = createSupabaseClient(req.token);

    // Get all roasts for this user
    const { data: roasts, error } = await supabase
      .from('roasts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch roasts' });
    }

    if (!roasts || roasts.length === 0) {
      return res.json({
        postsCount: 0,
        avgScore: 0,
        scoreHistory: [],
        dimensionAverages: {
          hook: 0,
          clarity: 0,
          authority: 0,
          engagement: 0,
          format: 0,
          goalAlignment: 0,
          cta: 0,
          originality: 0
        },
        formatPerformance: {}
      });
    }

    // Calculate statistics
    const avgScore = Math.round(
      roasts.reduce((sum, r) => sum + (r.composite_score || 0), 0) / roasts.length
    );

    // Score history (last 30)
    const scoreHistory = roasts.slice(0, 30).reverse().map(r => ({
      date: new Date(r.created_at).toLocaleDateString(),
      score: r.composite_score
    }));

    // Dimension averages
    const dimensionAverages = {
      hook: Math.round(roasts.reduce((sum, r) => sum + (r.hook_score || 0), 0) / roasts.length),
      clarity: Math.round(roasts.reduce((sum, r) => sum + (r.clarity_score || 0), 0) / roasts.length),
      authority: Math.round(roasts.reduce((sum, r) => sum + (r.authority_score || 0), 0) / roasts.length),
      engagement: Math.round(roasts.reduce((sum, r) => sum + (r.engagement_score || 0), 0) / roasts.length),
      format: Math.round(roasts.reduce((sum, r) => sum + (r.format_score || 0), 0) / roasts.length),
      goalAlignment: Math.round(roasts.reduce((sum, r) => sum + (r.goal_alignment_score || 0), 0) / roasts.length),
      cta: Math.round(roasts.reduce((sum, r) => sum + (r.cta_score || 0), 0) / roasts.length),
      originality: Math.round(roasts.reduce((sum, r) => sum + (r.originality_score || 0), 0) / roasts.length)
    };

    // Format performance
    const formatPerformance = {};
    roasts.forEach(r => {
      const format = r.format_detected || 'Unknown';
      if (!formatPerformance[format]) {
        formatPerformance[format] = { count: 0, totalScore: 0 };
      }
      formatPerformance[format].count += 1;
      formatPerformance[format].totalScore += r.composite_score || 0;
    });

    Object.keys(formatPerformance).forEach(format => {
      formatPerformance[format].avgScore = Math.round(
        formatPerformance[format].totalScore / formatPerformance[format].count
      );
    });

    res.json({
      postsCount: roasts.length,
      avgScore,
      scoreHistory,
      dimensionAverages,
      formatPerformance,
      recentPosts: roasts.slice(0, 5)
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
