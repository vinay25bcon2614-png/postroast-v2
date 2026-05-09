// Creator templates and patterns extracted from successful posts
// These teach the AI engine what successful LinkedIn posts look like for each goal

export const CREATOR_TEMPLATES = {
  // GET_CLIENTS: Focus on attracting leads
  justin_welsh_problem_first: {
    name: 'Justin Welsh - Problem First',
    goal: 'get_clients',
    structure: `
    1. Hook with emotional truth about a specific problem
    2. Identify why people get stuck (the trap)
    3. Present better way to think about it
    4. Share one specific example with results
    5. Clear CTA (usually newsletter or consultation)
    `,
    keyPrinciples: [
      'Lead with problem, not solution',
      'Make pain feel urgent and real',
      'Position your approach as counter-intuitive',
      'Use specific number or example',
      'End with easy next step',
    ],
  },

  alex_hormozi_assumed_close: {
    name: 'Alex Hormozi - Assumed Close',
    goal: 'get_clients',
    structure: `
    1. Open with specific claim about what fails
    2. Explain what most people try (and why it fails)
    3. Teach one method with steps
    4. Show result proof (numbers matter)
    5. Naturally mention your service
    `,
    keyPrinciples: [
      'Teach one thing deeply, not lists',
      'Use assumed close technique',
      'Include specific metrics/results',
      'Build authority without flexing',
      'Make business foundation principles clear',
    ],
  },

  chris_orlob_pain_agitation: {
    name: 'Chris Orlob - Pain Agitation',
    goal: 'get_clients',
    structure: `
    1. Hook with data point (X% fail at this)
    2. Research-backed insights
    3. Explain what top performers do differently
    4. Multiple specific tactics
    5. Link to deeper resource
    `,
    keyPrinciples: [
      'Lead with research and data',
      'Agitate the pain point deeply',
      'Provide multiple specific insights',
      'Back everything with evidence',
      'Show clear transformation pathway',
    ],
  },

  // GROW_AUDIENCE: Focus on engagement and followers
  lara_acosta_personal_story: {
    name: 'Lara Acosta - Personal Story',
    goal: 'grow_audience',
    structure: `
    1. Start with specific moment (I was, I did, I saw)
    2. Share feeling/reaction with details
    3. Insight from that moment
    4. How to apply this lesson
    5. Reflection or question
    `,
    keyPrinciples: [
      'Lead with relatable, specific moment',
      'Make it vivid with details',
      'Insight must be surprising but true',
      'Application should be clear',
      'End with engagement invitation',
    ],
  },

  steven_bartlett_philosophy: {
    name: 'Steven Bartlett - Philosophy',
    goal: 'grow_audience',
    structure: `
    1. Big idea or philosophical truth
    2. Historical context or parallel
    3. Current situation in the world
    4. Future implications
    5. Reflection that makes people think
    `,
    keyPrinciples: [
      'Start with something that feels true',
      'Dig deeper than surface level',
      'Make it feel like 1:1 conversation',
      'Build philosophical depth',
      'End with resonance, not CTA',
    ],
  },

  // AUTHORITY: Thought leadership
  lenny_rachitsky_research: {
    name: 'Lenny Rachitsky - Research',
    goal: 'authority',
    structure: `
    1. Research finding or expert interview
    2. What conventional wisdom says
    3. What data actually shows
    4. Why this matters
    5. Implications and forward question
    `,
    keyPrinciples: [
      'Ground in research and data',
      'Challenge conventional wisdom',
      'Show what experts miss',
      'Connect research to practice',
      'End with forward-thinking question',
    ],
  },

  packy_mccormick_patterns: {
    name: 'Packy McCormick - Pattern Analysis',
    goal: 'authority',
    structure: `
    1. Historical pattern (what happened then)
    2. Pattern repeating today
    3. What pattern reveals
    4. Implications for future
    5. What to watch for
    `,
    keyPrinciples: [
      'Show pattern across time',
      'Make pattern explicit',
      'Connect history to present',
      'Predict implications',
      'Provide framework for watching',
    ],
  },

  // BALANCED: Work for multiple goals
  balanced_story_plus_value: {
    name: 'Balanced - Story + Value',
    goal: 'balanced',
    structure: `
    1. Personal moment (hook + story)
    2. The insight from that moment
    3. Specific lesson people can use
    4. Broader application
    5. Engagement invitation
    `,
    keyPrinciples: [
      'Personal story hooks, value delivers',
      'Insight must be clear and applicable',
      'Balance emotion with value',
      'Multiple entry points',
      'Works for both clients and audience',
    ],
  },
};

export const TEMPLATE_KEYWORDS = {
  get_clients: {
    hookWords: [
      'most',
      'everyone',
      'nobody talks about',
      'real cost',
      'trade-off',
      'reverse',
    ],
    structures: [
      'Problem → Why → Solution → Proof → CTA',
      'Pain Point → Mistake → Better Way → Example',
      'Research → Insight → Method → Result',
    ],
  },

  grow_audience: {
    hookWords: [
      'surprising',
      'here\'s what',
      'controversial',
      'unpopular opinion',
      'this is wild',
      'I learned',
    ],
    structures: [
      'Story → Insight → Lesson → Question',
      'Observation → Pattern → Teaching → Invitation',
      'Truth → Why We Avoid It → Evidence → Reflection',
    ],
  },

  authority: {
    hookWords: [
      'research shows',
      'data reveals',
      'counterintuitive',
      'pattern analysis',
      'framework',
      'principle',
    ],
    structures: [
      'Data → Analysis → Framework → Implication',
      'Pattern → Why It Matters → Application',
      'Thesis → Evidence → Principle → Future',
    ],
  },
};

export function getTemplateForGoal(goal: string) {
  const templates = Object.values(CREATOR_TEMPLATES).filter(
    (t) => t.goal === goal
  );
  return templates;
}

export function getKeywordsForGoal(goal: string) {
  return TEMPLATE_KEYWORDS[goal] || TEMPLATE_KEYWORDS.balanced;
}
