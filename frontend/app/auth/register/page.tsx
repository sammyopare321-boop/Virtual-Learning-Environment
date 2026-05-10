'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '@/utils/api/authApi';
import { useAuth } from '@/context/AuthContext';
import { 
  GraduationCap, User, BookOpen, Building2, Mail, Lock, 
  Check, Loader2, ArrowRight, ShieldCheck, Zap, 
  BarChart3, Users, Sparkles
} from 'lucide-react';

const ROLES = [
  { 
    value: 'student', 
    label: 'Student', 
    icon: User, 
    desc: 'Track assignments, collaborate with classmates, and monitor academic progress.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
    border: 'hover:border-indigo-500/40'
  },
  { 
    value: 'teacher', 
    label: 'Teacher', 
    icon: BookOpen, 
    desc: 'Create courses, manage grading, and monitor student performance with ease.',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    border: 'hover:border-emerald-500/40'
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student', department: '' });
  const [loading, setLoading] = useState(false);
  const [passChecks, setPassChecks] = useState({
    length: false,
    upper: false,
    number: false,
  });

  useEffect(() => {
    setPassChecks({
      length: form.password.length >= 8,
      upper: /[A-Z]/.test(form.password),
      number: /[0-9]/.test(form.password),
    });
  }, [form.password]);

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passChecks.length || !passChecks.upper || !passChecks.number) {
      toast.error('Please meet all password requirements');
      return;
    }
    setLoading(true);
    try {
      // Step 1: Create the account
      await authApi.register(form);
      toast.success('Account created! Welcome to UniLearn.');
      
      // Step 2: Login immediately (this sets relay cookie + Bearer token)
      const loggedInUser = await login(form.email, form.password);
      
      // Step 3: Redirect to role-specific dashboard
      router.push(`/dashboard/${loggedInUser.role}`);
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const passStrength = Object.values(passChecks).filter(Boolean).length;

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Visuals & Value Prop */}
      <section className="hidden lg:flex lg:w-1/2 relative bg-surface-950 items-center justify-center p-12 overflow-hidden border-r border-white/5">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-primary-900/30 rounded-full blur-[140px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-indigo-900/20 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-10">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center glow-primary">
                <GraduationCap size={22} className="text-white" />
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">UniLearn</span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight tracking-tight">
              One platform for <span className="gradient-text-primary">academic excellence.</span>
            </h2>
            <p className="text-lg text-surface-400 mb-12 leading-relaxed">
              Join 50,000+ students and educators using our intelligent workspace to manage courses, 
              automate grading, and collaborate in real-time.
            </p>

            {/* Floating Visual Cards */}
            <div className="relative mb-20 group">
              <div className="relative rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-surface-900 scale-105 group-hover:scale-[1.07] transition-transform duration-700">
                <Image 
                  src="/images/registration_visual.png" 
                  alt="UniLearn Platform" 
                  width={800} 
                  height={600}
                  className="opacity-90"
                />
              </div>
              
              {/* Stats Badge */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 glass p-5 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                    <BarChart3 className="text-emerald-400" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-white">99.9%</p>
                    <p className="text-[10px] uppercase font-bold text-surface-500 tracking-widest">Platform Uptime</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="flex items-center gap-10 opacity-60">
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <ShieldCheck size={18} className="text-primary-400" />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Sparkles size={18} className="text-amber-400" />
                <span>AI Powered Insights</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-surface-400">
                <Zap size={18} className="text-emerald-400" />
                <span>Real-time Sync</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Right Side: Signup Form */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 lg:p-20 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] -z-10" />
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-[540px]"
        >
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">Create your account</h1>
            <p className="text-surface-400 text-lg">
              Access courses, collaboration tools, and analytics from one workspace.
            </p>
          </div>

          <div className="glass-dark rounded-[32px] p-8 lg:p-10 shadow-2xl border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <GraduationCap size={120} />
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
              {/* Role Selection */}
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-surface-500 uppercase tracking-[0.2em] ml-1">Choose your role</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {ROLES.map(r => {
                    const isSelected = form.role === r.value;
                    return (
                      <button 
                        type="button" 
                        key={r.value}
                        onClick={() => setForm(p => ({ ...p, role: r.value }))}
                        className={`group relative p-6 rounded-2xl border transition-all duration-500 text-left ${
                          isSelected 
                            ? 'border-primary-500 bg-primary-500/10 glow-primary' 
                            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10'
                        }`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-500 ${
                          isSelected ? 'bg-primary-600 text-white shadow-lg' : 'bg-white/5 text-surface-500'
                        }`}>
                          <r.icon size={24} />
                        </div>
                        <h4 className={`font-bold mb-1 transition-colors ${isSelected ? 'text-white' : 'text-surface-300'}`}>
                          {r.label}
                        </h4>
                        <p className="text-[11px] text-surface-500 leading-relaxed font-medium">
                          {r.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2 group">
                    <label className="text-xs font-semibold text-surface-400 ml-1">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-600 group-focus-within:text-primary-500 transition-colors" size={18} />
                      <input 
                        type="text" 
                        required
                        className="input bg-white/[0.03] border-white/10 text-white pl-12 h-12 hover:bg-white/[0.05] focus:bg-white/[0.05] transition-all"
                        placeholder="e.g. John Doe"
                        value={form.name}
                        onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 group">
                    <label className="text-xs font-semibold text-surface-400 ml-1">Department</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-600 group-focus-within:text-primary-500 transition-colors" size={18} />
                      <input 
                        type="text" 
                        required
                        className="input bg-white/[0.03] border-white/10 text-white pl-12 h-12 hover:bg-white/[0.05] focus:bg-white/[0.05] transition-all"
                        placeholder="e.g. Science"
                        value={form.department}
                        onChange={e => setForm(p => ({ ...p, department: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 group">
                  <label className="text-xs font-semibold text-surface-400 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-600 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input 
                      type="email" 
                      required
                      className="input bg-white/[0.03] border-white/10 text-white pl-12 h-12 hover:bg-white/[0.05] focus:bg-white/[0.05] transition-all"
                      placeholder="name@university.edu"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-3 group">
                  <label className="text-xs font-semibold text-surface-400 ml-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-600 group-focus-within:text-primary-500 transition-colors" size={18} />
                    <input 
                      type="password" 
                      required
                      className="input bg-white/[0.03] border-white/10 text-white pl-12 h-12 hover:bg-white/[0.05] focus:bg-white/[0.05] transition-all"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    />
                  </div>
                  
                  {/* Password Strength Indicator */}
                  <div className="space-y-3 pt-1 px-1">
                    <div className="flex gap-2">
                      {[1, 2, 3].map(i => (
                        <div 
                          key={i} 
                          className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                            passStrength >= i 
                              ? passStrength === 3 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]' : 'bg-amber-500' 
                              : 'bg-white/10'
                          }`} 
                        />
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                      {[
                        { key: 'length', label: '8+ Characters' },
                        { key: 'upper', label: 'Uppercase Letter' },
                        { key: 'number', label: 'Includes Number' },
                      ].map(check => (
                        <div key={check.key} className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                            passChecks[check.key as keyof typeof passChecks] 
                              ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-500' 
                              : 'border-white/10 text-white/10'
                          }`}>
                            <Check size={10} strokeWidth={4} />
                          </div>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${
                            passChecks[check.key as keyof typeof passChecks] ? 'text-emerald-400' : 'text-surface-600'
                          }`}>
                            {check.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn btn-primary w-full h-14 text-base font-bold shadow-2xl shadow-primary-600/30 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                {loading ? <Loader2 className="animate-spin" size={22} /> : (
                  <span className="flex items-center gap-2">
                    Create Account <ArrowRight size={20} />
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm font-medium text-surface-500">
                Have an account?{' '}
                <Link href="/auth/login" className="text-white font-bold hover:text-primary-400 transition-colors">
                  Sign in
                </Link>
              </p>
              <div className="flex items-center gap-2 text-[10px] font-bold text-surface-600 uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span>Encrypted Auth</span>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-8 opacity-40 grayscale pointer-events-none">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-surface-500">Trusted by 150+ Institutions</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
