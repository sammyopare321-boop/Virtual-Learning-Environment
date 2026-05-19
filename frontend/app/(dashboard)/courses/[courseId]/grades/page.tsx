'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { courseApi } from '@/utils/api/courseApi';
import { useCourse } from '@/hooks/queries/useCourse';
import { useCourseGrades } from '@/hooks/queries/useCourseResources';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';
import { 
  Trophy, Star, Target, TrendingUp, 
  BarChart3, FileText, CheckCircle2, AlertCircle,
  Search, Filter, ChevronRight, ArrowUpRight,
  Loader2, Sparkles, Award, BookOpen, HelpCircle,
  Scale, Save, X, User, ShieldAlert, Zap,
  Activity, PieChart, ShieldCheck, Mail
} from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';

interface GradeItem {
  _id: string;
  sourceId: { title: string };
  sourceType: 'assignment' | 'quiz';
  score: number;
  maxScore: number;
  gradedAt: string;
}

interface GradebookEntry {
  student: { _id: string; name: string; email: string };
  assignmentAverage: number;
  quizAverage: number;
  finalPercentage: number;
}

interface AnalyticsData {
  classAverage: number;
  highestScore: number;
  lowestScore: number;
  distribution: {
    'below50': number;
    '50-69': number;
    '70-89': number;
    '90-100': number;
  };
  completionRate: number;
}

export default function GradesPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  
  const queryClient = useQueryClient();
  const { data: course } = useCourse(courseId);
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';
  const role = isStudent ? 'student' : 'teacher';
  
  const { data: gradeData, isLoading: loading } = useCourseGrades(courseId, role, Boolean(courseId && user));
  const weights = gradeData?.weights ?? null;
  const finalGrade = gradeData?.finalGrade ?? null;
  const myGrades = (gradeData?.myGrades ?? []) as GradeItem[];
  const gradebook = (gradeData?.gradebook ?? []) as GradebookEntry[];
  const atRisk = (gradeData?.atRisk ?? []) as GradebookEntry[];

  const [showWeightForm, setShowWeightForm] = useState(false);
  const [wForm, setWForm] = useState({ assignmentWeight: 60, quizWeight: 40 });
  const [savingW, setSavingW] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Analytics for instructors
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    if (weights) {
      setWForm({
        assignmentWeight: weights.assignmentWeight,
        quizWeight: weights.quizWeight,
      });
    }
  }, [weights]);

  useEffect(() => {
    if (isTeacher && courseId) {
      setLoadingAnalytics(true);
      courseApi.getAnalytics(courseId)
        .then((res) => {
          setAnalytics(res.data?.data || null);
        })
        .catch((err) => {
          console.error('Failed to load class analytics:', err);
        })
        .finally(() => {
          setLoadingAnalytics(false);
        });
    }
  }, [isTeacher, courseId]);

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (wForm.assignmentWeight + wForm.quizWeight !== 100) {
      toast.error('Weights must add up to exactly 100%.');
      return;
    }
    setSavingW(true);
    try {
      await courseApi.setGradeWeights(courseId, wForm);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.grades(courseId, role) });
      setShowWeightForm(false);
      toast.success('Grade weights updated successfully.');
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update weights.');
    } finally {
      setSavingW(false);
    }
  };

  const getGradeColor = (p: number) => {
    if (p >= 70) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (p >= 50) return 'text-amber-600 bg-amber-50 border-amber-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const getGradeText = (p: number) => {
    if (p >= 85) return 'A (Excellent)';
    if (p >= 70) return 'B (Good)';
    if (p >= 50) return 'C (Pass)';
    return 'F (Fail/At-Risk)';
  };

  // Grade data for Recharts BarChart
  const gradeDistributionData = analytics?.distribution ? [
    { name: 'Below 50% (F)', count: analytics.distribution['below50'] || 0, fill: '#ef4444' },
    { name: '50% - 69% (C)', count: analytics.distribution['50-69'] || 0, fill: '#f59e0b' },
    { name: '70% - 89% (B)', count: analytics.distribution['70-89'] || 0, fill: '#3b82f6' },
    { name: '90% - 100% (A)', count: analytics.distribution['90-100'] || 0, fill: '#10b981' },
  ] : [];

  const filteredGradebook = gradebook.filter(entry => 
    entry.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    entry.student?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      
      {/* Overview Block */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary-600 font-bold text-[10px] uppercase tracking-widest">
              <Trophy size={14} /> Grades & Performance
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {isTeacher ? 'Instructor Gradebook & Course Analytics' : 'Your Academic Performance'}
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {isTeacher 
                ? 'Review class averages, analyze support needs, configure weight values, and access student grades.' 
                : 'Monitor your graded assignments, tests, overall standing, and grade component details.'}
            </p>
          </div>

          <div className="flex gap-3">
            {isTeacher && (
              <button 
                onClick={() => setShowWeightForm(p => !p)}
                className={`btn h-12 px-6 gap-2 text-xs font-bold shadow-sm transition-all rounded-xl ${
                  showWeightForm 
                    ? 'bg-slate-900 text-white hover:bg-slate-800' 
                    : 'btn-secondary'
                }`}
              >
                {showWeightForm ? <><X size={16} /> Close Weights</> : <><Scale size={16} /> Configure Weights</>}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Grade Weights Configuration Form */}
      <AnimatePresence>
        {showWeightForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                  <PieChartIcon size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Grade Weight Settings</h3>
                  <p className="text-slate-500 text-xs font-semibold">Define percentage weighting for assignments and quizzes.</p>
                </div>
              </div>

              <form onSubmit={handleSaveWeights} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="w-assignment" className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">Assignment Weight (%)</label>
                    <input 
                      id="w-assignment"
                      type="number" min="0" max="100"
                      className="input-premium h-12 text-sm" 
                      value={wForm.assignmentWeight} 
                      onChange={e => {
                        const v = parseInt(e.target.value) || 0;
                        setWForm({ assignmentWeight: v, quizWeight: 100 - v });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="w-quiz" className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-1">Quiz Weight (%)</label>
                    <input 
                      id="w-quiz"
                      type="number" min="0" max="100"
                      className="input-premium h-12 text-sm" 
                      value={wForm.quizWeight} 
                      onChange={e => {
                        const v = parseInt(e.target.value) || 0;
                        setWForm({ quizWeight: v, assignmentWeight: 100 - v });
                      }}
                    />
                  </div>
                </div>

                <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all duration-300 ${
                  wForm.assignmentWeight + wForm.quizWeight === 100 
                    ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                    : 'bg-rose-50 border-rose-100 text-rose-700'
                }`}>
                  {wForm.assignmentWeight + wForm.quizWeight === 100 ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase tracking-wider">Weight Balance Verification</p>
                    <p className="text-[10px] font-medium opacity-80">Assignments ({wForm.assignmentWeight}%) + Quizzes ({wForm.quizWeight}%) must sum to exactly 100%. Current sum: {wForm.assignmentWeight + wForm.quizWeight}%</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    type="submit" 
                    disabled={savingW || wForm.assignmentWeight + wForm.quizWeight !== 100} 
                    className="btn btn-primary h-12 px-6 text-xs font-bold shadow-sm"
                  >
                    {savingW ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} className="mr-2" /> Save Weights</>}
                  </button>
                  <button type="button" onClick={() => setShowWeightForm(false)} className="btn btn-secondary h-12 px-6 text-xs font-bold shadow-sm">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-white border border-slate-200 rounded-3xl animate-pulse shadow-sm" />)}
        </div>
      ) : isStudent ? (
        <div className="space-y-8">
          {/* Student Performance Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-8 text-primary-500/5 pointer-events-none group-hover:scale-105 transition-transform duration-1000">
              <Target size={180} />
            </div>

            <div className="flex flex-col lg:flex-row items-center gap-12 relative z-10">
              {/* Progress Ring */}
              <div className="shrink-0 relative">
                <div className="w-40 h-40 rounded-full border-[12px] border-slate-50 flex items-center justify-center relative shadow-inner">
                  <svg className="absolute inset-[-12px] rotate-[-90deg] w-[184px] h-[184px]">
                     <circle 
                       cx="92" cy="92" r="78" fill="transparent" stroke="currentColor" strokeWidth="12" 
                       className="text-primary-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.2)]" 
                       strokeDasharray={490}
                       strokeDashoffset={490 - (490 * (finalGrade?.finalPercentage || 0)) / 100}
                       strokeLinecap="round"
                     />
                  </svg>
                  <div className="flex flex-col items-center">
                    <span className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">{Math.round(finalGrade?.finalPercentage || 0)}%</span>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Average</span>
                  </div>
                </div>
              </div>

              {/* Progress Description */}
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Course Grade Progress</h3>
                  <p className="text-slate-500 font-medium text-sm">Aggregated scores computed across all completed tasks.</p>
                </div>
                
                <div className="flex flex-wrap justify-center lg:justify-start gap-8">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <FileText size={14} className="text-primary-500" /> Assignment Average
                    </span>
                    <p className="text-xl font-extrabold text-slate-800">
                      {Math.round(finalGrade?.assignmentAverage || 0)}% 
                      <span className="text-xs font-semibold text-slate-400 ml-1.5">({weights?.assignmentWeight || 60}% weight)</span>
                    </p>
                  </div>
                  <div className="w-px h-10 bg-slate-100 hidden lg:block" />
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <Activity size={14} className="text-primary-500" /> Quiz Average
                    </span>
                    <p className="text-xl font-extrabold text-slate-800">
                      {Math.round(finalGrade?.quizAverage || 0)}%
                      <span className="text-xs font-semibold text-slate-400 ml-1.5">({weights?.quizWeight || 40}% weight)</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* standing label */}
              <div className={`px-10 py-6 rounded-2xl border-2 text-center min-w-[200px] transition-all duration-500 ${getGradeColor(finalGrade?.finalPercentage || 0)}`}>
                <p className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-85">Academic Standing</p>
                <p className="text-2xl font-extrabold uppercase tracking-tight leading-none mb-1">
                  {getGradeText(finalGrade?.finalPercentage || 0)}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-3 text-[9px] font-black uppercase tracking-wider opacity-75">
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  Updated Just Now
                </div>
              </div>
            </div>
          </motion.div>

          {/* Student Grade Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Grade Details</h3>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Individual assessment items</p>
              </div>
              <div className="text-primary-600 text-[10px] font-black uppercase tracking-wider bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm">
                {myGrades.length} Graded Items
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Assessment Name</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Type</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Score Achieved</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Percentage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myGrades.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100 text-slate-300 shadow-inner">
                          <BookOpen size={24} />
                        </div>
                        <p className="text-slate-400 font-bold text-sm">No grades have been posted for you in this course yet.</p>
                      </td>
                    </tr>
                  ) : myGrades.map((g, idx) => {
                    const p = Math.round((g.score / g.maxScore) * 100);
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                        key={g._id} className="hover:bg-slate-50/40 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all border border-slate-100">
                              <HelpCircle size={16} />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm tracking-tight group-hover:text-primary-600 transition-colors">{g.sourceId?.title || 'Assessment Item'}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{new Date(g.gradedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border shadow-sm ${
                            g.sourceType === 'quiz' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                          }`}>
                            {g.sourceType}
                          </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-800">{g.score}</span>
                            <span className="text-[9px] font-semibold text-slate-400">out of {g.maxScore}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <span className={`inline-block px-4 py-1.5 rounded-xl font-bold text-sm border shadow-sm ${getGradeColor(p)}`}>
                            {p}%
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* Teacher Support List */}
          <AnimatePresence>
            {atRisk.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98, y: 15 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-rose-50 border border-rose-200 rounded-3xl p-8 shadow-sm relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 p-8 text-rose-500/5 pointer-events-none group-hover:scale-105 transition-transform duration-1000">
                  <ShieldAlert size={140} />
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center gap-8 relative z-10">
                  <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-md shadow-rose-900/10 shrink-0 border-2 border-white/10">
                    <ShieldAlert size={28} />
                  </div>
                  <div className="flex-1 text-left space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-rose-900 tracking-tight">Academic Support Interventions</h3>
                      <p className="text-rose-700/80 font-medium text-sm">
                        Grade calculations have flagged <span className="font-extrabold text-rose-900 underline underline-offset-4">{atRisk.length} students</span> performing below 50% in the course.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {atRisk.map(s => (
                        <div 
                          key={s.student?._id} 
                          className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl border border-rose-200 flex items-center gap-3 shadow-sm"
                        >
                          <div className="w-7 h-7 rounded-lg bg-rose-600 text-white flex items-center justify-center font-extrabold text-xs shadow-sm">{s.student?.name?.charAt(0)}</div>
                          <div className="text-left">
                            <p className="text-[10px] font-black text-rose-900 uppercase tracking-widest">{s.student?.name}</p>
                            <p className="text-[9px] font-bold text-rose-600">{Math.round(s.finalPercentage || 0)}% Standing</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="btn bg-rose-600 text-white hover:bg-rose-700 px-6 h-12 text-xs font-bold shadow-md shrink-0 flex items-center gap-2">
                    <Mail size={16} /> Contact Students
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Instructor Analytics Section (Distribution BarChart) */}
          {loadingAnalytics ? (
            <div className="h-80 bg-white rounded-3xl border border-slate-200 animate-pulse flex items-center justify-center">
              <Loader2 size={32} className="animate-spin text-primary-500" />
            </div>
          ) : analytics && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Grade Distribution Chart */}
              <div className="lg:col-span-8 bg-white border border-slate-200 p-6 lg:p-8 rounded-3xl shadow-sm space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Grade Distribution</h3>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Breakdown of student standings</p>
                </div>
                
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={gradeDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip 
                        cursor={{ fill: '#f8fafc' }} 
                        contentStyle={{ background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} 
                        labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                      />
                      <Bar dataKey="count" radius={[8, 8, 0, 0]} maxBarSize={60}>
                        {gradeDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Academic Metrics Panel */}
              <div className="lg:col-span-4 bg-white border border-slate-200 p-6 lg:p-8 rounded-3xl shadow-sm flex flex-col justify-between space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Class Averages</h3>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Overall performance metrics</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Class Average Score</span>
                    <span className="text-lg font-extrabold text-slate-900">{Math.round(analytics.classAverage || 0)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Highest Score Recorded</span>
                    <span className="text-lg font-extrabold text-emerald-600">{Math.round(analytics.highestScore || 0)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lowest Score Recorded</span>
                    <span className="text-lg font-extrabold text-rose-600">{Math.round(analytics.lowestScore || 0)}%</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Syllabus Completion</span>
                    <span className="text-lg font-extrabold text-indigo-600">{Math.round(analytics.completionRate || 0)}%</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Quick Metrics Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
                  <TrendingUp size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Class Average</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {gradebook.length > 0 ? Math.round(gradebook.reduce((a,b)=>a+b.finalPercentage,0)/gradebook.length) : 0}%
                  </p>
                </div>
                <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${gradebook.length > 0 ? Math.round(gradebook.reduce((a,b)=>a+b.finalPercentage,0)/gradebook.length) : 0}%` }} />
                </div>
             </div>
             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <ShieldCheck size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessments Count</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {gradeData?.weights ? 2 : 0} Grade Areas
                  </p>
                </div>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-md inline-block">Active Calculations</p>
             </div>
             <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <User size={18} />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Students</p>
                  <p className="text-2xl font-extrabold text-slate-900">
                    {gradebook.length} Enrolled
                  </p>
                </div>
                <p className="text-[9px] font-black text-amber-600 uppercase tracking-widest bg-amber-50 px-2.5 py-0.5 rounded-md inline-block">Syllabus Roster</p>
             </div>
          </div>

          {/* Teacher Gradebook Table */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/30">
              <div className="space-y-0.5">
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Class Gradebook</h3>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Detailed grades per student</p>
              </div>
              <div className="relative group flex-1 max-w-xs">
                 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                 <input 
                   placeholder="Search student..." 
                   className="w-full h-10 pl-10 pr-4 rounded-xl bg-white border border-slate-200 text-xs font-bold outline-none focus:border-primary-500 transition-all"
                   value={searchQuery}
                   onChange={e => setSearchQuery(e.target.value)}
                 />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Student Name</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Assignment Avg</th>
                    <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Quiz Avg</th>
                    <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">Overall Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGradebook.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-16 text-center">
                        <p className="text-slate-400 font-bold text-sm">No grades matching filter rules.</p>
                      </td>
                    </tr>
                  ) : filteredGradebook.map((entry, idx) => {
                    const fp = Math.round(entry.finalPercentage || 0);
                    return (
                      <motion.tr 
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                        key={entry.student?._id} className="hover:bg-slate-50/40 transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-700 flex items-center justify-center font-bold text-sm border border-primary-100 group-hover:bg-primary-500 group-hover:text-white transition-all duration-500">
                              {entry.student?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-sm leading-tight group-hover:text-primary-600 transition-colors">{entry.student?.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{entry.student?.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-slate-700">{Math.round(entry.assignmentAverage || 0)}%</span>
                        </td>
                        <td className="px-6 py-5">
                          <span className="text-sm font-bold text-slate-700">{Math.round(entry.quizAverage || 0)}%</span>
                        </td>
                        <td className="px-6 py-5 text-right">
                           <div className="inline-flex items-center gap-4">
                              <span className={`px-4 py-1.5 rounded-xl font-bold text-sm border shadow-sm ${getGradeColor(fp)}`}>
                                {fp}%
                              </span>
                              <button aria-label="Access student profile" className="w-9 h-9 rounded-xl bg-slate-50 text-slate-300 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center border border-slate-100 active:scale-90">
                                <ArrowUpRight size={16} />
                              </button>
                           </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PieChartIcon({ size = 20, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
      <path d="M22 12A10 10 0 0 0 12 2v10z" />
    </svg>
  );
}
