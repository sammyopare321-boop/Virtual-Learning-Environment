import axios from 'axios';

// Use empty baseURL so /api/* requests go to the same origin and are handled
// by Next.js rewrite rules (which proxy to the real backend via API_URL or
// NEXT_PUBLIC_API_URL set in next.config.ts). Avoids circular requests when
// NEXT_PUBLIC_API_URL points to the frontend's own domain.
const axiosInstance = axios.create({
  baseURL: '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 90000, // 90s — AI calls can take up to 60s across provider fallbacks
  withCredentials: true,
});

// Token stored in memory (from login/register response body) for Bearer auth
let _authToken: string | null = null;

export function setAuthToken(token: string | null) {
  _authToken = token;
}

export function getAuthToken(): string | null {
  return _authToken;
}

// Attach Bearer token on every request (works cross-origin where cookies fail)
axiosInstance.interceptors.request.use((config) => {
  if (_authToken) {
    config.headers.Authorization = `Bearer ${_authToken}`;
  }
  return config;
});

// Handle 401 and 403 globally — redirect to appropriate pages
// Also capture errors with Sentry
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    // Capture API errors with Sentry
    if (typeof window !== 'undefined') {
      try {
        const { captureException, addSentryBreadcrumb } = require('@/lib/sentry');
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;
        
        // Add breadcrumb for debugging
        addSentryBreadcrumb(
          `API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
          'api',
          status >= 500 ? 'error' : 'warning'
        );

        // Capture 5xx errors as exceptions
        if (status >= 500) {
          captureException(error, {
            url: error.config?.url,
            method: error.config?.method,
            status,
            message,
          });
        }
      } catch {
        // Sentry not available
      }
    }

    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      // Handle 401 - Unauthorized (not logged in)
      if (error.response?.status === 401) {
        setAuthToken(null);
        window.location.href = '/auth/login';
      }
      
      // Handle 403 - Forbidden (logged in but insufficient permissions)
      if (error.response?.status === 403) {
        // Redirect to dashboard if trying to access unauthorized routes
        if (window.location.pathname.startsWith('/dashboard/teacher') || 
            window.location.pathname.startsWith('/dashboard/admin') ||
            window.location.pathname.startsWith('/teacher') ||
            window.location.pathname.startsWith('/admin')) {
          window.location.href = '/dashboard';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
