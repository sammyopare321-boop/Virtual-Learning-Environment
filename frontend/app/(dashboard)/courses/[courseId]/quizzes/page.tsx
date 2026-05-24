'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCourse } from '@/hooks/queries/useCourse';
import { useCourseQuizzes } from '@/hooks/queries/useCourseResources';
import {
  FlaskConical, Calendar, Clock, Trophy, Plus, Loader2,
  CheckCircle2, AlertCircle, ArrowRight, Inbox, Search,
  BarChart3, Zap, Target
} from 'lucide-react';

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  dueDate?: string;
  timeLimit?: number;
  totalPoints?: number;
  questions?: number;
  status: 'draft' | 'published';
}

interface Attempt {
  _id: string;
  quiz: string;
  score?: number;
  totalPoints?: number;
  status: 'completed' | 'in_progress';
}

export default function QuizzesPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const { data: course } = useCourse(courseId);
  const { data: quizData, isLoading: loading } = useCourseQuizzes(courseId);

  const quizzes = (quizData?.quizzes ?? []) as Quiz[];
  const attempts = (quizData?.attempts ?? {}) as unknown as Record<string, Attempt>;

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredQuizzes = useMemo(() => {
    let result = quizzes.filter(q =>
      q.title.toLowerCase().includes(search.toLowerCase())
    );

    if (statusFilter !== 'all') {
      result = result.filter(q => q.status === statusFilter);
    }

    return result.sort((a, b) => new Date(b._id).getTime() - new Date(a._id).getTime());
  }, [quizzes, search, statusFilter]);

  const stats = {
    total: quizzes.length,
    published: quizzes.filter(q => q.status === 'published').length,
    completed: Object.values(attempts).filter(a => a.status === 'completed').length,
    avgScore: Object.values(attempts).length > 0
      ? Math.round(
          Object.values(attempts).reduce((sum, a) => sum + ((a.score || 0) / (a.totalPoints || 100) * 100), 0) /
          Object.values(attempts).length
        )
      : 0,
  };

  return (
    <div className="space-y-4 pb-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Quizzes & Assessments</h1>
          <p className="page-subtitle mt-0.5">Take quizzes, track scores, and review performance.</p>
        </div>

        {isTeacher && (
          <Link
            href={`/courses/${courseId}/quizzes/new`}
            className="btn btn-primary btn-sm gap-1.5 self-start sm:self-auto"
          >
            <Plus size={14} /> Create Quiz
          </Link>
        )}
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card">
          <p className="section-label mb-1">Total Quizzes</p>
          <p className="text-xl font-bold text-slate-900">{stats.total}</p>
        </div>
        <div className="stat-card">
          <p className="section-label mb-1">Published</p>
          <p className="text-xl font-bold text-emerald-600">{stats.published}</p>
        </div>
        {isStudent && (
          <>
            <div className="stat-card">
              <p className="section-label mb-1">Completed</p>
              <p className="text-xl font-bold text-blue-600">{stats.completed}</p>
            </div>
            <div className="stat-card">
              <p className="section-label mb-1">Avg Score</p>
              <p className="text-xl font-bold text-primary-600">{stats.avgScore}%</p>
            </div>
          </>
        )}
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
            {search || statusFilter !== 'all'
              ? 'No quizzes match your filters.'
              : 'No quizzes have been created yet.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredQuizzes.map((q, idx) => {
            const attempt = attempts[q._id];
            const isCompleted = attempt?.status === 'completed';
            const score = attempt?.score || 0;
            const total = attempt?.totalPoints || 100;
            const percentage = Math.round((score / total) * 100);

            return (
              <motion.div
                key={q._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-slate-100 rounded-xl p-4 hover:border-slate-200 hover:shadow-sm transition-all flex flex-col group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1">
                    <h3 className="text-[13px] font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {q.title}
                    </h3>
                  </div>
                  <span className={`px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 ${
                    q.status === 'published'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      : 'bg-slate-50 text-slate-500 border border-slate-100'
                  }`}>
                    {q.status}
                  </span>
                </div>

                {q.description && (
                  <p className="text-[11px] text-slate-500 mb-3 line-clamp-2">{q.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 mb-3 text-[11px]">
                  {q.questions && (
                    <div className="flex items-center gap-1 text-slate-500">
                      <Target size={12} className="text-slate-400" />
                      <span>{q.questions} Questions</span>
                    </div>
                  )}
                  {q.timeLimit && (
                    <div className="flex items-center gap-1 text-slate-500">
                      <Clock size={12} className="text-slate-400" />
                      <span>{q.timeLimit} min</span>
                    </div>
                  )}
                </div>

                {isStudent && isCompleted && (
                  <div className="mb-3 p-2 rounded-lg bg-primary-50 border border-primary-100">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-primary-600 uppercase">Your Score</span>
                      <span className="text-[12px] font-bold text-primary-600">{percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-primary-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-3 border-t border-slate-100">
                  <Link
                    href={`/courses/${courseId}/quizzes/${q._id}`}
                    className="btn btn-secondary btn-sm w-full justify-center gap-1 text-[11px]"
                  >
                    {isTeacher ? 'Manage' : isCompleted ? 'Review' : 'Start'} <ArrowRight size={10} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}


