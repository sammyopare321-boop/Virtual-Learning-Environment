import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
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

// Handle 401 globally — redirect to login
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

    if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      setAuthToken(null);
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
