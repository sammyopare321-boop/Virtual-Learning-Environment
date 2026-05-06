'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/utils/axiosInstance';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // On mount, fetch current user if token exists
    const token = document.cookie.includes('token');
    if (token) {
      axiosInstance.get('/api/auth/me')
        .then(res => setUser(res.data.data))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await axiosInstance.post('/api/auth/login', { email, password });
    const { token, data } = res.data;
    // Store token in httpOnly-like cookie via API or document.cookie
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    setUser(data);
    router.push(`/dashboard/${data.role}`);
  };

  const register = async (userData) => {
    const res = await axiosInstance.post('/api/auth/register', userData);
    const { token, data } = res.data;
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}`;
    setUser(data);
    router.push(`/dashboard/${data.role}`);
  };

  const logout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    setUser(null);
    router.push('/auth/login');
  };

  const isImpersonating = () => {
    try {
      const token = document.cookie.match(/token=([^;]+)/)?.[1];
      if (!token) return false;
      const decoded = jwtDecode(token);
      return decoded.isImpersonation === true;
    } catch { return false; }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isImpersonating }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
