'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { GraduationCap, ArrowLeft, Zap } from 'lucide-react';
import SentinelFeed from '@/components/shared/SentinelFeed';
import { useState, useEffect } from 'react';

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isSentinelOpen, setIsSentinelOpen] = useState(false);

  useEffect(() => {
    const handleToggle = () => setIsSentinelOpen(p => !p);
    window.addEventListener('toggle-sentinel', handleToggle);
    return () => window.removeEventListener('toggle-sentinel', handleToggle);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans overflow-x-hidden">
      {/* Universal Top Navigation */}
      <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href={`/dashboard/${user?.role || 'student'}`} className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
              <GraduationCap className="text-white" size={18} />
            </div>
            <span className="font-black text-lg text-slate-900 tracking-tight hidden sm:block">UniLearn</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsSentinelOpen(true)}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-100 text-slate-400 hover:text-amber-500 transition-all"
            aria-label="Open Sentinel"
            title="Open Sentinel"
          >
            <Zap size={18} />
          </button>
          <Link 
            href={`/dashboard/${user?.role || 'student'}`} 
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-widest"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12 relative z-10">
        {children}
      </main>

      {/* Global Components */}
      <SentinelFeed isOpen={isSentinelOpen} onClose={() => setIsSentinelOpen(false)} />
    </div>
  );
}
