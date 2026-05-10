'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '@/utils/api/courseApi';
import { useAuth } from '@/context/AuthContext';
import { 
  Trophy, Star, Target, TrendingUp, 
  BarChart3, FileText, CheckCircle2, AlertCircle,
  Search, Filter, ChevronRight, ArrowUpRight,
  Loader2, Sparkles, Award, BookOpen, HelpCircle
} from 'lucide-react';

interface Grade {
  _id: string;
  item: string; // Assignment/Quiz title
  type: 'assignment' | 'quiz' | 'exam';
  score: number;
  maxScore: number;
  weight: number;
  feedback?: string;
  gradedAt: string;
}

interface GradebookEntry {
  student: {
    _id: string;
    name: string;
    email: string;
  };
  grades: Grade[];
  finalGrade: number;
}

export default function GradesPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]); // For student view
  const [gradebook, setGradebook] = useState<GradebookEntry[]>([]); // For teacher view
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    if (courseId) {
      Promise.resolve().then(() => {
        if (!ignore) setLoading(true);
        return courseApi.getGradebook(courseId);
      }).then(res => {
        if (ignore) return;
        const data = res.data.data;
        if (user?.role === 'teacher') {
          setGradebook(Array.isArray(data) ? data : []);
        } else {
          if (Array.isArray(data)) {
            setGrades(data[0]?.grades || []);
          } else {
            setGrades(data?.grades || []);
          }
        }
      }).catch(() => {
        if (!ignore) {
          setGrades([]);
          setGradebook([]);
        }
      }).finally(() => {
        if (!ignore) setLoading(false);
      });
    }
    return () => { ignore = true; };
  }, [courseId, user?.role]);

  const stats = {
    avgScore: grades.length > 0 ? Math.round(grades.reduce((acc, g) => acc + (g.score / g.maxScore), 0) / grades.length * 100) : 0,
    totalPoints: grades.reduce((acc, g) => acc + g.score, 0),
    maxPoints: grades.reduce((acc, g) => acc + g.maxScore, 0),
    completed: grades.length
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8 lg:p-12">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <Award size={14} />
            Academic Achievement
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6"
          >
            Performance <span className="text-blue-600">Gradebook.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed"
          >
            {user?.role === 'teacher' 
              ? 'Analyze class-wide performance, manage final grades, and provide detailed feedback.' 
              : 'Track your academic progress across all assignments, quizzes, and exams.'}
          </motion.p>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="flex gap-4"
        >
          <button className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black text-xs hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest">
            <BarChart3 size={18} /> Export CSV
          </button>
        </motion.div>
      </header>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Current Grade', value: `${stats.avgScore}%`, icon: Trophy, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
          { label: 'Total Points', value: stats.totalPoints, icon: Target, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Graded Items', value: stats.completed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Platform Rank', value: 'Top 15%', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={28} className={stat.color} />
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1 tracking-tighter leading-none">{stat.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : user?.role === 'student' ? (
        /* Student Grade Table */
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Grade Breakdown</h3>
            <button className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:text-blue-800 transition-colors">
              View Weights <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assessment Item</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Weight</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Score</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {grades.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-bold">No grades recorded for this course yet.</p>
                    </td>
                  </tr>
                ) : grades.map((grade) => (
                  <tr key={grade._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          {grade.type === 'quiz' ? <HelpCircle size={18} /> : <FileText size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight mb-1">{grade.item}</p>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(grade.gradedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-500">{grade.weight}%</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-700">{grade.score} <span className="text-slate-400 font-medium">/ {grade.maxScore}</span></span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className={`inline-block px-4 py-1.5 rounded-xl font-black text-sm tracking-tight ${
                        (grade.score / grade.maxScore) > 0.8 ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {Math.round((grade.score / grade.maxScore) * 100)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Teacher Gradebook Table */
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
             <h3 className="text-xl font-black text-slate-900 tracking-tight">Class Gradebook</h3>
             <div className="relative group">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input placeholder="Filter students..." className="h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-blue-500 transition-colors" />
             </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Name</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Assignments</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Quizzes</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Final Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {gradebook.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-bold">No students enrolled or graded yet.</p>
                    </td>
                  </tr>
                ) : gradebook.map((entry) => (
                  <tr key={entry.student._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                          {entry.student.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight mb-0.5">{entry.student.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{entry.student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-700">85% <span className="text-[10px] text-slate-400 uppercase ml-1">avg</span></span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-slate-700">92% <span className="text-[10px] text-slate-400 uppercase ml-1">avg</span></span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="inline-flex items-center gap-3">
                          <span className="text-xl font-black text-slate-900 tracking-tighter">{entry.finalGrade || 88}%</span>
                          <button aria-label={`View report for ${entry.student.name}`} title={`View report for ${entry.student.name}`} className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center">
                            <ArrowUpRight size={14} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
