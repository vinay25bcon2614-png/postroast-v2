import { FC, useState, useCallback, useEffect } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import KPIRow from './KPIRow';
import ComposerCard from './ComposerCard';
import ScoreCard from './ScoreCard';
import InsightCard from './InsightCard';
import RightPanel from './RightPanel';
import GoalTrackerScreen from './GoalTrackerScreen';
import PostHistoryScreen from './PostHistoryScreen';
import AnalyticsScreen from './AnalyticsScreen';
import CTABuilderScreen from './CTABuilderScreen';
import { useAuth } from '../contexts/AuthContext';
import { getRoast } from '../lib/backend';
import {
  loadUserCreatorPreferences,
  loadUserGoals,
  loadUserAnalytics,
  loadUserStreak,
} from '../lib/userdata';
import {
  User,
  KPIMetrics,
  PostScore,
  AIRewrite,
  Format,
  StyleDNA,
  StreakDay,
} from '../types';
import '../styles/dashboard.css';

const mockUser: User = {
  id: '1',
  email: 'user@postroast.com',
  name: 'Sarah Chen',
  subscriptionTier: 'free',
};

const mockMetrics: KPIMetrics = {
  avgScore: {
    value: 67,
    trend: 12,
    trendLabel: '+12 vs last month',
    isPositive: true,
  },
  postsAnalyzed: {
    value: 24,
    trend: 8,
    trendLabel: '+8 this week',
    isPositive: true,
  },
  hookAvgWeakest: {
    value: 52,
    trend: 'focus',
    trendLabel: 'focus area',
    isPositive: false,
  },
  leaderboardRank: {
    percentile: 'Top 18%',
    trend: 'up',
    trendLabel: 'up 34 spots',
  },
};

const mockScore: PostScore = {
  overall: 55,
  label: 'Corporate Try-Hard',
  subtitle: 'Hook is weak — no curiosity, no tension',
  dimensions: [
    { name: 'Hook', score: 42 },
    { name: 'Clarity', score: 68 },
    { name: 'Authority', score: 55 },
    { name: 'Engagement', score: 61 },
    { name: 'Originality', score: 48 },
  ],
  format: 'Authority claim',
};

const mockRewrite: AIRewrite = {
  text: 'Here\'s what nobody tells you about corporate LinkedIn: The best posts aren\'t polished, they\'re relatable. I spent 10 years optimizing for "professional" until I realized my audience wanted authenticity. This week alone, my most engagement came from admitting what I got wrong.',
  improvement: 22,
  hooks: ['Client hook'],
};

const mockTemplates: Format[] = [
  {
    id: '1',
    name: 'Insider Leak',
    description: 'What your industry won\'t say publicly',
    tag: 'HIGH HOOK',
    category: 'HIGH_HOOK',
  },
  {
    id: '2',
    name: 'Case Study',
    description: 'Before/after with real numbers',
    tag: 'HIGH TRUST',
    category: 'HIGH_TRUST',
  },
  {
    id: '3',
    name: 'Mistake List',
    description: 'X errors your niche makes',
    tag: 'VIRAL',
    category: 'VIRAL',
  },
  {
    id: '4',
    name: 'Contrarian',
    description: 'Challenge conventional wisdom',
    tag: 'AUTHORITY',
    category: 'AUTHORITY',
  },
];

const mockStyleDNA: StyleDNA = {
  status: 'learning',
  voice: 'Analytical, direct, pattern-focused',
  patterns: [
    'Question → Data → Insight format',
    'Uses contrarian angles',
    'Focuses on "what nobody tells you"',
  ],
};

const mockStreakDays: StreakDay[] = [
  { day: 'M', completed: true },
  { day: 'T', completed: true },
  { day: 'W', completed: true },
  { day: 'T', completed: true },
  { day: 'F', completed: true },
  { day: 'S', completed: false },
  { day: 'S', completed: false },
];

const Dashboard: FC = () => {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState('workspace');
  const [activeRightTab, setActiveRightTab] = useState<'rewrite' | 'templates' | 'style-dna'>(
    'rewrite'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [creatorMix, setCreatorMix] = useState([]);
  const [userGoals, setUserGoals] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Load user data on mount
  useEffect(() => {
    if (!user?.id) return;

    const loadData = async () => {
      try {
        const [prefs, goals, analyticsData] = await Promise.all([
          loadUserCreatorPreferences(user.id),
          loadUserGoals(user.id),
          loadUserAnalytics(user.id),
        ]);
        
        setCreatorMix(prefs);
        setUserGoals(goals);
        setAnalytics(analyticsData);
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };

    loadData();
  }, [user?.id]);

  const handleRoast = useCallback(async (content: string, goal: string) => {
    console.log('Roasting:', content, 'Goal:', goal, 'Creators:', creatorMix);
    setIsLoading(true);
    try {
      const result = await getRoast(
        content,
        [{ id: goal }],
        creatorMix
      );
      console.log('Roast result:', result);
      // TODO: Update UI with real results
    } catch (error) {
      console.error('Roast failed:', error);
      alert('Failed to roast: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  }, [creatorMix]);

  const handleNavigate = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  const handleUpgrade = useCallback(() => {
    console.log('Opening upgrade modal');
  }, []);

  return (
    <div className="dashboard">
      <TopBar
        user={mockUser}
        streakDays={7}
        onUpgrade={handleUpgrade}
      />
      <Sidebar activeSection={activeSection} onNavigate={handleNavigate} />

      {/* Render different screens based on activeSection */}
      {activeSection === 'workspace' && (
        <main className="dashboard-main">
          <div className="dashboard-content">
            <h1 className="dashboard-title">Workspace</h1>

            <KPIRow metrics={mockMetrics} />

            <div className="dashboard-grid">
              <div className="main-column">
                <ComposerCard
                  onRoast={handleRoast}
                  defaultGoal="Get Clients"
                  isLoading={isLoading}
                />
                <ScoreCard score={mockScore} formatDetected="Authority claim" />
                <InsightCard
                  goal="Get Clients"
                  insight="Your hook doesn't create curiosity. You're leading with your solution instead of your audience's problem. LinkedIn users scroll past generic credentials—they stop for relatable struggles."
                  primaryFix="Start with a contrarian statement or surprising statistic that makes readers think 'wait, is that true?' Then deliver the insight."
                />
              </div>
            </div>
          </div>
        </main>
      )}

      {activeSection === 'roasts' && <PostHistoryScreen />}
      {activeSection === 'analytics' && <AnalyticsScreen />}
      {activeSection === 'goal-tracker' && <GoalTrackerScreen />}
      {activeSection === 'cta-builder' && <CTABuilderScreen />}

      {activeSection === 'workspace' && (
        <RightPanel
          activeTab={activeRightTab}
          onTabChange={setActiveRightTab}
          rewrite={mockRewrite}
          templates={mockTemplates}
          styleDNA={mockStyleDNA}
        />
      )}
    </div>
  );
};

export default Dashboard;
