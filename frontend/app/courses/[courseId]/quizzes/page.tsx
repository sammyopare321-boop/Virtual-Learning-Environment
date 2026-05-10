'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '@/utils/api/courseApi';
import { useAuth } from '@/context/AuthContext';
import { 
  FileText, Clock, ChevronRight, Plus, 
  Search, Filter, Sparkles, HelpCircle,
  AlertCircle, CheckCircle2, Calendar, 
  BarChart3, Loader2, Play
} from 'lucide-react';
import Link from 'next/link';

interface Quiz {
  _id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  totalPoints: number;
  dueDate?: string;
  status: 'draft' | 'published' | 'closed';
  questionCount?: number;
}

export default function QuizzesPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    courseApi.getQuizzes(courseId)
      .then(res => setQuizzes(res.data.data || []))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto p-8 lg:p-12">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <HelpCircle size={14} />
            Academic Assessments
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6"
          >
            Quizzes & <span className="text-blue-600">Exams.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed"
          >
            Manage and participate in course assessments. Track your progress and view detailed feedback.
          </motion.p>
        </div>

        {user?.role === 'teacher' && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
          >
            <Plus size={20} strokeWidth={3} /> Create Quiz
          </motion.button>
        )}
      </header>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search by quiz title..."
            className="w-full bg-white border border-slate-200 text-slate-900 pl-14 pr-6 h-16 rounded-2xl focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none font-bold shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="h-16 px-8 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest text-xs">
          <Filter size={18} /> Filters
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-48 rounded-[32px] bg-slate-100 animate-pulse border border-slate-200" />
          ))}
        </div>
      ) : filteredQuizzes.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-sm"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <HelpCircle size={48} className="text-blue-600/20" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">No assessments found.</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
            There are currently no quizzes or exams scheduled for this course. Check back later!
          </p>
          {user?.role === 'teacher' && (
            <button className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-black hover:bg-slate-800 transition-all uppercase tracking-widest text-sm">
              Create your first quiz
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredQuizzes.map((quiz, i) => (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white rounded-[32px] border border-slate-200 p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex items-start justify-between mb-8">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  quiz.status === 'published' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                }`}>
                  <FileText size={28} />
                </div>
                <div className="flex gap-2">
                   <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                     quiz.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-500 border-slate-200'
                   }`}>
                     {quiz.status}
                   </span>
                </div>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mb-3 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                {quiz.title}
              </h3>
              <p className="text-slate-500 font-medium line-clamp-2 mb-8 text-sm leading-relaxed">
                {quiz.description || 'No description provided for this assessment.'}
              </p>

              <div className="grid grid-cols-2 gap-6 mb-8 pt-8 border-t border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Duration</p>
                    <p className="text-sm font-black text-slate-900 leading-none">{quiz.duration} min</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
                    <Star size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Points</p>
                    <p className="text-sm font-black text-slate-900 leading-none">{quiz.totalPoints} pts</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : 'No Due Date'}
                  </span>
                </div>
                
                <Link 
                  href={`/courses/${courseId}/quizzes/${quiz._id}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-black text-xs hover:bg-blue-600 transition-all uppercase tracking-widest group/btn"
                >
                  {user?.role === 'student' ? 'Take Quiz' : 'Manage'} <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Quick Stats Panel (Teacher only) */}
      {user?.role === 'teacher' && quizzes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-12 opacity-10 rotate-12 pointer-events-none">
            <BarChart3 size={160} />
          </div>
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Total Assessments</p>
              <p className="text-5xl font-black tracking-tighter leading-none">{quizzes.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Avg Completion</p>
              <p className="text-5xl font-black tracking-tighter leading-none">82%</p>
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em] mb-4">Pending Grading</p>
              <p className="text-5xl font-black tracking-tighter leading-none">14</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
