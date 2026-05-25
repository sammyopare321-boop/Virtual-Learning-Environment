'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useRouter } from 'next/navigation';
import { 
  Plus, GripVertical, Trash2, Settings, Target,
  Save, HelpCircle, CheckSquare,
  Type, Sparkles, Loader2,
  FileText, Clock, ArrowRight, Brain, Zap, X, AlertCircle
} from 'lucide-react';
import { 
  DndContext, 
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  DragEndEvent,
  DragOverlay
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import toast from 'react-hot-toast';
import { quizApi } from '@/utils/api/extraApis';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/queryKeys';

// --- TYPES ---
type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

interface Question {
  id: string;
  type: QuestionType;
  text: string;
  marks: number;
  required: boolean;
  options: string[];
  correctAnswer: string;
}

// --- SORTABLE QUESTION ITEM ---
function QuestionSidebarItem({ question, isActive, onClick, onDelete, index }: { question: Question, isActive: boolean, onClick: () => void, onDelete: () => void, index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group flex items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer mb-2 ${
        isDragging
          ? 'opacity-50 bg-primary-50 border-primary-300'
          : isActive 
            ? 'bg-primary-50 border-primary-300 shadow-sm' 
            : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
      }`}
      onClick={onClick}
    >
      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 flex-shrink-0">
        <GripVertical size={14}/>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-slate-900 truncate">{question.text || `Question ${index + 1}`}</p>
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wide">{question.type.replace('_', ' ')} • {question.marks}pts</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500 flex-shrink-0"
        title="Delete question"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}

// --- MAIN QUIZ BUILDER ---
export default function QuizBuilder() {
  const { courseId } = useParams() as { courseId: string };
  const router = useRouter();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [saving, setSaving] = useState(false);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  
  // Form State
  const [quizDetails, setQuizDetails] = useState({
    title: '',
    description: '',
  });
  
  const [quizSettings, setQuizSettings] = useState({
    duration: 30,
    startTime: '',
    endTime: '',
    totalMarks: 20
  });

  const [questions, setQuestions] = useState<Question[]>([
    { id: 'q1', type: 'multiple_choice', text: 'What is the primary law of thermodynamics?', marks: 10, required: true, options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: '0' }
  ]);
  const [activeId, setActiveId] = useState('q1');
  const activeQuestion = questions.find(q => q.id === activeId) || questions[0];

  const sensors = useSensors(useSensor(PointerSensor, { distance: 8 }));

  const handleDragEnd = (event: DragEndEvent) => {
    setDraggedId(null);
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const addQuestion = (type: QuestionType = 'multiple_choice') => {
    const newId = `q${Date.now()}`;
    setQuestions([...questions, { id: newId, type, text: '', marks: 5, required: true, options: ['Option A', 'Option B', 'Option C', 'Option D'], correctAnswer: '0' }]);
    setActiveId(newId);
  };

  const deleteQuestion = (id: string) => {
    if (questions.length === 1) {
      toast.error('You must have at least one question');
      return;
    }
    setQuestions(questions.filter(q => q.id !== id));
    if (activeId === id) {
      setActiveId(questions[0].id === id ? questions[1].id : questions[0].id);
    }
    toast.success('Question deleted');
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, ...updates } : q));
  };

  // Validation
  const getErrors = () => {
    const errors: string[] = [];
    if (!quizDetails.title.trim()) errors.push('Quiz title is required');
    if (!quizSettings.startTime) errors.push('Start time is required');
    if (!quizSettings.endTime) errors.push('End time is required');
    if (quizSettings.startTime && quizSettings.endTime && new Date(quizSettings.startTime) >= new Date(quizSettings.endTime)) {
      errors.push('End time must be after start time');
    }
    if (quizSettings.duration <= 0) errors.push('Duration must be greater than 0');
    if (quizSettings.totalMarks <= 0) errors.push('Total marks must be greater than 0');
    if (questions.some(q => !q.text.trim())) errors.push('All questions must have text');
    if (questions.some(q => q.type === 'multiple_choice' && q.options.filter(o => o.trim()).length < 2)) {
      errors.push('Multiple choice questions need at least 2 options');
    }
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);
    if (totalMarks !== quizSettings.totalMarks) {
      errors.push(`Question marks (${totalMarks}) must equal total marks (${quizSettings.totalMarks})`);
    }
    return errors;
  };

  const handleSave = async () => {
    const errors = getErrors();
    if (errors.length > 0) {
      errors.forEach(err => toast.error(err));
      return;
    }

    setSaving(true);
    try {
      // 1. Create Quiz
      const res = await quizApi.createQuiz(courseId, {
        ...quizDetails,
        ...quizSettings,
        startTime: new Date(quizSettings.startTime).toISOString(),
        endTime: new Date(quizSettings.endTime).toISOString(),
      });
      const newQuiz = res.data.data;
      
      // 2. Create Questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const payload: Record<string, unknown> = {
          text: q.text,
          type: q.type,
          marks: q.marks,
          order: i + 1,
        };
        if (q.type === 'multiple_choice') {
          payload.options = q.options.filter(o => o.trim());
          payload.correctAnswer = q.correctAnswer;
        } else if (q.type === 'true_false') {
          payload.correctAnswer = q.correctAnswer;
        }
        await quizApi.addQuestion(newQuiz._id, payload);
      }

      await queryClient.invalidateQueries({ queryKey: queryKeys.quizzes.list(courseId) });
      toast.success('Quiz created successfully!');
      router.push(`/courses/${courseId}/quizzes/${newQuiz._id}`);
      
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setSaving(false);
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300 py-8">
           <div className="text-center space-y-3 mb-10">
             <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                <FileText size={24} />
             </div>
             <h2 className="text-3xl font-display font-bold text-slate-900">Quiz Details</h2>
             <p className="text-sm text-slate-600">Give your quiz a title and add instructions for students.</p>
           </div>
           
           <div className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Quiz Title *</label>
                 <input 
                   autoFocus
                   className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm" 
                   placeholder="e.g., Midterm Exam - Chapter 5"
                   value={quizDetails.title}
                   onChange={e => setQuizDetails({...quizDetails, title: e.target.value})}
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Instructions (Optional)</label>
                 <textarea 
                   className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm resize-none h-32" 
                   placeholder="Add any instructions or context for students..."
                   value={quizDetails.description}
                   onChange={e => setQuizDetails({...quizDetails, description: e.target.value})}
                 />
              </div>
              <button 
                onClick={() => setStep(2)}
                className="w-full btn btn-primary py-3 text-sm font-semibold gap-2 rounded-lg"
              >
                Continue to Settings <ArrowRight size={16} />
              </button>
           </div>
        </div>
      );
    }
    if (step === 2) {
      return (
        <div className="max-w-2xl mx-auto animate-in fade-in duration-300 py-8">
           <div className="text-center space-y-3 mb-10">
             <div className="w-14 h-14 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center mx-auto mb-4">
                <Settings size={24} />
             </div>
             <h2 className="text-3xl font-display font-bold text-slate-900">Quiz Settings</h2>
             <p className="text-sm text-slate-600">Configure timing, duration, and total marks.</p>
           </div>
           
           <div className="space-y-6 bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <Clock size={14}/> Duration (mins) *
                    </label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm" 
                      value={quizSettings.duration}
                      onChange={e => setQuizSettings({...quizSettings, duration: parseInt(e.target.value) || 0})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <Target size={14}/> Total Marks *
                    </label>
                    <input 
                      type="number"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm" 
                      value={quizSettings.totalMarks}
                      onChange={e => setQuizSettings({...quizSettings, totalMarks: parseInt(e.target.value) || 0})}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <Clock size={14}/> Start Time *
                    </label>
                    <input 
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm" 
                      value={quizSettings.startTime}
                      onChange={e => setQuizSettings({...quizSettings, startTime: e.target.value})}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide flex items-center gap-2">
                      <Clock size={14}/> End Time *
                    </label>
                    <input 
                      type="datetime-local"
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm" 
                      value={quizSettings.endTime}
                      onChange={e => setQuizSettings({...quizSettings, endTime: e.target.value})}
                    />
                 </div>
              </div>

              <div className="flex gap-3 pt-4">
                 <button 
                   onClick={() => setStep(1)}
                   className="flex-1 btn btn-secondary py-3 text-sm font-semibold rounded-lg"
                 >
                   Back
                 </button>
                 <button 
                   onClick={() => setStep(3)}
                   className="flex-[2] btn btn-primary py-3 text-sm font-semibold gap-2 rounded-lg"
                 >
                   Build Questions <ArrowRight size={16} />
                 </button>
              </div>
           </div>
        </div>
      );
    }
    return (
      <div className="flex h-full animate-in fade-in duration-300 w-full relative gap-0">
        {/* LEFT SIDEBAR: Question List */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shadow-sm overflow-hidden">
           <div className="p-4 border-b border-slate-200 space-y-3 shrink-0">
              <button 
                onClick={() => addQuestion('multiple_choice')}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-xs uppercase tracking-wide hover:bg-primary-700 transition-colors"
              >
                 <Plus size={14} /> Add Question
              </button>
           </div>

           <div className="flex-1 overflow-y-auto p-4 scrollbar-premium">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd} onDragStart={(e) => setDraggedId(e.active.id as string)}>
                 <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
                    {questions.map((q, idx) => (
                      <QuestionSidebarItem 
                        key={q.id} 
                        question={q} 
                        index={idx}
                        isActive={activeId === q.id} 
                        onClick={() => setActiveId(q.id)}
                        onDelete={() => deleteQuestion(q.id)}
                      />
                    ))}
                 </SortableContext>
              </DndContext>
           </div>

           <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-2 shrink-0">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                 <span>Questions</span>
                 <span className="text-slate-900">{questions.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                 <span>Total Points</span>
                 <span className="text-primary-600">{questions.reduce((acc, q) => acc + q.marks, 0)} / {quizSettings.totalMarks}</span>
              </div>
           </div>
        </aside>

        {/* CENTER: Question Editor */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 relative">
           <div className="max-w-3xl mx-auto">
              <AnimatePresence mode="wait">
                 {activeQuestion ? (
                   <motion.div
                     key={activeId}
                     initial={{ opacity: 0, y: 10 }} 
                     animate={{ opacity: 1, y: 0 }} 
                     exit={{ opacity: 0, y: -10 }}
                     className="space-y-8"
                   >
                      <div className="space-y-3">
                         <label className="text-xs font-semibold text-primary-600 uppercase tracking-wide">Question Text *</label>
                         <textarea 
                           className="w-full px-4 py-4 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-lg font-medium resize-none min-h-[100px]"
                           placeholder="Enter your question here..."
                           value={activeQuestion.text}
                           onChange={(e) => updateQuestion(activeId, { text: e.target.value })}
                         />
                      </div>

                      <div className="space-y-4">
                         <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Answer Options</label>
                         {renderQuestionCanvas(activeQuestion, updateQuestion)}
                      </div>
                   </motion.div>
                 ) : (
                   <div className="h-64 flex items-center justify-center text-slate-400 font-medium">Select or add a question</div>
                 )}
              </AnimatePresence>
           </div>
        </div>

        {/* RIGHT SIDEBAR: Question Settings */}
        {activeQuestion && (
          <aside className="w-64 bg-white border-l border-slate-200 p-6 shadow-sm overflow-y-auto scrollbar-premium">
             <div className="flex items-center gap-2 mb-6">
                <Settings size={16} className="text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wide">Settings</h3>
             </div>

             <div className="space-y-6">
                <section>
                   <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Type</label>
                   <div className="space-y-2">
                      {['multiple_choice', 'true_false', 'short_answer'].map((type) => (
                        <button 
                          key={type}
                          onClick={() => updateQuestion(activeId, { type: type as QuestionType })}
                          className={`w-full flex items-center gap-2 p-2.5 rounded-lg border transition-all text-xs font-semibold ${activeQuestion.type === type ? 'bg-primary-50 border-primary-300 text-primary-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'}`}
                        >
                           <div className="w-5 h-5 rounded flex items-center justify-center text-slate-400">
                              {getItemIcon(type as QuestionType)}
                           </div>
                           <span className="capitalize">{type.replace('_', ' ')}</span>
                        </button>
                      ))}
                   </div>
                </section>

                <section className="pt-4 border-t border-slate-200">
                   <label htmlFor="marks" className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">Marks</label>
                   <input 
                     id="marks" 
                     type="number" 
                     className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm font-semibold"
                     value={activeQuestion.marks}
                     onChange={(e) => updateQuestion(activeId, { marks: parseInt(e.target.value) || 0 })}
                   />
                </section>
             </div>
          </aside>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* HEADER */}
      <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-6">
           <button 
             onClick={() => router.push(`/courses/${courseId}/quizzes`)} 
             className="text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
           >
              ← Back
           </button>
           <div className="flex items-center gap-3">
              {[1, 2, 3].map(num => (
                <React.Fragment key={num}>
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                      step >= num ? 'bg-primary-600 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {num}
                  </div>
                  {num < 3 && <div className={`w-6 h-0.5 rounded-full ${step > num ? 'bg-primary-600' : 'bg-slate-200'}`} />}
                </React.Fragment>
              ))}
           </div>
           <span className="text-xs font-medium text-slate-600">
             {step === 1 && 'Quiz Details'}
             {step === 2 && 'Quiz Settings'}
             {step === 3 && 'Build Questions'}
           </span>
        </div>
        
        <div className="flex items-center gap-3">
           {step === 3 && (
             <button 
               onClick={handleSave} 
               disabled={saving}
               className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary-600 text-white font-semibold text-xs uppercase tracking-wide hover:bg-primary-700 disabled:opacity-50 transition-colors"
             >
                {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14} />} 
                {saving ? 'Saving...' : 'Create Quiz'}
             </button>
           )}
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="flex-1 flex overflow-hidden relative w-full">
         {renderStepContent()}

         {/* AI GENERATION PANEL */}
         <AnimatePresence>
            {aiPanelOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
                  onClick={() => setAiPanelOpen(false)}
                />
                <motion.div 
                  initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200"
                >
                   <div className="h-14 border-b border-slate-200 flex items-center justify-between px-6 bg-gradient-to-r from-indigo-50 to-purple-50 shrink-0">
                      <div className="flex items-center gap-2 text-indigo-600">
                         <Brain size={18} />
                         <span className="font-semibold text-sm uppercase tracking-wide">AI Generator</span>
                      </div>
                      <button onClick={() => setAiPanelOpen(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={18} />
                      </button>
                   </div>
                   <div className="p-6 space-y-6 overflow-y-auto flex-1">
                      <div className="space-y-2">
                         <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Topic</label>
                         <textarea className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm resize-none h-20" placeholder="E.g., Quantum Mechanics, Cell Biology..." />
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Difficulty</label>
                         <select className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm bg-white">
                            <option>Introductory</option>
                            <option>Intermediate</option>
                            <option>Advanced</option>
                         </select>
                      </div>
                      <div className="space-y-2">
                         <label className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Number of Questions</label>
                         <input type="number" className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm" defaultValue={5} />
                      </div>
                   </div>
                   <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0">
                      <button 
                        onClick={() => {
                          toast.success('AI generation initiated (coming soon).');
                          setAiPanelOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs uppercase tracking-wide hover:opacity-90 transition-colors"
                      >
                         <Zap size={14} /> Generate Questions
                      </button>
                   </div>
                </motion.div>
              </>
            )}
         </AnimatePresence>
      </main>

    </div>
  );
}

function getItemIcon(type: QuestionType) {
  switch(type) {
    case 'multiple_choice': return <CheckSquare size={16} />;
    case 'true_false': return <HelpCircle size={16} />;
    case 'short_answer': return <Type size={16} />;
    default: return <HelpCircle size={16} />;
  }
}

function renderQuestionCanvas(q: Question, update: (id: string, u: Partial<Question>) => void) {
  switch(q.type) {
    case 'multiple_choice':
      return (
        <div className="space-y-3">
           {q.options?.map((opt, i) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                key={i} 
                className="flex items-center gap-3 group"
              >
                 <button 
                   onClick={() => update(q.id, { correctAnswer: String(i) })}
                   className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all border-2 flex-shrink-0 ${
                     q.correctAnswer === String(i) 
                      ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/30' 
                      : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                   }`}
                   title="Mark as correct answer"
                 >
                    {String.fromCharCode(65 + i)}
                 </button>
                 <input 
                   title={`Option ${String.fromCharCode(65 + i)}`}
                   placeholder="Enter option text..."
                   className={`flex-1 px-4 py-2.5 border rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm ${
                     q.correctAnswer === String(i) ? 'border-primary-300 bg-primary-50' : 'border-slate-200 bg-white'
                   }`}
                   value={opt}
                   onChange={(e) => {
                     const next = [...(q.options || [])];
                     next[i] = e.target.value;
                     update(q.id, { options: next });
                   }}
                 />
                  <button 
                    onClick={() => {
                      const next = q.options.filter((_, idx) => idx !== i);
                      let newCorrect = q.correctAnswer;
                      if (q.correctAnswer === String(i)) newCorrect = "0";
                      else if (parseInt(q.correctAnswer) > i) newCorrect = String(parseInt(q.correctAnswer) - 1);
                      update(q.id, { options: next, correctAnswer: newCorrect });
                    }}
                    className="p-2 rounded-lg bg-white text-slate-300 hover:bg-red-50 hover:text-red-500 transition-all opacity-0 group-hover:opacity-100 border border-slate-200 flex-shrink-0"
                  >
                     <Trash2 size={16} />
                  </button>
              </motion.div>
           ))}
           <button 
             onClick={() => update(q.id, { options: [...(q.options || []), 'New Option'] })}
             className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white text-slate-600 font-semibold text-xs uppercase tracking-wide hover:bg-slate-50 hover:text-primary-600 transition-all border-2 border-dashed border-slate-200 mt-4"
           >
              <Plus size={14} /> Add Option
           </button>
        </div>
      );
    case 'true_false':
       return (
         <div className="flex gap-4">
            {['true', 'false'].map(val => (
              <button 
                key={val}
                onClick={() => update(q.id, { correctAnswer: val })}
                className={`flex-1 py-4 rounded-lg border-2 font-semibold text-sm uppercase tracking-wide transition-all ${
                  q.correctAnswer === val 
                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-600/30' 
                    : 'bg-white border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-600'
                }`}
              >
                {val}
              </button>
            ))}
         </div>
       );
    case 'short_answer':
       return (
         <div className="h-32 w-full bg-slate-100 border-2 border-dashed border-slate-300 rounded-lg flex flex-col justify-center px-6 text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wide flex items-center gap-2"><Type size={14}/> Student Response Area</span>
            <p className="text-xs text-slate-400 mt-1">Responses will require manual grading</p>
         </div>
       );
    default:
      return <div className="py-12 text-center bg-slate-100 rounded-lg border-2 border-dashed border-slate-300 text-slate-400 font-semibold uppercase tracking-wide text-xs">Unsupported Type</div>;
  }
}
