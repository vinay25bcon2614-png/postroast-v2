import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

/**
 * Load user's creator preferences for roast scoring
 */
export async function loadUserCreatorPreferences(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_creator_preferences')
      .select('creator_id, weight, position')
      .eq('user_id', userId)
      .order('position', { ascending: true });

    if (error) {
      console.error('Failed to load creator preferences:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error loading creator preferences:', error);
    return [];
  }
}

/**
 * Load user's selected goals for roast scoring
 */
export async function loadUserGoals(userId: string) {
  try {
    const { data, error } = await supabase
      .from('user_goals')
      .select('goal_id, priority, weight')
      .eq('user_id', userId)
      .order('priority', { ascending: true });

    if (error) {
      console.error('Failed to load user goals:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error loading user goals:', error);
    return [];
  }
}

/**
 * Load user's analytics data
 */
export async function loadUserAnalytics(userId: string) {
  try {
    const { data, error } = await supabase
      .from('roasts')
      .select('scores, insights, format, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      console.error('Failed to load analytics:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return {
        postsCount: 0,
        avgScore: 0,
        scoreHistory: [],
        dimensionAverages: {},
        formatPerformance: {}
      };
    }

    const postsCount = data.length;
    
    // Calculate averages
    const scores = data.map(r => r.scores?.compositeScore || 0);
    const avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / postsCount);

    // Calculate dimension averages
    const dimensionAverages = {};
    const dimensions = ['hook', 'clarity', 'authority', 'engagement', 'format', 'goalAlignment', 'cta', 'originality'];
    
    dimensions.forEach(dim => {
      const values = data
        .map(r => r.scores?.[dim] || 0)
        .filter(v => v > 0);
      dimensionAverages[dim] = values.length > 0 ? Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 0;
    });

    // Format performance
    const formatPerformance = {};
    data.forEach(r => {
      const fmt = r.format || 'Unknown';
      if (!formatPerformance[fmt]) {
        formatPerformance[fmt] = { total: 0, count: 0 };
      }
      formatPerformance[fmt].total += r.scores?.compositeScore || 0;
      formatPerformance[fmt].count += 1;
    });

    Object.keys(formatPerformance).forEach(fmt => {
      formatPerformance[fmt] = Math.round(formatPerformance[fmt].total / formatPerformance[fmt].count);
    });

    return {
      postsCount,
      avgScore,
      scoreHistory: scores.slice(0, 30),
      dimensionAverages,
      formatPerformance
    };
  } catch (error) {
    console.error('Error loading user analytics:', error);
    return null;
  }
}

/**
 * Load user's streak data
 */
export async function loadUserStreak(userId: string) {
  try {
    const { data, error } = await supabase
      .from('streaks')
      .select('current_streak, longest_streak, last_post_date')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Failed to load streak:', error);
      return { current_streak: 0, longest_streak: 0, last_post_date: null };
    }

    return data || { current_streak: 0, longest_streak: 0, last_post_date: null };
  } catch (error) {
    console.error('Error loading streak:', error);
    return { current_streak: 0, longest_streak: 0, last_post_date: null };
  }
}

/**
 * Get current user from Supabase session
 */
export async function getCurrentUser() {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
