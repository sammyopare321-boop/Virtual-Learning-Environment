'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, BookOpen, Users, User, ArrowRight, Zap, 
  Shield, BarChart2, CheckCircle2, MessageSquare, 
  LayoutDashboard, Bell, Globe, Sparkles, Star,
  ShieldCheck, Smartphone, Target, Trophy, Clock,
  ChevronDown, HelpCircle, Menu, X
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Active Students', value: '50K+' },
    { label: 'Expert Teachers', value: '1,200+' },
    { label: 'Institutions', value: '150+' },
    { label: 'Course Completion', value: '94%' },
  ];

  const features = [
    { 
      icon: LayoutDashboard, 
      label: 'Course Management', 
      desc: 'Centralized hub for syllabi, resources, and live sessions with seamless organization.',
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    { 
      icon: Zap, 
      label: 'Smart Tracking', 
      desc: 'Automated deadline reminders and real-time submission tracking for every assignment.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    { 
      icon: Sparkles, 
      label: 'AI Academic Insights', 
      desc: 'Predictive analytics to identify student needs and optimize learning outcomes early.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    },
    { 
      icon: MessageSquare, 
      label: 'Real-Time Collaboration', 
      desc: 'Instant peer-to-peer messaging and discussion boards integrated into every course.',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50'
    },
    { 
      icon: BarChart2, 
      label: 'Deep Analytics', 
      desc: 'Institutional-level reporting on attendance, grading trends, and platform engagement.',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    { 
      icon: Shield, 
      label: 'Secure Administration', 
      desc: 'Enterprise-grade JWT authentication and role-based access for campus-wide security.',
      color: 'text-rose-600',
      bg: 'bg-rose-50'
    },
  ];

  const roles = [
    {
      icon: User,
      role: 'Students',
      desc: 'Take control of your academic journey. Access lectures, track grades, and collaborate with peers in a unified workspace.',
      stats: '24/7 Access',
      preview: 'My Progress: 88%',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      border: 'hover:border-indigo-300',
      shadow: 'hover:shadow-indigo-500/10'
    },
    {
      icon: BookOpen,
      role: 'Teachers',
      desc: 'Design engaging learning experiences. Automate grading, manage large classes, and monitor performance with ease.',
      stats: 'Grading AI+',
      preview: 'Class Avg: B+',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'hover:border-emerald-300',
      shadow: 'hover:shadow-emerald-500/10'
    },
    {
      icon: Users,
      role: 'Administrators',
      desc: 'Oversee your entire institution. Manage staff, view campus-wide analytics, and maintain rigorous security standards.',
      stats: 'Enterprise Logs',
      preview: 'System: 99.9% Up',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'hover:border-amber-300',
      shadow: 'hover:shadow-amber-500/10'
    },
  ];

  const pricing = [
    {
      name: 'Standard',
      price: 'Free',
      desc: 'Perfect for individual students and teachers looking for a better workspace.',
      features: ['Unlimited Course Enrollment', 'Real-time Messaging', 'Up to 5GB Storage', 'Core Analytics'],
      cta: 'Start for Free',
      popular: false
    },
    {
      name: 'Institution',
      price: '$4.99',
      unit: '/student/mo',
      desc: 'The best option for universities and schools seeking a unified platform.',
      features: ['Full Admin Controls', 'AI Grading Assistant', 'Unlimited Storage', 'Enterprise Security', 'Premium Support'],
      cta: 'Contact Sales',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      desc: 'For large-scale academic ecosystems requiring deep integrations.',
      features: ['White-label Option', 'SSO Integration', 'API Access', 'Dedicated Account Manager', 'SLA Guarantee'],
      cta: 'Talk to Enterprise',
      popular: false
    }
  ];

  const faqs = [
    { q: "Is UniLearn secure?", a: "Yes, we use enterprise-grade JWT authentication and role-based access control to ensure all data remains private and secure." },
    { q: "Can I use it on mobile?", a: "Absolutely. UniLearn is fully responsive and optimized for mobile devices, with dedicated mobile apps coming soon." },
    { q: "How does AI grading work?", a: "Our AI helps suggest grades based on rubrics, but final decisions are always left to the instructor." },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[10%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-indigo-50/60 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'bg-white/90 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-black text-2xl tracking-tighter text-slate-900">UniLearn</span>
          </div>

          <div className="hidden lg:flex items-center gap-10">
            {['Features', 'Solutions', 'Pricing', 'Resources'].map(link => (
              <Link key={link} href={`#${link.toLowerCase()}`} className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors px-4 py-2 uppercase tracking-widest">
              Sign In
            </Link>
            <Link href="/auth/register" className="px-7 py-3 rounded-full bg-slate-900 hover:bg-blue-600 text-white text-sm font-bold shadow-xl shadow-slate-900/10 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest">
              Get Started
            </Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center bg-white border border-slate-200 rounded-xl">
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden">
            <div className="flex flex-col gap-6">
              {['Features', 'Solutions', 'Pricing', 'Resources'].map(link => (
                <Link key={link} href={`#${link.toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-black text-slate-900 tracking-tight">
                  {link}
                </Link>
              ))}
              <div className="h-px bg-slate-100 my-4" />
              <Link href="/auth/login" className="text-xl font-bold text-slate-600">Sign In</Link>
              <Link href="/auth/register" className="w-full py-4 rounded-2xl bg-blue-600 text-white text-center font-bold text-lg shadow-lg">Get Started Free</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 lg:pt-48 pb-24 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-10 shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            SaaS Platform v2.0 • 2026 Edition
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-6xl lg:text-[6.5rem] font-black tracking-tighter leading-[0.95] max-w-6xl mx-auto mb-10 text-slate-900"
          >
            Elevate your <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">academic world.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-xl lg:text-2xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-14"
          >
            UniLearn is the intelligent workspace that unifies teaching, collaboration, and campus management into one beautiful experience.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-24"
          >
            <Link href="/auth/register" className="group flex items-center justify-center gap-3 h-16 px-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xl shadow-2xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95">
              Get Started Free <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/auth/login" className="flex items-center justify-center h-16 px-12 rounded-full bg-white border border-slate-200 text-slate-700 font-extrabold text-xl hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:-translate-y-1 active:scale-95">
              Request a Demo
            </Link>
          </motion.div>

          {/* Product Mockup Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="relative max-w-7xl mx-auto"
          >
            <div className="absolute inset-x-0 -top-24 h-48 bg-gradient-to-t from-slate-50 to-transparent z-10" />
            
            <div className="relative rounded-[40px] overflow-hidden border border-slate-200 shadow-[0_40px_100px_rgba(15,23,42,0.12)] bg-white group p-4 lg:p-6">
              <div className="absolute top-0 left-0 w-full h-14 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 flex items-center px-8 gap-2 z-20">
                 <div className="w-3.5 h-3.5 rounded-full bg-rose-400" />
                 <div className="w-3.5 h-3.5 rounded-full bg-amber-400" />
                 <div className="w-3.5 h-3.5 rounded-full bg-emerald-400" />
                 <div className="ml-6 flex-1 h-7 bg-white border border-slate-100 rounded-lg flex items-center px-4">
                    <div className="w-32 h-2 bg-slate-100 rounded-full" />
                 </div>
              </div>
              
              <div className="relative mt-12 lg:mt-14 rounded-[24px] overflow-hidden">
                <Image 
                  src="/images/dashboard_mockup.png" 
                  alt="UniLearn Dashboard Preview" 
                  width={1400} 
                  height={900}
                  className="w-full h-auto group-hover:scale-[1.01] transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-40 pointer-events-none" />
              </div>
            </div>

            {/* Floating Widgets */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-16 -right-16 hidden xl:block w-80 z-30"
            >
              <div className="bg-white/90 backdrop-blur-xl p-6 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Insight</span>
                  <Sparkles size={16} className="text-amber-500" />
                </div>
                <div className="flex flex-col gap-2">
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ duration: 2, delay: 1 }} className="h-full bg-blue-600 rounded-full" />
                  </div>
                  <span className="text-xs font-bold text-slate-700 leading-none">Class Engagement: 85%</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Live Updates Streaming</span>
                </div>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -bottom-12 -left-12 hidden xl:block w-72 z-30"
            >
              <div className="bg-slate-900 p-6 rounded-[32px] shadow-2xl border border-white/10">
                <div className="flex items-center gap-3 mb-4 text-white">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none mb-1">Collaborative</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mode Active</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-3 w-full bg-white/5 rounded-full" />
                  <div className="h-3 w-4/5 bg-white/5 rounded-full" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 py-24 bg-white border-y border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-16">
            Powering institutions worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-32 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-1000">
             <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-slate-900"><Globe size={32}/> GlobalEdu</div>
             <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-slate-900"><ShieldCheck size={32}/> SecureCampus</div>
             <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-slate-900"><GraduationCap size={32}/> Ivy Institute</div>
             <div className="flex items-center gap-3 font-black text-3xl tracking-tighter text-slate-900"><BookOpen size={32}/> OpenMind</div>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 max-w-6xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="text-center p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 hover:bg-white transition-all">
                <p className="text-5xl font-black text-slate-900 mb-2 tracking-tighter leading-none">{s.value}</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">Experience the future <br /> of education.</h2>
            <p className="text-slate-500 text-xl lg:text-2xl font-medium leading-relaxed max-w-3xl mx-auto">
              UniLearn unifies teaching, research, and campus management into a single, high-performance ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={f.label}
                whileHover={{ y: -10 }}
                className="group p-10 rounded-[40px] bg-white border border-slate-200 hover:border-blue-200 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
              >
                <div className={`w-16 h-16 rounded-[20px] ${f.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon size={30} className={f.color} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{f.label}</h3>
                <p className="text-slate-500 font-medium leading-relaxed text-lg">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Section */}
      <section id="solutions" className="relative z-10 py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="flex flex-col lg:flex-row items-end justify-between gap-10 mb-24">
            <div className="max-w-3xl">
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">Tailored for you.</h2>
              <p className="text-slate-500 text-xl lg:text-2xl font-medium leading-relaxed">
                Whether you are submitting assignments, grading papers, or managing campus security, UniLearn provides a custom experience for your needs.
              </p>
            </div>
            <Link href="/auth/register" className="group flex items-center gap-3 text-lg font-black text-blue-600 mb-4 uppercase tracking-widest">
              Choose your role <ChevronDown size={20} className="-rotate-90 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.role}
                  whileHover={{ y: -12 }}
                  className={`relative overflow-hidden rounded-[40px] border border-slate-200 bg-white p-10 transition-all duration-500 hover:shadow-2xl ${r.border} ${r.shadow} group`}
                >
                  <div className={`w-20 h-20 rounded-[24px] ${r.bg} flex items-center justify-center mb-10 shadow-inner`}>
                    <Icon size={36} className={r.color} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 mb-5 tracking-tighter uppercase">{r.role}</h3>
                  <p className="text-slate-600 font-medium text-lg leading-relaxed mb-12">{r.desc}</p>
                  
                  <div className="mt-auto pt-10 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{r.stats}</span>
                      <span className="text-lg font-black text-slate-900 tracking-tight">{r.preview}</span>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300 shadow-sm border border-slate-100 group-hover:border-blue-600">
                      <ArrowRight size={22} className="text-slate-400 group-hover:text-white transition-all duration-300" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="relative z-10 py-32 bg-slate-50 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-4xl mx-auto mb-24">
            <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">Transparent SaaS Pricing.</h2>
            <p className="text-slate-500 text-xl lg:text-2xl font-medium leading-relaxed max-w-2xl mx-auto">
              Simple, scalable pricing for institutions of all sizes.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {pricing.map((p, i) => (
              <div key={p.name} className={`relative p-10 lg:p-12 rounded-[48px] bg-white border transition-all duration-500 flex flex-col ${p.popular ? 'border-blue-500 shadow-2xl shadow-blue-900/10 scale-105 z-10' : 'border-slate-200'}`}>
                {p.popular && (
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-[0.2em] shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="mb-10">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">{p.name}</h3>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-6xl font-black text-slate-900 tracking-tighter leading-none">{p.price}</span>
                    {p.unit && <span className="text-slate-400 font-bold text-lg uppercase tracking-widest">{p.unit}</span>}
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed">{p.desc}</p>
                </div>
                <div className="space-y-4 mb-12">
                  {p.features.map(f => (
                    <div key={f} className="flex items-center gap-3">
                      <CheckCircle2 size={20} className="text-blue-600 shrink-0" />
                      <span className="text-sm font-bold text-slate-700">{f}</span>
                    </div>
                  ))}
                </div>
                <button className={`mt-auto w-full py-5 rounded-2xl font-black text-lg transition-all active:scale-95 uppercase tracking-widest ${p.popular ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-700' : 'bg-slate-100 text-slate-900 hover:bg-slate-200'}`}>
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-32 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <h2 className="text-5xl lg:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.95]">Common <br />Questions.</h2>
              <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-md mb-10">
                Everything you need to know about getting started with the platform.
              </p>
              <div className="flex items-center gap-4 p-6 rounded-3xl bg-blue-50 border border-blue-100 max-w-sm">
                <HelpCircle className="text-blue-600" size={32} />
                <div>
                  <p className="text-sm font-black text-slate-900 mb-0.5">Need help?</p>
                  <Link href="#" className="text-xs font-bold text-blue-600 hover:underline">Contact our support team</Link>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              {faqs.map((f, i) => (
                <div key={i} className="p-8 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-pointer group">
                  <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight flex items-center justify-between">
                    {f.q} <ChevronDown size={20} className="text-slate-400 group-hover:text-blue-600 transition-colors" />
                  </h4>
                  <p className="text-slate-600 font-medium leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="relative rounded-[64px] bg-slate-900 p-12 lg:p-24 overflow-hidden shadow-2xl group border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-950 opacity-95" />
            <div className="absolute top-[-50%] right-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[140px] group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="inline-block px-5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-12"
              >
                Join the revolution
              </motion.div>
              <h2 className="text-5xl lg:text-8xl font-black text-white mb-10 tracking-tighter leading-[0.9]">Start your academic <br /> evolution today.</h2>
              <p className="text-slate-400 text-xl lg:text-2xl mb-16 font-medium leading-relaxed max-w-3xl mx-auto">
                No hidden setup fees. No complex contracts. Just a beautiful, high-performance workspace for your entire campus.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link href="/auth/register" className="h-18 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-14 rounded-full font-black text-xl shadow-2xl shadow-blue-900/50 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest">
                  Get Started Free
                </Link>
                <Link href="#" className="h-18 flex items-center justify-center bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 px-14 rounded-full font-black text-xl transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 pt-24 pb-12 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-16 mb-24">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                  <GraduationCap size={26} className="text-white" />
                </div>
                <span className="font-black text-3xl tracking-tighter text-slate-900">UniLearn</span>
              </div>
              <p className="text-slate-500 text-lg font-medium leading-relaxed max-w-sm mb-10">
                The intelligent academic workspace for modern institutions. Built for scale, security, and student success.
              </p>
              <div className="flex gap-4">
                {[Globe, Users, Bell, MessageSquare].map((Icon, i) => (
                  <Link key={i} href="#" className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 hover:border-blue-200 transition-all">
                    <Icon size={20} />
                  </Link>
                ))}
              </div>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Integrations', 'Updates', 'Security'] },
              { title: 'Solutions', links: ['Universities', 'K-12', 'Corporate', 'Training'] },
              { title: 'Resources', links: ['Documentation', 'API Reference', 'Support', 'Guides'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Privacy', 'Legal'] },
            ].map(group => (
              <div key={group.title}>
                <h4 className="font-black text-xs mb-8 uppercase tracking-[0.2em] text-slate-900">{group.title}</h4>
                <ul className="flex flex-col gap-5">
                  {group.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-widest">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full border border-emerald-100">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Status: Fully Operational</span>
            </div>
            <p>© 2026 UniLearn Inc. All rights reserved.</p>
            <div className="flex gap-10">
              <Link href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
