'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useAdminStats } from '@/hooks/queries/useAdmin';
import { Calendar, Plus, Search, CheckSquare, Square } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: loading } = useAdminStats(Boolean(user));
  const [searchTerm, setSearchTerm] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  });

  // Greeting based on hour
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  // Simplified action toolbar
  const actions = [
    { href: '/admin/users', label: 'Add Student', color: 'primary' },
    { href: '/admin/users', label: 'Add Teacher', color: 'emerald' },
    { href: '/admin/courses', label: 'Create Course', color: 'indigo' },
  ];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar size={14} />
            <span>{currentDate}</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900">{greeting}, {user?.name?.split(' ')[0] ?? 'Admin'}</h1>
        </div>
        <div className="flex gap-3">
          {actions.map((a) => (
            <Link
              key={a.label}
              href={a.href}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white bg-${a.color}-600 hover:bg-${a.color}-700 transition`}
            >
              <Plus size={16} /> {a.label}
            </Link>
          ))}
        </div>
      </header>

      {/* Users Summary */}
      <section className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Users Summary</h2>
          <div className="relative w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search users…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:bg-white focus:border-primary-500"
            />
          </div>
        </div>
        <p className="text-slate-600 text-sm">
          Total Students: <strong>{stats?.totalStudents?.toLocaleString() ?? '–'}</strong>{' '} |{' '}
          Total Courses: <strong>{stats?.totalCourses?.toLocaleString() ?? '–'}</strong>{' '} |{' '}
          Total Teachers: <strong>{stats?.totalTeachers?.toLocaleString() ?? '–'}</strong>
        </p>
      </section>
    </div>
  );
}
