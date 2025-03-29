// Configuration for the client application

/**
 * Get the base URL for API requests.
 * In development, this will be the same origin (since we're using Vite's proxy).
 * In production, the API and client are served from the same server.
 */
export function getApiBaseUrl(): string {
  // When running in the browser, use the current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for SSR or non-browser environments
  return 'http://localhost:3000';
} 