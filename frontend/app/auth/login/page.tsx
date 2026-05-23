/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { GraduationCap, Mail, Lock, Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';

function LoginContent() {
  const { login, loginWithGoogle, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Google init – minimal version (kept for functionality)
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).google) {
      (window as any).google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
        callback: async (response: any) => {
          setLoading(true);
          try {
            const loggedInUser = await loginWithGoogle(response.credential);
            toast.success('Welcome via Google!');
            const redirect = searchParams.get('redirect') ?? `/dashboard/${loggedInUser.role}`;
            router.push(redirect);
          } catch (e) {
            const msg = (e as AxiosError<{ message: string }>).response?.data?.message || 'Google Sign‑In failed';
            setError(msg);
            toast.error(msg);
          } finally {
            setLoading(false);
          }
        },
      });
      (window as any).google.accounts.id.renderButton(
        document.getElementById('google-btn'),
        { theme: 'outline', size: 'large', shape: 'rectangular', text: 'signin_with', width: 200 }
      );
    }
  }, [loginWithGoogle, router, searchParams]);

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push(`/dashboard/${user.role}`);
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) {
      setError('Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      toast.success('Welcome back!');
      const redirect = searchParams.get('redirect') ?? `/dashboard/${loggedInUser.role}`;
      router.push(redirect);
    } catch (e) {
      const msg = (e as AxiosError<{ message: string }>).response?.data?.message || 'Invalid credentials';
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
          <h1 className="text-2xl font-bold text-slate-900">UniLearn Login</h1>
        </div>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Sign In'}
          </button>
        </form>
        <div className="my-4 text-center text-slate-500">or</div>
        <div id="google-btn" className="flex justify-center" />
        <p className="mt-6 text-center text-sm text-slate-600">
          New here? <Link href="/auth/register" className="text-blue-600 hover:underline">Create an account</Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center p-6"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
      <LoginContent />
    </Suspense>
  );
}
