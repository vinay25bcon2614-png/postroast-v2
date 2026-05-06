/* Auto-generated Supabase database types */
/* Generated from your Supabase schema */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          name: string
          avatar_url: string | null
          bio: string | null
          subscription_tier: 'free' | 'pro' | 'agency'
          subscription_started_at: string | null
          subscription_ends_at: string | null
          posts_roasted_count: number
          current_streak_days: number
          best_streak_days: number
          last_post_date: string | null
          style_dna_status: 'learning' | 'ready'
          style_dna_data: Json | null
          industry: string | null
          tone: string | null
          goal_mode: 'clients' | 'audience' | 'authority' | 'brand'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          email: string
          name: string
          avatar_url?: string | null
          bio?: string | null
          subscription_tier?: 'free' | 'pro' | 'agency'
          subscription_started_at?: string | null
          subscription_ends_at?: string | null
          posts_roasted_count?: number
          current_streak_days?: number
          best_streak_days?: number
          last_post_date?: string | null
          style_dna_status?: 'learning' | 'ready'
          style_dna_data?: Json | null
          industry?: string | null
          tone?: string | null
          goal_mode?: 'clients' | 'audience' | 'authority' | 'brand'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          name?: string
          avatar_url?: string | null
          bio?: string | null
          subscription_tier?: 'free' | 'pro' | 'agency'
          subscription_started_at?: string | null
          subscription_ends_at?: string | null
          posts_roasted_count?: number
          current_streak_days?: number
          best_streak_days?: number
          last_post_date?: string | null
          style_dna_status?: 'learning' | 'ready'
          style_dna_data?: Json | null
          industry?: string | null
          tone?: string | null
          goal_mode?: 'clients' | 'audience' | 'authority' | 'brand'
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          content: string
          character_count: number
          goal: 'clients' | 'audience' | 'authority' | 'brand'
          published_at: string | null
          status: 'draft' | 'roasted' | 'published'
          format_detected: string | null
          engagement_metrics: Json | null
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          content: string
          character_count: number
          goal: 'clients' | 'audience' | 'authority' | 'brand'
          published_at?: string | null
          status?: 'draft' | 'roasted' | 'published'
          format_detected?: string | null
          engagement_metrics?: Json | null
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          content?: string
          character_count?: number
          goal?: 'clients' | 'audience' | 'authority' | 'brand'
          published_at?: string | null
          status?: 'draft' | 'roasted' | 'published'
          format_detected?: string | null
          engagement_metrics?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: 'posts_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      scores: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
          overall_score: number
          hook_score: number
          clarity_score: number
          authority_score: number
          engagement_score: number
          originality_score: number
          emotional_pull_score: number
          actionability_score: number
          format_detected: string
          percentile_rank: number
          label: string
          subtitle: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
          overall_score: number
          hook_score: number
          clarity_score: number
          authority_score: number
          engagement_score: number
          originality_score: number
          emotional_pull_score: number
          actionability_score: number
          format_detected: string
          percentile_rank: number
          label: string
          subtitle: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
          overall_score?: number
          hook_score?: number
          clarity_score?: number
          authority_score?: number
          engagement_score?: number
          originality_score?: number
          emotional_pull_score?: number
          actionability_score?: number
          format_detected?: string
          percentile_rank?: number
          label?: string
          subtitle?: string
        }
        Relationships: [
          {
            foreignKeyName: 'scores_post_id_fkey'
            columns: ['post_id']
            isOneToOne: true
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'scores_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      rewrites: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
          updated_at: string
          original_content: string
          rewritten_content: string
          score_improvement: number
          technique: string
          confidence: number
          goal: 'clients' | 'audience' | 'authority' | 'brand'
          style_applied: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
          updated_at?: string
          original_content: string
          rewritten_content: string
          score_improvement: number
          technique: string
          confidence: number
          goal: 'clients' | 'audience' | 'authority' | 'brand'
          style_applied?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          original_content?: string
          rewritten_content?: string
          score_improvement?: number
          technique?: string
          confidence?: number
          goal?: 'clients' | 'audience' | 'authority' | 'brand'
          style_applied?: string
        }
        Relationships: [
          {
            foreignKeyName: 'rewrites_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'rewrites_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      style_dna: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          posts_analyzed: number
          industry: string | null
          tone: string | null
          signature_phrases: string[]
          average_length: number
          uses_numbers: boolean
          uses_questions: boolean
          uses_emojis: boolean
          uses_stories: boolean
          common_topics: string[]
          voice_description: string
          confidence_score: number
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          posts_analyzed?: number
          industry?: string | null
          tone?: string | null
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
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          posts_analyzed?: number
          industry?: string | null
          tone?: string | null
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
        Relationships: [
          {
            foreignKeyName: 'style_dna_user_id_fkey'
            columns: ['user_id']
            isOneToOne: true
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      leaderboard: {
        Row: {
          id: string
          user_id: string
          period: 'daily' | 'weekly' | 'all_time'
          rank: number
          average_score: number
          posts_this_period: number
          current_streak: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          period: 'daily' | 'weekly' | 'all_time'
          rank: number
          average_score: number
          posts_this_period: number
          current_streak: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          period?: 'daily' | 'weekly' | 'all_time'
          rank?: number
          average_score?: number
          posts_this_period?: number
          current_streak?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'leaderboard_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      formats: {
        Row: {
          id: string
          name: string
          description: string
          category: 'HIGH_HOOK' | 'HIGH_TRUST' | 'VIRAL' | 'AUTHORITY'
          example_post: string
          template: string
          best_for_goals: ('clients' | 'audience' | 'authority' | 'brand')[]
          average_engagement: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          category: 'HIGH_HOOK' | 'HIGH_TRUST' | 'VIRAL' | 'AUTHORITY'
          example_post: string
          template: string
          best_for_goals: ('clients' | 'audience' | 'authority' | 'brand')[]
          average_engagement?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          category?: 'HIGH_HOOK' | 'HIGH_TRUST' | 'VIRAL' | 'AUTHORITY'
          example_post?: string
          template?: string
          best_for_goals?: ('clients' | 'audience' | 'authority' | 'brand')[]
          average_engagement?: number
          created_at?: string
        }
        Relationships: []
      }
      insights: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
          goal: 'clients' | 'audience' | 'authority' | 'brand'
          insight_text: string
          primary_fix: string
          secondary_suggestions: string[]
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
          goal: 'clients' | 'audience' | 'authority' | 'brand'
          insight_text: string
          primary_fix: string
          secondary_suggestions?: string[]
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
          goal?: 'clients' | 'audience' | 'authority' | 'brand'
          insight_text?: string
          primary_fix?: string
          secondary_suggestions?: string[]
        }
        Relationships: [
          {
            foreignKeyName: 'insights_post_id_fkey'
            columns: ['post_id']
            isOneToOne: false
            referencedRelation: 'posts'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'insights_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      user_stats: {
        Row: {
          user_id: string | null
          total_posts: number | null
          avg_score: number | null
          current_streak: number | null
          best_streak: number | null
          highest_score: number | null
          lowest_score: number | null
          posts_this_week: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_percentile: {
        Args: {
          user_id: string
          score: number
        }
        Returns: number
      }
      update_user_streak: {
        Args: {
          user_id: string
        }
        Returns: number
      }
      calculate_leaderboard_rank: {
        Args: {
          period: 'daily' | 'weekly' | 'all_time'
        }
        Returns: undefined
      }
    }
    Enums: {
      goal_type: 'clients' | 'audience' | 'authority' | 'brand'
      subscription_tier: 'free' | 'pro' | 'agency'
      post_status: 'draft' | 'roasted' | 'published'
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database }
    = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][keyof Database[PublicTableNameOrOptions['schema']]['Tables']]
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions]
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database }
    = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][keyof Database[PublicTableNameOrOptions['schema']]['Tables']]['Insert']
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions]['Insert']
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database }
    = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][keyof Database[PublicTableNameOrOptions['schema']]['Tables']]['Update']
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions]['Update']
  : never
