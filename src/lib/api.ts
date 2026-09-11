/**
 * Base API client for communicating with the Express backend server.
 * All API calls go through this module.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * Get stored JWT token
 */
const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

/**
 * Store JWT token
 */
export const setToken = (token: string) => {
  localStorage.setItem('auth_token', token);
};

/**
 * Remove JWT token
 */
export const clearToken = () => {
  localStorage.removeItem('auth_token');
};

/**
 * Make an API request with automatic auth headers and error handling
 */
export const apiRequest = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(errorBody.error || `HTTP ${response.status}`);
  }

  return response.json();
};

/**
 * Convenience methods
 */
export const api = {
  get: <T = any>(endpoint: string) => apiRequest<T>(endpoint),

  post: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: <T = any>(endpoint: string, body: any) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }),
};
