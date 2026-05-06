-- PostRoast Premium Database Schema
-- Run this in Supabase SQL Editor to set up all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- ENUMS
-- ============================================================================

CREATE TYPE goal_type AS ENUM ('clients', 'audience', 'authority', 'brand');
CREATE TYPE subscription_tier AS ENUM ('free', 'pro', 'agency');
CREATE TYPE post_status AS ENUM ('draft', 'roasted', 'published');
CREATE TYPE style_dna_status AS ENUM ('learning', 'ready');
CREATE TYPE tone_type AS ENUM ('professional', 'casual', 'technical', 'humorous', 'inspirational');
CREATE TYPE format_category AS ENUM ('HIGH_HOOK', 'HIGH_TRUST', 'VIRAL', 'AUTHORITY');

-- ============================================================================
-- USERS TABLE
-- ============================================================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  
  -- Subscription
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_started_at TIMESTAMP WITH TIME ZONE,
  subscription_ends_at TIMESTAMP WITH TIME ZONE,
  
  -- Stats
  posts_roasted_count INTEGER DEFAULT 0,
  current_streak_days INTEGER DEFAULT 0,
  best_streak_days INTEGER DEFAULT 0,
  last_post_date TIMESTAMP WITH TIME ZONE,
  
  -- Style DNA
  style_dna_status style_dna_status DEFAULT 'learning',
  style_dna_data JSONB,
  
  -- Profile
  industry VARCHAR(100),
  tone tone_type,
  goal_mode goal_type DEFAULT 'audience'
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_subscription ON users(subscription_tier);

-- ============================================================================
-- POSTS TABLE
-- ============================================================================

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  content TEXT NOT NULL,
  character_count INTEGER NOT NULL,
  goal goal_type NOT NULL,
  published_at TIMESTAMP WITH TIME ZONE,
  status post_status DEFAULT 'draft',
  format_detected VARCHAR(100),
  
  -- LinkedIn engagement (if published)
  engagement_metrics JSONB
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_goal ON posts(goal);

-- ============================================================================
-- SCORES TABLE (One score per post)
-- ============================================================================

CREATE TABLE scores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL UNIQUE REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- 8-dimension scoring
  overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
  hook_score INTEGER NOT NULL CHECK (hook_score >= 0 AND hook_score <= 100),
  clarity_score INTEGER NOT NULL CHECK (clarity_score >= 0 AND clarity_score <= 100),
  authority_score INTEGER NOT NULL CHECK (authority_score >= 0 AND authority_score <= 100),
  engagement_score INTEGER NOT NULL CHECK (engagement_score >= 0 AND engagement_score <= 100),
  originality_score INTEGER NOT NULL CHECK (originality_score >= 0 AND originality_score <= 100),
  emotional_pull_score INTEGER NOT NULL CHECK (emotional_pull_score >= 0 AND emotional_pull_score <= 100),
  actionability_score INTEGER NOT NULL CHECK (actionability_score >= 0 AND actionability_score <= 100),
  
  -- Metadata
  format_detected VARCHAR(100),
  percentile_rank NUMERIC(5, 2), -- User's percentile vs all posts (0-100)
  label VARCHAR(100), -- "Corporate Try-Hard", "Authority Play", etc.
  subtitle TEXT -- "Hook is weak — no curiosity, no tension"
);

CREATE INDEX idx_scores_user_id ON scores(user_id);
CREATE INDEX idx_scores_created_at ON scores(created_at DESC);
CREATE INDEX idx_scores_overall ON scores(overall_score DESC);

-- ============================================================================
-- REWRITES TABLE
-- ============================================================================

CREATE TABLE rewrites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  original_content TEXT NOT NULL,
  rewritten_content TEXT NOT NULL,
  score_improvement INTEGER, -- How many points the rewrite would improve score by
  technique VARCHAR(100), -- 'authority-hook', 'emotional-pull', 'curiosity-gap', etc.
  confidence INTEGER CHECK (confidence >= 0 AND confidence <= 100),
  goal goal_type NOT NULL,
  style_applied VARCHAR(100) -- Which style was applied
);

CREATE INDEX idx_rewrites_post_id ON rewrites(post_id);
CREATE INDEX idx_rewrites_user_id ON rewrites(user_id);
CREATE INDEX idx_rewrites_created_at ON rewrites(created_at DESC);

-- ============================================================================
-- STYLE DNA TABLE (One per user, updates over time)
-- ============================================================================

CREATE TABLE style_dna (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Learning progress
  posts_analyzed INTEGER DEFAULT 0,
  
  -- Profile
  industry VARCHAR(100),
  tone tone_type,
  signature_phrases TEXT[], -- Array of common phrases
  average_length INTEGER, -- Average words per post
  
  -- Patterns
  uses_numbers BOOLEAN DEFAULT FALSE,
  uses_questions BOOLEAN DEFAULT FALSE,
  uses_emojis BOOLEAN DEFAULT FALSE,
  uses_stories BOOLEAN DEFAULT FALSE,
  common_topics TEXT[], -- Array of common topics
  
  -- AI Analysis
  voice_description TEXT, -- "Analytical, direct, pattern-focused"
  confidence_score NUMERIC(3, 2) CHECK (confidence_score >= 0 AND confidence_score <= 1)
);

CREATE INDEX idx_style_dna_user_id ON style_dna(user_id);

-- ============================================================================
-- LEADERBOARD TABLE (Denormalized for performance)
-- ============================================================================

CREATE TABLE leaderboard (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  period VARCHAR(20) NOT NULL, -- 'daily', 'weekly', 'all_time'
  rank INTEGER NOT NULL,
  average_score NUMERIC(5, 2),
  posts_this_period INTEGER,
  current_streak INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, period)
);

CREATE INDEX idx_leaderboard_period_rank ON leaderboard(period, rank);
CREATE INDEX idx_leaderboard_user_period ON leaderboard(user_id, period);

-- ============================================================================
-- FORMATS TABLE (Post templates/formats)
-- ============================================================================

CREATE TABLE formats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  category format_category NOT NULL,
  example_post TEXT NOT NULL,
  template TEXT NOT NULL,
  best_for_goals goal_type[] NOT NULL, -- Array of goals this format works for
  average_engagement NUMERIC(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_formats_category ON formats(category);

-- ============================================================================
-- INSIGHTS TABLE
-- ============================================================================

CREATE TABLE insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  goal goal_type NOT NULL,
  insight_text TEXT NOT NULL,
  primary_fix TEXT NOT NULL,
  secondary_suggestions TEXT[]
);

CREATE INDEX idx_insights_post_id ON insights(post_id);
CREATE INDEX idx_insights_user_id ON insights(user_id);

-- ============================================================================
-- VIEWS
-- ============================================================================

-- User statistics view
CREATE VIEW user_stats AS
SELECT 
  u.id as user_id,
  COUNT(DISTINCT p.id) as total_posts,
  ROUND(AVG(s.overall_score)::NUMERIC, 2) as avg_score,
  u.current_streak_days as current_streak,
  u.best_streak_days as best_streak,
  MAX(s.overall_score) as highest_score,
  MIN(s.overall_score) as lowest_score,
  COUNT(DISTINCT CASE WHEN p.created_at > NOW() - INTERVAL '7 days' THEN p.id END) as posts_this_week
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
LEFT JOIN scores s ON p.id = s.post_id
GROUP BY u.id, u.current_streak_days, u.best_streak_days;

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function: Get user's percentile rank for a score
CREATE OR REPLACE FUNCTION get_user_percentile(user_id UUID, score_value INTEGER)
RETURNS NUMERIC AS $$
BEGIN
  RETURN (
    SELECT ROUND(
      (COUNT(*) FILTER (WHERE overall_score < score_value) * 100.0 / 
       COUNT(*))::NUMERIC, 2
    )
    FROM scores
  );
END;
$$ LANGUAGE plpgsql;

-- Function: Update user streak
CREATE OR REPLACE FUNCTION update_user_streak(user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  last_post_date DATE;
BEGIN
  -- Get last post date
  SELECT DATE(created_at) INTO last_post_date
  FROM posts
  WHERE user_id = $1
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- If no posts, streak is 0
  IF last_post_date IS NULL THEN
    UPDATE users SET current_streak_days = 0 WHERE id = $1;
    RETURN 0;
  END IF;
  
  -- Calculate streak (consecutive days with posts)
  WITH date_series AS (
    SELECT DISTINCT DATE(created_at) as post_date
    FROM posts
    WHERE user_id = $1
    ORDER BY post_date DESC
  ),
  streak_calc AS (
    SELECT 
      post_date,
      ROW_NUMBER() OVER (ORDER BY post_date DESC) as day_num,
      (DATE(CURRENT_DATE) - post_date)::INTEGER as days_ago
    FROM date_series
  )
  SELECT COUNT(*) INTO streak
  FROM streak_calc
  WHERE days_ago = day_num - 1;
  
  -- Update user
  UPDATE users 
  SET current_streak_days = streak,
      best_streak_days = GREATEST(best_streak_days, streak),
      last_post_date = NOW()
  WHERE id = $1;
  
  RETURN streak;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update user timestamp on post insert
CREATE OR REPLACE FUNCTION update_post_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_post_timestamp();

-- Trigger: Update user stats when post is created
CREATE OR REPLACE FUNCTION increment_post_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users 
  SET posts_roasted_count = posts_roasted_count + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_post_count
AFTER INSERT ON posts
FOR EACH ROW
EXECUTE FUNCTION increment_post_count();

-- ============================================================================
-- SEED DATA: Formats
-- ============================================================================

INSERT INTO formats (name, description, category, example_post, template, best_for_goals) VALUES
(
  'Insider Leak',
  'Share what others in your industry won''t say publicly',
  'HIGH_HOOK',
  'Most agency owners won''t tell you this: the best way to grow is by sharing your failures. Here''s what I learned...',
  'Most [industry] won''t tell you: [contrarian insight]. Here''s what I learned in [X years]...',
  ARRAY['clients'::goal_type, 'authority'::goal_type]
),
(
  'Case Study',
  'Before/after story with real numbers',
  'HIGH_TRUST',
  'We took a client from $0 → $500K ARR in 18 months. Here''s the exact playbook...',
  '[Company/Person] went from [before state] → [after state] in [timeframe]. Here''s how:',
  ARRAY['clients'::goal_type, 'audience'::goal_type]
),
(
  'Mistake List',
  'X mistakes your industry makes (and how to fix them)',
  'VIRAL',
  '5 mistakes every startup makes with their first hire (and what to do instead)...',
  '[X] mistakes [audience] makes with [topic]: [list with fixes]',
  ARRAY['audience'::goal_type, 'authority'::goal_type]
),
(
  'Contrarian Take',
  'Challenge the conventional wisdom in your niche',
  'AUTHORITY',
  'Everyone says follow your passion. I say that''s terrible advice. Here''s why...',
  'Everyone says [conventional wisdom]. I''ve found the opposite to be true: [contrarian take]...',
  ARRAY['authority'::goal_type, 'audience'::goal_type]
),
(
  'Question Hook',
  'Start with a thought-provoking question',
  'HIGH_HOOK',
  'What if everything you know about [topic] is wrong? I''ve spent 5 years researching this...',
  'What if [bold question]? I''ve spent [timeframe] discovering [insight]...',
  ARRAY['audience'::goal_type, 'authority'::goal_type]
),
(
  'Story Arc',
  'Personal narrative with a lesson',
  'HIGH_TRUST',
  'I almost went broke in 2018. Here''s how that failure became my biggest asset...',
  'I [dramatic moment] in [timeframe]. That''s when I realized [insight]...',
  ARRAY['audience'::goal_type, 'brand'::goal_type]
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewrites ENABLE ROW LEVEL SECURITY;
ALTER TABLE style_dna ENABLE ROW LEVEL SECURITY;
ALTER TABLE insights ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can see own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Posts: Users can see their own, anonymous leaderboard data
CREATE POLICY "Users can see own posts" ON posts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own posts" ON posts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Scores: Similar to posts
CREATE POLICY "Users can see own scores" ON scores
  FOR SELECT USING (auth.uid()::text = user_id::text);

-- Format library is public
ALTER TABLE formats DISABLE ROW LEVEL SECURITY;

-- Leaderboard: Limited data visibility (no emails)
CREATE POLICY "Leaderboard is readable" ON leaderboard
  FOR SELECT USING (true);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
