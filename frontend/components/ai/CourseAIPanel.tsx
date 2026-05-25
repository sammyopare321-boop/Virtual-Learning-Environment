'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, X, Loader2, Copy, ChevronDown, ChevronUp,
  PenTool, FileText, BookOpen, MessageSquare, Zap, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { aiApi } from '@/utils/api/aiApi';

type Mode = 'quiz' | 'assignment' | 'outline' | 'feedback' | 'lecture';

interface ModeConfig {
  label: string;
  icon: React.ElementType;
  color: string;
  placeholder: string;
  description: string;
}

const modes: Record<Mode, ModeConfig> = {
  quiz: {
    label: 'Quiz Questions',
    icon: PenTool,
    color: 'text-violet-600 bg-violet-50 border-violet-100',
    placeholder: 'e.g. Photosynthesis, World War II, Recursion...',
    description: 'Generate multiple-choice questions for any topic',
  },
  assignment: {
    label: 'Assignment Prompt',
    icon: FileText,
    color: 'text-blue-600 bg-blue-50 border-blue-100',
    placeholder: 'e.g. Climate Change, Binary Trees, Shakespeare...',
    description: 'Create a detailed assignment with rubric',
  },
  outline: {
    label: 'Course Outline',
    icon: BookOpen,
    color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
    placeholder: 'e.g. Introduction to Data Science',
    description: 'Generate a structured weekly course outline',
  },
  feedback: {
    label: 'Student Feedback',
    icon: MessageSquare,
    color: 'text-amber-600 bg-amber-50 border-amber-100',
    placeholder: 'Paste student submission here...',
    description: 'Generate constructive feedback for a submission',
  },
  lecture: {
    label: 'Lecture Notes',
    icon: Zap,
    color: 'text-pink-600 bg-pink-50 border-pink-100',
    placeholder: 'e.g. Introduction to Machine Learning',
    description: 'Generate structured lecture notes',
  },
};

interface CourseAIPanelProps {
  defaultMode?: Mode;
  courseTitle?: string;
}

export default function CourseAIPanel({ defaultMode = 'quiz', courseTitle }: CourseAIPanelProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [topic, setTopic] = useState('');
  const [extra, setExtra] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [resultExpanded, setResultExpanded] = useState(true);

  const cfg = modes[mode];

  const handleGenerate = async () => {
    if (!topic.trim()) { toast.error('Please enter a topic'); return; }
    setLoading(true);
    setResult(null);
    try {
      let res: any;
      switch (mode) {
        case 'quiz':
          res = await aiApi.generateQuizQuestions(topic, difficulty, count);
          setResult(res.data?.data);
          break;
        case 'assignment':
          res = await aiApi.generateAssignmentPrompt(
            topic,
            extra ? extra.split(',').map((s: string) => s.trim()).filter(Boolean) : ['Understand the topic', 'Apply concepts'],
            difficulty
          );
          setResult(res.data?.data);
          break;
        case 'outline':
          res = await aiApi.generateCourseOutline(topic, extra || courseTitle || topic, Number(count) || 12);
          setResult(res.data?.data);
          break;
        case 'feedback':
          res = await aiApi.generateStudentFeedback(topic, extra || 'Clarity, Accuracy, Depth', 75);
          setResult(res.data?.data);
          break;
        case 'lecture':
          res = await aiApi.generateLectureNotes(
            topic,
            extra ? extra.split(',').map((s: string) => s.trim()).filter(Boolean) : []
          );
          setResult(res.data?.data ?? res.data);
          break;
      }
      toast.success('Generated successfully');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Generation failed — check your API key');
    } finally {
      setLoading(false);
    }
  };

  const copyResult = () => {
    const text = typeof result === 'string' ? result : JSON.stringify(result, null, 2);
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm shadow-xl shadow-violet-600/30 transition-all hover:scale-105 active:scale-95"
      >
        <Sparkles size={16} />
        AI Assistant
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />

            {/* Slide-in panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-[420px] bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-violet-50 to-indigo-50 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-violet-600 flex items-center justify-center">
                    <Sparkles size={15} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">AI Assistant</p>
                    {courseTitle && <p className="text-xs text-slate-500 truncate max-w-[200px]">{courseTitle}</p>}
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Mode tabs */}
              <div className="flex gap-1 px-4 py-3 border-b border-slate-100 overflow-x-auto no-scrollbar shrink-0">
                {(Object.entries(modes) as [Mode, ModeConfig][]).map(([key, m]) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => { setMode(key); setResult(null); setTopic(''); setExtra(''); }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        mode === key
                          ? m.color + ' border-current'
                          : 'text-slate-500 bg-slate-50 border-slate-100 hover:border-slate-200'
                      }`}
                    >
                      <Icon size={12} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <p className="text-xs text-slate-500">{cfg.description}</p>

                {/* Topic input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {mode === 'feedback' ? 'Submission Content' : 'Topic'}
                  </label>
                  {mode === 'feedback' ? (
                    <textarea
                      rows={4}
                      placeholder={cfg.placeholder}
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm resize-none transition-all"
                    />
                  ) : (
                    <input
                      type="text"
                      placeholder={cfg.placeholder}
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all"
                    />
                  )}
                </div>

                {/* Extra field — context-dependent */}
                {mode === 'assignment' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Learning Outcomes (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Understand X, Apply Y, Analyse Z"
                      value={extra}
                      onChange={e => setExtra(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all"
                    />
                  </div>
                )}
                {mode === 'lecture' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Subtopics (optional, comma-separated)</label>
                    <input
                      type="text"
                      placeholder="Supervised learning, Neural networks..."
                      value={extra}
                      onChange={e => setExtra(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all"
                    />
                  </div>
                )}
                {mode === 'feedback' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Rubric Criteria</label>
                    <input
                      type="text"
                      placeholder="Clarity, Accuracy, Depth of analysis"
                      value={extra}
                      onChange={e => setExtra(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all"
                    />
                  </div>
                )}
                {mode === 'outline' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Duration (weeks)</label>
                    <input
                      type="number"
                      min={1}
                      max={52}
                      value={count}
                      onChange={e => setCount(Number(e.target.value))}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all"
                    />
                  </div>
                )}

                {/* Difficulty + count for quiz */}
                {mode === 'quiz' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={e => setDifficulty(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm bg-white transition-all"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">Questions</label>
                      <input
                        type="number"
                        min={1}
                        max={20}
                        value={count}
                        onChange={e => setCount(Math.min(20, Math.max(1, Number(e.target.value))))}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm transition-all"
                      />
                    </div>
                  </div>
                )}
                {mode === 'assignment' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={e => setDifficulty(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm bg-white transition-all"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                )}

                {/* Generate button */}
                <button
                  onClick={handleGenerate}
                  disabled={loading || !topic.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm transition-all disabled:opacity-50"
                >
                  {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                  {loading ? 'Generating...' : 'Generate'}
                </button>

                {/* Result */}
                {result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden"
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span className="text-xs font-bold text-slate-700">Result</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={copyResult}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold transition-all"
                        >
                          <Copy size={11} /> Copy
                        </button>
                        <button
                          onClick={() => setResultExpanded(p => !p)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-slate-600 transition-all"
                        >
                          {resultExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        </button>
                      </div>
                    </div>
                    {resultExpanded && (
                      <pre className="p-4 text-xs text-slate-700 whitespace-pre-wrap overflow-auto max-h-80 font-mono leading-relaxed">
                        {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                      </pre>
                    )}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
