'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, BookOpen, Users, User, ArrowRight, Zap, 
  Shield, BarChart2, CheckCircle2, MessageSquare, 
  LayoutDashboard, Bell, Globe, Sparkles 
} from 'lucide-react';

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

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
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10'
    },
    { 
      icon: Zap, 
      label: 'Smart Tracking', 
      desc: 'Automated deadline reminders and real-time submission tracking for every assignment.',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10'
    },
    { 
      icon: Sparkles, 
      label: 'AI Academic Insights', 
      desc: 'Predictive analytics to identify student needs and optimize learning outcomes early.',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10'
    },
    { 
      icon: MessageSquare, 
      label: 'Real-Time Collaboration', 
      desc: 'Instant peer-to-peer messaging and discussion boards integrated into every course.',
      color: 'text-blue-400',
      bg: 'bg-blue-500/10'
    },
    { 
      icon: BarChart2, 
      label: 'Deep Analytics', 
      desc: 'Institutional-level reporting on attendance, grading trends, and platform engagement.',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10'
    },
    { 
      icon: Shield, 
      label: 'Secure Administration', 
      desc: 'Enterprise-grade JWT authentication and role-based access for campus-wide security.',
      color: 'text-rose-400',
      bg: 'bg-rose-500/10'
    },
  ];

  const roles = [
    {
      icon: User,
      role: 'Students',
      desc: 'Take control of your academic journey. Access lectures, track grades, and collaborate with peers in a unified workspace.',
      stats: '24/7 Access',
      preview: 'My Progress: 88%',
      color: 'text-indigo-400',
      border: 'hover:border-indigo-500/40',
      glow: 'glow-primary'
    },
    {
      icon: BookOpen,
      role: 'Teachers',
      desc: 'Design engaging learning experiences. Automate grading, manage large classes, and monitor performance with ease.',
      stats: 'Grading AI+',
      preview: 'Class Avg: B+',
      color: 'text-emerald-400',
      border: 'hover:border-emerald-500/40',
      glow: 'glow-emerald'
    },
    {
      icon: Users,
      role: 'Administrators',
      desc: 'Oversee your entire institution. Manage staff, view campus-wide analytics, and maintain rigorous security standards.',
      stats: 'Enterprise Logs',
      preview: 'System: 99.9% Up',
      color: 'text-amber-400',
      border: 'hover:border-amber-500/40',
      glow: 'glow-amber'
    },
  ];

  return (
    <div className="min-h-screen bg-surface-900 text-white font-sans">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-primary-900/40 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-5%] right-[10%] w-[600px] h-[600px] bg-indigo-900/30 rounded-full blur-[100px] opacity-40" />
      </div>

      {/* Navbar */}
      <nav className={`nav-sticky ${scrolled ? 'nav-scrolled' : 'bg-transparent'} border-b border-white/5`}>
        <div className="section-container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center glow-primary">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">UniLearn</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Features', 'Solutions', 'Pricing', 'About', 'Contact'].map(link => (
              <Link key={link} href="#" className="text-sm font-medium text-surface-400 hover:text-white transition-colors">
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:block text-sm font-semibold text-surface-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm px-6">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 lg:pt-32 pb-16 overflow-hidden">
        <div className="section-container text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/10 text-xs font-semibold text-primary-400 mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            Next-gen Learning Platform v2.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-8xl font-bold tracking-tight leading-[1.05] max-w-5xl mx-auto mb-8 gradient-text-premium"
          >
            One intelligent platform for <span className="gradient-text-primary">modern learning.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-surface-400 max-w-3xl mx-auto leading-relaxed mb-12"
          >
            UniLearn unifies teaching, collaboration, and administration into a single workspace. 
            Empowering institutions with real-time analytics, automated grading, and secure productivity.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20"
          >
            <Link href="/auth/register" className="btn btn-primary btn-lg px-10 shadow-lg shadow-primary-600/20">
              Get Started Free <ArrowRight size={20} />
            </Link>
            <Link href="/auth/login" className="btn btn-secondary btn-lg px-10 bg-white/5 border border-white/10 text-white hover:bg-white/10">
              Request a Demo
            </Link>
          </motion.div>

          {/* Product Mockup Showcase */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-6xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-surface-900">
              <Image 
                src="/images/dashboard_mockup.png" 
                alt="UniLearn Dashboard Preview" 
                width={1200} 
                height={800}
                className="w-full h-auto opacity-90"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-900 via-transparent to-transparent opacity-60" />
            </div>

            {/* Floating Widgets */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 hidden xl:block w-72"
            >
              <div className="glass p-4 rounded-2xl shadow-2xl border border-white/10">
                <Image src="/images/ui_widgets.png" alt="UI Widget" width={280} height={180} className="rounded-lg mb-3" />
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] uppercase font-bold text-surface-500 tracking-wider">Live Analytics</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 py-16 border-y border-white/5 bg-white/[0.01]">
        <div className="section-container">
          <p className="text-center text-xs font-bold text-surface-600 uppercase tracking-widest mb-10">
            Trusted by world-class academic institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-bold text-xl"><Globe size={24}/> Global Edu</div>
             <div className="flex items-center gap-2 font-bold text-xl"><Shield size={24}/> Secure Campus</div>
             <div className="flex items-center gap-2 font-bold text-xl"><GraduationCap size={24}/> Ivy Institute</div>
             <div className="flex items-center gap-2 font-bold text-xl"><BookOpen size={24}/> Open Mind</div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold mb-1">{s.value}</p>
                <p className="text-xs font-semibold text-surface-500 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Built for the future of education.</h2>
            <p className="text-surface-400 text-lg leading-relaxed">
              Every tool you need to manage courses, empower teachers, and help students succeed — all in one seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={f.label}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-2xl glass border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <f.icon size={24} className={f.color} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.label}</h3>
                <p className="text-surface-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Section */}
      <section className="relative z-10 py-32 bg-white/[0.01] border-y border-white/5">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">Tailored for every role.</h2>
            <p className="text-surface-400 text-lg leading-relaxed">
              Whether you are submitting assignments, grading papers, or managing campus security, UniLearn provides a custom-built interface for your needs.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <motion.div
                  key={r.role}
                  whileHover={{ y: -10 }}
                  className={`relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] backdrop-blur-xl p-8 lg:p-10 transition-all duration-500 ${r.border} ${r.glow}`}
                >
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-8 ${r.color}`}>
                    <Icon size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{r.role}</h3>
                  <p className="text-surface-400 leading-relaxed mb-8">{r.desc}</p>
                  
                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-surface-600 uppercase tracking-widest">{r.stats}</span>
                      <span className="text-sm font-semibold text-white">{r.preview}</span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                      <ArrowRight size={16} className="text-surface-400 group-hover:text-white" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-32">
        <div className="section-container">
          <div className="glass p-12 lg:p-20 rounded-[40px] border border-white/10 text-center relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary-600/10 rounded-full blur-[100px] -z-10" />
             
             <div className="flex justify-center gap-1 mb-8">
               {[1,2,3,4,5].map(i => <Sparkles key={i} size={20} className="text-amber-400 fill-amber-400" />)}
             </div>
             
             <blockquote className="text-2xl lg:text-4xl font-medium leading-snug text-white max-w-4xl mx-auto mb-10">
               "UniLearn transformed our campus operations. The integration between assignments, live sessions, and admin logs is seamless and truly enterprise-grade."
             </blockquote>
             
             <div className="flex flex-col items-center">
               <div className="w-16 h-16 rounded-full bg-indigo-500 mb-4 flex items-center justify-center text-xl font-bold">DR</div>
               <p className="font-bold text-lg">Dr. Elena Rodriguez</p>
               <p className="text-sm text-surface-500 uppercase tracking-widest font-bold">Director of Academic Affairs, Ivy Institute</p>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-32">
        <div className="section-container">
          <div className="relative rounded-[40px] bg-primary-600 p-12 lg:p-24 overflow-hidden glow-primary group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500 to-indigo-700 opacity-90" />
            <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-6xl font-bold text-white mb-8 tracking-tight">Ready to evolve your campus?</h2>
              <p className="text-primary-100 text-lg lg:text-xl mb-12 opacity-90">
                Join 150+ institutions and 50K+ students already using UniLearn to modernize their academic journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/register" className="btn btn-lg bg-white text-primary-600 hover:bg-surface-50 px-12 font-bold shadow-xl">
                  Get Started Free
                </Link>
                <Link href="#" className="btn btn-lg bg-transparent border border-white/30 text-white hover:bg-white/10 px-10">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 pt-20 pb-10">
        <div className="section-container">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
                  <GraduationCap size={20} className="text-white" />
                </div>
                <span className="font-bold text-xl tracking-tight">UniLearn</span>
              </div>
              <p className="text-surface-500 text-sm leading-relaxed max-w-xs mb-8">
                The intelligent academic workspace for modern institutions. Built for scale, security, and student success.
              </p>
              <div className="flex gap-4">
                {[Globe, Users, Bell].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-surface-500 hover:text-white hover:bg-white/10 transition-all">
                    <Icon size={18} />
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
                <h4 className="font-bold text-sm mb-6 uppercase tracking-widest text-surface-400">{group.title}</h4>
                <ul className="flex flex-col gap-4">
                  {group.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-sm text-surface-500 hover:text-white transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-surface-600 font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>System Status: Operational</span>
            </div>
            <p>© 2026 UniLearn Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-white">Privacy Policy</Link>
              <Link href="#" className="hover:text-white">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
