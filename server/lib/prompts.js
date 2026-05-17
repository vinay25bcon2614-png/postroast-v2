export function getRoastPrompt(postText, goals, creatorMix) {
  const goalDescriptions = {
    get_clients: 'Convert followers into paying customers',
    authority: 'Become the go-to expert in your niche',
    growth: 'Build followers, increase reach',
    viral: 'Occasional breakout posts with high impressions',
    thought_leader: 'Shape industry, get speaking invites',
    personal_brand: 'Build long-term recognition and credibility'
  };

  const goalText = goals
    .map(g => `${g.id}: ${goalDescriptions[g.id] || g.id}`)
    .join('\n');

  const creatorText = creatorMix
    .map(c => `${c.key} (weight: ${c.weight})`)
    .join(', ');

  return `You are a LinkedIn content strategist and AI post analyzer for PostRoast.

Your job: Score this LinkedIn post across 8 dimensions, identify why it will or won't perform, and provide actionable feedback.

USER'S POST:
"""
${postText}
"""

USER'S GOALS (prioritized):
${goalText}

CREATOR STYLES TO CONSIDER:
${creatorText}

SCORE THIS POST on a scale of 0-100 for each dimension:

1. **Hook Score** (0-100): Does the first line stop the scroll?
   - 0-30: Boring, doesn't create curiosity
   - 30-60: Okay, some curiosity but not compelling
   - 60-80: Good hook, makes people want to read more
   - 80-100: Exceptional, immediately compelling

2. **Clarity Score** (0-100): Is the message clear and easy to understand?
   - Consider: Is it obvious what the post is about? Can someone understand it in 5 seconds?

3. **Authority Score** (0-100): Does it establish expertise or credibility?
   - Consider: Does this position the writer as someone worth following?

4. **Engagement Score** (0-100): Will people engage (like, comment, share)?
   - Consider: Is there a reason to stop, react, or comment?

5. **Format Score** (0-100): Does it follow a proven high-performing format?
   - Common formats: Story, List, Framework, Contrarian, Data-Driven, Question, Vulnerability, Case Study

6. **Goal Alignment Score** (0-100): Does it align with the user's goals?
   - Consider: For "${goals[0]?.id || 'N/A'}", does this post help achieve that?

7. **CTA Score** (0-100): Is there a clear, compelling call-to-action?
   - Good CTAs: "DM me", "Reply with...", "Link in bio", "Comment below"
   - Bad CTAs: None, vague, too aggressive

8. **Originality Score** (0-100): Is this unique or does it feel generic?
   - Consider: Would someone have seen this exact post before?

---

RESPOND ONLY WITH VALID JSON (no markdown, no code blocks):

{
  "compositeScore": <0-100>,
  "scores": {
    "hook": <0-100>,
    "clarity": <0-100>,
    "authority": <0-100>,
    "engagement": <0-100>,
    "format": <0-100>,
    "goalAlignment": <0-100>,
    "cta": <0-100>,
    "originality": <0-100>
  },
  "formatDetected": "<Story|List|Framework|Contrarian|Data|Question|Vulnerability|CaseStudy|Other>",
  "summary": "<1 sentence summary of what this post does well>",
  "weaknesses": [
    "<specific weakness 1>",
    "<specific weakness 2>",
    "<specific weakness 3>"
  ],
  "keyInsight": "<1-2 sentences about the main issue holding this post back>",
  "improvement": "<specific, actionable improvement advice>"
}`;
}

export function getRewritePrompt(postText, goals, scores, creatorMix, styleDNA = null) {
  const creatorPatterns = {
    welsh: {
      style: 'Philosophical, warm, focus on freedom and authenticity',
      exampleOpening: 'Remember: [contrarian take]',
      signature: 'Asks reflective questions, builds to insight'
    },
    hormozi: {
      style: 'Aggressive, direct, pattern-focused, contrarian',
      exampleOpening: 'Listen: Here\'s what most miss...',
      signature: 'Challenges conventional wisdom, gives framework'
    },
    acosta: {
      style: 'Strategic, viral-focused, story-driven',
      exampleOpening: 'I used to think [X]. Now I think [Y].',
      signature: 'Creates tension through contrasts, clear CTAs'
    },
    rachitsky: {
      style: 'Data-driven, educational, detailed breakdown',
      exampleOpening: 'Here are the [number] metrics that matter...',
      signature: 'Lists with data, step-by-step frameworks'
    }
  };

  let styleGuide = '';
  if (styleDNA && styleDNA.posts_analysed >= 10) {
    styleGuide = `
WRITE IN THIS SPECIFIC PERSON'S VOICE:
Voice fingerprint: ${styleDNA.voiceFingerprint}
Voice tags: ${styleDNA.voiceTags?.join(', ')}
Directness: ${styleDNA.directness}% (${styleDNA.directness > 60 ? 'very direct' : 'storytelling-focused'})
Sample sentence: "${styleDNA.sampleSentence}"

Make this rewrite sound like THIS specific writer, not generic AI.
`;
  } else {
    styleGuide = `
CREATOR STYLES TO BLEND:
${creatorMix.map(c => {
  const pattern = creatorPatterns[c.key];
  return pattern ? `${c.key}: ${pattern.style} (weight: ${c.weight})` : `${c.key} (weight: ${c.weight})`;
}).join('\n')}
`;
  }

  return `You are a LinkedIn copywriter rewriting posts to score higher on specific dimensions.

ORIGINAL POST:
"""
${postText}
"""

CURRENT SCORES (out of 100):
- Hook: ${scores.hook}
- Clarity: ${scores.clarity}
- Authority: ${scores.authority}
- Engagement: ${scores.engagement}
- Format: ${scores.format}
- Goal Alignment: ${scores.goalAlignment}
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
