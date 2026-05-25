// Supabase database types - auto-generated from schema

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  industry?: string;
  audience_description?: string;
  timezone?: string;
  onboarding_complete: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserGoal {
  id: string;
  user_id: string;
  goal_id: string;
  priority: number;
  created_at: string;
}

export interface UserCreatorPreference {
  id: string;
  user_id: string;
  creator_key: string;
  active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  tone_score: number;
  storytelling_score: number;
  vulnerability_score: number;
  humor_score: number;
  authority_score: number;
  posts_analyzed: number;
  created_at: string;
  updated_at: string;
}

export interface Roast {
  id: string;
  user_id: string;
  original_post: string;
  goals_active: string[];
  scores: Record<string, any>;
  rewrite?: string;
  rewrite_prompt?: string;
  format_detected?: string;
  creators_used?: string[];
  created_at: string;
}

export interface StyleDNA {
  id: string;
  user_id: string;
  post_id?: string;
  detected_patterns: Record<string, any>;
  voice_characteristics: Record<string, any>;
  last_updated: string;
}

export interface UsageLog {
  id: string;
  user_id: string;
  roasts_today: number;
  reset_at: string;
  created_at: string;
}

export interface Streak {
  id: string;
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_roast_date?: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  display_name: string;
  opted_in: boolean;
  avg_score: number;
  posts_this_week: number;
  improvement_this_week: number;
  week_start: string;
  updated_at: string;
}

export interface SavedFormat {
  id: string;
  user_id: string;
  format_id: string;
  created_at: string;
}

export interface LinkedInSnapshot {
  id: string;
  user_id: string;
  post_url?: string;
  impressions: number;
  clicks: number;
  comments: number;
  reposts: number;
  followers_count: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: 'free' | 'pro';
  paddle_customer_id?: string;
  paddle_subscription_id?: string;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  created_at: string;
  updated_at: string;
}

// Convenience types

export type GoalType = 'Get Clients' | 'Grow Audience' | 'Build Authority' | 'Balanced';

export interface PostScore {
  hook?: number;
  clarity?: number;
  authority?: number;
  engagement?: number;
  originality?: number;
  cta?: number;
  structure?: number;
  viral_potential?: number;
  overall: number;
}

export interface RoastRequest {
  post: string;
  goals: string[];
  mode?: 'full' | 'hook-only' | 'rewrite-only' | 'audit';
  styleDNA?: Partial<UserProfile>;
}

export interface RoastResponse {
  scores: PostScore;
  rewrite: string;
  reasoning: string;
  formatDetected?: string;
  creatorsUsed?: string[];
}
