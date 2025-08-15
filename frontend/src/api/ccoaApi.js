import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Generates a ChromaDB-compatible collection name from a repo URL.
 * @param {string} repoUrl - The URL of the GitHub repository.
 * @returns {string} A unique session ID for the repository.
 */
export const generateSessionId = (repoUrl) => {
  if (!repoUrl) return '';
  return repoUrl.replace("https://", "").replace(/\//g, "_").replace(/\./g, "_");
};

/**
 * Onboards a new repository.
 * @param {string} repoUrl - The URL of the GitHub repository.
 * @returns {Promise<object>} The onboarding data (learning path, starter tasks).
 */
export const onboardRepository = (repoUrl) => {
  return apiClient.post('/api/v1/onboard', { repo_url: repoUrl });
};

/**
 * Sends a chat message to the backend.
 * @param {string} sessionId - The session ID for the repository.
 * @param {string} query - The user's question.
 * @returns {Promise<object>} The chat response including the answer and provenance.
 */
export const sendChatMessage = (sessionId, query) => {
  return apiClient.post('/api/v1/chat', { session_id: sessionId, query });
};