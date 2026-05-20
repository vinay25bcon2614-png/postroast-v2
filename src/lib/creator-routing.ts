import { GoalId } from '../types'

// Creator pattern definitions extracted from successful LinkedIn posts
export interface CreatorPattern {
  name: string
  description: string
  goal: GoalId
  hookStyle: string
  structure: string[]
  keyPrinciples: string[]
  avoidLanguage: string[]
  systemPromptAddition: string
}

export const CREATOR_PATTERNS: Record<string, CreatorPattern> = {
  // GET_CLIENTS: Focus on attracting leads
  hormozi: {
    name: 'Alex Hormozi - Assumed Close',
    description: 'Direct operator. Results-first. No fluff.',
    goal: 'get_clients',
    hookStyle: 'Shock stat or counterintuitive claim',
    structure: [
      'Open with specific claim about what fails',
      'Explain what most people try (and why it fails)',
      'Teach one method with steps',
      'Show result proof (numbers matter)',
      'Naturally mention your service'
    ],
    keyPrinciples: [
      'Lead with result',
      'Teach one thing deeply, not lists',
      'Include specific metrics/results',
      'Build authority without flexing',
      'Make business foundation principles clear',
      'High intensity, no hedging'
    ],
    avoidLanguage: [
      'maybe',
      'I think',
      'everyone',
      'tips',
      'I believe',
      'you might'
    ],
    systemPromptAddition: `
You are rewriting for Alex Hormozi's direct operator style. 

Rules:
- Open with SPECIFIC claim (stat or outcome)
- No fluff. Delete every filler word.
- Teach ONE method with exact steps
- Include numbers/metrics
- End with clear, hard CTA when appropriate
- Average sentence: 8 words or less
- Never: "I think", "maybe", "you might", "I believe"
- Tone: Confident, direct, blunt
    `
  },

  welsh: {
    name: 'Justin Welsh - Problem First',
    description: 'Reflective authority. Builds intimacy before selling.',
    goal: 'get_clients',
    hookStyle: 'Provocative statement about a specific problem',
    structure: [
      'Hook with emotional truth about a specific problem',
      'Identify why people get stuck (the trap)',
      'Present better way to think about it',
      'Share one specific example with results',
      'Clear CTA (usually newsletter or consultation)'
    ],
    keyPrinciples: [
      'Lead with problem, not solution',
      'Make pain feel urgent and real',
      'Position your approach as counter-intuitive',
      'Use specific number or example',
      'End with easy next step',
      'Build intimacy through vulnerability',
      'Trust compounds through repetition'
    ],
    avoidLanguage: [
      'everyone',
      'tips',
      'how to',
      'beginners',
      'excited to share',
      'I\'m proud'
    ],
    systemPromptAddition: `
You are rewriting for Justin Welsh's reflective authority style.

Rules:
- Open with problem or painful truth
- Use white space strategically (short lines)
- Build intimacy through specific example
- Position your approach as counter-intuitive
- CTA feels like invitation, never hard sell
- Tone: Warm, reflective, authentic
- Include vulnerability or personal insight
    `
  },

  orlob: {
    name: 'Chris Orlob - Data First',
    description: 'B2B specialist. Data-heavy. Specific claim → proof.',
    goal: 'get_clients',
    hookStyle: 'Stat-driven hook with specific data',
    structure: [
      'Hook with compelling stat or research finding',
      'Research-backed insights and context',
      'Explain what top performers do differently',
      'Actionable framework or system',
      'CTA targeting specific audience'
    ],
    keyPrinciples: [
      'Lead with data/stat',
      'Use industry-specific expertise',
      'Name specific companies or situations',
      'Lists are skimmable and structured',
      'Problem-aware CTA',
      'B2B sales focused',
      'Sophisticated buyer targeting'
    ],
    avoidLanguage: [
      'everyone',
      'should try',
      'best practices',
      'leverage',
      'synergy',
      'generic'
    ],
    systemPromptAddition: `
You are rewriting for Chris Orlob's B2B data-first style.

Rules:
- Open with specific stat or research finding
- Include data/proof throughout
- Use numbered lists for skimmability
- Target specific professional audience
- Reference industry research or cases
- Include specific metrics or percentages
- CTA speaks to specific professional pain
    `
  },

  // GROW_AUDIENCE: Focus on virality and relatability
  acosta: {
    name: 'Lara Acosta - Social Proof Stacking',
    description: 'Results for others. High energy. Community builder.',
    goal: 'grow_audience',
    hookStyle: 'Opens with specific achievement of someone else',
    structure: [
      'Hook with client/community win (not your win)',
      'Stack multiple small proofs',
      'Share brief transformation story',
      'Energy and celebration tone',
      'Call to action (masterclass, DM, join)'
    ],
    keyPrinciples: [
      'Lead with others\' wins, not yours',
      'Stack multiple examples for pattern',
      'High energy, celebratory tone',
      'Community-first mindset',
      'Authentic about being helpful',
      'FOMO + belonging triggers'
    ],
    avoidLanguage: ['I built', 'I created', 'my success', 'I earned', 'my students'],
    systemPromptAddition: `
You are rewriting for Lara Acosta's social proof stacking style.

Rules:
- Lead with SOMEONE ELSE'S win, not your own
- Stack 2-3 specific client/community achievements
- High energy, celebratory tone
- Show the person helped (if applicable)
- Community-first: "Our community just..."
- End with invitation: DM, join, masterclass
- Avoid: making it about you
    `
  },

  rachitsky: {
    name: 'David Rachitsky - Reverse Format',
    description: 'Contrarian. Challenges the norm. Authority through nuance.',
    goal: 'grow_audience',
    hookStyle: 'Challenges conventional wisdom directly',
    structure: [
      'Hook: Challenge widely held belief',
      'Explain why it\'s wrong',
      'Share unexpected counterintuitive perspective',
      'Support with personal experience or data',
      'Nuanced conclusion'
    ],
    keyPrinciples: [
      'Contrarian opening',
      'Challenge common advice',
      'Embrace nuance (not black/white)',
      'Intellectual curiosity tone',
      'Authority through depth, not flexing',
      'Change reader perspective'
    ],
    avoidLanguage: ['simple', 'easy', 'everyone agrees', 'obviously', 'common sense'],
    systemPromptAddition: `
You are rewriting for David Rachitsky's contrarian style.

Rules:
- Open by challenging conventional wisdom
- Explain why the common take is incomplete
- Present nuanced, counterintuitive perspective
- Support with reasoning or personal story
- Avoid oversimplification
- Tone: Intellectual, curious, evidence-based
- Leave reader thinking differently
    `
  },

  // AUTHORITY / THOUGHT LEADER
  bartlett: {
    name: 'Julian Shapiro (style) - Framework First',
    description: 'Systems thinker. Mental models. Deep frameworks.',
    goal: 'authority',
    hookStyle: 'Introduces powerful concept or framework',
    structure: [
      'Hook: Introduce powerful framework or mental model',
      'Explain how most people think about it (wrong)',
      'Reveal better way to think about it',
      'Deep dive into framework',
      'Application / closing thought'
    ],
    keyPrinciples: [
      'Introduce novel framework',
      'Correct misconceptions',
      'Deep thinking, not surface',
      'Mental model clarity',
      'Timeless principles',
      'Authority through systems, not stories'
    ],
    avoidLanguage: ['tips', 'hack', 'life changing', 'everyone needs', 'secret'],
    systemPromptAddition: `
You are rewriting for Julian Shapiro-style framework thinking.

Rules:
- Hook: Introduce a framework or mental model
- Correct how most people think about this
- Deep explanation of how it actually works
- Make the principle timeless and universal
- Use clear structure (step-by-step or layered)
- Tone: Thoughtful, systems-oriented, authoritative
- Close with principle, not pitch
    `
  },

  mccormick: {
    name: 'Tim Ferriss (style) - Story + Framework',
    description: 'Personal story + deep systems + actionability.',
    goal: 'authority',
    hookStyle: 'Personal story that illustrates a principle',
    structure: [
      'Hook: Specific moment or failure',
      'Build context and struggle',
      'Reveal insight/principle learned',
      'Framework or system developed',
      'Application and takeaway'
    ],
    keyPrinciples: [
      'Specific personal story (not generic)',
      'Vulnerability + learning',
      'Extract universal principle',
      'Actionable framework',
      'Deep research/thinking behind it',
      'Authenticity + systems'
    ],
    avoidLanguage: ['I\'m excited', 'mindblown', 'game changer', 'everyone should'],
    systemPromptAddition: `
You are rewriting for Tim Ferriss-style thinking.

Rules:
- Hook: Specific personal story or moment
- Show vulnerability/learning
- Extract the universal principle
- Offer a framework or system
- Back it with research or deep thinking
- Make it actionable
- Tone: Thoughtful, evidence-based, authentic
    `
  }
}

export interface CreatorMix {
  patterns: string[] // Keys of CREATOR_PATTERNS
  weights: Record<string, number> // Normalized weights (sum = 1)
}

/**
 * Calculate best creator mix for a given goal
 * Returns top 2-3 creators weighted by goal fit
 */
export function getCreatorMix(goal: GoalId): CreatorMix {
  const goalPatterns: Record<GoalId, string[]> = {
    get_clients: ['hormozi', 'welsh', 'orlob'],
    grow_audience: ['acosta', 'rachitsky'],
    authority: ['bartlett', 'mccormick'],
    viral: ['acosta', 'rachitsky'],
    personal_brand: ['welsh', 'rachitsky']
  }

  const creators = goalPatterns[goal] || ['hormozi', 'welsh']
  const weight = 1 / creators.length

  const weights: Record<string, number> = {}
  creators.forEach(c => {
    weights[c] = weight
  })

  return {
    patterns: creators,
    weights
  }
}

/**
 * Build a rewrite prompt with creator pattern injection
 */
export function buildRewritePrompt(
  postText: string,
  goal: GoalId,
  styleDNA?: {
    directness: number
    storytelling: number
    authority: number
  }
): string {
  const mix = getCreatorMix(goal)
  const primaryCreator = mix.patterns[0]
  const pattern = CREATOR_PATTERNS[primaryCreator]

  if (!pattern) {
    return `Rewrite this LinkedIn post for the goal: ${goal}\n\n${postText}`
  }

  const dnaInjection = styleDNA
    ? `
User's voice patterns (Style DNA):
- Directness: ${styleDNA.directness}/10
- Storytelling: ${styleDNA.storytelling}/10
- Authority: ${styleDNA.authority}/10

Adapt the rewrite to match their natural voice while staying true to the ${primaryCreator} pattern.
`
    : ''

  return `You are rewriting a LinkedIn post using the ${pattern.name} pattern.

Goal: ${goal}

${pattern.systemPromptAddition}

${dnaInjection}

Original post:
"${postText}"

Rewrite this post following the ${primaryCreator} pattern. Preserve the core message but transform the delivery.

Return ONLY the rewritten post, no explanation.`
}

/**
 * Score post dimensions for a goal
 */
export function scorePostDimensions(
  postText: string,
  scores: Record<string, number>,
  goal: GoalId
): Record<string, { score: number; feedback: string }> {
  const weights = getGoalWeights(goal)

  const dimensions: Record<string, { score: number; feedback: string }> = {
    hookStrength: {
      score: scores.hook || 0,
      feedback: scores.hook! > 70 ? 'Strong opening' : 'Hook could be sharper'
    },
    specificity: {
      score: scores.specificity || 0,
      feedback:
        scores.specificity! > 70 ? 'Specific and concrete' : 'Add more specific numbers/examples'
    },
    authority: {
      score: scores.authority || 0,
      feedback: scores.authority! > 70 ? 'Strong authority' : 'Build more credibility'
    },
    cta: {
      score: scores.cta || 0,
      feedback: scores.cta! > 70 ? 'Clear CTA' : 'CTA could be stronger'
    },
    originality: {
      score: scores.originality || 0,
      feedback: scores.originality! > 70 ? 'Original take' : 'Less common perspective needed'
    }
  }

  return dimensions
}

function getGoalWeights(goal: GoalId): Record<string, number> {
  const weights: Record<GoalId, Record<string, number>> = {
    get_clients: {
      hookStrength: 0.25,
      specificity: 0.25,
      authority: 0.2,
      cta: 0.15,
      originality: 0.15
    },
    grow_audience: {
      hookStrength: 0.2,
      specificity: 0.15,
      authority: 0.15,
      cta: 0.25,
      originality: 0.25
    },
    authority: {
      hookStrength: 0.2,
      specificity: 0.25,
      authority: 0.3,
      cta: 0.1,
      originality: 0.15
    },
    viral: {
      hookStrength: 0.3,
      specificity: 0.1,
      authority: 0.1,
      cta: 0.2,
      originality: 0.3
    },
    personal_brand: {
      hookStrength: 0.25,
      specificity: 0.15,
      authority: 0.2,
      cta: 0.15,
      originality: 0.25
    }
  }

  return weights[goal] || weights.get_clients
}
