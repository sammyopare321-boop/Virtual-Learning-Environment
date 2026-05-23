'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useStudentDashboard } from '@/hooks/queries/useStudentDashboard';
import { CalendarDays, Play, Activity, BookOpenCheck, Star, CheckCircle } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data, isLoading } = useStudentDashboard(Boolean(user));

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const stats = data?.stats ?? {
    gpa: 0,
    attendance: 0,
    assignmentsSubmitted: 0,
    onTimeRate: 0,
  };

  // Simplified primary actions
  const actions = [
    { href: '/courses', label: 'Continue Lesson', icon: <Play size={20} fill="currentColor" />, bg: 'primary' },
    { href: '/live', label: 'Join Live', icon: <Activity size={20} />, bg: 'rose' },
    { href: '/assignments', label: 'Assignments', icon: <BookOpenCheck size={20} />, bg: 'indigo' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-wider mb-2">
            <CalendarDays size={14} />
            <span>{currentDate}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900">{greeting}, {user?.name?.split(' ')[0] ?? ''}</h1>
        </div>
        <div className="flex gap-3">
          {actions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-${a.bg}-600 hover:bg-${a.bg}-700 transition`}
            >
              {a.icon} {a.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Quick Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-8 h-8 text-blue-600" />
            <h3 className="text-xs font-bold text-slate-500 uppercase">GPA</h3>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.gpa || '—'}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-8 h-8 text-emerald-600" />
            <h3 className="text-xs font-bold text-slate-500 uppercase">Attendance</h3>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.attendance || '0'}%</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-8 h-8 text-indigo-600" />
            <h3 className="text-xs font-bold text-slate-500 uppercase">Submissions</h3>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">{stats.assignmentsSubmitted}</div>
          <p className="text-sm text-indigo-600">{stats.onTimeRate}% on‑time</p>
        </div>
      </section>
    </div>
  );
}
