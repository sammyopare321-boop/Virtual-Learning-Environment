/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

function LoginContent() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: any) => {
          setLoading(true);
          try {
            const user = await loginWithGoogle(response.credential, 'student');
            toast.success('Welcome back!');
            router.push(redirect || `/dashboard/${user.role}`);
          } catch (e) {
            const msg = (e as AxiosError<{ message: string }>).response?.data?.message || 'Google sign-in failed';
            setError(msg); toast.error(msg);
          } finally { setLoading(false); }
        },
      });
      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', shape: 'rectangular', text: 'signin_with', width: 200 }
      );
    }
  }, [loginWithGoogle, redirect, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success('Welcome back!');
      router.push(redirect || `/dashboard/${user.role}`);
    } catch (e) {
      const msg = (e as AxiosError<{ message: string }>).response?.data?.message || 'Invalid credentials';
      setError(msg); toast.error(msg);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-[14px] font-bold text-slate-900 leading-none">UniLearn</p>
            <p className="text-[10px] text-slate-400 leading-none">Intelligence Platform</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h1 className="text-[18px] font-semibold text-slate-900 mb-1">Sign in</h1>
          <p className="text-[13px] text-slate-500 mb-5">Enter your credentials to continue.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-100 text-red-700 text-[12px] font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="section-label block mb-1.5" htmlFor="email">Email</label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  id="email" type="email" required
                  className="input-premium pl-8"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="section-label block mb-1.5" htmlFor="password">Password</label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input
                  id="password" type="password" required
                  className="input-premium pl-8"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="btn btn-primary w-full gap-2 mt-1"
            >
              {loading ? <Loader2 size={14} className="animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="my-4 flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-[11px] text-slate-400">or</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>
          <div id="google-signin-btn" className="flex justify-center" />

          <p className="mt-5 text-center text-[12px] text-slate-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-primary-600 font-medium hover:underline">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-600" size={24} />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
