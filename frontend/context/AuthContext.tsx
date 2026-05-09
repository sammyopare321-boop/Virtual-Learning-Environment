'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '@/utils/api/authApi';

import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isImpersonating: () => boolean;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router                = useRouter();

  // Rehydrate session on mount — the HttpOnly cookie is sent automatically via withCredentials
  useEffect(() => {
    authApi.getMe()
      .then(res => setUser(res.data.data))
      .catch(() => setUser(null)) // No valid session — stay logged out
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    const { data } = res.data;
    // Cookie is set server-side as HttpOnly — we just store the user state
    setUser(data);
    router.push(`/dashboard/${data.role}`);
    return data;
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await authApi.logout(); // Clears the HttpOnly cookie on the server
    } finally {
      setUser(null);
      router.push('/auth/login');
    }
  }, [router]);

  const isImpersonating = useCallback(() => {
    try {
      // Token is HttpOnly, but is also returned in the login response body.
      // We detect impersonation from the user object's flag if available.
      const token = (user as any)?._impersonationToken;
      if (!token) return false;
      const decoded = jwtDecode<{ isImpersonation?: boolean }>(token);
      return decoded.isImpersonation === true;
    } catch { return false; }
  }, [user]);

  const updateUser = useCallback((updatedData: Partial<User>) => {
    setUser((prev) => prev ? ({ ...prev, ...updatedData }) : null);
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, login, logout, isImpersonating, updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
