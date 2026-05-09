import { GoalId, PostScore, ScoreDimension } from '../types';
import { getScoringPrompt, getRewritePrompt, getInsightPrompt } from '../lib/prompts';

// This service will integrate with your Claude API backend
// Adjust the endpoint based on your backend setup

interface ScoreResponse {
  overall: number;
  dimensions: Record<string, { score: number; feedback: string }>;
  primaryStrength: string;
  primaryWeakness: string;
  improvements: string[];
}

export async function scorePost(
  goal: GoalId,
  postContent: string
): Promise<{ overall: number; dimensions: ScoreDimension[] }> {
  try {
    const prompt = getScoringPrompt(goal, postContent);

    // Call your backend endpoint
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, goal, postContent }),
    });

    if (!response.ok) throw new Error('Scoring failed');

    const data: ScoreResponse = await response.json();

    const dimensions: ScoreDimension[] = Object.entries(data.dimensions).map(
      ([name, { score }]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        score,
      })
    );

    return {
      overall: data.overall,
      dimensions,
    };
  } catch (error) {
    console.error('Error scoring post:', error);
    throw error;
  }
}

export async function rewritePost(
  goal: GoalId,
  postContent: string,
  userContext?: { industry?: string; audience?: string; voice?: string }
): Promise<string> {
  try {
    const prompt = getRewritePrompt(goal, postContent, userContext);

    const response = await fetch('/api/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, goal, postContent }),
    });

    if (!response.ok) throw new Error('Rewrite failed');

    const data = await response.json();
    return data.rewrite;
  } catch (error) {
    console.error('Error rewriting post:', error);
    throw error;
  }
}

export async function getInsight(
  goal: GoalId,
  postContent: string,
  scores: Record<string, number>
): Promise<{ strength: string; weakness: string; primaryFix: string }> {
  try {
    const prompt = getInsightPrompt(goal, postContent, scores);

    const response = await fetch('/api/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, goal, postContent }),
    });

    if (!response.ok) throw new Error('Insight failed');

    return await response.json();
  } catch (error) {
    console.error('Error getting insight:', error);
    throw error;
  }
}
