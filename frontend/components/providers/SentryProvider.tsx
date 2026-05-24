'use client';

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { initSentry, setSentryUser, clearSentryUser } from '@/lib/sentry';

export function SentryProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    // Initialize Sentry on mount
    initSentry();
  }, []);

  useEffect(() => {
    // Set user context when authenticated
    if (user?._id) {
      setSentryUser(user._id, user.email, user.name);
    } else {
      clearSentryUser();
    }
  }, [user]);

  return <>{children}</>;
}
