'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  GraduationCap, BookOpen, Users, Zap, BarChart3, MessageSquare,
  ArrowRight, CheckCircle2, Sparkles, Play, Target, Activity
} from 'lucide-react';

export default function LandingPage() {
  const features = [
    {
      icon: BookOpen,
      title: 'Smart Learning',
      description: 'Organized courses with interactive content, assignments, and real-time feedback.',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Connect with classmates, discuss ideas, and learn together in real-time.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track progress with detailed insights and personalized learning recommendations.',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
    },
    {
      icon: Sparkles,
      title: 'AI Assistant',
      description: 'Get instant help with homework, concept explanations, and study guidance.',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
  ];

  const roles = [
    {
      title: 'For Students',
      description: 'Master your courses with interactive learning tools and AI-powered tutoring.',
      features: ['Track progress', 'Submit assignments', 'Join discussions', 'Get AI help'],
      icon: Play,
      href: '/auth/register',
    },
    {
      title: 'For Teachers',
      description: 'Create engaging courses and monitor student progress effortlessly.',
      features: ['Create courses', 'Grade assignments', 'Live sessions', 'Analytics'],
      icon: Target,
      href: '/auth/register',
    },
    {
      title: 'For Admins',
      description: 'Manage the entire platform with powerful tools and system insights.',
      features: ['User management', 'Course oversight', 'System monitoring', 'Reports'],
      icon: Activity,
      href: '/auth/register',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary-600 flex items-center justify-center">
              <GraduationCap size={24} className="text-white" />
            </div>
            <span className="text-xl font-black text-white">UniLearn</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm font-semibold text-slate-300 hover:text-white transition">
              Sign In
            </Link>
            <Link href="/auth/register" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 border border-primary-400/30">
            <Sparkles size={14} className="text-primary-300" />
            <span className="text-xs font-semibold text-primary-300 uppercase tracking-wider">Welcome to the future of learning</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            Learn, Teach & Manage
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">
              All in One Place
            </span>
          </h1>

          <p className="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            UniLearn is a modern learning platform designed for students, teachers, and administrators. Create courses, collaborate in real-time, and track progress with powerful analytics.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/auth/register" className="btn btn-primary btn-lg gap-2">
              <Play size={16} fill="currentColor" />
              Start Learning Free
            </Link>
            <Link href="/auth/login" className="btn btn-secondary btn-lg gap-2">
              Sign In <ArrowRight size={16} />
            </Link>
          </div>

          <p className="text-sm text-slate-400">No credit card required. Free forever for basic features.</p>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Powerful Features</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">Everything you need for modern education</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group p-8 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-primary-500/10 transition-all backdrop-blur-sm"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon size={24} className={feature.color} />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-300">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Role-Based Cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Built for Everyone</h2>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">Tailored experiences for students, teachers, and administrators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, idx) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative overflow-hidden rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 hover:bg-slate-800/80 hover:shadow-xl hover:shadow-primary-500/10 transition-all backdrop-blur-sm"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-slate-700/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-8 space-y-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center group-hover:bg-primary-500/20 transition-colors">
                    <Icon size={24} className="text-slate-300 group-hover:text-primary-400 transition-colors" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">{role.title}</h3>
                    <p className="text-slate-300">{role.description}</p>
                  </div>

                  <ul className="space-y-2">
                    {role.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <Link href={role.href} className="inline-flex items-center gap-2 text-primary-400 font-semibold hover:gap-3 transition-all hover:text-primary-300">
                    Get Started <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {[
            { value: '10K+', label: 'Active Users' },
            { value: '500+', label: 'Courses' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
            >
              <p className="text-4xl md:text-5xl font-black bg-gradient-to-r from-primary-400 to-blue-400 bg-clip-text text-transparent">{stat.value}</p>
              <p className="text-slate-300 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-6 py-20">
        <div className="rounded-3xl bg-gradient-to-r from-primary-600 to-blue-600 p-12 text-center text-white space-y-6 border border-primary-500/30 shadow-2xl shadow-primary-500/20">
          <h2 className="text-3xl md:text-4xl font-black">Ready to Transform Learning?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Join thousands of students and teachers already using UniLearn to create better learning experiences.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/auth/register" className="btn bg-white text-primary-600 hover:bg-slate-50 font-semibold gap-2">
              Start Free <ArrowRight size={16} />
            </Link>
            <Link href="/auth/login" className="btn border-2 border-white text-white hover:bg-white/10 font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-700/50 backdrop-blur-sm bg-slate-900/50 mt-20">
        <div className="max-w-6xl mx-auto px-6 py-12 text-center text-slate-400">
          <p>&copy; 2025 UniLearn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
