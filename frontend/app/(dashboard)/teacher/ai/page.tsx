'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, FileText, Shield, Target, BookOpen, Zap,
  ChevronRight, X, Loader2, Copy, Download, CheckCircle2,
  ClipboardList, BarChart3, AlertTriangle, PenTool
} from 'lucide-react';
import toast from 'react-hot-toast';
import gradingApi from '@/utils/api/gradingApi';
import plagiarismApi from '@/utils/api/plagiarismApi';
import { aiApi } from '@/utils/api/aiApi';
import { courseApi } from '@/utils/api/courseApi';

// ─── Tool definitions ─────────────────────────────────────────────────────────

const tools = [
  {
    id: 'rubric',
    label: 'Generate Rubric',
    description: 'Auto-generate a grading rubric from an assignment description',
    icon: ClipboardList,
    color: 'bg-blue-50 text-blue-600 border-blue-100',
    badge: 'Grading',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'grade',
    label: 'AI Grader',
    description: 'Grade a student submission against a rubric with detailed feedback',
    icon: CheckCircle2,
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    badge: 'Grading',
    badgeColor: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'plagiarism',
    label: 'Plagiarism Check',
    description: 'Analyse a submission for plagiarism and writing inconsistencies',
    icon: Shield,
    color: 'bg-red-50 text-red-600 border-red-100',
    badge: 'Integrity',
    badgeColor: 'bg-red-100 text-red-700',
  },
  {
    id: 'outline',
    label: 'Course Outline',
    description: 'Generate a structured course outline from a title and description',
    icon: BookOpen,
    color: 'bg-violet-50 text-violet-600 border-violet-100',
    badge: 'Content',
    badgeColor: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'quiz',
    label: 'Quiz Questions',
    description: 'Generate quiz questions for any topic at any difficulty level',
    icon: PenTool,
    color: 'bg-amber-50 text-amber-600 border-amber-100',
    badge: 'Content',
    badgeColor: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'assignment',
    label: 'Assignment Prompt',
    description: 'Create a detailed assignment prompt with learning outcomes',
    icon: FileText,
    color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    badge: 'Content',
    badgeColor: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'feedback',
    label: 'Student Feedback',
    description: 'Generate personalised, constructive feedback for a student',
    icon: Target,
    color: 'bg-pink-50 text-pink-600 border-pink-100',
    badge: 'Grading',
    badgeColor: 'bg-pink-100 text-pink-700',
  },
  {
    id: 'lecture',
    label: 'Lecture Notes',
    description: 'Generate structured lecture notes for any topic',
    icon: BarChart3,
    color: 'bg-teal-50 text-teal-600 border-teal-100',
    badge: 'Content',
    badgeColor: 'bg-teal-100 text-teal-700',
  },
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function TeacherAIPage() {
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => { setActiveTool(null); setResult(null); };

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header */}
      <motion.section
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-violet-600 font-bold text-[10px] uppercase tracking-widest">
              <Sparkles size={14} /> AI Tools for Teachers
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Teacher AI Suite</h2>
            <p className="text-slate-500 font-medium text-sm">
              Generate content, grade submissions, detect plagiarism, and more — all powered by AI.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold">
              <Zap size={12} /> {tools.length} tools available
            </div>
          </div>
        </div>
      </motion.section>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool, idx) => {
          const Icon = tool.icon;
          return (
            <motion.button
              key={tool.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              onClick={() => { setActiveTool(tool.id); setResult(null); }}
              className="group text-left bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 hover:shadow-md transition-all"
            >
              <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center mb-4 ${tool.color}`}>
                <Icon size={20} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tool.badgeColor}`}>
                  {tool.badge}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-violet-600 transition-colors">
                {tool.label}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">{tool.description}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-violet-600 transition-colors">
                Open tool <ChevronRight size={12} />
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Tool Panel */}
      <AnimatePresence>
        {activeTool && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                {(() => {
                  const tool = tools.find(t => t.id === activeTool)!;
                  const Icon = tool.icon;
                  return (
                    <>
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${tool.color}`}>
                        <Icon size={17} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{tool.label}</h3>
                        <p className="text-xs text-slate-500">{tool.description}</p>
                      </div>
                    </>
                  );
                })()}
              </div>
              <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all">
                <X size={15} />
              </button>
            </div>

            <div className="p-6">
              {activeTool === 'rubric' && <RubricTool onResult={setResult} loading={loading} setLoading={setLoading} />}
              {activeTool === 'grade' && <GradeTool onResult={setResult} loading={loading} setLoading={setLoading} />}
              {activeTool === 'plagiarism' && <PlagiarismTool onResult={setResult} loading={loading} setLoading={setLoading} />}
              {activeTool === 'outline' && <OutlineTool onResult={setResult} loading={loading} setLoading={setLoading} />}
              {activeTool === 'quiz' && <QuizTool onResult={setResult} loading={loading} setLoading={setLoading} />}
              {activeTool === 'assignment' && <AssignmentTool onResult={setResult} loading={loading} setLoading={setLoading} />}
              {activeTool === 'feedback' && <FeedbackTool onResult={setResult} loading={loading} setLoading={setLoading} />}
              {activeTool === 'lecture' && <LectureTool onResult={setResult} loading={loading} setLoading={setLoading} />}

              {/* Result display */}
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-slate-50 rounded-2xl border border-slate-200 p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-widest">Result</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { navigator.clipboard.writeText(JSON.stringify(result, null, 2)); toast.success('Copied!'); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold transition-all"
                      >
                        <Copy size={12} /> Copy
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([JSON.stringify(result, null, 2)], { type: 'application/json' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a'); a.href = url; a.download = `ai-result-${activeTool}.json`; a.click();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold transition-all"
                      >
                        <Download size={12} /> Download
                      </button>
                    </div>
                  </div>
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap overflow-auto max-h-96 font-mono leading-relaxed">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Individual tool forms ────────────────────────────────────────────────────

function ToolForm({ fields, onSubmit, loading, submitLabel = 'Generate' }: {
  fields: Array<{ id: string; label: string; type?: string; placeholder?: string; rows?: number }>;
  onSubmit: (values: Record<string, string>) => void;
  loading: boolean;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>({});
  return (
    <form
      onSubmit={e => { e.preventDefault(); onSubmit(values); }}
      className="space-y-4"
    >
      {fields.map(f => (
        <div key={f.id}>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">{f.label}</label>
          {f.rows ? (
            <textarea
              rows={f.rows}
              placeholder={f.placeholder}
              value={values[f.id] || ''}
              onChange={e => setValues(p => ({ ...p, [f.id]: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-slate-800 resize-none transition-all"
            />
          ) : (
            <input
              type={f.type || 'text'}
              placeholder={f.placeholder}
              value={values[f.id] || ''}
              onChange={e => setValues(p => ({ ...p, [f.id]: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-slate-800 transition-all"
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
        {loading ? 'Generating...' : submitLabel}
      </button>
    </form>
  );
}

function RubricTool({ onResult, loading, setLoading }: any) {
  return (
    <ToolForm
      loading={loading}
      submitLabel="Generate Rubric"
      fields={[
        { id: 'assignmentDescription', label: 'Assignment Description', rows: 4, placeholder: 'Describe the assignment in detail...' },
        { id: 'totalPoints', label: 'Total Points', placeholder: '100' },
      ]}
      onSubmit={async (v) => {
        setLoading(true);
        try {
          const res = await gradingApi.generateRubric(v.assignmentDescription, Number(v.totalPoints) || 100);
          onResult(res.data);
        } catch { toast.error('Failed to generate rubric'); }
        finally { setLoading(false); }
      }}
    />
  );
}

function GradeTool({ onResult, loading, setLoading }: any) {
  return (
    <ToolForm
      loading={loading}
      submitLabel="Grade Submission"
      fields={[
        { id: 'submissionId', label: 'Submission ID', placeholder: 'MongoDB ObjectId of the submission' },
        { id: 'assignmentDescription', label: 'Assignment Description', rows: 3, placeholder: 'What was the assignment about?' },
        { id: 'totalPoints', label: 'Total Points', placeholder: '100' },
      ]}
      onSubmit={async (v) => {
        setLoading(true);
        try {
          const rubric = await gradingApi.generateRubric(v.assignmentDescription, Number(v.totalPoints) || 100);
          const res = await gradingApi.gradeSubmission(v.submissionId, rubric.data?.criteria || [], Number(v.totalPoints) || 100, v.assignmentDescription);
          onResult(res.data);
        } catch { toast.error('Failed to grade submission'); }
        finally { setLoading(false); }
      }}
    />
  );
}

function PlagiarismTool({ onResult, loading, setLoading }: any) {
  return (
    <ToolForm
      loading={loading}
      submitLabel="Check Plagiarism"
      fields={[
        { id: 'submissionId', label: 'Submission ID', placeholder: 'MongoDB ObjectId of the submission' },
      ]}
      onSubmit={async (v) => {
        setLoading(true);
        try {
          const res = await plagiarismApi.checkPlagiarism(v.submissionId);
          onResult(res.data);
        } catch { toast.error('Failed to check plagiarism'); }
        finally { setLoading(false); }
      }}
    />
  );
}

function OutlineTool({ onResult, loading, setLoading }: any) {
  const [created, setCreated] = useState<{ courseId: string; title: string } | null>(null);
  const [creating, setCreating] = useState(false);
  const [lastValues, setLastValues] = useState<Record<string, string>>({});
  const [courses, setCourses] = useState<{ _id: string; title: string; code: string }[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [saved, setSaved] = useState(false);

  // Load teacher's courses for the dropdown
  useEffect(() => {
    courseApi.getAll().then(res => {
      setCourses(res.data?.data || []);
    }).catch(() => {});
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await aiApi.createCourse(
        lastValues.courseTitle,
        lastValues.courseDescription,
        Number(lastValues.duration) || 12
      );
      const course = res.data?.data?.course;
      setCreated({ courseId: course._id, title: course.title });
      toast.success(`Course "${course.title}" created with ${res.data?.data?.modules?.length} modules!`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to create course');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Course selector — save outline to an existing course */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Save outline to existing course <span className="text-slate-400 font-normal">(optional)</span>
        </label>
        <select
          value={selectedCourseId}
          onChange={e => { setSelectedCourseId(e.target.value); setSaved(false); }}
          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none text-sm text-slate-800 bg-white transition-all"
        >
          <option value="">— Generate only, don't save to a course —</option>
          {courses.map(c => (
            <option key={c._id} value={c._id}>{c.title} ({c.code})</option>
          ))}
        </select>
        {selectedCourseId && (
          <p className="text-[11px] text-violet-600 font-semibold mt-1 px-1">
            ✓ Outline will be saved to this course and visible to enrolled students
          </p>
        )}
      </div>

      <ToolForm
        loading={loading}
        submitLabel="Generate Outline"
        fields={[
          { id: 'courseTitle', label: 'Course Title', placeholder: 'e.g. Introduction to Data Science' },
          { id: 'courseDescription', label: 'Course Description (optional)', rows: 3, placeholder: 'Brief description — leave blank to auto-generate' },
          { id: 'duration', label: 'Duration (weeks)', placeholder: '12' },
        ]}
        onSubmit={async (v) => {
          setLastValues(v);
          setCreated(null);
          setSaved(false);
          setLoading(true);
          try {
            const res = await aiApi.generateCourseOutline(
              v.courseTitle,
              v.courseDescription || `A course on ${v.courseTitle}`,
              Number(v.duration) || 12,
              selectedCourseId || undefined
            );
            onResult(res.data?.data);
            if (selectedCourseId) setSaved(true);
          } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed to generate outline'); }
          finally { setLoading(false); }
        }}
      />

      {/* Saved confirmation */}
      {saved && selectedCourseId && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-50 border border-violet-200 text-violet-800 text-sm font-medium">
          <CheckCircle2 size={16} className="text-violet-600 shrink-0" />
          <span>Outline saved to course — students can now see it.</span>
          <a
            href={`/courses/${selectedCourseId}/modules`}
            className="ml-auto text-violet-700 underline underline-offset-2 hover:text-violet-900 text-xs font-semibold"
          >
            View course →
          </a>
        </div>
      )}

      {/* Create brand-new course from outline */}
      {lastValues.courseTitle && !created && !selectedCourseId && (
        <button
          onClick={handleCreate}
          disabled={creating || loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all disabled:opacity-50"
        >
          {creating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          {creating ? 'Creating course...' : 'Create Course in LMS'}
        </button>
      )}

      {/* Success state after creating new course */}
      {created && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium">
          <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          <span>Course created!</span>
          <a
            href={`/courses/${created.courseId}/modules`}
            className="ml-auto text-emerald-700 underline underline-offset-2 hover:text-emerald-900 text-xs font-semibold"
          >
            Open course →
          </a>
        </div>
      )}
    </div>
  );
}

function QuizTool({ onResult, loading, setLoading }: any) {
  return (
    <ToolForm
      loading={loading}
      submitLabel="Generate Questions"
      fields={[
        { id: 'topic', label: 'Topic', placeholder: 'e.g. Photosynthesis, World War II, Recursion...' },
        { id: 'difficulty', label: 'Difficulty', placeholder: 'easy / medium / hard' },
        { id: 'count', label: 'Number of Questions', placeholder: '5' },
      ]}
      onSubmit={async (v) => {
        setLoading(true);
        try {
          const res = await aiApi.generateQuizQuestions(v.topic, v.difficulty || 'medium', Number(v.count) || 5);
          onResult(res.data?.data);
        } catch (e: any) { 
          const errorMsg = e?.response?.status === 403 
            ? 'Access denied. Only teachers can use this feature.' 
            : e?.response?.data?.message || 'Failed to generate questions';
          toast.error(errorMsg);
        }
        finally { setLoading(false); }
      }}
    />
  );
}

function AssignmentTool({ onResult, loading, setLoading }: any) {
  return (
    <ToolForm
      loading={loading}
      submitLabel="Generate Prompt"
      fields={[
        { id: 'topic', label: 'Topic', placeholder: 'e.g. Climate Change, Binary Trees...' },
        { id: 'learningOutcomes', label: 'Learning Outcomes (comma-separated)', placeholder: 'Understand X, Apply Y, Analyse Z' },
        { id: 'difficulty', label: 'Difficulty', placeholder: 'easy / medium / hard' },
      ]}
      onSubmit={async (v) => {
        setLoading(true);
        try {
          const outcomes = v.learningOutcomes.split(',').map((s: string) => s.trim()).filter(Boolean);
          const res = await aiApi.generateAssignmentPrompt(v.topic, outcomes, v.difficulty || 'medium');
          onResult(res.data?.data);
        } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed to generate assignment'); }
        finally { setLoading(false); }
      }}
    />
  );
}

function FeedbackTool({ onResult, loading, setLoading }: any) {
  return (
    <ToolForm
      loading={loading}
      submitLabel="Generate Feedback"
      fields={[
        { id: 'studentName', label: 'Student Name', placeholder: 'e.g. Alex Johnson' },
        { id: 'submissionContent', label: 'Submission Content', rows: 4, placeholder: 'Paste the student submission here...' },
        { id: 'rubricCriteria', label: 'Rubric Criteria', rows: 2, placeholder: 'e.g. Clarity, Accuracy, Depth of analysis' },
        { id: 'score', label: 'Score', placeholder: 'e.g. 78' },
      ]}
      onSubmit={async (v) => {
        setLoading(true);
        try {
          const res = await aiApi.generateStudentFeedback(v.submissionContent, v.rubricCriteria, Number(v.score));
          onResult(res.data?.data);
        } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed to generate feedback'); }
        finally { setLoading(false); }
      }}
    />
  );
}

function LectureTool({ onResult, loading, setLoading }: any) {
  return (
    <ToolForm
      loading={loading}
      submitLabel="Generate Notes"
      fields={[
        { id: 'topic', label: 'Topic', placeholder: 'e.g. Introduction to Machine Learning' },
        { id: 'subtopics', label: 'Subtopics (comma-separated, optional)', placeholder: 'Supervised learning, Neural networks, Overfitting' },
      ]}
      onSubmit={async (v) => {
        setLoading(true);
        try {
          const subtopics = v.subtopics ? v.subtopics.split(',').map((s: string) => s.trim()).filter(Boolean) : [];
          const res = await aiApi.generateLectureNotes(v.topic, subtopics);
          onResult(res.data?.data);
        } catch (e: any) { toast.error(e?.response?.data?.message || 'Failed to generate lecture notes'); }
        finally { setLoading(false); }
      }}
    />
  );
}
