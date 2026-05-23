'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { courseApi } from '@/utils/api/courseApi';
import { useCourseQuizzes } from '@/hooks/queries/useCourseResources';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';
import { quizApi } from '@/utils/api/extraApis';
import {
  FileText, Clock, ChevronRight, Plus,
  Search, Filter, Sparkles, HelpCircle,
  AlertCircle, CheckCircle2, Calendar,
  BarChart3, Loader2, Play, Star, ArrowRight,
  X, Save, Trash2, Globe, Lock, Target, Zap,
  Activity, ShieldCheck, Cpu, Brain, Timer, Users,
  Settings
} from 'lucide-react';
import Link from 'next/link';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  duration: number;
  totalMarks: number;
  startTime: string;
  endTime: string;
  isPublished: boolean;
  questionCount?: number;
  status: 'draft' | 'published' | 'closed';
}

const getStatusMeta = (quiz: Quiz) => {
  const now = new Date();
  const start = new Date(quiz.startTime);
  const end = new Date(quiz.endTime);
  const noQuestions = quiz.questionCount === 0 || !quiz.questionCount;

  if (!quiz.isPublished) return {
    label: noQuestions ? 'Awaiting Structure' : 'Draft',
    bg: noQuestions ? 'bg-amber-50' : 'bg-slate-50',
    text: noQuestions ? 'text-amber-600' : 'text-slate-500',
    border: noQuestions ? 'border-amber-200' : 'border-slate-200',
    dot: noQuestions ? 'bg-amber-400' : 'bg-slate-400',
    icon: noQuestions ? <AlertCircle size={10} /> : <Lock size={10} />
  };
  if (now < start) return {
    label: 'Scheduled',
    bg: 'bg-primary-50',
    text: 'text-primary-600',
    border: 'border-primary-200',
    dot: 'bg-primary-500',
    icon: <Calendar size={10} />
  };
  if (now > end) return {
    label: 'Closed',
    bg: 'bg-slate-50',
    text: 'text-slate-500',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
    icon: <ShieldCheck size={10} />
  };
  return {
    label: 'Live',
    bg: 'bg-rose-50',
    text: 'text-rose-600',
    border: 'border-rose-200',
    dot: 'bg-rose-500 animate-pulse',
    icon: <Activity size={10} />
  };
};

export default function QuizzesPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();

  const queryClient = useQueryClient();
  const { data: quizzesData = [], isLoading: loading } = useCourseQuizzes(courseId);
  const quizzes = quizzesData as Quiz[];

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handlePublish = async (quiz: Quiz) => {
    if (!quiz.questionCount || quiz.questionCount === 0) {
      toast.error('Add at least one question before publishing.');
      return;
    }
    try {
      await quizApi.publishQuiz(quiz._id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.list(courseId) });
      toast.success('Quiz published.');
    } catch (err) {
      toast.error('Failed to publish.');
    }
  };

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(search.toLowerCase());
    let matchesStatus = true;
    if (statusFilter === 'published') matchesStatus = q.status === 'published';
    if (statusFilter === 'draft') matchesStatus = q.status === 'draft';
    if (statusFilter === 'closed') matchesStatus = q.status === 'closed';
    return matchesSearch && matchesStatus;
  });

  const activeQuizzes = quizzes.filter(q => q.status === 'published').length;

  return (
    <div className="space-y-4 pb-10">

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Quizzes</h1>
          <p className="page-subtitle mt-0.5">Assessments and knowledge checks.</p>
        </div>

        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Link
            href={`/courses/${courseId}/quizzes/new`}
            className="btn btn-primary btn-sm gap-1.5 self-start sm:self-auto"
          >
            <Plus size={14} /> Create Quiz
          </Link>
        )}
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="stat-card">
          <p className="section-label mb-1">Total Quizzes</p>
          <p className="text-xl font-bold text-slate-900">{quizzes.length}</p>
        </div>
        <div className="stat-card">
          <p className="section-label mb-1">Active</p>
          <p className="text-xl font-bold text-primary-600">{activeQuizzes}</p>
        </div>
        <div className="stat-card">
          <p className="section-label mb-1">Avg Score</p>
          <p className="text-xl font-bold text-emerald-600">72%</p>
        </div>
        <div className="stat-card">
          <p className="section-label mb-1">To Review</p>
          <p className="text-xl font-bold text-amber-600">12</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            className="input-premium pl-8 h-8 text-xs w-full"
            placeholder="Search quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-premium h-8 py-0 text-xs w-32 cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="published">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => <div key={i} className="h-32 rounded-xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-200 shadow-sm">
          <FileText size={20} className="text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No quizzes found</h3>
          <p className="text-[11px] text-slate-400 mt-1">Adjust filters or create a new assessment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredQuizzes.map((quiz) => {
            const status = getStatusMeta(quiz);

            return (
              <div key={quiz._id} className="bg-white border border-slate-100 rounded-xl p-3 hover:border-slate-200 hover:shadow-sm transition-all flex flex-col group">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-[13px] font-semibold text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors" title={quiz.title}>
                    {quiz.title}
                  </h3>
                  <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold shrink-0 border ${status.bg} ${status.text} ${status.border}`}>
                    <span className={`w-1 h-1 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <FileText size={12} className="text-slate-400" />
                    <span>{quiz.questionCount || 0} Qs</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                    <Clock size={12} className="text-slate-400" />
                    <span>{quiz.duration || 30} min</span>
                  </div>
                </div>

                <div className="mt-auto pt-3 border-t border-slate-100 flex items-center gap-1.5">
                  <Link
                    href={`/courses/${courseId}/quizzes/${quiz._id}`}
                    className="btn btn-secondary btn-sm flex-1 justify-center gap-1 text-[11px]"
                  >
                    Open <ArrowRight size={10} />
                  </Link>

                  {(user?.role === 'teacher' || user?.role === 'admin') && (
                    <>
                      <Link
                        href={`/courses/${courseId}/quizzes/${quiz._id}/edit`}
                        className="btn btn-ghost btn-sm px-2 text-[11px]"
                        title="Edit"
                      >
                        <Settings size={12} />
                      </Link>
                      <button
                        className="btn btn-ghost btn-sm px-2 text-[11px]"
                        title="Analytics"
                      >
                        <BarChart3 size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
