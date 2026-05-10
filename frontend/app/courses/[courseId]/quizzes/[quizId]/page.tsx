'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api/axiosInstance';
import ImmersiveQuizPlayer from '@/components/learning/ImmersiveQuizPlayer';
import { 
  Sparkles, Star, Clock, Play, Loader2, 
  CheckCircle2, Plus, Trash2, List, AlertCircle 
} from 'lucide-react';

interface Question {
  _id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string;
  marks: number;
}

interface Attempt {
  _id: string;
  status: 'in_progress' | 'completed';
  startedAt: string;
  score?: number;
  student?: {
    _id: string;
    name: string;
  };
}

export default function QuizDetailPage() {
  const { courseId, quizId } = useParams() as { courseId: string; quizId: string };
  const { user } = useAuth();
  const router = useRouter();
  
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [allAttempts, setAllAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showQForm, setShowQForm] = useState(false);
  const [addingQ, setAddingQ] = useState(false);
  
  const [qForm, setQForm] = useState({
    text: '',
    type: 'multiple_choice' as any,
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: 5
  });
  
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

  const showToast = (msg: string, type: string = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadData = useCallback(async () => {
    try {
      const qRes = await api.get(`/api/quizzes/${quizId}`);
      setQuiz(qRes.data.data);
      setQuestions(qRes.data.data?.questions || []);
      
      if (isStudent) {
        try {
          const aRes = await api.get(`/api/quizzes/${quizId}/my-attempt`);
          setAttempt(aRes.data.data);
        } catch {}
      }
      
      if (isTeacher) {
        try {
          const atRes = await api.get(`/api/quizzes/${quizId}/attempts`);
          setAllAttempts(atRes.data.data || []);
        } catch {}
      }
    } catch (err) {
      router.push(`/courses/${courseId}/quizzes`);
    } finally {
      setLoading(false);
    }
  }, [courseId, quizId, isStudent, isTeacher, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (!attempt || attempt.status !== 'in_progress' || !quiz) return;
    
    const deadline = new Date(attempt.startedAt).getTime() + quiz.duration * 60000;
    const tick = setInterval(() => {
      const left = Math.max(0, deadline - Date.now());
      setTimeLeft(left);
      if (left === 0) {
        clearInterval(tick);
        handleFinalSubmit({}); // Auto-submit empty if needed
      }
    }, 1000);
    
    return () => clearInterval(tick);
  }, [attempt, quiz]);

  const handleStart = async () => {
    setStarting(true);
    try {
      const res = await api.post(`/api/quizzes/${quizId}/start`);
      setAttempt(res.data.data);
      showToast('Assessment environment initialized.');
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Could not start quiz.', 'error');
    } finally {
      setStarting(false);
    }
  };

  const handleFinalSubmit = async (answers: Record<string, string>) => {
    setSubmitting(true);
    try {
      const answersArr = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      const res = await api.post(`/api/quizzes/${quizId}/submit`, { answers: answersArr });
      setAttempt(res.data.data);
      showToast('Assessment submitted successfully!');
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Submission failed.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingQ(true);
    try {
      const payload: any = { ...qForm, marks: parseInt(qForm.marks.toString()), order: questions.length + 1 };
      if (qForm.type === 'multiple_choice') payload.options = qForm.options.filter(o => o.trim());
      else delete payload.options;
      
      const res = await api.post(`/api/quizzes/${quizId}/questions`, payload);
      setQuestions(p => [...p, res.data.data]);
      setShowQForm(false);
      showToast('Question integrated successfully!');
    } catch (e: any) {
      showToast(e.response?.data?.message || 'Failed to add question.', 'error');
    } finally {
      setAddingQ(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
      <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
    </div>
  );

  // STUDENT — ACTIVE MODE
  if (isStudent && attempt?.status === 'in_progress') {
    return (
      <ImmersiveQuizPlayer 
        quiz={quiz} 
        questions={questions} 
        attempt={attempt} 
        onSubmit={handleFinalSubmit}
        timeLeft={timeLeft}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
          
          <AnimatePresence>
            {toast && (
              <motion.div 
                initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }}
                className={`fixed top-12 left-1/2 z-[100] px-8 py-4 rounded-2xl font-black shadow-2xl border flex items-center gap-3 ${
                  toast.type === 'error' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle2 size={20} />}
                {toast.msg}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            <div className="lg:col-span-8 space-y-12">
              {/* Header section */}
              <section className="bg-white rounded-[48px] border border-slate-100 p-12 shadow-sm relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                      <Sparkles size={14} /> Academic Assessment
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6">{quiz?.title}</h1>
                    <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl mb-10">
                      {quiz?.description || 'Strategic academic evaluation module designed to measure core competency proficiency.'}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <MetaBadge icon={<Star size={14} />} label={`${quiz?.totalMarks} Marks Available`} />
                      <MetaBadge icon={<Clock size={14} />} label={`${quiz?.duration} Minutes Duration`} />
                    </div>
                 </div>
              </section>

              {/* Student View: Launchpad or Results */}
              {isStudent && (
                <>
                  {!attempt ? (
                    <section className="bg-slate-900 rounded-[48px] p-16 text-center text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden">
                       <div className="absolute inset-0 bg-blue-600/10" />
                       <div className="relative z-10 max-w-md mx-auto">
                          <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-10 backdrop-blur-xl border border-white/10">
                             <Play size={40} className="text-white fill-white ml-2" />
                          </div>
                          <h2 className="text-3xl font-black tracking-tight mb-4">Initialize Arena.</h2>
                          <p className="text-slate-400 font-medium mb-12">
                            The environment is ready. Once initialized, the timer will begin. Ensure your academic workspace is prepared.
                          </p>
                          <button
                            onClick={handleStart}
                            disabled={starting}
                            className="w-full h-18 bg-blue-600 text-white rounded-3xl font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-4 uppercase tracking-[0.2em]"
                          >
                            {starting ? <Loader2 className="animate-spin" /> : 'Start Assessment'}
                          </button>
                       </div>
                    </section>
                  ) : (
                    <section className="bg-white rounded-[48px] border border-slate-100 p-12 shadow-sm text-center">
                       <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[28px] flex items-center justify-center mx-auto mb-8">
                          <CheckCircle2 size={40} />
                       </div>
                       <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">Evaluation Archived.</h2>
                       <p className="text-slate-500 font-medium mb-12">Your responses have been successfully submitted for final review.</p>
                       <div className="bg-slate-50 rounded-[40px] p-10 max-w-sm mx-auto">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Final Score</p>
                          <p className="text-6xl font-black text-slate-900 tracking-tighter">
                            {attempt.score !== undefined ? attempt.score : '--'}
                            <span className="text-2xl text-slate-400 ml-2">/ {quiz?.totalMarks}</span>
                          </p>
                          {attempt.score !== undefined && (
                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                               {Math.round((attempt.score / quiz?.totalMarks) * 100)}% Proficiency Reached
                            </div>
                          )}
                       </div>
                    </section>
                  )}
                </>
              )}

              {/* Teacher View: Question Management */}
              {isTeacher && (
                <section className="space-y-12">
                   <div className="flex items-center justify-between">
                      <div>
                         <h2 className="text-3xl font-black text-slate-900 tracking-tight">Intelligence Bank.</h2>
                         <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-1">{questions.length} Items Indexed</p>
                      </div>
                      <button 
                        onClick={() => setShowQForm(!showQForm)}
                        className="px-8 h-14 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all flex items-center gap-3"
                      >
                         <Plus size={18} /> Add Requirement
                      </button>
                   </div>

                   {showQForm && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] border-2 border-blue-100 p-10 shadow-2xl shadow-blue-900/5">
                         <form onSubmit={handleAddQuestion} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="md:col-span-2">
                                  <label htmlFor="q-text" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Instruction Text</label>
                                  <textarea 
                                    id="q-text"
                                    title="Question Text"
                                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 text-slate-900 font-medium focus:border-blue-600 outline-none transition-all resize-none" 
                                    rows={4} placeholder="What is the primary academic objective..."
                                    value={qForm.text} onChange={e => setQForm({...qForm, text: e.target.value})}
                                  />
                               </div>
                               <div>
                                  <label htmlFor="q-type" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Item Type</label>
                                  <select 
                                    id="q-type"
                                    title="Question Type"
                                    aria-label="Select the type of question"
                                    className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-bold outline-none focus:border-blue-600" 
                                    value={qForm.type} onChange={e => setQForm({...qForm, type: e.target.value as any})}
                                  >
                                     <option value="multiple_choice">Multiple Choice</option>
                                     <option value="true_false">True / False</option>
                                     <option value="short_answer">Short Answer</option>
                                  </select>
                               </div>
                               <div>
                                  <label htmlFor="q-marks" className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Marks Allocation</label>
                                  <input 
                                    id="q-marks"
                                    title="Marks for this question"
                                    type="number" className="w-full h-14 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 font-bold outline-none focus:border-blue-600" 
                                    value={qForm.marks} onChange={e => setQForm({...qForm, marks: parseInt(e.target.value)})} 
                                  />
                               </div>
                            </div>
                            <button type="submit" className="w-full h-16 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                               {addingQ ? <Loader2 className="animate-spin mx-auto" /> : 'Integrate Question'}
                            </button>
                         </form>
                      </motion.div>
                   )}

                   <div className="space-y-4">
                      {questions.map((q, idx) => (
                        <div key={q._id} className="bg-white rounded-[32px] border border-slate-100 p-8 flex items-start gap-6 hover:border-blue-200 transition-all group">
                           <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 font-black flex items-center justify-center text-sm group-hover:bg-blue-50 group-hover:text-blue-600 transition-all">
                              {idx + 1}
                           </div>
                           <div className="flex-1">
                              <h4 className="text-lg font-bold text-slate-900 leading-snug mb-3">{q.text}</h4>
                              <div className="flex gap-4">
                                 <span className="px-3 py-1 rounded-lg bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-500">{q.type.replace('_', ' ')}</span>
                                 <span className="px-3 py-1 rounded-lg bg-blue-50 text-[9px] font-black uppercase tracking-widest text-blue-600">{q.marks} Marks</span>
                              </div>
                           </div>
                           <button 
                             title="Delete Question"
                             aria-label="Delete question"
                             className="w-10 h-10 rounded-xl bg-slate-50 text-slate-300 flex items-center justify-center hover:bg-rose-50 hover:text-rose-600 transition-all"
                           >
                              <Trash2 size={18} />
                           </button>
                        </div>
                      ))}
                   </div>
                </section>
              )}
            </div>

            {/* Sidebar Controls */}
            <aside className="lg:col-span-4 space-y-8">
               <div className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-8">Technical Parameters</h3>
                  <div className="space-y-6">
                     <TechnicalRow icon={<List size={16} />} label="Total Items" value={questions.length} />
                     <TechnicalRow icon={<Clock size={16} />} label="Time Limit" value={`${quiz?.duration}m`} />
                     <TechnicalRow icon={<Star size={16} />} label="Max Score" value={quiz?.totalMarks} />
                     <TechnicalRow icon={<CheckCircle2 size={16} />} label="Status" value={quiz?.isPublished ? 'Live' : 'Draft'} color="text-emerald-500" />
                  </div>
               </div>

               {isTeacher && allAttempts.length > 0 && (
                  <div className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                     <h3 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-8 relative z-10">Live Performance</h3>
                     <div className="space-y-6 relative z-10">
                        {allAttempts.slice(0, 4).map(a => (
                           <div key={a._id} className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center text-xs font-black">
                                    {a.student?.name?.charAt(0)}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-sm font-bold truncate">{a.student?.name}</p>
                                    <p className="text-[10px] font-black text-slate-500 uppercase">{a.status}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <p className="text-sm font-black text-blue-400">{a.score ?? '--'}</p>
                                 <p className="text-[9px] font-black text-slate-600 tracking-tighter">/ {quiz?.totalMarks}</p>
                              </div>
                           </div>
                        ))}
                     </div>
                     <button className="w-full mt-10 py-4 rounded-2xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                        Audit Gradebook
                     </button>
                  </div>
               )}
            </aside>

          </div>
          </div>
    </div>
  );
}

function MetaBadge({ icon, label }: any) {
  return (
    <div className="px-5 py-2.5 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 text-[11px] font-black uppercase tracking-widest shadow-sm flex items-center gap-3">
      <div className="text-blue-600">{icon}</div>
      {label}
    </div>
  );
}

function TechnicalRow({ icon, label, value, color }: any) {
  return (
    <div className="flex items-center justify-between py-2">
       <div className="flex items-center gap-3 text-slate-400">
          {icon}
          <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
       </div>
       <span className={`text-sm font-black ${color || 'text-slate-900'}`}>{value}</span>
    </div>
  );
}

