/* PostRoast Premium Type Definitions */

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  subscriptionTier: 'free' | 'pro';
}

export interface KPIMetrics {
  avgScore: {
    value: number;
    trend: number;
    trendLabel: string;
    isPositive: boolean;
  };
  postsAnalyzed: {
    value: number;
    trend: number;
    trendLabel: string;
    isPositive: boolean;
  };
  hookAvgWeakest: {
    value: number;
    trend: string;
    trendLabel: string;
    isPositive?: boolean;
  };
  leaderboardRank: {
    percentile: string;
    trend: string;
    trendLabel: string;
  };
}

export interface PostScore {
  overall: number;
  label: string;
  subtitle: string;
  dimensions: ScoreDimension[];
  format?: string;
}

export interface ScoreDimension {
  name: string;
  score: number;
  color?: string;
}

export interface AIRewrite {
  text: string;
  improvement: number;
  hooks: string[];
  loading?: boolean;
}

export interface InsightData {
  goal: string;
  insight: string;
  primaryFix: string;
}

export interface Format {
  id: string;
  name: string;
  description: string;
  tag: string;
  category: 'HIGH_HOOK' | 'HIGH_TRUST' | 'VIRAL' | 'AUTHORITY';
}

export interface StyleDNA {
  status: 'learning' | 'ready';
  voice: string;
  patterns: string[];
}

export interface StreakDay {
  day: string;
  completed: boolean;
}

/* Component Props */

export interface SidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export interface TopBarProps {
  user: User;
  streakDays: number;
  onUpgrade: () => void;
}

export interface KPIRowProps {
  metrics: KPIMetrics;
}

export interface ComposerCardProps {
  onRoast: (content: string, goal: string) => void;
  defaultGoal?: string;
  isLoading?: boolean;
}

export interface ScoreCardProps {
  score: PostScore;
  formatDetected?: string;
}

export interface InsightCardProps {
  goal: string;
  insight: string;
  primaryFix: string;
}

export interface RewriteCardProps {
  rewrite: AIRewrite;
  onCopy: () => void;
  onRegenerate: () => void;
  isLoading?: boolean;
}

export interface TemplateGridProps {
  templates: Format[];
  goal: string;
}

export interface StreakBoxProps {
  days: StreakDay[];
  totalDays: number;
  percentile: number;
}

export interface RightPanelProps {
  activeTab: 'rewrite' | 'templates' | 'style-dna';
  onTabChange: (tab: 'rewrite' | 'templates' | 'style-dna') => void;
  rewrite?: AIRewrite;
  templates?: Format[];
  styleDNA?: StyleDNA;
}

/* Goal System Types */

export type GoalId = 'get_clients' | 'grow_audience' | 'authority' | 'balanced';

export interface Goal {
  id: GoalId;
  label: string;
  description: string;
  emoji: string;
  scoringWeights: Record<string, number>;
  bestTemplates: string[];
  rewriteGuidance: RewriteGuidance;
}

export interface RewriteGuidance {
  openWith: string;
  tone: string;
  structure: string;
  avoidLanguage: string[];
  requiredElements: string[];
}

export interface UserGoalProfile {
  selectedGoal: GoalId;
  industry?: string;
  niche?: string;
  voice?: string;
  targetAudience?: string;
}
