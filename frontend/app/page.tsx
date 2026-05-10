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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[10%] w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-indigo-50/60 rounded-full blur-[120px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-slate-200 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
              <GraduationCap size={22} className="text-white" />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900">UniLearn</span>
          </div>

          <div className="hidden lg:flex items-center gap-8">
            {['Features', 'Solutions', 'Pricing', 'About', 'Contact'].map(link => (
              <Link key={link} href="#" className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
                {link}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors">
              Sign In
            </Link>
            <Link href="/auth/register" className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-lg shadow-slate-900/10 transition-all hover:-translate-y-0.5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-32 lg:pt-48 pb-20 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-blue-600 mb-8 shadow-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Next-gen Learning Platform v2.0
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-[5rem] font-extrabold tracking-tight leading-[1.05] max-w-5xl mx-auto mb-8 text-slate-900"
          >
            One intelligent platform for <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">modern learning.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg lg:text-xl text-slate-500 font-medium max-w-3xl mx-auto leading-relaxed mb-12"
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
            <Link href="/auth/register" className="flex items-center justify-center gap-2 h-14 px-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1">
              Start Building Free <ArrowRight size={20} />
            </Link>
            <Link href="/auth/login" className="flex items-center justify-center h-14 px-10 rounded-full bg-white border border-slate-200 text-slate-700 font-bold text-lg hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all hover:-translate-y-1">
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
            <div className="relative rounded-[32px] overflow-hidden border border-slate-200 shadow-[0_20px_50px_rgba(15,23,42,0.1)] bg-white group">
              <div className="absolute top-0 left-0 w-full h-12 bg-slate-50 border-b border-slate-200 flex items-center px-6 gap-2">
                 <div className="w-3 h-3 rounded-full bg-rose-400" />
                 <div className="w-3 h-3 rounded-full bg-amber-400" />
                 <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <Image 
                src="/images/dashboard_mockup.png" 
                alt="UniLearn Dashboard Preview" 
                width={1200} 
                height={800}
                className="w-full h-auto mt-12 group-hover:scale-[1.02] transition-transform duration-1000"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80 pointer-events-none" />
            </div>

            {/* Floating Widgets */}
            <motion.div 
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-10 -right-10 hidden xl:block w-72 z-20"
            >
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100">
                <Image src="/images/ui_widgets.png" alt="UI Widget" width={280} height={180} className="rounded-xl mb-4" />
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Live Analytics Active</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="relative z-10 py-20 border-y border-slate-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-12">
            Trusted by world-class academic institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 text-slate-400 grayscale hover:grayscale-0 transition-all duration-700">
             <div className="flex items-center gap-2 font-extrabold text-2xl hover:text-slate-800 transition-colors"><Globe size={28}/> GlobalEdu</div>
             <div className="flex items-center gap-2 font-extrabold text-2xl hover:text-slate-800 transition-colors"><Shield size={28}/> SecureCampus</div>
             <div className="flex items-center gap-2 font-extrabold text-2xl hover:text-slate-800 transition-colors"><GraduationCap size={28}/> Ivy Institute</div>
             <div className="flex items-center gap-2 font-extrabold text-2xl hover:text-slate-800 transition-colors"><BookOpen size={28}/> OpenMind</div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 max-w-5xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="text-center p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition-shadow">
                <p className="text-4xl font-extrabold text-slate-900 mb-2">{s.value}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Built for the future of education.</h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">
              Every tool you need to manage courses, empower teachers, and help students succeed — all in one seamless experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div 
                key={f.label}
                whileHover={{ y: -8 }}
                className="group p-8 rounded-[32px] bg-white border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon size={28} className={f.color} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{f.label}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Role-Based Section */}
      <section className="relative z-10 py-32 bg-white border-y border-slate-200">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Tailored for every role.</h2>
            <p className="text-slate-500 text-xl font-medium leading-relaxed">
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
                  className={`relative overflow-hidden rounded-[32px] border border-slate-200 bg-white p-8 lg:p-10 transition-all duration-500 hover:shadow-2xl ${r.border} ${r.shadow} group`}
                >
                  <div className={`w-16 h-16 rounded-2xl ${r.bg} flex items-center justify-center mb-8`}>
                    <Icon size={32} className={r.color} />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">{r.role}</h3>
                  <p className="text-slate-500 font-medium leading-relaxed mb-10">{r.desc}</p>
                  
                  <div className="mt-auto pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{r.stats}</span>
                      <span className="text-sm font-bold text-slate-900">{r.preview}</span>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                      <ArrowRight size={18} className="text-slate-400 group-hover:text-white transition-colors duration-300" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative z-10 py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="bg-white p-12 lg:p-24 rounded-[40px] border border-slate-200 shadow-xl shadow-slate-200/50 text-center relative overflow-hidden">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-50 rounded-full blur-[100px] pointer-events-none" />
             
             <div className="relative z-10">
               <div className="flex justify-center gap-1.5 mb-10">
                 {[1,2,3,4,5].map(i => <Sparkles key={i} size={24} className="text-amber-400 fill-amber-400" />)}
               </div>
               
               <blockquote className="text-3xl lg:text-5xl font-extrabold tracking-tight leading-tight text-slate-900 max-w-4xl mx-auto mb-12">
                 "UniLearn transformed our campus operations. The integration between assignments, live sessions, and admin logs is seamless and truly enterprise-grade."
               </blockquote>
               
               <div className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full bg-indigo-100 mb-4 flex items-center justify-center text-indigo-600 text-xl font-bold border border-indigo-200">DR</div>
                 <p className="font-extrabold text-xl text-slate-900">Dr. Elena Rodriguez</p>
                 <p className="text-sm text-slate-500 font-bold uppercase tracking-widest mt-1">Director of Academic Affairs, Ivy Institute</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 py-32 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="relative rounded-[48px] bg-slate-900 p-12 lg:p-24 overflow-hidden shadow-2xl group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-blue-950 opacity-90" />
            <div className="absolute top-[-50%] right-[-10%] w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000" />
            
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <h2 className="text-4xl lg:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]">Ready to evolve your campus?</h2>
              <p className="text-slate-300 text-xl lg:text-2xl mb-12 font-medium">
                Join 150+ institutions and 50K+ students already using UniLearn to modernize their academic journey.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                <Link href="/auth/register" className="h-16 flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-12 rounded-full font-bold text-lg shadow-xl shadow-blue-900/50 transition-all hover:-translate-y-1">
                  Get Started Free
                </Link>
                <Link href="#" className="h-16 flex items-center justify-center bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-12 rounded-full font-bold text-lg transition-all hover:-translate-y-1">
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 pt-20 pb-10 bg-white">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-12 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md shadow-blue-600/20">
                  <GraduationCap size={22} className="text-white" />
                </div>
                <span className="font-extrabold text-2xl tracking-tight text-slate-900">UniLearn</span>
              </div>
              <p className="text-slate-500 text-base font-medium leading-relaxed max-w-sm mb-8">
                The intelligent academic workspace for modern institutions. Built for scale, security, and student success.
              </p>
              <div className="flex gap-4">
                {[Globe, Users, Bell].map((Icon, i) => (
                  <Link key={i} href="#" className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all">
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
                <h4 className="font-extrabold text-sm mb-6 uppercase tracking-widest text-slate-900">{group.title}</h4>
                <ul className="flex flex-col gap-4">
                  {group.links.map(link => (
                    <li key={link}>
                      <Link href="#" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 font-bold">
            <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-100">
              <CheckCircle2 size={16} className="text-emerald-500" />
              <span>System Status: Operational</span>
            </div>
            <p>© 2026 UniLearn Inc. All rights reserved.</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-blue-600">Privacy Policy</Link>
              <Link href="#" className="hover:text-blue-600">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
