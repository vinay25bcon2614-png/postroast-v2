/**
 * GET /api/analytics
 * Get user's analytics and performance data
 */
import express from 'express'
import { getCurrentUser } from '../lib/database.js'
import { getSupabaseServerClient } from '../lib/supabase.ts'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    // Get current user
    let user
    try {
      user = await getCurrentUser(req)
    } catch (err) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const supabase = getSupabaseServerClient()

    // Parallel data fetching
    const [roastsData, streakData, leaderboardData, profileData] = await Promise.all([
      // Get all roasts for user
      supabase
        .from('roasts')
        .select('scores, created_at, goals_active, format_detected')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false }),
      
      // Get streak
      supabase
        .from('streaks')
        .select('current_streak, longest_streak, last_roast_date')
        .eq('user_id', user.id)
        .single(),
      
      // Get leaderboard position
      supabase
        .from('leaderboard_entries')
        .select('avg_score, posts_this_week, improvement_this_week')
        .eq('user_id', user.id)
        .single(),
      
      // Get user profile
      supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()
    ])

    const roasts = roastsData.data || []
    const streak = streakData.data
    const leaderboard = leaderboardData.data
    const profile = profileData.data

    // Calculate analytics
    if (roasts.length === 0) {
      return res.json({
        empty: true,
        message: 'No roasts yet. Create your first roast to see analytics.'
      })
    }

    // Calculate score trends
    const scores30d = roasts.filter(r => {
      const date = new Date(r.created_at)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      return date >= thirtyDaysAgo
    })

    const avgScore = roasts.length > 0
      ? Math.round(roasts.reduce((sum, r) => sum + (r.scores?.overall || 0), 0) / roasts.length)
      : 0

    const avgScore30d = scores30d.length > 0
      ? Math.round(scores30d.reduce((sum, r) => sum + (r.scores?.overall || 0), 0) / scores30d.length)
      : avgScore

    const improvement = avgScore30d - (roasts.length > scores30d.length ? avgScore : 0)

    // Calculate dimension averages
    const dimensionAverages = {
      hook: 0,
      clarity: 0,
      authority: 0,
      engagement: 0,
      originality: 0,
      cta: 0,
      structure: 0,
      viral_potential: 0
    }

    roasts.forEach(r => {
      Object.keys(dimensionAverages).forEach(key => {
        dimensionAverages[key] += (r.scores?.[key] || 0)
      })
    })

    Object.keys(dimensionAverages).forEach(key => {
      dimensionAverages[key] = Math.round(dimensionAverages[key] / roasts.length)
    })

    // Format performance by format detected
    const formatPerformance = {}
    roasts.forEach(r => {
      const format = r.format_detected || 'Unknown'
      if (!formatPerformance[format]) {
        formatPerformance[format] = { total: 0, count: 0, avg: 0 }
      }
      formatPerformance[format].total += r.scores?.overall || 0
      formatPerformance[format].count += 1
      formatPerformance[format].avg = Math.round(formatPerformance[format].total / formatPerformance[format].count)
    })

    res.json({
      empty: false,
      summary: {
        total_roasts: roasts.length,
        avg_score: avgScore,
        avg_score_30d: avgScore30d,
        improvement_30d: Math.round(improvement),
        streak: streak?.current_streak || 0,
        longest_streak: streak?.longest_streak || 0
      },
      leaderboard: {
        avg_score: leaderboard?.avg_score || 0,
        posts_this_week: leaderboard?.posts_this_week || 0,
        improvement_this_week: Math.round(leaderboard?.improvement_this_week || 0)
      },
      dimensions: dimensionAverages,
      formats: formatPerformance,
      recent: roasts.slice(0, 10).map(r => ({
        id: r.id,
        scores: r.scores,
        created_at: r.created_at,
        format: r.format_detected
      })),
      style_dna: profile && {
        tone: profile.tone_score,
        storytelling: profile.storytelling_score,
        vulnerability: profile.vulnerability_score,
        humor: profile.humor_score,
        authority: profile.authority_score,
        posts_analyzed: profile.posts_analyzed
      }
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router;
