import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = document.cookie.match(/token=([^;]+)/)?.[1];
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle expired tokens globally
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      document.cookie = 'token=; path=/; max-age=0';
      if (typeof window !== "undefined") {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(err);
  }
);

export default axiosInstance;
