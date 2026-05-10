'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, CheckCircle2, ChevronLeft, ChevronRight, 
  AlertCircle, Send, Loader2, Play, Info, Sparkles,
  Save, List, CheckSquare, MessageSquare, Timer
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuth } from '@/context/AuthContext';

interface Quiz {
  _id: string;
  title: string;
  description?: string;
}

interface Attempt {
  _id: string;
  startTime?: string;
  status?: string;
}

interface Question {
  _id: string;
  text: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  marks: number;
}

interface ImmersiveQuizPlayerProps {
  quiz: Quiz;
  questions: Question[];
  attempt: Attempt;
  onSubmit: (answers: Record<string, string>) => Promise<void>;
  timeLeft: number | null;
}

export default function ImmersiveQuizPlayer({ quiz, questions, attempt, onSubmit, timeLeft }: ImmersiveQuizPlayerProps) {
  const { user } = useAuth();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const currentQ = questions[currentIdx];
  const progress = ((currentIdx + 1) / questions.length) * 100;

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return `${m}:${String(s % 60).padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
    else setShowConfirm(true);
  };

  const handlePrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const setAnswer = (val: string) => {
    setAnswers(prev => ({ ...prev, [currentQ._id]: val }));
  };

  const submitFinal = async () => {
    setIsSubmitting(true);
    await onSubmit(answers);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      
      {/* Immersive Header */}
      <header className="h-24 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-50">
         <div className="flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
               <Timer size={24} />
            </div>
            <div>
               <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none mb-1">{quiz.title}</h1>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assessment in progress</p>
            </div>
         </div>

         <div className="flex items-center gap-8">
            {/* Navigation Matrix (Mini) */}
            <div className="hidden md:flex gap-1.5">
               {questions.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentIdx(i)}
                    title={`Go to Question ${i + 1}`}
                    aria-label={`Navigate to assessment question ${i + 1}`}
                    className={`w-8 h-2 rounded-full transition-all ${
                      i === currentIdx ? 'bg-blue-600 w-12' : answers[questions[i]._id] ? 'bg-blue-200' : 'bg-slate-100'
                    }`} 
                  />
               ))}
            </div>

            <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border-2 transition-all ${
              timeLeft && timeLeft < 300000 ? 'bg-rose-50 border-rose-200' : 'bg-blue-50 border-blue-200'
            }`}>
               <Clock size={18} className={timeLeft && timeLeft < 300000 ? 'text-rose-500' : 'text-blue-500'} />
               <span className={`text-2xl font-black font-mono leading-none ${
                 timeLeft && timeLeft < 300000 ? 'text-rose-600' : 'text-blue-600'
               }`}>
                 {timeLeft !== null ? formatTime(timeLeft) : '--:--'}
               </span>
            </div>
         </div>
      </header>

      {/* Progress Sentinel */}
      <div className="h-1.5 w-full bg-slate-100 overflow-hidden">
         <motion.div 
           className="h-full bg-blue-600" 
           initial={{ width: 0 }} 
           animate={{ width: `${progress}%` }} 
         />
      </div>

      {/* Main Focus Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-20 relative">
         <div className="max-w-3xl w-full">
            <AnimatePresence mode="wait">
               {!showConfirm ? (
                  <motion.div 
                    key={currentQ._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    className="space-y-12"
                  >
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                              Question {currentIdx + 1} of {questions.length}
                           </span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                              {currentQ.marks} Marks Available
                           </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight tracking-tight">
                           {currentQ.text}
                        </h2>
                     </div>

                     {/* Question Types */}
                     <div className="space-y-4">
                        {currentQ.type === 'multiple_choice' && (
                           <div className="grid grid-cols-1 gap-4">
                              {currentQ.options?.map((opt, i) => (
                                 <button
                                   key={i}
                                   onClick={() => setAnswer(String(i))}
                                   className={`flex items-center gap-6 p-6 rounded-[28px] border-2 transition-all text-left group ${
                                     answers[currentQ._id] === String(i)
                                       ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/20'
                                       : 'bg-white border-slate-100 text-slate-600 hover:border-blue-200'
                                   }`}
                                 >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                                      answers[currentQ._id] === String(i) ? 'bg-white/20 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600'
                                    }`}>
                                       {String.fromCharCode(65 + i)}
                                    </div>
                                    <span className="text-lg font-bold">{opt}</span>
                                 </button>
                              ))}
                           </div>
                        )}

                        {currentQ.type === 'true_false' && (
                           <div className="flex flex-col sm:flex-row gap-6">
                              {['true', 'false'].map(val => (
                                 <button
                                   key={val}
                                   onClick={() => setAnswer(val)}
                                   className={`flex-1 flex flex-col items-center gap-6 p-10 rounded-[40px] border-2 transition-all uppercase tracking-[0.2em] font-black ${
                                     answers[currentQ._id] === val
                                       ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-600/20'
                                       : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'
                                   }`}
                                 >
                                    <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-2 ${
                                      answers[currentQ._id] === val ? 'bg-white/20' : 'bg-slate-50'
                                    }`}>
                                       {val === 'true' ? <CheckCircle2 size={32} /> : <XCircle size={32} />}
                                    </div>
                                    {val}
                                 </button>
                              ))}
                           </div>
                        )}

                        {currentQ.type === 'short_answer' && (
                           <div className="space-y-4">
                              <textarea
                                rows={8}
                                className="w-full bg-white border-2 border-slate-100 rounded-[32px] p-8 text-xl font-medium text-slate-900 focus:border-blue-600 transition-all outline-none resize-none shadow-xl shadow-slate-900/5"
                                placeholder="Begin typing your academic response..."
                                value={answers[currentQ._id] || ''}
                                onChange={e => setAnswer(e.target.value)}
                              />
                              <div className="flex justify-end px-4">
                                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {(answers[currentQ._id] || '').split(' ').filter(Boolean).length} Words Written
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Action Controls */}
                     <div className="pt-10 flex items-center justify-between gap-6">
                        <button 
                          onClick={handlePrev}
                          disabled={currentIdx === 0}
                          className="flex items-center gap-3 px-8 h-16 rounded-2xl bg-white border-2 border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:border-blue-100 hover:text-blue-600 transition-all disabled:opacity-0"
                        >
                           <ChevronLeft size={18} /> Previous Item
                        </button>
                        
                        <button 
                          onClick={handleNext}
                          className="flex items-center gap-3 px-10 h-16 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 group"
                        >
                           {currentIdx === questions.length - 1 ? 'Review & Submit' : 'Next Question'}
                           <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                     </div>
                  </motion.div>
               ) : (
                  <motion.div 
                    key="confirm"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-[40px] p-12 text-center border border-slate-100 shadow-2xl relative overflow-hidden"
                  >
                     <div className="absolute top-0 inset-x-0 h-2 bg-blue-600" />
                     <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
                        <Sparkles size={40} />
                     </div>
                     <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Readiness Check.</h3>
                     <p className="text-slate-500 font-medium text-lg max-w-sm mx-auto mb-12 leading-relaxed">
                        You have addressed {Object.keys(answers).length} out of {questions.length} items. Do you wish to submit your evaluation now?
                     </p>
                     
                     <div className="grid grid-cols-2 gap-4">
                        <button 
                          onClick={() => setShowConfirm(false)}
                          className="h-16 rounded-2xl bg-slate-100 text-slate-600 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all"
                        >
                           Go Back to Review
                        </button>
                        <button 
                          onClick={submitFinal}
                          disabled={isSubmitting}
                          className="h-16 rounded-2xl bg-blue-600 text-white font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                        >
                           {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                           Commit Submission
                        </button>
                     </div>
                  </motion.div>
               )}
            </AnimatePresence>
         </div>
      </main>

      {/* Footer Sentinel */}
      <footer className="h-20 bg-white border-t border-slate-100 px-10 flex items-center justify-between">
         <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Auto-Save Active</span>
         </div>
         <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            {user?.name} · ID #{user?._id?.slice(-6)}
         </div>
      </footer>

    </div>
  );
}

function XCircle({ size = 24, ...props }: React.SVGProps<SVGSVGElement> & { size?: number }) {
  return (
    <svg 
      {...props} 
      width={size} 
      height={size} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"/>
      <path d="m15 9-6 6"/>
      <path d="m9 9 6 6"/>
    </svg>
  );
}
