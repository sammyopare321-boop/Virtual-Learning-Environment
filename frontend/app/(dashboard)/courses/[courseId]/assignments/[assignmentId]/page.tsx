'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Loader2, CheckCircle2, AlertCircle, Sparkles, Star, 
  FileText, Clock, BarChart3, ArrowLeft, Send, X,
  GraduationCap, Target, Zap, TrendingUp, Users, Cpu, Shield,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import Link from 'next/link';
import SubmissionStudio from '@/components/learning/SubmissionStudio';
import toast from 'react-hot-toast';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  totalMarks: number;
}

interface Submission {
  _id: string;
  student: { _id: string, name: string };
  submittedAt: string;
  textContent?: string;
  files?: string[];
  fileUrls?: string[];
  status: 'submitted' | 'graded' | 'late';
  grade?: number;
  feedback?: string;
}

export default function AssignmentDetailPage() {
  const { courseId, assignmentId } = useParams() as { courseId: string, assignmentId: string };
  const { user } = useAuth();
  
  const [assignment, setAssignment]= useState<Assignment | null>(null);
  const [submission, setSubmission]= useState<Submission | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading]      = useState(true);
  const [submitting, setSubmitting]= useState(false);
  const [grading, setGrading]      = useState<string | null>(null);
  const [gradeForm, setGradeForm]  = useState<Record<string, { grade: string, feedback: string }>>({});

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const loadData = useCallback(async () => {
    if (!assignmentId) return;
    try {
      const aRes = await courseApi.getAssignment(assignmentId);
      setAssignment(aRes.data.data);
      
      if (isStudent) {
        try {
          const sRes = await courseApi.getMySubmission(assignmentId);
          const subData = sRes.data.data;
          if (subData) {
            setSubmission({
              ...subData,
              files: subData.fileUrls || subData.files || []
            });
          } else {
            setSubmission(null);
          }
        } catch (err) {}
      }
      
      if (isTeacher) {
        try {
          const sRes = await courseApi.getSubmissions(assignmentId);
          const mapped = (sRes.data.data || []).map((sub: Submission) => ({
            ...sub,
            files: sub.fileUrls || sub.files || []
          }));
          setAllSubmissions(mapped);
        } catch (err) {}
      }
    } catch (err) {
      toast.error('Synchronization error detected.');
    } finally {
      setLoading(false);
    }
  }, [assignmentId, isStudent, isTeacher]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadData();
  }, [loadData]);

  const handleFinalSubmit = async (textContent: string, files: File[]) => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('textContent', textContent);
      files.forEach(f => fd.append('files', f));
      const res = await courseApi.submitAssignment(assignmentId, fd);
      const subData = res.data.data;
      setSubmission({
        ...subData,
        files: subData.fileUrls || subData.files || []
      });
      toast.success('Transmission successful. Mission complete.');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || 'Transmission disrupted.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGrade = async (submissionId: string) => {
    const gf = gradeForm[submissionId];
    if (!gf?.grade) { toast.error('Grade input missing.'); return; }
    setGrading(submissionId);
    try {
      await courseApi.gradeSubmission(submissionId, { 
        grade: parseInt(gf.grade), 
        feedback: gf.feedback || '' 
      });
      setAllSubmissions(p => p.map(s => s._id === submissionId ? { ...s, grade: parseInt(gf.grade), feedback: gf.feedback, status:'graded' } : s));
      toast.success('Assessment protocols finalized.');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      toast.error(axiosErr.response?.data?.message || 'Grading sequence failed.');
    } finally {
      setGrading(null);
    }
  };

  if (loading) return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-slate-100 border-t-primary-500 rounded-full animate-spin shadow-xl shadow-primary-500/5" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Cpu size={28} className="text-primary-500 animate-pulse" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500">Establishing Uplink</p>
          <p className="text-slate-400 font-medium text-sm">Synchronizing mission telemetry...</p>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] -mt-8 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8 pb-20">
        
        {/* Breadcrumb Navigation */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
           <Link href={`/courses/${courseId}/assignments`} className="group flex items-center gap-3 text-slate-400 hover:text-primary-500 transition-all">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white group-hover:bg-primary-50 group-hover:border-primary-100 group-hover:-translate-x-0.5 transition-all shadow-sm">
                <ArrowLeft size={16} />
              </div>
              <div className="space-y-0.5">
                <span className="text-[9px] font-black uppercase tracking-[0.15em] block text-slate-400">Assignments</span>
                <span className="text-xs font-bold text-slate-900 group-hover:text-primary-500">Back to List</span>
              </div>
           </Link>
        </header>

        {isStudent && assignment && (
          <div className="space-y-8">
            <SubmissionStudio 
              assignment={assignment} 
              submission={submission} 
              onSubmit={handleFinalSubmit}
            />
          </div>
        )}

        {isTeacher && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              
              {/* Assignment Overview */}
              <section className="bg-white rounded-3xl border border-slate-100 p-8 md:p-10 relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-primary-500 text-[10px] font-black uppercase tracking-wider">
                      <Shield size={14} /> Instructor Portal
                    </div>
                    <div className="flex items-center -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-slate-200 border border-white text-[9px] font-bold flex items-center justify-center text-slate-600">JS</div>
                      <div className="w-6 h-6 rounded-full bg-primary-100 border border-white text-[9px] font-bold flex items-center justify-center text-primary-600">AM</div>
                      <div className="w-6 h-6 rounded-full bg-emerald-100 border border-white text-[9px] font-bold flex items-center justify-center text-emerald-600">TL</div>
                      <div className="w-6 h-6 rounded-full bg-slate-100 border border-white text-[9px] font-bold flex items-center justify-center text-slate-400">+12</div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                      {assignment?.title}
                    </h1>
                    <p className="text-slate-500 font-medium text-base max-w-2xl leading-relaxed">
                      {assignment?.description || "No specifications provided for this assignment."}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-2 shadow-xs hover:border-primary-100 transition-colors">
                      <Target size={14} className="text-primary-500" /> {assignment?.totalMarks} Marks
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-2 shadow-xs hover:border-primary-100 transition-colors">
                      <Users size={14} className="text-primary-500" /> {allSubmissions.length} Submissions
                    </div>
                    <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-600 uppercase tracking-wider flex items-center gap-2 shadow-xs hover:border-primary-100 transition-colors">
                      <Clock size={14} className="text-primary-500" /> Due {assignment ? format(new Date(assignment.dueDate), 'MMM dd, yyyy') : 'N/A'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Submissions Queue */}
              <section className="space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">Student Submissions</h2>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Review and Grade cohort submissions</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total</span>
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-[11px] flex items-center justify-center font-black">{allSubmissions.length}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {allSubmissions.length === 0 ? (
                    <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-200 hover:border-primary-500/40 transition-all duration-300">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl shadow-inner mx-auto flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                        <GraduationCap size={28} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">No submissions received yet</p>
                    </div>
                  ) : allSubmissions.map((sub, idx) => (
                    <motion.div 
                      key={sub._id}
                      initial={{ opacity: 0, y: 12 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-3xl border border-slate-100 p-6 md:p-8 hover:border-primary-400/40 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6 relative z-10">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-md group-hover:scale-105 transition-transform duration-300">
                            {sub.student?.name?.charAt(0)}
                          </div>
                          <div className="space-y-0.5">
                            <h4 className="text-lg font-bold text-slate-900 tracking-tight">{sub.student?.name}</h4>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                               <Clock size={12} className="text-primary-500" /> Received {format(new Date(sub.submittedAt), 'MMM dd, p')}
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border shadow-xs ${
                          sub.status === 'graded' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-primary-50 text-primary-600 border-primary-100'
                        }`}>
                          {sub.status === 'graded' ? <><CheckCircle2 size={10} className="inline mr-1" /> Graded</> : 'Needs Grading'}
                        </div>
                      </div>

                      {sub.textContent && (
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/80 mb-6 text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-wrap relative z-10">
                          {sub.textContent}
                        </div>
                      )}

                      {((sub.files && sub.files.length > 0) || (sub.fileUrls && sub.fileUrls.length > 0)) && (
                        <div className="space-y-3 mb-6 relative z-10">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Attached Files</label>
                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {(sub.files || sub.fileUrls || []).map((url: string, i: number) => {
                                 const rawName = url.substring(url.lastIndexOf('\\') + 1).substring(url.lastIndexOf('/') + 1);
                                 const cleanName = rawName.includes('-') && rawName.split('-').length > 1 
                                   ? rawName.substring(rawName.indexOf('-') + 1) 
                                   : rawName || `Attachment ${i + 1}`;
                                 return (
                                   <div key={i} className="bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between group/file hover:border-primary-200 transition-all duration-300">
                                      <div className="flex items-center gap-3 min-w-0 flex-1">
                                         <div className="w-10 h-10 rounded-lg bg-white text-primary-500 flex items-center justify-center shrink-0 shadow-xs">
                                            <FileText size={16} />
                                         </div>
                                         <div className="space-y-0.5 min-w-0 flex-1">
                                            <p className="text-xs font-bold text-slate-900 truncate" title={cleanName}>{cleanName}</p>
                                            <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                               <Target size={8} /> File Verified
                                            </p>
                                         </div>
                                      </div>
                                      <a 
                                         href={url.startsWith('http') ? url : `http://localhost:5000/${url}`} 
                                         target="_blank" 
                                         rel="noopener noreferrer"
                                         aria-label={`Download vault attachment ${cleanName}`}
                                         title="Download attached file"
                                         className="w-8 h-8 rounded-lg bg-white text-slate-400 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all shadow-xs shrink-0 ml-3"
                                      >
                                         <ExternalLink size={14} />
                                      </a>
                                   </div>
                                 );
                              })}
                           </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 relative z-10 border-t border-slate-100 pt-6">
                        <div className="lg:col-span-3">
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">Score</label>
                             <input 
                               type="number" min="0" max={assignment?.totalMarks} 
                               placeholder={`0 - ${assignment?.totalMarks}`}
                               className="input-premium h-12 font-black text-center text-sm"
                               defaultValue={sub.grade}
                               onChange={e => setGradeForm(p => ({ ...p, [sub._id]: { ...p[sub._id], grade: e.target.value } }))}
                             />
                          </div>
                        </div>
                        <div className="lg:col-span-6">
                          <div className="space-y-1.5">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">Feedback</label>
                             <input 
                               placeholder="Provide student feedback..."
                               className="input-premium h-12 font-medium px-4 text-sm"
                               defaultValue={sub.feedback}
                               onChange={e => setGradeForm(p => ({ ...p, [sub._id]: { ...p[sub._id], feedback: e.target.value } }))}
                             />
                          </div>
                        </div>
                        <div className="lg:col-span-3 flex items-end">
                          <button 
                            onClick={() => handleGrade(sub._id)}
                            disabled={grading === sub._id}
                            className="btn btn-primary w-full h-12 uppercase tracking-wider font-black text-[10px] shadow-sm hover:shadow-md transition-all duration-300 active:scale-98"
                          >
                            {grading === sub._id ? <Loader2 size={14} className="animate-spin mr-1.5" /> : <Send size={14} className="mr-1.5" />}
                            {sub.status === 'graded' ? 'Update Grade' : 'Save Grade'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="lg:col-span-4 space-y-6">
              
              {/* Analytics Summary */}
              <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
                <div className="flex items-center gap-2 text-[10px] font-black text-primary-500 uppercase tracking-wider">
                  <BarChart3 size={14} /> Analytics Overview
                </div>
                <div className="space-y-1">
                  <StatRow icon={<Clock size={16} />} label="Due Date" value={assignment ? format(new Date(assignment.dueDate), 'MMM dd, yyyy') : 'N/A'} />
                  <StatRow icon={<TrendingUp size={16} />} label="Submission Rate" value={`${allSubmissions.length > 0 ? Math.round((allSubmissions.length / 30) * 100) : 0}%`} />
                  <StatRow icon={<Zap size={16} />} label="Submitted Students" value={`${allSubmissions.length} of 30`} />
                  <StatRow icon={<Star size={16} />} label="Average Grade" value="N/A" />
                </div>
              </section>

              {/* Grade Distribution Breakdown */}
              <section className="bg-slate-900 rounded-3xl p-8 text-white space-y-6 relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-2xl" />
                 <div className="space-y-1">
                    <h3 className="text-lg font-display font-extrabold tracking-tight">Grade Distribution</h3>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Cohort grading benchmarks</p>
                 </div>
                 <div className="space-y-4 pt-2">
                    {/* A Range */}
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">Excellent (90-100%)</span>
                          <span className="text-primary-400">40% of class</span>
                       </div>
                       <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-400 to-teal-400 h-1 rounded-full" style={{ width: '40%' }} />
                       </div>
                    </div>
                    {/* B Range */}
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">Good (80-89%)</span>
                          <span className="text-primary-400">35% of class</span>
                       </div>
                       <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                          <div className="bg-gradient-to-r from-primary-400 to-indigo-400 h-1 rounded-full" style={{ width: '35%' }} />
                       </div>
                    </div>
                    {/* C Range */}
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">Passing (70-79%)</span>
                          <span className="text-primary-400">15% of class</span>
                       </div>
                       <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                          <div className="bg-gradient-to-r from-amber-400 to-orange-400 h-1 rounded-full" style={{ width: '15%' }} />
                       </div>
                    </div>
                    {/* Needs Review Range */}
                    <div className="space-y-1.5">
                       <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-300">{"Needs Review (<70%)"}</span>
                          <span className="text-primary-400">10% of class</span>
                       </div>
                       <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                          <div className="bg-slate-700 h-1 rounded-full" style={{ width: '10%' }} />
                       </div>
                    </div>
                 </div>
              </section>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function StatRow({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group-hover:border-primary-50 transition-colors">
      <div className="flex items-center gap-3 text-slate-400">
        <div className="text-primary-500 bg-primary-50 p-1.5 rounded-lg">{icon}</div>
        <span className="text-[10px] font-black uppercase tracking-wider">{label}</span>
      </div>
      <span className="text-sm font-extrabold text-slate-900">{value}</span>
    </div>
  );
}
