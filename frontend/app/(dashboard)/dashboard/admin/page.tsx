'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminStats } from '@/hooks/queries/useAdmin';
import { Calendar, Plus, Search, Users, BookOpen, GraduationCap, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: loading } = useAdminStats(Boolean(user));
  const [searchTerm, setSearchTerm] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const statCards = [
    { label: 'Students',  value: stats?.totalStudents  ?? '–', icon: Users,         color: 'text-blue-600',   bg: 'bg-blue-50'   },
    { label: 'Teachers',  value: stats?.totalTeachers  ?? '–', icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Courses',   value: stats?.totalCourses   ?? '–', icon: BookOpen,      color: 'text-violet-600', bg: 'bg-violet-50'  },
  ];

  const quickLinks = [
    { href: '/admin/users',       label: 'Add Student',   color: 'bg-blue-600 hover:bg-blue-700'   },
    { href: '/admin/users',       label: 'Add Teacher',   color: 'bg-emerald-600 hover:bg-emerald-700' },
    { href: '/admin/courses/new', label: 'Create Course', color: 'bg-violet-600 hover:bg-violet-700' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5 pb-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-primary-600 text-[11px] font-semibold uppercase tracking-wider mb-1">
            <Calendar size={12} /><span>{currentDate}</span>
          </div>
          <h1 className="page-title">{greeting}, {user?.name?.split(' ')[0] ?? 'Admin'} 👋</h1>
          <p className="page-subtitle mt-0.5">Platform overview and management tools.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          {quickLinks.map(({ href, label, color }) => (
            <Link key={label} href={href}
              className={`btn btn-sm text-white gap-1.5 ${color}`}
            >
              <Plus size={12} />{label}
            </Link>
          ))}
        </div>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="stat-card flex items-start gap-3">
            <div className={`w-9 h-9 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
              <Icon size={17} className={color} />
            </div>
            <div>
              <p className="section-label mb-0.5">{label}</p>
              {loading
                ? <div className="h-7 w-16 bg-slate-100 rounded animate-pulse mt-1" />
                : <p className="text-2xl font-bold text-slate-900 leading-none tracking-tight">{value?.toLocaleString?.() ?? value}</p>
              }
            </div>
          </div>
        ))}
      </section>

      {/* Users Summary */}
      <section className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[13px] font-semibold text-slate-700">Users Overview</h2>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-premium pl-8 pr-3 h-8 w-44 text-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          {[
            { label: 'Total Students', value: stats?.totalStudents, href: '/admin/users', color: 'text-blue-600' },
            { label: 'Total Teachers', value: stats?.totalTeachers, href: '/admin/users', color: 'text-emerald-600' },
            { label: 'Total Courses',  value: stats?.totalCourses,  href: '/admin/courses', color: 'text-violet-600' },
          ].map(({ label, value, href, color }) => (
            <Link key={label} href={href} className="group p-3 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-100 transition-colors">
              <p className={`text-xl font-bold ${color}`}>{loading ? '–' : value?.toLocaleString() ?? '–'}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{label}</p>
              <p className="text-[10px] text-primary-600 mt-1 flex items-center justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                View all <ArrowUpRight size={9} />
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick Navigation */}
      <section>
        <h2 className="section-label mb-2">Management Tools</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { href: '/admin/users',       label: 'User Management',   icon: Users,         sub: 'Manage students & teachers' },
            { href: '/admin/courses',     label: 'Course Management', icon: BookOpen,      sub: 'View and edit all courses'  },
            { href: '/admin/analytics',   label: 'Analytics',         icon: TrendingUp,    sub: 'Platform performance data'  },
          ].map(({ href, label, icon: Icon, sub }) => (
            <Link key={href} href={href}
              className="flex items-start gap-2.5 p-3 bg-white border border-slate-100 rounded-xl hover:border-slate-200 hover:shadow-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary-50 transition-colors">
                <Icon size={15} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
              </div>
              <div>
                <p className="text-[12px] font-semibold text-slate-800 group-hover:text-primary-600">{label}</p>
                <p className="text-[11px] text-slate-400">{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
