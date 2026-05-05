"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/utils/api/authApi";
import { dashboardPath } from "@/utils/roleGuard";
import { errorMessage, unwrap } from "@/utils/formatters";

const AuthContext = createContext(null);

function setCookie(name, value, maxAge = 7 * 24 * 60 * 60) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function clearAuthCookies() {
  document.cookie = "token=; path=/; max-age=0";
  document.cookie = "role=; path=/; max-age=0";
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const router = useRouter();

  const refreshUser = async () => {
    const response = await authApi.getMe();
    const nextUser = unwrap(response);
    setUser(nextUser);
    if (nextUser?.role) setCookie("role", nextUser.role);
    return nextUser;
  };

  useEffect(() => {
    const hasToken = document.cookie.includes("token=");
    if (!hasToken) {
      setLoading(false);
      return;
    }

    refreshUser()
      .catch(() => {
        clearAuthCookies();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    setAuthError("");
    const response = await authApi.login(credentials);
    const token = response.data?.token;
    if (!token) throw new Error("Login did not return a token.");
    setCookie("token", token);
    const nextUser = await refreshUser();
    router.push(dashboardPath(nextUser?.role));
  };

  const register = async (payload) => {
    setAuthError("");
    const response = await authApi.register(payload);
    const token = response.data?.token;
    if (!token) throw new Error("Registration did not return a token.");
    setCookie("token", token);
    const nextUser = await refreshUser();
    router.push(dashboardPath(nextUser?.role));
  };

  const updateProfile = async (payload) => {
    const response = await authApi.updateMe(payload);
    const nextUser = unwrap(response);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    clearAuthCookies();
    setUser(null);
    router.push("/auth/login");
  };

  const value = useMemo(() => ({
    user,
    loading,
    authError,
    setAuthError: (error) => setAuthError(errorMessage(error)),
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
    isImpersonating: () => document.cookie.includes("impersonating=true")
  }), [user, loading, authError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
