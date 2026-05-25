/**
 * Supabase database helper functions
 */
import { getSupabaseServerClient, createUserContextClient, getTokenFromRequest } from './supabase.js'

/**
 * Get the current user from the database
 */
export async function getCurrentUser(req) {
  const token = getTokenFromRequest(req)
  if (!token) {
    throw new Error('No authorization token')
  }

  try {
    const supabase = createUserContextClient(token)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      throw new Error('Unauthorized')
    }

    return user
  } catch (err) {
    throw new Error('Failed to get user: ' + err.message)
  }
}

/**
 * Get or create user profile in users table
 */
export async function getOrCreateUserProfile(userId) {
  const supabase = getSupabaseServerClient()
  
  // Try to get existing user
  const { data: existing } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (existing) {
    return existing
  }

  // Create new user record
  const { data: user, error } = await supabase.auth.admin.getUserById(userId)
  if (error) throw error

  const { data: created, error: createError } = await supabase
    .from('users')
    .insert({
      id: userId,
      email: user.user.email,
      name: user.user.user_metadata?.name || user.user.email?.split('@')[0],
      onboarding_complete: false
    })
    .select()
    .single()

  if (createError) throw createError

  // Create default profile record
  await supabase
    .from('user_profiles')
    .insert({
      user_id: userId,
      tone_score: 0.5,
      storytelling_score: 0.5,
      vulnerability_score: 0.5,
      humor_score: 0.5,
      authority_score: 0.5,
      posts_analyzed: 0
    })

  // Create default streak record
  await supabase
    .from('streaks')
    .insert({
      user_id: userId,
      current_streak: 0,
      longest_streak: 0
    })

  // Create default leaderboard entry
  await supabase
    .from('leaderboard_entries')
    .insert({
      user_id: userId,
      display_name: `Creator ${Math.random().toString(36).substring(7).toUpperCase()}`,
      opted_in: false,
      avg_score: 0
    })

  // Create default subscription (free plan)
  await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: 'free',
      status: 'active'
    })

  return created
}

/**
 * Check if user has exceeded daily roast limit
 */
export async function checkRoastLimit(userId) {
  const supabase = getSupabaseServerClient()

  // Get today's roast count
  const today = new Date().toISOString().split('T')[0]
  const { data: logs, error } = await supabase
    .from('usage_logs')
    .select('roasts_today')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`)
    .lt('created_at', `${today}T23:59:59`)
    .limit(1)

  if (error) throw error

  const roastsToday = logs?.[0]?.roasts_today || 0
  
  // Get user plan
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('plan_type')
    .eq('user_id', userId)
    .single()

  const limit = sub?.plan_type === 'pro' ? 100 : 3 // Free users get 3/day
  
  return {
    allowed: roastsToday < limit,
    used: roastsToday,
    limit
  }
}

/**
 * Increment user's daily roast count
 */
export async function incrementRoastCount(userId) {
  const supabase = getSupabaseServerClient()

  const today = new Date().toISOString().split('T')[0]
  
  // Try to update existing log for today
  const { data: existing } = await supabase
    .from('usage_logs')
    .select('id, roasts_today')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00`)
    .lt('created_at', `${today}T23:59:59`)
    .single()

  if (existing) {
    await supabase
      .from('usage_logs')
      .update({ roasts_today: existing.roasts_today + 1 })
      .eq('id', existing.id)
  } else {
    // Create new usage log for today
    await supabase
      .from('usage_logs')
      .insert({
        user_id: userId,
        roasts_today: 1,
        reset_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      })
  }
}

/**
 * Update user's streak
 */
export async function updateUserStreak(userId) {
  const supabase = getSupabaseServerClient()

  const { data: streak, error } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error

  const today = new Date().toISOString().split('T')[0]
  const lastRoastDate = streak?.last_roast_date ? new Date(streak.last_roast_date).toISOString().split('T')[0] : null
  
  let newStreak = streak?.current_streak || 0
  let newLongest = streak?.longest_streak || 0

  if (lastRoastDate === today) {
    // Already roasted today, don't increment
    return
  }

  if (lastRoastDate === new Date(Date.now() - 86400000).toISOString().split('T')[0]) {
    // Roasted yesterday, increment streak
    newStreak = (streak?.current_streak || 0) + 1
  } else {
    // Streak broken, start new
    newStreak = 1
  }

  if (newStreak > newLongest) {
    newLongest = newStreak
  }

  await supabase
    .from('streaks')
    .update({
      current_streak: newStreak,
      longest_streak: newLongest,
      last_roast_date: today
    })
    .eq('user_id', userId)
}

/**
 * Update leaderboard after a roast
 */
export async function updateLeaderboardEntry(userId, score) {
  const supabase = getSupabaseServerClient()

  const { data: entry, error } = await supabase
    .from('leaderboard_entries')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code !== 'PGRST116') throw error

  if (!entry) return // User not on leaderboard yet

  // Get all roasts for this user
  const { data: roasts } = await supabase
    .from('roasts')
    .select('scores')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (!roasts || roasts.length === 0) return

  // Calculate average score
  const totalScore = roasts.reduce((sum, r) => {
    const scores = r.scores || {}
    return sum + (scores.overall || 0)
  }, 0)
  const avgScore = totalScore / roasts.length

  // Calculate posts this week
  const weekStart = new Date()
  weekStart.setDate(weekStart.getDate() - weekStart.getDay())
  weekStart.setHours(0, 0, 0, 0)

  const thisWeekRoasts = roasts.filter(r => {
    return new Date(r.created_at) >= weekStart
  })

  await supabase
    .from('leaderboard_entries')
    .update({
      avg_score: Math.round(avgScore),
      posts_this_week: thisWeekRoasts.length,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', userId)
}

/**
 * Save a roast/analysis to the database
 */
export async function saveRoast(userId, roastData) {
  const supabase = getSupabaseServerClient()

  const { data, error } = await supabase
    .from('roasts')
    .insert({
      user_id: userId,
      original_post: roastData.original_post,
      goals_active: roastData.goals || [],
      scores: roastData.scores || {},
      rewrite: roastData.rewrite,
      rewrite_prompt: roastData.rewrite_prompt,
      format_detected: roastData.format_detected,
      creators_used: roastData.creators_used || []
    })
    .select()
    .single()

  if (error) throw error

  return data
}
