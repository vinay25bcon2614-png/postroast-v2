import { Goal, GoalId } from '../types';

export const GOALS: Record<GoalId, Goal> = {
  get_clients: {
    id: 'get_clients',
    label: '🎯 Get Clients',
    description: 'Write posts that attract inbound leads',
    emoji: '💼',
    scoringWeights: {
      hookStrength: 0.25,
      specificity: 0.25,
      authority: 0.20,
      cta: 0.15,
      originality: 0.15,
    },
    bestTemplates: [
      'pain_reveal',
      'case_study',
      'insider_leak',
      'mistake_list',
      'contrarian',
    ],
    rewriteGuidance: {
      openWith: 'SPECIFIC PAIN OR PROBLEM',
      tone: 'Confident, direct, no fluff',
      structure: 'Problem → Solution → Proof → CTA',
      avoidLanguage: ['everyone', 'tips', 'how to', 'beginners'],
      requiredElements: [
        'specific industry/role',
        'exact problem',
        'clear CTA',
      ],
    },
  },

  grow_audience: {
    id: 'grow_audience',
    label: '📈 Grow Audience',
    description: 'Build your personal brand & attract followers',
    emoji: '⭐',
    scoringWeights: {
      hookStrength: 0.20,
      relatability: 0.25,
      controversy: 0.15,
      storytelling: 0.25,
      originality: 0.15,
    },
    bestTemplates: [
      'personal_story',
      'unpopular_opinion',
      'transformation',
      'lesson_learned',
      'mistake_admission',
      'behind_the_scenes',
    ],
    rewriteGuidance: {
      openWith: 'CONTROVERSIAL HOOK OR SURPRISING STATEMENT',
      tone: 'Authentic, conversational, a bit vulnerable',
      structure: 'Hook → Story → Insight → Reflection',
      avoidLanguage: ['sell', 'book now', 'DM me', 'limited spots'],
      requiredElements: [
        'personal vulnerability',
        'relatable conflict',
        'genuine insight',
      ],
    },
  },

  authority: {
    id: 'authority',
    label: '💡 Thought Leader',
    description: 'Position yourself as an expert in your field',
    emoji: '👑',
    scoringWeights: {
      depth: 0.25,
      framework: 0.25,
      originality: 0.20,
      authority: 0.20,
      clarity: 0.10,
    },
    bestTemplates: [
      'framework',
      'research_breakdown',
      'trend_analysis',
      'debunk_myth',
      'systems_thinking',
    ],
    rewriteGuidance: {
      openWith: 'SURPRISING INSIGHT OR CONTRARIAN TAKE',
      tone: 'Educated, nuanced, evidence-based',
      structure: 'Thesis → Evidence → Framework → Implications',
      avoidLanguage: ['simple', 'hack', 'secret', 'only few know'],
      requiredElements: [
        'data/research',
        'counterintuitive insight',
        'actionable framework',
      ],
    },
  },

  balanced: {
    id: 'balanced',
    label: '⚖️ Balanced',
    description: 'Mix of clients, audience, and authority',
    emoji: '🎪',
    scoringWeights: {
      hookStrength: 0.18,
      relatability: 0.18,
      specificity: 0.16,
      authority: 0.16,
      storytelling: 0.16,
      originality: 0.16,
    },
    bestTemplates: [
      'case_study_with_lesson',
      'story_with_framework',
      'personal_insight_with_authority',
    ],
    rewriteGuidance: {
      openWith: 'HOOK THAT WORKS FOR MULTIPLE AUDIENCES',
      tone: 'Professional but warm, credible but relatable',
      structure: 'Hook → Story/Problem → Insight → Broad CTA',
      avoidLanguage: [],
      requiredElements: [
        'engagement hook',
        'relatability',
        'specific insight',
      ],
    },
  },
};

export function getGoalConfig(goalId: GoalId): Goal {
  return GOALS[goalId] || GOALS.balanced;
}

export function getAllGoals(): Goal[] {
  return Object.values(GOALS);
}

export function getGoalLabel(goalId: GoalId): string {
  return GOALS[goalId]?.label || 'Balanced';
}
