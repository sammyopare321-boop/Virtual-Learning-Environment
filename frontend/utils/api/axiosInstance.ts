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
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
      setAuthToken(null);
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
