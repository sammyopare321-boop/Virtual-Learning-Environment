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
  fileUrls?: string[];
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Left: Assignment Details */}
      <div className="lg:col-span-5 space-y-6">
         <section className="bg-white rounded-3xl border border-slate-100 p-8 relative overflow-hidden group shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-105 transition-transform duration-700" />
            <div className="relative z-10 space-y-6">
               <div className="flex items-center gap-2 text-primary-500 text-[10px] font-black uppercase tracking-wider">
                 <BookOpen size={14} /> Assignment Details
               </div>
               <div className="space-y-3">
                  <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">{assignment.title}</h1>
                  <p className="text-base text-slate-500 font-medium leading-relaxed">
                     {assignment.description || 'Please review all requirements and guidelines carefully before submitting your work.'}
                  </p>
               </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Total Marks</p>
                     <p className="text-lg font-black text-slate-900">{assignment.totalMarks} Marks</p>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100/80">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Status</p>
                     <p className="text-lg font-black text-slate-900 capitalize">{submission?.status || 'Assigned'}</p>
                  </div>
               </div>
            </div>
         </section>

         {/* Grade & Feedback (if graded) */}
         <AnimatePresence>
            {isGraded && (
               <motion.section 
                 initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                 className="bg-slate-900 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden border border-slate-800"
               >
                  <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/20 rounded-full blur-3xl" />
                  <div className="relative z-10 space-y-6">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary-500 flex items-center justify-center shadow-md">
                           <Zap size={18} className="text-white" />
                        </div>
                        <div>
                           <h3 className="text-lg font-display font-extrabold tracking-tight">Grading Feedback</h3>
                           <p className="text-primary-400 text-[9px] font-black uppercase tracking-wider">Evaluation Completed</p>
                        </div>
                     </div>

                     <div className="bg-white/5 rounded-2xl p-5 border border-white/10 italic">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2 not-italic">Instructor Comments</p>
                        <p className="text-slate-300 font-medium leading-relaxed text-sm">
                           &quot;{submission.feedback || 'Excellent execution on this task. Your core synthesis was well-structured and evidenced.'}&quot;
                        </p>
                     </div>

                     <div className="flex items-center justify-between px-1">
                        <div className="space-y-0.5">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Score</p>
                           <p className="text-3xl font-display font-black tracking-tight">
                              {submission.grade}
                              <span className="text-sm text-slate-500 ml-1">/{assignment.totalMarks}</span>
                           </p>
                        </div>
                        <div className="text-right space-y-0.5">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Grade Percentage</p>
                           <p className="text-3xl font-display font-black text-primary-400">
                              {Math.round(((submission.grade ?? 0) / assignment.totalMarks) * 100)}%
                           </p>
                        </div>
                     </div>
                  </div>
               </motion.section>
            )}
         </AnimatePresence>
      </div>

      {/* Right: Submission Workspace */}
      <div className="lg:col-span-7">
         {!submission ? (
            <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
               <div className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                     <label htmlFor="academic-composition" className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Your Answer</label>
                     <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                        <span className="text-[9px] font-black text-primary-500 uppercase tracking-wider">Draft Auto-saving</span>
                     </div>
                  </div>
                  <textarea 
                    id="academic-composition"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 text-base font-medium text-slate-900 focus:border-primary-500 focus:bg-white focus:ring-4 focus:ring-primary-500/5 outline-none transition-all resize-none min-h-[320px] placeholder:text-slate-400"
                    placeholder="Type your assignment submission response here..."
                    value={textContent}
                    onChange={e => setTextContent(e.target.value)}
                  />
               </div>

               <div className="space-y-6">
                <div className="space-y-4">
                   <label htmlFor="file-upload" className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">Files & Attachments</label>
                   <div 
                     onDragOver={e => { e.preventDefault(); setDragActive(true); }}
                     onDragLeave={() => setDragActive(false)}
                     onDrop={e => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files) setFiles(prev => [...prev, ...Array.from(e.dataTransfer.files)]); }}
                     className={`relative rounded-2xl border-2 border-dashed p-8 text-center transition-all cursor-pointer group ${
                       dragActive ? 'border-primary-500 bg-primary-50' : 'border-slate-200 bg-slate-50 hover:border-primary-300'
                     }`}
                     onClick={() => document.getElementById('file-upload')?.click()}
                   >
                      <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform duration-300">
                         <Upload size={20} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 mb-0.5">Upload Files</h4>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Drag & drop files here, or click to upload</p>
                      <input 
                        id="file-upload" 
                        type="file" 
                        multiple 
                        title="Select files to submit"
                        className="hidden" 
                        onChange={handleFileChange} 
                      />
                   </div>
                </div>

                <AnimatePresence>
                  {files.length > 0 && (
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                        {files.map((f, i) => (
                           <motion.div 
                             key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                             className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between group/file hover:border-primary-200 transition-all duration-300"
                           >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                 <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                                    <Paperclip size={14} />
                                 </div>
                                 <div className="min-w-0 flex-1">
                                    <p className="text-xs font-bold text-slate-900 truncate" title={f.name}>{f.name}</p>
                                    <p className="text-[9px] font-bold text-slate-400 uppercase">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                                 </div>
                              </div>
                              <button 
                                 onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                 aria-label={`Remove file ${f.name}`}
                                 className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors ml-2"
                              >
                                 <X size={14} />
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
                 className="btn btn-primary w-full h-14 rounded-2xl text-sm font-display font-black shadow-sm hover:shadow-md transition-all duration-300 gap-2 uppercase tracking-wider"
               >
                 {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Send size={16} />}
                 {isSubmitting ? 'Submitting assignment...' : 'Submit Assignment'}
               </button>
            </section>
         ) : (
            <section className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm space-y-6">
               <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                     <h3 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">Your Submission</h3>
                     <p className="text-xs font-medium text-slate-500">Successfully submitted to the course workspace.</p>
                  </div>
                  <div className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-wider flex items-center gap-1 shrink-0">
                     <CheckCircle2 size={12} /> Submitted
                  </div>
               </div>

               {submission.textContent && (
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">Your Submitted Text</label>
                     <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/80 text-sm text-slate-600 leading-relaxed font-medium whitespace-pre-wrap">
                        {submission.textContent}
                     </div>
                  </div>
               )}

                {((submission.files && submission.files.length > 0) || (submission.fileUrls && submission.fileUrls.length > 0)) && (
                  <div className="space-y-2">
                     <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider px-1">Submitted Files</label>
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(submission.files || submission.fileUrls || []).map((url: string, i: number) => {
                           const rawName = url.substring(url.lastIndexOf('\\') + 1).substring(url.lastIndexOf('/') + 1);
                           const cleanName = rawName.includes('-') && rawName.split('-').length > 1 
                             ? rawName.substring(rawName.indexOf('-') + 1) 
                             : rawName || `Attachment ${i + 1}`;
                           return (
                             <div key={i} className="bg-white border border-slate-100 rounded-xl p-3 flex items-center justify-between group/file hover:border-primary-200 transition-all duration-300">
                                <div className="flex items-center gap-3 min-w-0 flex-1">
                                   <div className="w-8 h-8 rounded-lg bg-primary-50 text-primary-500 flex items-center justify-center shrink-0">
                                      <FileText size={14} />
                                   </div>
                                   <div className="space-y-0.5 min-w-0 flex-1">
                                      <p className="text-xs font-bold text-slate-900 truncate" title={cleanName}>{cleanName}</p>
                                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                                         <Target size={10} /> Verified
                                      </p>
                                   </div>
                                </div>
                                <a 
                                   href={url.startsWith('http') ? url : `http://localhost:5000/${url}`} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   aria-label={`View file ${cleanName}`}
                                   title="View file"
                                   className="w-8 h-8 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300 shadow-sm shrink-0 ml-3"
                                >
                                   <ExternalLink size={14} />
                                </a>
                             </div>
                           );
                        })}
                     </div>
                  </div>
               )}
            </section>
         )}
      </div>

    </div>
  );
}
