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
  Activity, ShieldCheck, Cpu, Brain, Timer, Users
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
    label: noQuestions ? 'Awaiting Architecture' : 'Protocol Draft', 
    bg: noQuestions ? 'bg-amber-50' : 'bg-slate-50', 
    text: noQuestions ? 'text-amber-600' : 'text-slate-400', 
    border: noQuestions ? 'border-amber-100' : 'border-slate-100', 
    dot: noQuestions ? 'bg-amber-400' : 'bg-slate-300',
    icon: noQuestions ? <AlertCircle size={12} /> : <Lock size={12} />
  };
  if (now < start) return { 
    label: 'Scheduled Transmission', 
    bg: 'bg-primary-50', 
    text: 'text-primary-600', 
    border: 'border-primary-100', 
    dot: 'bg-primary-400',
    icon: <Calendar size={12} />
  };
  if (now > end) return { 
    label: 'Archive State', 
    bg: 'bg-slate-50', 
    text: 'text-slate-500', 
    border: 'border-slate-100', 
    dot: 'bg-slate-400',
    icon: <ShieldCheck size={12} />
  };
  return { 
    label: 'Live Broadcast', 
    bg: 'bg-rose-50', 
    text: 'text-rose-600', 
    border: 'border-rose-100', 
    dot: 'bg-rose-500 animate-pulse',
    icon: <Activity size={12} />
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
      toast.error('Add at least one question before broadcasting.');
      return;
    }
    try {
      await quizApi.publishQuiz(quiz._id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.list(courseId) });
      toast.success('Assessment broadcasted to cohort.');
    } catch (err) {
      toast.error('Broadcast failed.');
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
    <div className="space-y-10 pb-20">
      
      {/* 🔷 TOP HEADER */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            Quizzes
          </h1>
          <p className="text-slate-500 font-medium text-lg">
            Create interactive assessments and track student performance.
          </p>
        </div>
        
        {(user?.role === 'teacher' || user?.role === 'admin') && (
          <Link 
            href={`/courses/${courseId}/quizzes/new`}
            className="btn btn-primary h-14 px-8 gap-3 text-sm font-bold uppercase tracking-wider shadow-lg shadow-primary-500/20 whitespace-nowrap inline-flex items-center justify-center rounded-xl transition-all hover:scale-105"
          >
            <Plus size={20} strokeWidth={2.5} /> Create Quiz
          </Link>
        )}
      </header>

      {/* 📊 QUIZ OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Total Quizzes</p>
          <p className="text-3xl font-display font-black text-slate-900">{quizzes.length} <span className="text-sm font-bold text-slate-400">Total</span></p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Active Quizzes</p>
          <p className="text-3xl font-display font-black text-primary-500">{activeQuizzes} <span className="text-sm font-bold text-slate-400">Active</span></p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Average Score</p>
          <p className="text-3xl font-display font-black text-emerald-500">72% <span className="text-sm font-bold text-slate-400">Avg Score</span></p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Pending Reviews</p>
          <p className="text-3xl font-display font-black text-amber-500">12 <span className="text-sm font-bold text-slate-400">Reviews</span></p>
        </div>
      </div>

      {/* 🔍 FILTERS & SEARCH */}
      <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col sm:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 h-12 text-sm font-semibold focus:bg-white focus:border-primary-500 outline-none transition-all"
            placeholder="Search quizzes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <select aria-label="Filter by course" className="bg-slate-50 border border-slate-100 text-slate-600 text-sm font-bold rounded-xl h-12 px-4 focus:outline-none focus:border-primary-500 flex-1 sm:flex-none cursor-pointer">
            <option value="all">Course ▼</option>
          </select>
          <select 
            aria-label="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-100 text-slate-600 text-sm font-bold rounded-xl h-12 px-4 focus:outline-none focus:border-primary-500 flex-1 sm:flex-none cursor-pointer"
          >
            <option value="all">Status ▼</option>
            <option value="published">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </select>
          <select aria-label="Sort quizzes" className="bg-slate-50 border border-slate-100 text-slate-600 text-sm font-bold rounded-xl h-12 px-4 focus:outline-none focus:border-primary-500 flex-1 sm:flex-none cursor-pointer hidden md:block">
            <option value="all">Sort ▼</option>
          </select>
        </div>
      </div>

      {/* 📚 QUIZ CARDS */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-64 rounded-3xl bg-white border border-slate-100 animate-pulse" />)}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="py-24 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl mx-auto flex items-center justify-center mb-6">
            <FileText size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No quizzes found</h3>
          <p className="text-slate-500 font-medium">Adjust your filters or create a new assessment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const isActive = quiz.status === 'published';
            
            return (
              <div key={quiz._id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-primary-200 transition-all duration-300 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 line-clamp-1" title={quiz.title}>{quiz.title}</h3>
                  <p className="text-sm font-semibold text-slate-500 mt-1">Course: Default View</p>
                </div>
                
                <div className="space-y-3 mb-6 flex-1">
                  <div className="flex items-center justify-between text-sm font-medium text-slate-600 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                    <span className="flex items-center gap-2"><FileText size={16} className="text-slate-400"/> Questions</span>
                    <span className="font-bold text-slate-900">{quiz.questionCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-600 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                    <span className="flex items-center gap-2"><Clock size={16} className="text-slate-400"/> Duration</span>
                    <span className="font-bold text-slate-900">{quiz.duration || 30} mins</span>
                  </div>
                  <div className="flex items-center justify-between text-sm font-medium text-slate-600 bg-slate-50 rounded-xl px-4 py-2 border border-slate-100">
                    <span className="flex items-center gap-2"><Users size={16} className="text-slate-400"/> Attempts</span>
                    <span className="font-bold text-slate-900">0 / Unlimited</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-5 space-y-5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Status:</span>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                      isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} /> 
                      {isActive ? 'Active' : 'Draft'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link 
                      href={`/courses/${courseId}/quizzes/${quiz._id}`}
                      className="flex-1 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl text-center transition-colors"
                    >
                      Open
                    </Link>
                    {(user?.role === 'teacher' || user?.role === 'admin') && (
                      <>
                        <Link 
                          href={`/courses/${courseId}/quizzes/${quiz._id}/edit`}
                          className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl text-center transition-colors"
                        >
                          Edit
                        </Link>
                        <button 
                          className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 text-xs font-bold uppercase tracking-wider py-2.5 rounded-xl text-center transition-colors"
                        >
                          Analytics
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
