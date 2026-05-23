'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useStudentDashboard } from '@/hooks/queries/useStudentDashboard';
import { CalendarDays, Play, Activity, BookOpenCheck, Star, CheckCircle, TrendingUp, Clock, ArrowUpRight } from 'lucide-react';

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

  const statCards = [
    {
      label: 'GPA',
      value: stats.gpa || '—',
      suffix: '',
      icon: Star,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      trend: '+0.2 this term',
    },
    {
      label: 'Attendance',
      value: stats.attendance || 0,
      suffix: '%',
      icon: Activity,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      trend: 'Above average',
    },
    {
      label: 'Submissions',
      value: stats.assignmentsSubmitted,
      suffix: '',
      icon: CheckCircle,
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      trend: `${stats.onTimeRate}% on-time`,
    },
  ];

  const quickActions = [
    { href: '/courses',     label: 'My Courses',   icon: BookOpenCheck, color: 'text-blue-600',   bg: 'bg-blue-50 hover:bg-blue-100'   },
    { href: '/ai-tutor',    label: 'AI Tutor',      icon: Play,          color: 'text-violet-600', bg: 'bg-violet-50 hover:bg-violet-100' },
    { href: '/radar',       label: 'Progress',      icon: TrendingUp,    color: 'text-emerald-600', bg: 'bg-emerald-50 hover:bg-emerald-100' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Page Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-primary-600 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <CalendarDays size={12} />
            <span>{currentDate}</span>
          </div>
          <h1 className="page-title">
            {greeting}, {user?.name?.split(' ')[0] ?? 'Student'} 👋
          </h1>
          <p className="page-subtitle mt-0.5">Here&apos;s what&apos;s happening in your workspace today.</p>
        </div>
        <Link
          href="/courses"
          className="btn btn-primary gap-1.5 self-start sm:self-auto"
        >
          <Play size={13} fill="currentColor" />
          Continue Learning
        </Link>
      </header>

      {/* Stat Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statCards.map(({ label, value, suffix, icon: Icon, color, bg, trend }) => (
          <div key={label} className="stat-card flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={17} className={color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="section-label mb-0.5">{label}</p>
              <p className="text-2xl font-bold text-slate-900 leading-none tracking-tight">
                {value}<span className="text-base font-semibold text-slate-400">{suffix}</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{trend}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Quick Access</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {quickActions.map(({ href, label, icon: Icon, color, bg }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 p-3 rounded-xl border border-transparent hover:border-slate-200 bg-white transition-all group`}
            >
              <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center transition-colors`}>
                <Icon size={15} className={color} />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{label}</span>
              <ArrowUpRight size={13} className="ml-auto text-slate-300 group-hover:text-slate-500 transition-colors" />
            </Link>
          ))}
        </div>
      </section>

      {/* Activity Placeholder */}
      {isLoading ? (
        <section className="space-y-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
          ))}
        </section>
      ) : (
        <section className="bg-white border border-slate-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-slate-700">Recent Activity</h2>
            <Link href="/courses" className="text-[11px] text-primary-600 hover:underline font-medium flex items-center gap-0.5">
              View all <ArrowUpRight size={11} />
            </Link>
          </div>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock size={24} className="text-slate-200 mb-2" />
            <p className="text-sm text-slate-400">No recent activity yet.</p>
            <p className="text-xs text-slate-300 mt-0.5">Start learning to see your progress here.</p>
          </div>
        </section>
      )}
    </div>
  );
}
