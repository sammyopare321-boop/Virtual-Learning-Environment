import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
  withCredentials: true, // Send the HttpOnly cookie automatically on every request
});

// Handle 401 globally — redirect to login
axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      // Cookie is HttpOnly — cleared server-side via POST /api/auth/logout.
      // Just redirect; the middleware will handle the rest.
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
