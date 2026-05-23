/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, User, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

function RegisterContent() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' as const });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple Google init (kept for functionality)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: any) => {
          setLoading(true);
          try {
            const user = await loginWithGoogle(response.credential, form.role);
            toast.success('Welcome!');
            router.push(`/dashboard/${user.role}`);
          } catch (e) {
            const msg = (e as AxiosError<{ message: string }>).response?.data?.message || 'Google sign‑up failed';
            setError(msg);
            toast.error(msg);
          } finally {
            setLoading(false);
          }
        },
      });
      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-signup-btn'),
        { theme: 'outline', size: 'large', shape: 'rectangular', text: 'signup_with', width: 200 }
      );
    }
  }, [loginWithGoogle, form.role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required');
      return;
    }
    setLoading(true);
    try {
      // Register via API then log in
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const loggedInUser = await login(form.email, form.password);
      toast.success('Account created!');
      router.push(`/dashboard/${loggedInUser.role}`);
    } catch (e) {
      const msg = (e as AxiosError<{ message: string }>).response?.data?.message || 'Registration failed';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap size={32} className="text-blue-600" />
          <h1 className="text-2xl font-bold text-slate-900">UniLearn Register</h1>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="email"
                type="email"
                className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                id="password"
                type="password"
                className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1" htmlFor="role">Account Type</label>
            <select
              id="role"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value as any })}
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Create Account'}
          </button>
        </form>
        <div className="my-4 text-center text-slate-500">or</div>
        <div id="google-signup-btn" className="flex justify-center" />
        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account? <Link href="/auth/login" className="text-blue-600 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
      <RegisterContent />
    </Suspense>
  );
}
