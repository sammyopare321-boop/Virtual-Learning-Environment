'use client';

import { useState, useMemo, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useCourseAssignments } from '@/hooks/queries/useCourseResources';
import {
  Calendar, Trophy,
  Plus, CheckCircle2, AlertCircle, LucideIcon,
  ArrowRight, Inbox, Activity, Search,
  ChevronUp
} from 'lucide-react';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  totalMarks: number;
}

interface Submission {
  _id: string;
  assignment: string;
  status: 'submitted' | 'graded' | 'late' | 'pending';
  grade?: number;
}

const statusBadge: Record<string, { bg: string, text: string, border: string, label: string, icon: LucideIcon }> = {
  submitted: { bg: 'bg-primary-50', text: 'text-primary-600', border: 'border-primary-100', label: 'Submitted', icon: CheckCircle2 },
  graded: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Graded', icon: Trophy },
  late: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', label: 'Overdue', icon: AlertCircle },
  pending: { bg: 'bg-slate-50', text: 'text-slate-400', border: 'border-slate-100', label: 'Pending', icon: Activity },
};

function daysLeft(dueDate: string) {
  const diff = new Date(dueDate).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: 'Past Due', color: 'text-rose-500', bg: 'bg-rose-50' };
  if (days === 0) return { text: 'Due Today', color: 'text-amber-500', bg: 'bg-amber-50' };
  if (days === 1) return { text: '1 Day Left', color: 'text-amber-500', bg: 'bg-amber-50' };
  return { text: `${days} Days Left`, color: 'text-slate-400', bg: 'bg-slate-50' };
}

export default function AssignmentsPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const { data: assignmentData, isLoading: loading } = useCourseAssignments(courseId, { isStudent });

  const assignments = (assignmentData?.assignments ?? []) as Assignment[];
  const submissions = (assignmentData?.submissions ?? {}) as unknown as Record<string, Submission>;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortKey, setSortKey] = useState('dueDate');

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const mainEl = document.querySelector('main');
    if (!mainEl) return;

    const onScroll = () => setShowScrollTop(mainEl.scrollTop > 300);
    mainEl.addEventListener('scroll', onScroll, { passive: true });
    return () => mainEl.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => {
    const mainEl = document.querySelector('main');
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // --- Computed stats from real data ---
  const totalSubmissions = Object.keys(submissions).length;
  const pendingReviews = Object.values(submissions).filter(s => s.status === 'submitted').length;
  const overdueCount = assignments.filter(
    a => new Date(a.dueDate) < new Date() && !submissions[a._id]
  ).length;

  // --- Filter + Sort pipeline ---
  const filteredAssignments = useMemo(() => {
    let result = assignments.filter(a =>
      a.title.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== 'all') {
      result = result.filter(a => {
        const sub = submissions[a._id];
        const status = sub?.status ?? 'pending';
        if (statusFilter === 'submitted') return status === 'submitted';
        if (statusFilter === 'graded') return status === 'graded';
        if (statusFilter === 'late') return status === 'late';
        if (statusFilter === 'pending') return !sub || status === 'pending';
        return true;
      });
    }

    if (sortKey === 'dueDate') {
      result = [...result].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    } else if (sortKey === 'points') {
      result = [...result].sort((a, b) => b.totalMarks - a.totalMarks);
    }

    return result;
  }, [assignments, submissions, search, statusFilter, sortKey]);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary-600 font-bold text-[10px] uppercase tracking-widest">
              <Activity size={14} /> Coursework
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Assignments
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {assignments.length > 0
                ? `${assignments.length} assignment${assignments.length > 1 ? 's' : ''} - Manage coursework, submissions, and grading`
                : 'Manage coursework, submissions, and grading'}
            </p>
          </div>

          {isTeacher && (
            <Link
              href={`/courses/${courseId}/assignments/new`}
              className="btn btn-primary h-12 px-6 gap-2 text-xs font-bold shadow-sm transition-all rounded-xl self-start md:self-auto"
            >
              <Plus size={16} /> Create Assignment
            </Link>
          )}
        </div>
      </section>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
            <Activity size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total</p>
            <p className="text-2xl font-extrabold text-slate-900">{assignments.length}</p>
          </div>
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <AlertCircle size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pending Review</p>
            <p className="text-2xl font-extrabold text-amber-600">{pendingReviews}</p>
          </div>
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(pendingReviews / Math.max(assignments.length, 1)) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <CheckCircle2 size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Submissions</p>
            <p className="text-2xl font-extrabold text-blue-600">{totalSubmissions}</p>
          </div>
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(totalSubmissions / Math.max(assignments.length, 1)) * 100}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <AlertCircle size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Overdue</p>
            <p className="text-2xl font-extrabold text-rose-600">{overdueCount}</p>
          </div>
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(overdueCount / Math.max(assignments.length, 1)) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            aria-label="Search assignments"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
            placeholder="Search assignments..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-xs font-medium cursor-pointer bg-white"
          >
            <option value="all">All Status</option>
            <option value="submitted">Submitted</option>
            <option value="graded">Graded</option>
            <option value="late">Overdue</option>
            <option value="pending">Pending</option>
          </select>
          <select
            aria-label="Sort assignments"
            value={sortKey}
            onChange={e => setSortKey(e.target.value)}
            className="px-3 py-2.5 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-xs font-medium cursor-pointer bg-white"
          >
            <option value="dueDate">By Due Date</option>
            <option value="points">By Points</option>
          </select>
        </div>
      </div>

      {/* Assignment List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-40 rounded-2xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : filteredAssignments.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
          <Inbox size={36} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Assignments Yet</h3>
          <p className="text-sm text-slate-500 mt-1.5">
            {search || statusFilter !== 'all'
              ? 'No assignments match your filters.'
              : 'No assignments have been created yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssignments.map((a) => {
            const dl = daysLeft(a.dueDate);
            const sub = submissions[a._id];
            const sb = statusBadge[sub?.status || 'pending'];
            const StatusIcon = sb.icon;

            return (
              <div key={a._id} className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-primary-200 hover:shadow-md transition-all flex flex-col group">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="text-sm font-bold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors" title={a.title}>
                    {a.title}
                  </h3>
                  {isStudent && (
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 border ${sb.bg} ${sb.text} ${sb.border}`}>
                      <StatusIcon size={12} /> {sb.label}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Calendar size={14} className="text-slate-400" />
                    <span className={`font-semibold ${dl.color}`}>{dl.text}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600">
                    <Trophy size={14} className="text-slate-400" />
                    <span className="font-semibold">{a.totalMarks} pts</span>
                  </div>
                </div>

                <div className="mt-auto">
                  <Link
                    href={`/courses/${courseId}/assignments/${a._id}`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition-all"
                  >
                    {isTeacher ? 'Manage' : isStudent && !sub ? 'Start' : 'View'} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Scroll to top FAB */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 w-8 h-8 rounded-full bg-slate-900 text-white shadow-lg flex items-center justify-center hover:bg-primary-600 transition-colors"
        >
          <ChevronUp size={16} />
        </button>
      )}
    </div>
  );
}
