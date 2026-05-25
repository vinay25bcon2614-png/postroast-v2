/**
 * PostRoast — Complete Prompt Library
 * Used by roast.js and rewrite endpoint
 */

const goalInstructions = {
  get_clients: {
    emphasis: 'Credibility, specificity, proof. Does this post convince someone to hire?',
    tone: 'Professional but warm. Confident without arrogance.',
    hookStyle: 'Lead with result or problem the client faces.',
    ctaInstruction: 'CTA should be DM, call booking, or discovery call. Make it easy.',
    avoid: 'Hype language, unclear benefits, generic advice.',
    rewriteGoal: 'Post feels like it comes from someone who delivers results.'
  },
  grow_audience: {
    emphasis: 'Reach, shareability, comment-bait. Will this get shared?',
    tone: 'Conversational, slightly irreverent. You own the room.',
    hookStyle: 'Start with a question, contrarian take, or gasping stat.',
    ctaInstruction: 'Ask a question that makes people comment. Discussion bait.',
    avoid: 'Niche jargon, self-centered angle, no payoff.',
    rewriteGoal: 'Post feels like it will go viral in your niche.'
  },
  authority: {
    emphasis: 'Expertise, insight, unique perspective. Do you sound like an expert?',
    tone: 'Authoritative but teachable. You know things others don\'t.',
    hookStyle: 'Start by breaking a belief or sharing insider knowledge.',
    ctaInstruction: 'CTA should deepen relationship (follow, newsletter, next post).',
    avoid: 'Buzzwords, surface-level takes, no unique angle.',
    rewriteGoal: 'Post positions you as the authority in your niche.'
  },
  thought_leader: {
    emphasis: 'Originality, depth, memorable insight. Is this worth remembering?',
    tone: 'Contemplative, wise, slightly future-focused.',
    hookStyle: 'Start with an observation about the world or industry.',
    ctaInstruction: 'CTA should invite deeper conversation or reflection.',
    avoid: 'Trends, short-term thinking, obvious advice.',
    rewriteGoal: 'Post reads like it came from someone thinking 2 years ahead.'
  },
  viral: {
    emphasis: 'Emotion, relatability, shareability. Will people HAVE to share?',
    tone: 'Raw, vulnerable sometimes, definitely entertaining.',
    hookStyle: 'Start with something shocking, funny, or deeply relatable.',
    ctaInstruction: 'Don\'t ask for action—just make people feel something.',
    avoid: 'Corporate speak, hedging, playing it safe.',
    rewriteGoal: 'Post makes people laugh, feel seen, or want to tag someone.'
  },
  personal_brand: {
    emphasis: 'Authenticity, consistency, memorable POV. Does this feel like YOU?',
    tone: 'Your unique voice. No trying to be someone else.',
    hookStyle: 'Lead with something only you would say.',
    ctaInstruction: 'CTA should invite people into your world.',
    avoid: 'Generic advice, copying others, playing roles.',
    rewriteGoal: 'Post feels unmistakably like your brand.'
  },
}

export function getRoastPrompt(postText, goals, creatorMix) {
  const goal = (goals && goals[0]?.id) || 'balanced'
  const instructions = goalInstructions[goal] || goalInstructions.get_clients

  const creatorText = creatorMix
    .map(c => `- ${c.key}: ${c.style || 'expert in their field'}`)
    .join('\n');

  return `You are PostRoast — an expert LinkedIn strategist who writes posts that get results.

YOUR ROLE:
Analyze this LinkedIn post for someone whose PRIMARY GOAL is: ${goal.replace('_', ' ').toUpperCase()}

GOAL CONTEXT:
- Emphasis: ${instructions.emphasis}
- Tone: ${instructions.tone}
- Best hook style: ${instructions.hookStyle}
- CTA approach: ${instructions.ctaInstruction}
- What to avoid: ${instructions.avoid}
- What success looks like: ${instructions.rewriteGoal}

CREATOR INTELLIGENCE (blend these writing styles):
${creatorText}
Capture the ENERGY of these creators, not their content. Blend their tone, not their examples.

SCORING DIMENSIONS (0-100 each):
1. HOOK (0-100): Does the first 2 lines stop the scroll? (0=invisible, 100=impossible to skip)
2. CLARITY (0-100): Can a stranger understand your point in 10 seconds? (0=confusing, 100=crystal clear)
3. CREDIBILITY (0-100): Do you sound like you know what you're talking about? (0=novice, 100=industry expert)
4. EMOTION (0-100): Does it make people FEEL something? (0=flat, 100=emotionally resonant)
5. CTA (0-100): Does it have a clear next step? (0=no CTA, 100=compelling action)
6. STRUCTURE (0-100): Is it organized logically? (0=rambling, 100=clear flow)
7. ORIGINALITY (0-100): Is this unique to your POV? (0=generic, 100=only you could write this)
8. GOAL ALIGNMENT (0-100): How well does this serve your stated goal? (0=misaligned, 100=perfect match)

ADDITIONAL ANALYSIS:
- format: If this follows a proven LinkedIn format, name it ("Case study", "Mistake list", "Insider leak", etc.) — otherwise "No format"
- primaryStrength: One sentence about what works best
- primaryWeakness: One sentence about the biggest problem
- improvements: List 3 specific, actionable rewrites
- compositeScore: Weighted average of all 8 dimensions

CRITICAL RULES:
- Vary your scores. Real posts are uneven. Someone can score 85 on clarity but 28 on CTA.
- No all 60s or all 70s. That's lazy analysis.
- Hook and CTA are often the BIGGEST levers—score them honestly.
- NEVER give a high Goal Alignment score if the post doesn't serve the stated goal.

RETURN: Valid JSON ONLY (no markdown code blocks, no explanation):
{
  "hook": 0,
  "clarity": 0,
  "credibility": 0,
  "emotion": 0,
  "cta": 0,
  "structure": 0,
  "originality": 0,
  "goalAlignment": 0,
  "format": "string",
  "primaryStrength": "string",
  "primaryWeakness": "string",
  "improvements": ["string", "string", "string"],
  "compositeScore": 0,
  "feedback": {
    "hook": "why this score",
    "clarity": "why this score",
    "credibility": "why this score",
    "emotion": "why this score",
    "cta": "why this score",
    "structure": "why this score",
    "originality": "why this score",
    "goalAlignment": "why this score"
  }
}

POST TO ANALYSE (max 2000 words):
${postText.substring(0, 2000)}
`

export function getRewritePrompt(postText, goals, creatorMix, voiceDNA = null, industry = null) {
  const goal = (goals && goals[0]?.id) || 'balanced'
  const instructions = goalInstructions[goal] || goalInstructions.get_clients

  let prompt = `You are PostRoast — an expert LinkedIn rewriter.

REWRITE GOAL: ${goal.replace('_', ' ').toUpperCase()}

REWRITE PRINCIPLES:
- Emphasis: ${instructions.emphasis}
- Tone: ${instructions.tone}
- Hook style: ${instructions.hookStyle}
- CTA approach: ${instructions.ctaInstruction}
- Avoid: ${instructions.avoid}
`

  if (industry) {
    prompt += `\nINDUSTRY CONTEXT: ${industry}\n`
  }

  if (creatorMix && creatorMix.length > 0) {
    prompt += `\nCREATOR BLEND (mix these styles):
${creatorMix.map(c => `- ${c.key}: ${c.style || 'expert creator'}`).join('\n')}
Capture their ENERGY, not their content.\n`
  }

  if (voiceDNA) {
    prompt += `\nYOUR VOICE DNA:
- Sentence structure: ${voiceDNA.structure || 'mixed'}
- Energy: ${voiceDNA.energy || 'balanced'}
- Post length: ${voiceDNA.avgLength || 'medium'} words
Use these as your baseline.\n`
  }

  prompt += `
REWRITE RULES (strict):
1. The hook MUST be completely different—don't keep the same opener
2. Remove hedging: "just", "maybe", "I think", "I believe"
3. No AI phrases: "delve", "tapestry", "it's worth noting", "leverage", "synergy"
4. No buzzwords: "paradigm", "disruptive", "utilize", "holistic"
5. Short punchy lines (unless voice DNA says otherwise)
6. Every sentence must earn its place—cut fluff
7. CTA must match the goal
8. Use creator blend for tone—don't copy, capture energy

RETURN: Only the rewritten post. No explanation. No "Here's the rewrite:". Just the post.

ORIGINAL POST:
${postText.substring(0, 2500)}
`

  return prompt
}
- CTA: ${scores.cta}
- Originality: ${scores.originality}

WEAKEST AREAS TO FIX:
${[
  { key: 'hook', score: scores.hook },
  { key: 'clarity', score: scores.clarity },
  { key: 'authority', score: scores.authority },
  { key: 'engagement', score: scores.engagement },
  { key: 'cta', score: scores.cta },
  { key: 'originality', score: scores.originality }
]
  .sort((a, b) => a.score - b.score)
  .slice(0, 3)
  .map(d => `- ${d.key}: ${d.score}/100`)
  .join('\n')}

USER'S GOALS: ${goals.map(g => g.id).join(', ')}

${styleGuide}

---

REWRITE THIS POST TO:
1. Fix the weakest scoring dimensions
2. Keep the core message and authenticity
3. Match the creator style blend above
4. Stay under 300 words
5. Include a strong CTA

Important: Do NOT add fake statistics or false claims. Keep everything truthful.
Do NOT change the message entirely - enhance it.

RESPOND WITH ONLY THE REWRITTEN POST TEXT (no markdown, no explanation, just the post):`;
}

export function getHookPrompt(postTopic, audience, goals, creatorMix) {
  const hookTypes = {
    stat: 'Start with surprising statistic: "X% of people..."',
    contrarian: 'Challenge conventional wisdom: "Everyone says X. They\'re wrong..."',
    question: 'Ask compelling question: "What if...?"',
    story: 'Open with relatable scenario: "I used to..."',
    boldClaim: 'Make bold, defensible claim: "The biggest mistake is..."',
    vulnerability: 'Share personal challenge: "I failed at..."'
  };

  return `Generate 5 LinkedIn hooks for this topic. Each hook should be different and optimized for maximum scroll-stop.

TOPIC: ${postTopic}
TARGET AUDIENCE: ${audience}
GOALS: ${goals.join(', ')}
CREATOR STYLE: ${creatorMix.map(c => c.key).join(', ')}

Generate exactly 5 hooks, one of each type:

1. STAT HOOK (0-30 words)
   ${hookTypes.stat}
   Make it specific and surprising.

2. CONTRARIAN HOOK (0-30 words)
   ${hookTypes.contrarian}
   Challenge an assumption your audience has.

3. QUESTION HOOK (0-30 words)
   ${hookTypes.question}
   Make them want to know the answer.

4. STORY HOOK (0-30 words)
   ${hookTypes.story}
   Relatable opening that makes them curious.

5. BOLD CLAIM HOOK (0-30 words)
   ${hookTypes.boldClaim}
   Defensible and interesting.

---

RESPOND ONLY WITH VALID JSON:

{
  "hooks": [
    {
      "type": "stat",
      "text": "<hook text under 30 words>",
      "score": <0-100 for how good this hook is>
    },
    {
      "type": "contrarian",
      "text": "<hook text>",
      "score": <0-100>
    },
    {
      "type": "question",
      "text": "<hook text>",
      "score": <0-100>
    },
    {
      "type": "story",
      "text": "<hook text>",
      "score": <0-100>
    },
    {
      "type": "boldClaim",
      "text": "<hook text>",
      "score": <0-100>
    }
  ]
}`;
}

export function getCTAPrompt(goal, offer, audience, postContext) {
  const ctasByGoal = {
    get_clients: ['DM me', 'Reply with keyword', 'Book a call', 'Apply here'],
    growth: ['Follow for more', 'Save this post', 'Comment and I\'ll send', 'Subscribe'],
    authority: ['Read my full article', 'Share your thoughts', 'Join the discussion', 'Subscribe to my newsletter'],
    thought_leader: ['Let\'s discuss in comments', 'Subscribe for deep dives', 'Join the community', 'Share this insight']
  };

  const relevantCTAs = ctasByGoal[goal] || ['Engage below', 'Take action', 'Let me know'];

  return `Generate 4 LinkedIn CTAs optimized for: ${goal}

CONTEXT:
- Offer/Service: ${offer || 'Not specified'}
- Target Audience: ${audience}
- Post is about: ${postContext}

Goals for this CTA:
${goal === 'get_clients' ? '- Drive direct messages or call bookings\n- Qualify leads\n- Create urgency' : ''}
${goal === 'growth' ? '- Maximize engagement\n- Build audience\n- Encourage saves and shares' : ''}
${goal === 'authority' ? '- Foster discussion\n- Build community\n- Position as expert' : ''}

Generate 4 CTAs using these styles: ${relevantCTAs.join(', ')}

Each CTA should be:
- Under 20 words
- Specific, not generic
- Natural sounding, not forced
- Appropriate for the goal

---

RESPOND ONLY WITH VALID JSON:

{
  "ctas": [
    {
      "type": "<type>",
      "text": "<CTA text>",
      "score": <0-100 for effectiveness>,
      "goalAlignment": <0-100 for how well it matches the goal>
    },
    {
      "type": "<type>",
      "text": "<CTA text>",
      "score": <0-100>,
      "goalAlignment": <0-100>
    },
    {
      "type": "<type>",
      "text": "<CTA text>",
      "score": <0-100>,
      "goalAlignment": <0-100>
    },
    {
      "type": "<type>",
      "text": "<CTA text>",
      "score": <0-100>,
      "goalAlignment": <0-100>
    }
  ]
}`;
}
