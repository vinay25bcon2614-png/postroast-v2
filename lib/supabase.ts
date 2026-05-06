import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get current authenticated user
 */
export async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

/**
 * Get or create user profile
 */
export async function getOrCreateUserProfile(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // User doesn't exist, create profile
    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert([
        {
          id: userId,
          email: '', // Should be set from auth
          name: '',
          subscription_tier: 'free',
        },
      ])
      .select()
      .single()

    if (createError) throw createError
    return newUser
  }

  if (error) throw error
  return data
}

/**
 * Create a new post
 */
export async function createPost(
  userId: string,
  content: string,
  goal: 'clients' | 'audience' | 'authority' | 'brand'
) {
  const { data, error } = await supabase
    .from('posts')
    .insert([
      {
        user_id: userId,
        content,
        character_count: content.length,
        goal,
        status: 'draft',
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Save post score
 */
export async function saveScore(
  postId: string,
  userId: string,
  scores: {
    overall: number
    hook: number
    clarity: number
    authority: number
    engagement: number
    originality: number
    emotionalPull: number
    actionability: number
  },
  metadata: {
    format: string
    label: string
    subtitle: string
    percentile: number
  }
) {
  const { data, error } = await supabase
    .from('scores')
    .insert([
      {
        post_id: postId,
        user_id: userId,
        overall_score: scores.overall,
        hook_score: scores.hook,
        clarity_score: scores.clarity,
        authority_score: scores.authority,
        engagement_score: scores.engagement,
        originality_score: scores.originality,
        emotional_pull_score: scores.emotionalPull,
        actionability_score: scores.actionability,
        format_detected: metadata.format,
        label: metadata.label,
        subtitle: metadata.subtitle,
        percentile_rank: metadata.percentile,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Save rewrite suggestion
 */
export async function saveRewrite(
  postId: string,
  userId: string,
  originalContent: string,
  rewrittenContent: string,
  goal: 'clients' | 'audience' | 'authority' | 'brand',
  improvement: number,
  technique: string
) {
  const { data, error } = await supabase
    .from('rewrites')
    .insert([
      {
        post_id: postId,
        user_id: userId,
        original_content: originalContent,
        rewritten_content: rewrittenContent,
        goal,
        score_improvement: improvement,
        technique,
        confidence: 85, // Default confidence
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Save insight
 */
export async function saveInsight(
  postId: string,
  userId: string,
  goal: 'clients' | 'audience' | 'authority' | 'brand',
  insightText: string,
  primaryFix: string
) {
  const { data, error } = await supabase
    .from('insights')
    .insert([
      {
        post_id: postId,
        user_id: userId,
        goal,
        insight_text: insightText,
        primary_fix: primaryFix,
      },
    ])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Get user's posts
 */
export async function getUserPosts(userId: string, limit = 50) {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get user's stats
 */
export async function getUserStats(userId: string) {
  const { data, error } = await supabase
    .from('user_stats')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Get user's style DNA
 */
export async function getStyleDNA(userId: string) {
  const { data, error } = await supabase
    .from('style_dna')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error && error.code === 'PGRST116') {
    // Doesn't exist yet
    return null
  }

  if (error) throw error
  return data
}

/**
 * Update style DNA
 */
export async function updateStyleDNA(
  userId: string,
  styleDNAData: {
    posts_analyzed: number
    industry?: string
    tone?: string
    signature_phrases?: string[]
    average_length?: number
    uses_numbers?: boolean
    uses_questions?: boolean
    uses_emojis?: boolean
    uses_stories?: boolean
    common_topics?: string[]
    voice_description?: string
    confidence_score?: number
  }
) {
  const existingStyleDNA = await getStyleDNA(userId)

  if (existingStyleDNA) {
    // Update existing
    const { data, error } = await supabase
      .from('style_dna')
      .update(styleDNAData)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  } else {
    // Create new
    const { data, error } = await supabase
      .from('style_dna')
      .insert([
        {
          user_id: userId,
          ...styleDNAData,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return data
  }
}

/**
 * Get leaderboard
 */
export async function getLeaderboard(
  period: 'daily' | 'weekly' | 'all_time' = 'weekly',
  limit = 10
) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*, users(name, avatar_url)')
    .eq('period', period)
    .order('rank', { ascending: true })
    .limit(limit)

  if (error) throw error
  return data
}

/**
 * Get user's leaderboard rank
 */
export async function getUserLeaderboardRank(userId: string) {
  const { data, error } = await supabase
    .from('leaderboard')
    .select('*')
    .eq('user_id', userId)
    .eq('period', 'weekly')
    .single()

  if (error && error.code === 'PGRST116') {
    return null
  }

  if (error) throw error
  return data
}

/**
 * Get all formats
 */
export async function getFormats() {
  const { data, error } = await supabase
    .from('formats')
    .select('*')
    .order('category', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get formats for specific goal
 */
export async function getFormatsForGoal(goal: 'clients' | 'audience' | 'authority' | 'brand') {
  const { data, error } = await supabase
    .from('formats')
    .select('*')
    .contains('best_for_goals', [goal])
    .order('category', { ascending: true })

  if (error) throw error
  return data
}

/**
 * Get user subscription
 */
export async function getUserSubscription(userId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('subscription_tier, subscription_ends_at')
    .eq('id', userId)
    .single()

  if (error) throw error
  return data
}

/**
 * Check if user can roast (free tier limit)
 */
export async function canUserRoast(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId)

  if (subscription.subscription_tier !== 'free') {
    return true // Pro and Agency have unlimited roasts
  }

  // Free tier: 3 roasts per day
  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  if (error) throw error
  return (data?.length || 0) < 3
}

/**
 * Get user's this week's post count
 */
export async function getPostsThisWeek(userId: string) {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('posts')
    .select('id')
    .eq('user_id', userId)
    .gte('created_at', sevenDaysAgo)

  if (error) throw error
  return data?.length || 0
}
