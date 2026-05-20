/**
 * API Configuration - Centralized for easy domain switching
 * Change the API_BASE_URL when switching domains
 */

// Get API URL from environment variable, fallback to localhost
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const apiConfig = {
  baseURL: API_BASE_URL,
  apiPath: '/api',
  
  // Generate full API endpoint
  getEndpoint: (path: string) => {
    // If already has protocol, use as-is
    if (path.startsWith('http')) return path;
    
    // If already starts with /api, use baseURL + path
    if (path.startsWith('/api')) {
      return `${API_BASE_URL}${path}`;
    }
    
    // Otherwise, prepend /api
    return `${API_BASE_URL}/api${path}`;
  }
};

/**
 * Generic fetch wrapper with error handling and auth
 */
export async function apiFetch(
  endpoint: string,
  options: RequestInit & { skipBaseURL?: boolean } = {}
) {
  const { skipBaseURL = false, ...fetchOptions } = options;
  
  const url = skipBaseURL ? endpoint : apiConfig.getEndpoint(endpoint);
  
  // Add auth token if available
  const authToken = localStorage.getItem('auth_token');
  if (authToken && !fetchOptions.headers) {
    fetchOptions.headers = {};
  }
  if (authToken) {
    (fetchOptions.headers as Record<string, string>)['Authorization'] = `Bearer ${authToken}`;
  }
  
  // Ensure JSON headers
  if (!fetchOptions.headers) {
    fetchOptions.headers = {};
  }
  if (fetchOptions.body && !((fetchOptions.headers as Record<string, string>)['Content-Type'])) {
    (fetchOptions.headers as Record<string, string>)['Content-Type'] = 'application/json';
  }
  
  try {
    const response = await fetch(url, fetchOptions);
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error ${response.status}: ${error}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
}

export default apiConfig;
