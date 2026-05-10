'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  GraduationCap, Mail, Lock, ArrowRight, Loader2, 
  ShieldCheck, Search, Users, Sparkles, Star,
  CheckCircle2, Globe
} from 'lucide-react';

import { Suspense } from 'react';

function LoginContent() {
  const { login, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(`/dashboard/${user.role}`);
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!form.email || !form.password) {
      setError('Please enter both email and password');
      return;
    }
    setLoading(true);
    try {
      const loggedInUser = await login(form.email, form.password);
      toast.success('Welcome back to UniLearn!');
      
      // Respect redirect parameter or use default
      const redirectTo = searchParams.get('redirect');
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push(`/dashboard/${loggedInUser.role}`);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Invalid email or password';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Left Panel: Product Storytelling */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-white p-16 flex-col justify-between items-center overflow-hidden border-r border-slate-200">
        {/* Animated Mesh Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.4, 0.6, 0.4] 
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-50 rounded-full blur-[100px]" 
          />
          <div className="absolute bottom-[-5%] left-[-5%] w-[600px] h-[600px] bg-indigo-50 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <GraduationCap className="text-white" size={22} />
            </div>
            <span className="text-slate-900 font-extrabold text-2xl tracking-tight">UniLearn</span>
          </div>
          <div className="flex gap-4 opacity-50">
            <Globe size={20} className="text-slate-400" />
            <Users size={20} className="text-slate-400" />
          </div>
        </div>

        <div className="relative z-10 max-w-xl text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 leading-[1.1] tracking-tight">
              The intelligent workspace <br />
              <span className="text-blue-600 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">for modern education.</span>
            </h2>
            <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium">
              UniLearn helps students, educators, and institutions manage academic workflows, 
              analytics, and collaboration in one secure, enterprise-grade platform.
            </p>

            {/* Product Preview Mockup */}
            <div className="relative mb-12 group">
              <div className="relative rounded-[32px] border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50 bg-white">
                <Image 
                  src="/images/login_visual.png" 
                  alt="UniLearn Dashboard" 
                  width={800} 
                  height={600}
                  className="opacity-95 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/60 to-transparent" />
              </div>
              
              {/* Testimonial Floating Card */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="absolute -bottom-6 -right-10 bg-white/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-100 shadow-xl max-w-[280px] text-left"
              >
                <div className="flex gap-1 mb-3">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-sm font-semibold text-slate-700 mb-4 leading-relaxed">
                  "UniLearn transformed how our university manages digital learning. Truly enterprise-grade."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">ER</div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">DR. Elena RODRIGUEZ</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="relative z-10 w-full flex justify-between items-center px-4 mt-8">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Trusted By</span>
            <span className="text-sm font-bold text-slate-700">150+ Global Institutions</span>
          </div>
          <div className="flex items-center gap-6 opacity-60">
            <CheckCircle2 size={24} className="text-emerald-500" />
            <ShieldCheck size={24} className="text-blue-500" />
            <Sparkles size={24} className="text-amber-500" />
          </div>
        </div>
      </section>

      {/* Right Panel: Auth Form */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20 relative">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-[120px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[440px] relative z-10"
        >
          <div className="mb-10 text-center">
            <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 lg:hidden">
              <GraduationCap className="text-blue-600" size={32} />
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">Welcome back</h1>
            <p className="text-slate-500 font-medium text-lg">Enter your credentials to access your workspace</p>
          </div>

          <div className="bg-white rounded-[32px] p-8 lg:p-10 shadow-2xl shadow-slate-200/50 border border-slate-100 relative">
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm font-semibold flex items-center gap-3 shadow-sm"
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2.5 group">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">University Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-12 pr-4 h-14 rounded-2xl hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-base"
                    placeholder="you@university.edu"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2.5 group">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
                  <Link href="#" className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                  <input 
                    type="password" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-12 pr-4 h-14 rounded-2xl hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none font-medium text-base tracking-wide"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 px-1 pt-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/20 cursor-pointer transition-colors"
                  checked={form.rememberMe}
                  onChange={e => setForm(p => ({ ...p, rememberMe: e.target.checked }))}
                />
                <label htmlFor="remember" className="text-sm font-semibold text-slate-600 cursor-pointer select-none">Remember this session</label>
              </div>

              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-base font-bold shadow-xl shadow-blue-600/20 group relative overflow-hidden transition-all hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : (
                    <span className="flex items-center justify-center gap-2">
                      Sign In to Workspace <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-widest"><span className="bg-white px-4 text-slate-400">Or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 h-12 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
                <Search size={18} className="text-slate-500" /> Google
              </button>
              <button className="flex items-center justify-center gap-3 h-12 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-bold hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all">
                <Users size={18} className="text-slate-500" /> Github
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm font-semibold text-slate-500">
            New to UniLearn?{' '}
            <Link href="/auth/register" className="text-blue-600 font-bold hover:text-blue-800 transition-colors">
              Create an account
            </Link>
          </p>
        </motion.div>

        {/* Footer Links */}
        <div className="mt-auto pt-10 flex flex-wrap justify-center items-center gap-8 text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">
          <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-slate-600 transition-colors">Support Center</Link>
          <div className="flex items-center gap-2 ml-2 text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
             <ShieldCheck size={16} /> <span>Secured by UniAuth</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={32} /></div>}>
      <LoginContent />
    </Suspense>
  );
}
