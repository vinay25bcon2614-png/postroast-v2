import { GoalId } from '../types';
import { GOALS } from './goals';
import { getTemplateForGoal, getKeywordsForGoal } from './templates';

export function getRewritePrompt(
  goal: GoalId,
  postContent: string,
  userContext?: { industry?: string; audience?: string; voice?: string }
): string {
  const goalConfig = GOALS[goal];
  const templates = getTemplateForGoal(goal);
  const keywords = getKeywordsForGoal(goal);

  const basePrompt = {
    get_clients: `You are rewriting a LinkedIn post to ATTRACT INBOUND CLIENTS AND LEADS.

Goal-specific scoring: Hook(25%) + Specificity(25%) + Authority(20%) + CTA(15%) + Originality(15%)

KEY PRINCIPLES:
1. Open with SPECIFIC PROBLEM they face (not generic motivation)
2. Show you understand their exact situation
3. Include proof of authority (results, examples)
4. Add clear, easy call-to-action
5. Remove generic language or corporate tone
6. Speak directly to ideal client's pain

TEMPLATE STRUCTURE:
- Hook: Identify specific problem
- Problem Agitation: Why this matters, consequences
- Authority: Proof point or example
- Solution Path: Better approach
- CTA: Clear next step (DM, call, consultation, etc.)

AVOID:
- Motivation quotes
- Too many hashtags
- Generic positioning
- Vague language

CREATOR EXAMPLES: ${templates.map((t) => t.name).join(', ')}

POST TO REWRITE:
${postContent}

USER CONTEXT: ${userContext ? `Industry: ${userContext.industry}, Audience: ${userContext.audience}, Voice: ${userContext.voice}` : 'General'}

Return ONLY the rewritten post (no explanations).`,

    grow_audience: `You are rewriting a LinkedIn post to BUILD A GROWING, ENGAGED AUDIENCE.

Goal-specific scoring: Relatability(25%) + Hook(20%) + Storytelling(25%) + Controversy(15%) + Originality(15%)

KEY PRINCIPLES:
1. Lead with relatable moment or emotion
2. Tell clear story with specific details
3. Extract genuine lesson people can learn
4. Remove corporate tone - sound like a real person
5. Add discussion-prompting element
6. Make people want to comment

TEMPLATE STRUCTURE:
- Hook: Personal moment or surprising truth
- Story: Specific details, vivid narrative
- Insight: What you learned
- Lesson: How people can apply this
- Engagement: Question or reflection

IMPORTANT:
- Sound authentic, not polished
- Use "I" and personal voice
- Create emotional resonance
- End with something discussion-worthy
- AVOID: Sales language, generic wisdom, unclear lessons

CREATOR EXAMPLES: ${templates.map((t) => t.name).join(', ')}

POST TO REWRITE:
${postContent}

Return ONLY the rewritten post (no explanations).`,

    authority: `You are rewriting a LinkedIn post to ESTABLISH THOUGHT LEADERSHIP.

Goal-specific scoring: Counterintuitive(25%) + Credibility(20%) + Authority(20%) + Clarity(20%) + Originality(15%)

KEY PRINCIPLES:
1. Lead with counterintuitive insight or pattern
2. Back it up with research, data, or clear logic
3. Explain why conventional wisdom is wrong
4. Connect to real-world implications
5. Position author as expert without flexing
6. Make implications crystal clear

TEMPLATE STRUCTURE:
- Hook: Counterintuitive insight
- Context: What conventional wisdom says
- Evidence: Research, data, or reasoning
- Implication: What this means
- Application: How this changes practice

IMPORTANT:
- Ground in evidence (data, research, experience)
- Challenge assumptions thoughtfully
- Show deep expertise without self-promotion
- Make implications clear
- AVOID: Unsubstantiated claims, vague insights

CREATOR EXAMPLES: ${templates.map((t) => t.name).join(', ')}

POST TO REWRITE:
${postContent}

Return ONLY the rewritten post (no explanations).`,

    balanced: `You are rewriting a LinkedIn post with BALANCED GOALS (audience + leads + authority).

Goal-specific scoring balanced across: Hook(18%) + Relatability(18%) + Specificity(16%) + Authority(16%) + Storytelling(16%) + Originality(16%)

KEY PRINCIPLES:
1. Strong hook that stops scrollers
2. Personal story or relatable insight
3. Clear value/lesson for audience
4. Subtle positioning of expertise
5. Natural call-to-action or engagement hook
6. Multiple entry points for different readers

TEMPLATE STRUCTURE:
- Hook: Personal + compelling
- Story/Context: Relatable moment
- Insight: Clear takeaway
- Value: Specific thing people can do
- Implication: How this helps
- Engagement: Subtle CTA or discussion

IMPORTANT:
- Balance emotion with value
- Multiple angles for different readers
- Authentic voice
- Clear primary message
- AVOID: Trying to do everything, unclear main point

POST TO REWRITE:
${postContent}

Return ONLY the rewritten post (no explanations).`,
  };

  return basePrompt[goal] || basePrompt.balanced;
}

export function getScoringPrompt(goal: GoalId, postContent: string): string {
  const goalConfig = GOALS[goal];
  const weights = goalConfig.scoringWeights;

  const dimensions = {
    get_clients: `
    1. **Hook Strength (${(weights.hookStrength * 100).toFixed(0)}%)**: Does it stop scrollers? Is it emotionally resonant?
    2. **Specificity (${(weights.specificity * 100).toFixed(0)}%)**: Is the problem clear and specific? Would I know if this is for me?
    3. **Authority (${(weights.authority * 100).toFixed(0)}%)**: Do they have credibility? Is there social proof?
    4. **CTA (${(weights.cta * 100).toFixed(0)}%)**: Is the call-to-action clear and easy?
    5. **Originality (${(weights.originality * 100).toFixed(0)}%)**: Is this fresh or repackaged?
    `,

    grow_audience: `
    1. **Relatability (${(weights.relatability * 100).toFixed(0)}%)**: Would people feel "that's so me"? Is there emotional resonance?
    2. **Hook Strength (${(weights.hookStrength * 100).toFixed(0)}%)**: Does it make you want to read more?
    3. **Storytelling (${(weights.storytelling * 100).toFixed(0)}%)**: Is there clear story arc? Vivid details? Tension/resolution?
    4. **Controversy (${(weights.controversy * 100).toFixed(0)}%)**: Does this spark discussion? Invite perspective?
    5. **Originality (${(weights.originality * 100).toFixed(0)}%)**: Is the voice authentic and distinctive?
    `,

    authority: `
    1. **Counterintuitive (${(weights.depth * 100).toFixed(0)}%)**: Does it challenge thinking? Is it surprising but defensible?
    2. **Credibility (${(weights.framework * 100).toFixed(0)}%)**: Is there research/data/evidence? Are claims substantiated?
    3. **Authority (${(weights.authority * 100).toFixed(0)}%)**: Do I believe they're an expert?
    4. **Clarity (${(weights.clarity * 100).toFixed(0)}%)**: Can I understand the core insight? Well-structured?
    5. **Originality (${(weights.originality * 100).toFixed(0)}%)**: Is this a fresh perspective?
    `,

    balanced: `
    1. **Hook (18%)**: Does it stop scrollers? Is it compelling?
    2. **Relatability (18%)**: Do I feel connected? Would I say "that's me"?
    3. **Specificity (16%)**: Clear and specific? Avoids vague language?
    4. **Authority (16%)**: Does this demonstrate credibility? Social proof?
    5. **Storytelling (16%)**: Is it well-told? Engaging arc?
    6. **Originality (16%)**: Distinctive voice? Novel angle?
    `,
  };

  return `You are an expert LinkedIn post analyzer for PostRoast.
Your goal: Analyze this post for a user who wants to **${goalConfig.label}** (${goalConfig.description}).

Score these dimensions:
${dimensions[goal]}

For each dimension:
- Score from 0-100
- 1-2 sentence explanation
- Specific feedback

Then provide:
- Overall score (weighted average)
- Primary strength (what works)
- Primary weakness (what needs fixing)
- Top 3 specific improvements

---
POST TO ANALYZE:
${postContent}

---
Return as JSON:
{
  "overall": <0-100>,
  "dimensions": {
    "dimension1": { "score": <0-100>, "feedback": "..." },
    ...
  },
  "primaryStrength": "...",
  "primaryWeakness": "...",
  "improvements": ["...", "...", "..."]
}`;
}

export function getInsightPrompt(
  goal: GoalId,
  postContent: string,
  scores: Record<string, number>
): string {
  return `Based on this ${goal} post analysis, provide concise feedback:

POST: ${postContent}

SCORES: ${JSON.stringify(scores)}

Provide:
1. One sentence summary of biggest strength
2. One sentence about primary weakness
3. One specific, actionable fix (1-2 sentences)

Return as JSON: { "strength": "...", "weakness": "...", "primaryFix": "..." }`;
}
