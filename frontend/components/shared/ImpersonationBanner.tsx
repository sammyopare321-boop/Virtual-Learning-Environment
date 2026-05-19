'use client';

import { useState } from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ImpersonationBanner() {
  const { user, isImpersonating, exitImpersonation } = useAuth();
  const [exiting, setExiting] = useState(false);

  if (!isImpersonating()) return null;

  const handleExit = async () => {
    setExiting(true);
    try {
      await exitImpersonation();
    } finally {
      setExiting(false);
    }
  };

  return (
    <div
      role="status"
      className="fixed top-0 left-0 right-0 z-[100] bg-amber-500 text-amber-950 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <ShieldAlert size={18} className="shrink-0" aria-hidden />
          <p className="text-sm font-bold truncate">
            Impersonating <span className="font-black">{user?.name}</span>
            <span className="hidden sm:inline font-medium opacity-80"> — admin view only (15 min)</span>
          </p>
        </div>
        <button
          type="button"
          onClick={handleExit}
          disabled={exiting}
          className="shrink-0 flex items-center gap-2 px-4 py-1.5 rounded-lg bg-amber-950/15 hover:bg-amber-950/25 text-sm font-black uppercase tracking-wider transition-colors disabled:opacity-60"
        >
          <LogOut size={14} />
          {exiting ? 'Exiting…' : 'Exit'}
        </button>
      </div>
    </div>
  );
}
