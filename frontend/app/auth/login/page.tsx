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
  CheckCircle2, Globe, Terminal
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
      
      {/* Left Panel: High-Impact Visual Story */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-white p-12 lg:p-20 flex-col justify-between items-center overflow-hidden border-r border-slate-200">
        
        {/* Animated Background Ambience */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.5, 0.3] 
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-50 rounded-full blur-[140px]" 
          />
          <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-indigo-50 rounded-full blur-[120px]" />
          <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-purple-50/50 rounded-full blur-[100px]" />
        </div>

        {/* Branding */}
        <div className="relative z-10 w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/30">
              <GraduationCap className="text-white" size={26} />
            </div>
            <span className="text-slate-900 font-black text-3xl tracking-tighter uppercase">UniLearn</span>
          </Link>
          <div className="flex gap-6 opacity-30">
            <Globe size={22} className="text-slate-400" />
            <Terminal size={22} className="text-slate-400" />
            <Users size={22} className="text-slate-400" />
          </div>
        </div>

        {/* Hero Copy */}
        <div className="relative z-10 max-w-xl text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-8"
            >
              Enterprise Academic Suite
            </motion.div>
            
            <h2 className="text-6xl lg:text-[5rem] font-black text-slate-900 mb-8 leading-[0.95] tracking-tighter">
              Unlock your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">potential.</span>
            </h2>
            <p className="text-slate-500 text-xl leading-relaxed mb-16 font-medium max-w-lg mx-auto">
              Access the world's most intelligent workspace for students, educators, and institutions.
            </p>

            {/* Product Preview Card */}
            <div className="relative mb-8 group">
              <div className="relative rounded-[48px] border border-slate-200 overflow-hidden shadow-[0_40px_100px_rgba(15,23,42,0.12)] bg-white p-4">
                <div className="rounded-[32px] overflow-hidden bg-slate-50 relative">
                  <Image 
                    src="/images/login_visual.png" 
                    alt="UniLearn Dashboard Preview" 
                    width={900} 
                    height={700}
                    className="opacity-95 group-hover:scale-105 transition-transform duration-1000"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
                </div>
              </div>
              
              {/* Floating Testimonial */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 1 }}
                className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-2xl p-7 rounded-[32px] border border-slate-100 shadow-2xl max-w-[320px] text-left group-hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="flex gap-1.5 mb-4">
                  {[1,2,3,4,5].map(i => <Star key={i} size={16} className="text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-base font-bold text-slate-800 mb-6 leading-relaxed italic">
                  "UniLearn isn't just a tool; it's the core of our digital campus experience."
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-blue-600/30">ER</div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Dr. Elena Rodriguez</p>
                    <p className="text-xs font-bold text-slate-900 leading-none">Director of Academic Affairs</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Footer Proof */}
        <div className="relative z-10 w-full flex justify-between items-center px-6 mt-12">
          <div className="flex flex-col gap-1.5">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Institutional Standard</span>
            <span className="text-base font-black text-slate-900 tracking-tight">150+ Global Universities</span>
          </div>
          <div className="flex items-center gap-8 opacity-40">
            <CheckCircle2 size={28} className="text-emerald-500" />
            <ShieldCheck size={28} className="text-blue-600" />
            <Sparkles size={28} className="text-amber-500" />
          </div>
        </div>
      </section>

      {/* Right Panel: Clean, High-Conversion Form */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 lg:p-24 relative bg-slate-50/50">
        
        {/* Mobile Header (Visible only on mobile) */}
        <div className="lg:hidden w-full flex items-center justify-center mb-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <GraduationCap className="text-white" size={22} />
            </div>
            <span className="text-slate-900 font-black text-2xl tracking-tighter uppercase">UniLearn</span>
          </Link>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-[480px] relative z-10"
        >
          <div className="mb-12 text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4 tracking-tighter leading-none">Welcome back.</h1>
            <p className="text-slate-500 font-medium text-lg leading-relaxed">
              Enter your credentials to access your secure <br className="hidden sm:block" /> academic workspace.
            </p>
          </div>

          <div className="bg-white rounded-[48px] p-10 lg:p-14 shadow-[0_40px_80px_rgba(15,23,42,0.08)] border border-slate-100 relative group transition-all duration-500">
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 p-5 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 text-sm font-bold flex items-center gap-4 shadow-sm"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3 group/field">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">University Email</label>
                <div className="relative">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-blue-600 transition-colors" size={22} />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-14 pr-6 h-16 rounded-[24px] hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none font-bold text-lg tracking-tight"
                    placeholder="you@university.edu"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-3 group/field">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                  <Link href="#" className="text-[10px] font-black text-blue-600 hover:text-blue-800 transition-colors uppercase tracking-widest">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/field:text-blue-600 transition-colors" size={22} />
                  <input 
                    type="password" 
                    required
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-14 pr-6 h-16 rounded-[24px] hover:bg-white focus:bg-white focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none font-bold text-lg tracking-tight"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 px-2 pt-2">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    id="remember" 
                    className="peer w-6 h-6 rounded-lg border-2 border-slate-200 bg-slate-50 checked:bg-blue-600 checked:border-blue-600 transition-all cursor-pointer outline-none appearance-none"
                    checked={form.rememberMe}
                    onChange={e => setForm(p => ({ ...p, rememberMe: e.target.checked }))}
                  />
                  <CheckCircle2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <label htmlFor="remember" className="text-sm font-bold text-slate-600 cursor-pointer select-none">Remember this session</label>
              </div>

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-18 rounded-[24px] bg-blue-600 hover:bg-blue-700 text-white text-xl font-black shadow-2xl shadow-blue-600/30 group relative overflow-hidden transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-70 disabled:hover:translate-y-0 uppercase tracking-widest"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  {loading ? <Loader2 className="animate-spin mx-auto" size={28} /> : (
                    <span className="flex items-center justify-center gap-3">
                      Sign In <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            <div className="relative my-12">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
              <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.3em]"><span className="bg-white px-6 text-slate-300">Social Authentication</span></div>
            </div>

            <div className="grid grid-cols-2 gap-5">
              <button aria-label="Login with Google" title="Google" className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-black hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest">
                <Search size={20} className="text-slate-400" /> Google
              </button>
              <button aria-label="Login with Github" title="Github" className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-white border border-slate-200 text-slate-700 text-sm font-black hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:-translate-y-0.5 active:scale-95 uppercase tracking-widest">
                <Globe size={20} className="text-slate-400" /> Github
              </button>
            </div>
          </div>

          <p className="mt-12 text-center text-base font-bold text-slate-500">
            New to the ecosystem?{' '}
            <Link href="/auth/register" className="text-blue-600 font-black hover:text-blue-800 transition-colors uppercase tracking-widest border-b-2 border-blue-100 hover:border-blue-600 pb-0.5">
              Create an account
            </Link>
          </p>
        </motion.div>

        {/* Auth Footer */}
        <div className="mt-auto pt-12 flex flex-wrap justify-center items-center gap-8 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] relative z-10">
          <Link href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          <div className="flex items-center gap-2 ml-4 text-emerald-600 bg-emerald-50/50 px-4 py-2 rounded-full border border-emerald-100/50 backdrop-blur-sm">
             <ShieldCheck size={16} /> <span>Secured by UniAuth Enterprise</span>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6 shadow-xl shadow-blue-600/20" />
      <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px]">Initializing Auth Engine...</p>
    </div>}>
      <LoginContent />
    </Suspense>
  );
}
