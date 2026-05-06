"use client";

import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" }
});

api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const token = document.cookie.match(/(?:^|; )token=([^;]+)/)?.[1];
    if (token) config.headers.Authorization = `Bearer ${decodeURIComponent(token)}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      document.cookie = "token=; path=/; max-age=0";
      document.cookie = "role=; path=/; max-age=0";
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default api;
