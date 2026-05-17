import { useAuth } from '../contexts/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

async function fetchBackend(endpoint, method = 'GET', body = null) {
  const token = getAuthToken();

  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${endpoint}`, options);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export async function getRoast(postText, goals, creatorMix) {
  return fetchBackend('/api/roast', 'POST', {
    postText,
    goals,
    creatorMix
  });
}

export async function getRewrite(postText, goals, creatorMix, roastId = null) {
  return fetchBackend('/api/rewrite', 'POST', {
    postText,
    goals,
    creatorMix,
    roastId
  });
}

export async function getHooks(postTopic, audience, goals, creatorMix) {
  return fetchBackend('/api/hooks', 'POST', {
    postTopic,
    audience,
    goals,
    creatorMix
  });
}

export async function getCTAs(goal, offer, audience, postContext) {
  return fetchBackend('/api/cta', 'POST', {
    goal,
    offer,
    audience,
    postContext
  });
}

export async function auditPost(postText) {
  return fetchBackend('/api/audit', 'POST', {
    postText
  });
}

export async function getStyleDNA() {
  return fetchBackend('/api/dna', 'GET');
}

export async function getAnalytics() {
  return fetchBackend('/api/analytics', 'GET');
}

export async function getLeaderboard() {
  return fetchBackend('/api/leaderboard', 'GET');
}

// Helper to get auth token for fetch calls
export function getAuthToken() {
  return localStorage.getItem('authToken');
}

