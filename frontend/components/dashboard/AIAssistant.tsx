'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { aiApi } from '@/utils/api/aiApi';
import {
  Sparkles, BookOpen, HelpCircle, FileText, MessageSquare,
  Loader2, Copy, Download, X, ChevronRight, Zap, Brain
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AIAssistantProps {
  courseId?: string;
  onClose?: () => void;
}

type AssistantMode = 'menu' | 'outline' | 'quiz' | 'assignment' | 'notes' | 'feedback' | 'syllabus';

export default function AIAssistant({ courseId, onClose }: AIAssistantProps) {
  const [mode, setMode] = useState<AssistantMode>('menu');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Form states
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [duration, setDuration] = useState(12);
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [quizCount, setQuizCount] = useState(5);
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(['']);
  const [subtopics, setSubtopics] = useState<string[]>(['']);

  const handleGenerateOutline = async () => {
    if (!courseTitle || !courseDescription) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await aiApi.generateCourseOutline(courseTitle, courseDescription, duration);
      setResult(JSON.stringify(response.data.data, null, 2));
      toast.success('Course outline generated!');
    } catch (error) {
      toast.error('Failed to generate course outline');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateQuiz = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }
    setLoading(true);
    try {
      const response = await aiApi.generateQuizQuestions(topic, difficulty, quizCount);
      setResult(JSON.stringify(response.data.data, null, 2));
      toast.success('Quiz questions generated!');
    } catch (error) {
      toast.error('Failed to generate quiz questions');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAssignment = async () => {
    if (!topic || learningOutcomes.filter(o => o.trim()).length === 0) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await aiApi.generateAssignmentPrompt(
        topic,
        learningOutcomes.filter(o => o.trim()),
        difficulty
      );
      setResult(JSON.stringify(response.data.data, null, 2));
      toast.success('Assignment prompt generated!');
    } catch (error) {
      toast.error('Failed to generate assignment');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateNotes = async () => {
    if (!topic) {
      toast.error('Please enter a topic');
      return;
    }
    setLoading(true);
    try {
      const response = await aiApi.generateLectureNotes(
        topic,
        subtopics.filter(s => s.trim())
      );
      setResult(response.data.data);
      toast.success('Lecture notes generated!');
    } catch (error) {
      toast.error('Failed to generate lecture notes');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      toast.success('Copied to clipboard!');
    }
  };

  const downloadResult = () => {
    if (result) {
      const element = document.createElement('a');
      const file = new Blob([result], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `ai-generated-${mode}-${Date.now()}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Downloaded!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl"
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-gradient-to-r from-primary-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center shadow-lg">
              <Brain size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">AI Course Assistant</h2>
              <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Powered by GPT-4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {mode === 'menu' && (
              <motion.div
                key="menu"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <p className="text-sm text-slate-600 mb-6">
                  Choose an AI-powered tool to help you create course content:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    {
                      id: 'outline',
                      icon: BookOpen,
                      title: 'Course Outline',
                      desc: 'Generate a complete course structure'
                    },
                    {
                      id: 'quiz',
                      icon: HelpCircle,
                      title: 'Quiz Questions',
                      desc: 'Create quiz questions automatically'
                    },
                    {
                      id: 'assignment',
                      icon: FileText,
                      title: 'Assignment Prompt',
                      desc: 'Generate assignment descriptions'
                    },
                    {
                      id: 'notes',
                      icon: MessageSquare,
                      title: 'Lecture Notes',
                      desc: 'Create comprehensive lecture notes'
                    },
                  ].map((tool) => {
                    const Icon = tool.icon;
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setMode(tool.id as AssistantMode)}
                        className="group p-4 rounded-2xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all text-left"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-primary-200 flex items-center justify-center transition-colors">
                            <Icon size={18} className="text-slate-600 group-hover:text-primary-600" />
                          </div>
                          <ChevronRight size={16} className="text-slate-300 group-hover:text-primary-500 transition-colors" />
                        </div>
                        <h3 className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{tool.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{tool.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {mode === 'outline' && (
              <motion.div
                key="outline"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setMode('menu')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 mb-4"
                >
                  ← Back to Menu
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={courseTitle}
                      onChange={(e) => setCourseTitle(e.target.value)}
                      placeholder="e.g., Introduction to Web Development"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Course Description
                    </label>
                    <textarea
                      value={courseDescription}
                      onChange={(e) => setCourseDescription(e.target.value)}
                      placeholder="Describe what students will learn..."
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Duration (weeks)
                    </label>
                    <input
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(parseInt(e.target.value))}
                      min="1"
                      max="52"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGenerateOutline}
                  disabled={loading}
                  className="w-full mt-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {loading ? 'Generating...' : 'Generate Outline'}
                </button>
              </motion.div>
            )}

            {mode === 'quiz' && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setMode('menu')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 mb-4"
                >
                  ← Back to Menu
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., JavaScript Promises"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Difficulty
                      </label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors"
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                        Number of Questions
                      </label>
                      <input
                        type="number"
                        value={quizCount}
                        onChange={(e) => setQuizCount(parseInt(e.target.value))}
                        min="1"
                        max="20"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleGenerateQuiz}
                  disabled={loading}
                  className="w-full mt-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {loading ? 'Generating...' : 'Generate Questions'}
                </button>
              </motion.div>
            )}

            {mode === 'assignment' && (
              <motion.div
                key="assignment"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setMode('menu')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 mb-4"
                >
                  ← Back to Menu
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Building a REST API"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Learning Outcomes
                    </label>
                    {learningOutcomes.map((outcome, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={outcome}
                        onChange={(e) => {
                          const newOutcomes = [...learningOutcomes];
                          newOutcomes[idx] = e.target.value;
                          setLearningOutcomes(newOutcomes);
                        }}
                        placeholder={`Outcome ${idx + 1}`}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors mb-2"
                      />
                    ))}
                    <button
                      onClick={() => setLearningOutcomes([...learningOutcomes, ''])}
                      className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      + Add Outcome
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Difficulty
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors"
                    >
                      <option value="easy">Easy</option>
                      <option value="medium">Medium</option>
                      <option value="hard">Hard</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={handleGenerateAssignment}
                  disabled={loading}
                  className="w-full mt-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {loading ? 'Generating...' : 'Generate Assignment'}
                </button>
              </motion.div>
            )}

            {mode === 'notes' && (
              <motion.div
                key="notes"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <button
                  onClick={() => setMode('menu')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-semibold flex items-center gap-1 mb-4"
                >
                  ← Back to Menu
                </button>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., Machine Learning Basics"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Subtopics (Optional)
                    </label>
                    {subtopics.map((subtopic, idx) => (
                      <input
                        key={idx}
                        type="text"
                        value={subtopic}
                        onChange={(e) => {
                          const newSubtopics = [...subtopics];
                          newSubtopics[idx] = e.target.value;
                          setSubtopics(newSubtopics);
                        }}
                        placeholder={`Subtopic ${idx + 1}`}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-primary-500 outline-none transition-colors mb-2"
                      />
                    ))}
                    <button
                      onClick={() => setSubtopics([...subtopics, ''])}
                      className="text-xs text-primary-600 hover:text-primary-700 font-semibold"
                    >
                      + Add Subtopic
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleGenerateNotes}
                  disabled={loading}
                  className="w-full mt-6 py-3 rounded-xl bg-primary-500 text-white font-bold hover:bg-primary-600 disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                  {loading ? 'Generating...' : 'Generate Notes'}
                </button>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-slate-900">Generated Content</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                      title="Copy to clipboard"
                    >
                      <Copy size={16} className="text-slate-600" />
                    </button>
                    <button
                      onClick={downloadResult}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                      title="Download"
                    >
                      <Download size={16} className="text-slate-600" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 max-h-64 overflow-y-auto border border-slate-200">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap break-words font-mono">
                    {result}
                  </pre>
                </div>

                <button
                  onClick={() => {
                    setResult(null);
                    setMode('menu');
                  }}
                  className="w-full py-3 rounded-xl bg-slate-100 text-slate-900 font-bold hover:bg-slate-200 transition-colors"
                >
                  Generate Something Else
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
