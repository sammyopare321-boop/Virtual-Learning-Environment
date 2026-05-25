'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCourseQuizzes } from '@/hooks/queries/useCourseResources';
import {
  Clock, Trophy, Plus,
  ArrowRight, Inbox, Search,
  Target, FlaskConical
} from 'lucide-react';

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  duration?: number;
  totalMarks?: number;
  isPublished?: boolean;
  questions?: unknown[];
  startTime?: string;
  endTime?: string;
}

export default function QuizzesPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const { data: quizzes = [], isLoading: loading } = useCourseQuizzes(courseId);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredQuizzes = useMemo(() => {
    let result = (quizzes as Quiz[]).filter((q: Quiz) =>
      q.title.toLowerCase().includes(search.toLowerCase())
    );
    if (statusFilter === 'published') result = result.filter(q => q.isPublished);
    if (statusFilter === 'draft') result = result.filter(q => !q.isPublished);
    return result;
  }, [quizzes, search, statusFilter]);

  const stats = {
    total: (quizzes as Quiz[]).length,
    published: (quizzes as Quiz[]).filter((q: Quiz) => q.isPublished).length,
  };

  return (
    <div className="space-y-4 pb-10">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Quizzes &amp; Assessments</h1>
          <p className="page-subtitle mt-0.5">Take quizzes, track scores, and review performance.</p>
        </div>
        {isTeacher && (
          <Link href={`/courses/${courseId}/quizzes/new`} className="btn btn-primary btn-sm gap-1.5 self-start sm:self-auto">
            <Plus size={14} /> Create Quiz
          </Link>
        )}
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card">
          <p className="section-label mb-1">Total Quizzes</p>
          <p className="text-xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="section-label mb-1">Published</p>
          <p className="text-xl font-bold text-emerald-600">{stats.published}</p>
        </div>
        <div className="stat-card">
          <p className="section-label mb-1">Drafts</p>
          <p className="text-xl font-bold text-amber-600">{stats.total - stats.published}</p>
        </div>
        <div className="stat-card">
          <p className="section-label mb-1">Questions</p>
          <p className="text-xl font-bold text-blue-600">
            {(quizzes as Quiz[]).reduce((s: number, q: Quiz) => s + (q.questions?.length ?? 0), 0)}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            aria-label="Search quizzes"
            className="input-premium pl-8 h-8 text-xs w-full"
            placeholder="Search quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {isTeacher && (
          <select
            aria-label="Filter by status"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="input-premium h-8 py-0 text-xs w-32 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        )}
      </div>

      {/* Quiz List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-200 shadow-sm">
          <Inbox size={20} className="text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No Quizzes Yet</h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {search || statusFilter !== 'all' ? 'No quizzes match your filters.' : 'No quizzes have been created yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredQuizzes.map((q, idx) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-sm transition-all flex flex-col group"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <h3 className="text-[13px] font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors flex-1">
                  {q.title}
                </h3>
                <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                  q.isPublished
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-slate-50 text-slate-500 border border-slate-100'
                }`}>
                  {q.isPublished ? 'Live' : 'Draft'}
                </span>
              </div>

              {q.description && (
                <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">{q.description}</p>
              )}

              <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
                <div className="flex items-center gap-1 text-slate-500">
                  <Target size={12} className="text-slate-400" />
                  <span>{q.questions?.length ?? 0} Questions</span>
                </div>
                {q.duration && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Clock size={12} className="text-slate-400" />
                    <span>{q.duration} min</span>
                  </div>
                )}
                {q.totalMarks && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <Trophy size={12} className="text-slate-400" />
                    <span>{q.totalMarks} pts</span>
                  </div>
                )}
                {q.startTime && (
                  <div className="flex items-center gap-1 text-slate-500">
                    <FlaskConical size={12} className="text-slate-400" />
                    <span>{new Date(q.startTime).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              <div className="mt-auto pt-3 border-t border-slate-100">
                <Link
                  href={`/courses/${courseId}/quizzes/${q._id}`}
                  className="btn btn-secondary btn-sm w-full justify-center gap-1 text-[11px]"
                >
                  {isTeacher ? 'Manage' : isStudent ? 'Start' : 'View'} <ArrowRight size={10} />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
