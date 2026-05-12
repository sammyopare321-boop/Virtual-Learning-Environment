'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, ChevronRight, Upload, 
  CheckCircle2, AlertCircle, Send, Loader2, 
  Paperclip, Trash2, Info, Sparkles, BookOpen,
  Download, MessageSquare, Star, BarChart3,
  ExternalLink, Zap, Target, X
} from 'lucide-react';
import { format } from 'date-fns';

interface Assignment {
  title: string;
  description?: string;
  totalMarks: number;
}

interface Submission {
  status: string;
  feedback?: string;
  grade?: number;
  textContent?: string;
  files?: string[];
}

interface SubmissionStudioProps {
  assignment: Assignment;
  submission: Submission | null;
  onSubmit: (textContent: string, files: File[]) => Promise<void>;
}

export default function SubmissionStudio({ assignment, submission, onSubmit }: SubmissionStudioProps) {
  const [textContent, setTextContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (idx: number) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const submitFinal = async () => {
    setIsSubmitting(true);
    await onSubmit(textContent, files);
    setIsSubmitting(false);
  };

  const isGraded = submission?.status === 'graded';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      
      {/* Left: Mission Brief */}
      <div className="lg:col-span-5 space-y-8">
         <section className="bg-white rounded-[40px] border border-slate-100 p-10 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10 space-y-8">
               <div className="flex items-center gap-3 text-primary-500 text-[10px] font-black uppercase tracking-[0.3em]">
                 <BookOpen size={14} /> Mission Brief
               </div>
               <div className="space-y-4">
                  <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-[1.1]">{assignment.title}</h1>
                  <p className="text-lg text-slate-500 font-medium leading-relaxed">
                     {assignment.description || 'This assignment requires a comprehensive academic response. Please review all instructions carefully before submitting.'}
                  </p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Yield</p>
                     <p className="text-xl font-black text-slate-900">{assignment.totalMarks} Pts</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current State</p>
                     <p className="text-xl font-black text-slate-900 capitalize">{submission?.status || 'Active'}</p>
                  </div>
               </div>
            </div>
         </section>

         {/* Intelligence Feedback (if graded) */}
         <AnimatePresence>
            {isGraded && (
               <motion.section 
                 initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                 className="bg-slate-900 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden border border-slate-800"
               >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center shadow-xl shadow-primary-500/20">
                           <Zap size={24} className="text-white" />
                        </div>
                        <div>
                           <h3 className="text-xl font-display font-extrabold tracking-tight">Performance Audit</h3>
                           <p className="text-primary-400 text-[10px] font-black uppercase tracking-widest">Assessment Finalized</p>
                        </div>
                     </div>

                     <div className="bg-white/5 rounded-3xl p-6 border border-white/10 italic">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 not-italic">Instructor Insights</p>
                        <p className="text-slate-300 font-medium leading-relaxed text-sm">
                           &quot;{submission.feedback || 'Excellent execution on this task. Your core synthesis was well-structured and evidenced.'}&quot;
                        </p>
                     </div>

                     <div className="flex items-center justify-between px-2">
                        <div className="space-y-1">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Yield</p>
                           <p className="text-4xl font-display font-black tracking-tighter">
                              {submission.grade}
                              <span className="text-lg text-slate-600 ml-1">/{assignment.totalMarks}</span>
                           </p>
                        </div>
                        <div className="text-right space-y-1">
                           <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Accuracy</p>
                           <p className="text-4xl font-display font-black text-primary-400">
                              {Math.round(((submission.grade ?? 0) / assignment.totalMarks) * 100)}%
                           </p>
                        </div>
                     </div>
                  </div>
               </motion.section>
            )}
         </AnimatePresence>
      </div>

      {/* Right: Workspace */}
      <div className="lg:col-span-7">
         {!submission ? (
            <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-10">
               <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                     <label htmlFor="academic-composition" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Academic Composition</label>
                     <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Workspace Sync Active</span>
                     </div>
                  </div>
                  <textarea 
                    id="academic-composition"
                    className="w-full bg-slate-50 border border-slate-100 rounded-[32px] p-8 text-lg font-medium text-slate-900 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none min-h-[400px]"
                    placeholder="Initialize your professional response drafting..."
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                  />
               </div>

               <div className="space-y-6">
                <div className="space-y-4">
                   <label htmlFor="file-upload" className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Resource Attachments</label>
                   <div 
                     onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                     onDragLeave={() => setDragActive(false)}
                     onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}
                     className={`relative rounded-[32px] border-2 border-dashed p-12 text-center transition-all cursor-pointer group ${
                       dragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-slate-50 hover:border-primary-300'
                     }`}
                     onClick={() => document.getElementById('file-upload')?.click()}
                   >
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                         <Upload size={24} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 mb-1">Drop Resources</h4>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Drag files or click to scan vault</p>
                      <input 
                        id="file-upload" 
                        type="file" 
                        multiple 
                        title="Select resource files for transmission"
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                   </div>
                </div>

                <AnimatePresence>
                  {files.length > 0 && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
                        {files.map((f, i) => (
                           <motion.div 
                             key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                             className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between group"
                           >
                              <div className="flex items-center gap-3 min-w-0">
                                 <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                                    <Paperclip size={16} />
                                 </div>
                                 <div className="min-w-0">
                                    <p className="text-xs font-bold text-slate-900 truncate">{f.name}</p>
                                    <p className="text-[9px] font-black text-slate-400 uppercase">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                 </div>
                              </div>
                              <button 
                                 onClick={() => removeFile(i)} 
                                 aria-label={`Remove file transmission ${f.name}`}
                                 className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                              >
                                 <X size={16} />
                              </button>
                           </motion.div>
                        ))}
                     </div>
                  )}
                </AnimatePresence>
               </div>

               <button
                 onClick={submitFinal}
                 disabled={isSubmitting || (!textContent && files.length === 0)}
                 className="btn btn-primary w-full h-20 rounded-[28px] text-xl font-display font-black shadow-xl shadow-primary-500/20 gap-4 uppercase tracking-[0.2em]"
               >
                 {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={24} />}
                 {isSubmitting ? 'Synchronizing Transmissions...' : 'Transmit Mission'}
               </button>
            </section>
         ) : (
            <section className="bg-white rounded-[40px] border border-slate-100 p-10 shadow-sm space-y-12">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <h3 className="text-2xl font-display font-extrabold text-slate-900 tracking-tight">Transmission Archive</h3>
                     <p className="text-sm font-medium text-slate-500">Resource successfully indexed in course vault.</p>
                  </div>
                  <div className="px-5 py-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <CheckCircle2 size={14} /> Encrypted & Stored
                  </div>
               </div>

               {submission.textContent && (
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Archived Composition</label>
                     <div className="bg-slate-50 rounded-[32px] p-10 border border-slate-100 text-lg text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                        {submission.textContent}
                     </div>
                  </div>
               )}

               {submission.files && submission.files.length > 0 && (
                  <div className="space-y-4">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Vault Attachments</label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {submission.files.map((url: string, i: number) => (
                           <div key={i} className="bg-white border border-slate-100 rounded-3xl p-6 flex items-center justify-between group hover:border-primary-200 transition-all">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center">
                                    <FileText size={20} />
                                 </div>
                                 <div className="space-y-0.5">
                                    <p className="text-sm font-bold text-slate-900">Attachment {i + 1}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                       <Target size={10} /> Verified
                                    </p>
                                 </div>
                              </div>
                              <a 
                                 href={url} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 aria-label={`Download vault attachment ${i + 1}`}
                                 title="Open in secure vault viewer"
                                 className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all shadow-sm"
                              >
                                 <ExternalLink size={16} />
                              </a>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </section>
         )}
      </div>

    </div>
  );
}
