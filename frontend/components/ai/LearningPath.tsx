'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, CheckCircle2, BookOpen, Target, Zap, Award,
  ChevronDown, ChevronUp, X, Download, Share2, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Module {
  moduleId: string;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  resources: string[];
  objectives: string[];
  assessments: string[];
  prerequisites: string[];
  estimatedCompletion: string;
}

interface Milestone {
  name: string;
  description: string;
  targetDate: string;
  successCriteria: string[];
}

interface LearningPathData {
  pathName: string;
  description: string;
  duration: string;
  modules: Module[];
  milestones: Milestone[];
  adaptiveStrategies: string[];
  supportResources: string[];
  checkpoints: string[];
}

interface LearningPathProps {
  studentId: string;
  studentName: string;
  courseTitle: string;
  onClose?: () => void;
}

export default function LearningPath({
  studentId,
  studentName,
  courseTitle,
  onClose,
}: LearningPathProps) {
  const [path, setPath] = useState<LearningPathData | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(null);

  const handleGeneratePath = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/learning-path', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentId,
          courseTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate learning path');
      }

      const data = await response.json();
      setPath(data);
      toast.success('Learning path generated successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to generate learning path');
    } finally {
      setLoading(false);
    }
  };

  const downloadPath = () => {
    if (!path) return;

    const pathText = `
PERSONALIZED LEARNING PATH
==========================
Student: ${studentName}
Course: ${courseTitle}
Path: ${path.pathName}

OVERVIEW:
${path.description}

TOTAL DURATION: ${path.duration}

MODULES:
${path.modules
  .map(
    (m, i) =>
      `${i + 1}. ${m.title} (${m.duration})
   Difficulty: ${m.difficulty}
   Description: ${m.description}
   Objectives: ${m.objectives.join(', ')}
   Resources: ${m.resources.join(', ')}
   Estimated Completion: ${m.estimatedCompletion}`
  )
  .join('\n\n')}

MILESTONES:
${path.milestones
  .map(
    (m, i) =>
      `${i + 1}. ${m.name}
   Target Date: ${m.targetDate}
   Description: ${m.description}
   Success Criteria: ${m.successCriteria.join(', ')}`
  )
  .join('\n\n')}

ADAPTIVE STRATEGIES:
${path.adaptiveStrategies.map((s, i) => `${i + 1}. ${s}`).join('\n')}

SUPPORT RESOURCES:
${path.supportResources.map((r, i) => `${i + 1}. ${r}`).join('\n')}

CHECKPOINTS:
${path.checkpoints.map((c, i) => `${i + 1}. ${c}`).join('\n')}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(pathText)}`);
    element.setAttribute('download', `learning_path_${studentId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Learning Path</h3>
            <p className="text-white/80 text-xs">{studentName}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!path ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 flex items-center justify-center mb-4 border border-violet-100">
              <Target size={32} className="text-violet-600" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">Generate Your Learning Path</h4>
            <p className="text-slate-500 text-xs max-w-xs mb-6">
              Click the button below to create a personalized learning path based on your performance and goals.
            </p>
            <button
              onClick={handleGeneratePath}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Target size={16} />
                  Generate Path
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Path Overview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-2xl border border-violet-200 p-6"
            >
              <h4 className="text-violet-900 font-bold text-lg mb-2">{path.pathName}</h4>
              <p className="text-violet-800 text-sm mb-4">{path.description}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-violet-600" />
                  <span className="text-sm font-semibold text-violet-900">Duration: {path.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen size={16} className="text-violet-600" />
                  <span className="text-sm font-semibold text-violet-900">Modules: {path.modules.length}</span>
                </div>
              </div>
            </motion.div>

            {/* Modules */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <BookOpen size={16} className="text-primary-600" />
                Learning Modules ({path.modules.length})
              </h4>
              {path.modules.map((module, idx) => (
                <div
                  key={module.moduleId}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 transition-all"
                >
                  <button
                    onClick={() => setExpandedModule(expandedModule === module.moduleId ? null : module.moduleId)}
                    className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 text-left">
                      <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold">
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{module.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {module.duration} • {module.difficulty}
                        </p>
                      </div>
                    </div>
                    {expandedModule === module.moduleId ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                  </button>

                  <AnimatePresence>
                    {expandedModule === module.moduleId && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-slate-200 bg-slate-50 p-4 space-y-3"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-600 mb-1">Description</p>
                          <p className="text-xs text-slate-700">{module.description}</p>
                        </div>

                        {module.objectives.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-600 mb-1">Learning Objectives</p>
                            <ul className="space-y-1">
                              {module.objectives.map((obj, i) => (
                                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                  <span className="text-primary-600 mt-1">✓</span>
                                  <span>{obj}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {module.resources.length > 0 && (
                          <div>
                            <p className="text-xs font-semibold text-slate-600 mb-1">Resources</p>
                            <ul className="space-y-1">
                              {module.resources.map((res, i) => (
                                <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                                  <span className="text-slate-400">→</span>
                                  <span>{res}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <p className="text-xs text-slate-500 pt-2 border-t border-slate-200">
                          Estimated Completion: {module.estimatedCompletion}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </motion.div>

            {/* Milestones */}
            {path.milestones.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Award size={16} className="text-emerald-600" />
                  Milestones ({path.milestones.length})
                </h4>
                {path.milestones.map((milestone, idx) => (
                  <div
                    key={idx}
                    className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 cursor-pointer hover:border-emerald-300 transition-all"
                    onClick={() => setExpandedMilestone(expandedMilestone === idx ? null : idx)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-emerald-900">{milestone.name}</p>
                        <p className="text-xs text-emerald-700 mt-1">{milestone.description}</p>
                      </div>
                      {expandedMilestone === idx ? (
                        <ChevronUp size={16} className="text-emerald-600 shrink-0" />
                      ) : (
                        <ChevronDown size={16} className="text-emerald-600 shrink-0" />
                      )}
                    </div>

                    <AnimatePresence>
                      {expandedMilestone === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-emerald-200"
                        >
                          <p className="text-xs font-semibold text-emerald-900 mb-2">Success Criteria:</p>
                          <ul className="space-y-1">
                            {milestone.successCriteria.map((criteria, i) => (
                              <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                                <CheckCircle2 size={12} className="text-emerald-600 mt-0.5 shrink-0" />
                                <span>{criteria}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="text-xs text-emerald-700 mt-2 font-semibold">
                            Target Date: {milestone.targetDate}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Adaptive Strategies */}
            {path.adaptiveStrategies.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-3">
                  <Zap size={16} className="text-blue-600" />
                  Adaptive Strategies
                </h4>
                <ul className="space-y-2">
                  {path.adaptiveStrategies.map((strategy, i) => (
                    <li key={i} className="text-xs text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>{strategy}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Support Resources */}
            {path.supportResources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4"
              >
                <h4 className="font-bold text-amber-900 text-sm mb-3">Support Resources</h4>
                <ul className="space-y-2">
                  {path.supportResources.map((resource, i) => (
                    <li key={i} className="text-xs text-amber-800 flex items-start gap-2">
                      <span className="text-amber-600 mt-1">•</span>
                      <span>{resource}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {path && (
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-2">
          <button
            onClick={downloadPath}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all"
          >
            <Download size={16} /> Download
          </button>
          <button
            onClick={() => toast.success('Path shared!')}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all"
          >
            <Share2 size={16} /> Share
          </button>
          <button
            onClick={handleGeneratePath}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm transition-all"
          >
            <Zap size={16} /> Regenerate
          </button>
        </div>
      )}
    </div>
  );
}
