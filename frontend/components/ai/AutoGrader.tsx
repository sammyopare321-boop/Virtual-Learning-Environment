'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, CheckCircle2, AlertCircle, Copy, Check, Download,
  TrendingUp, Award, Lightbulb, Target, X
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RubricScore {
  criterion: string;
  score: number;
  maxScore: number;
  feedback: string;
}

interface GradingResult {
  totalScore: number;
  percentage: number;
  rubricScores: RubricScore[];
  strengths: string[];
  improvements: string[];
  generalFeedback: string;
  suggestions: string;
  grade: string;
}

interface AutoGraderProps {
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  totalPoints: number;
  rubricCriteria: Array<{ name: string; points: number; description: string }>;
  onClose?: () => void;
  onGradeSubmit?: (grade: number) => void;
}

export default function AutoGrader({
  submissionId,
  studentName,
  assignmentTitle,
  totalPoints,
  rubricCriteria,
  onClose,
  onGradeSubmit,
}: AutoGraderProps) {
  const [gradingResult, setGradingResult] = useState<GradingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [overrideScore, setOverrideScore] = useState<number | null>(null);

  const handleGradeSubmission = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/grade-submission', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
          rubricCriteria,
          totalPoints,
          assignmentDescription: assignmentTitle,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to grade submission');
      }

      const data = await response.json();
      setGradingResult(data);
      toast.success('Submission graded successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to grade submission');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrade = () => {
    const finalScore = overrideScore !== null ? overrideScore : gradingResult?.totalScore;
    if (finalScore !== undefined && onGradeSubmit) {
      onGradeSubmit(finalScore);
      toast.success('Grade submitted');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    if (!gradingResult) return;

    const report = `
GRADING REPORT
==============
Student: ${studentName}
Assignment: ${assignmentTitle}
Submission ID: ${submissionId}

SCORE: ${gradingResult.totalScore}/${totalPoints} (${gradingResult.percentage}%)
GRADE: ${gradingResult.grade}

RUBRIC BREAKDOWN:
${gradingResult.rubricScores
  .map(
    r =>
      `- ${r.criterion}: ${r.score}/${r.maxScore} points\n  ${r.feedback}`
  )
  .join('\n')}

STRENGTHS:
${gradingResult.strengths.map(s => `- ${s}`).join('\n')}

AREAS FOR IMPROVEMENT:
${gradingResult.improvements.map(i => `- ${i}`).join('\n')}

FEEDBACK:
${gradingResult.generalFeedback}

SUGGESTIONS:
${gradingResult.suggestions}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(report)}`);
    element.setAttribute('download', `grading_report_${submissionId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Award size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Auto Grader</h3>
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
        {!gradingResult ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
              <Award size={32} className="text-emerald-600" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">Ready to Grade</h4>
            <p className="text-slate-500 text-xs max-w-xs mb-6">
              Click the button below to automatically grade this submission using AI.
            </p>
            <button
              onClick={handleGradeSubmission}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Grading...
                </>
              ) : (
                <>
                  <Award size={16} />
                  Grade Submission
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl border border-emerald-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1">
                    Final Score
                  </p>
                  <p className="text-4xl font-black text-emerald-900">
                    {gradingResult.totalScore}/{totalPoints}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1">
                    Percentage
                  </p>
                  <p className="text-3xl font-black text-emerald-900">
                    {gradingResult.percentage}%
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-emerald-600 font-bold text-xs uppercase tracking-widest mb-1">
                    Grade
                  </p>
                  <p className="text-3xl font-black text-emerald-900">
                    {gradingResult.grade}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all"
                  style={{ width: `${gradingResult.percentage}%` }}
                />
              </div>
            </motion.div>

            {/* Rubric Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-3"
            >
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-primary-600" />
                Rubric Breakdown
              </h4>
              {gradingResult.rubricScores.map((score, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-slate-900 text-sm">{score.criterion}</p>
                    <p className="font-bold text-primary-600 text-sm">
                      {score.score}/{score.maxScore}
                    </p>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">{score.feedback}</p>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${(score.score / score.maxScore) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Strengths */}
            {gradingResult.strengths.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-4"
              >
                <h4 className="font-bold text-emerald-900 text-sm flex items-center gap-2 mb-3">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                  Strengths
                </h4>
                <ul className="space-y-2">
                  {gradingResult.strengths.map((strength, idx) => (
                    <li key={idx} className="text-xs text-emerald-800 flex items-start gap-2">
                      <span className="text-emerald-600 mt-1">✓</span>
                      <span>{strength}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Improvements */}
            {gradingResult.improvements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4"
              >
                <h4 className="font-bold text-amber-900 text-sm flex items-center gap-2 mb-3">
                  <AlertCircle size={16} className="text-amber-600" />
                  Areas for Improvement
                </h4>
                <ul className="space-y-2">
                  {gradingResult.improvements.map((improvement, idx) => (
                    <li key={idx} className="text-xs text-amber-800 flex items-start gap-2">
                      <span className="text-amber-600 mt-1">→</span>
                      <span>{improvement}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Feedback */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4"
            >
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                <Lightbulb size={16} className="text-primary-600" />
                Feedback
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed mb-3">
                {gradingResult.generalFeedback}
              </p>
              {gradingResult.suggestions && (
                <div className="bg-white border border-slate-200 rounded-lg p-3">
                  <p className="text-xs font-semibold text-slate-900 mb-2">Suggestions:</p>
                  <p className="text-xs text-slate-600">{gradingResult.suggestions}</p>
                </div>
              )}
            </motion.div>

            {/* Override Score */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-blue-50 border border-blue-200 rounded-xl p-4"
            >
              <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-3">
                <Target size={16} className="text-blue-600" />
                Override Score (Optional)
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max={totalPoints}
                  value={overrideScore ?? gradingResult.totalScore}
                  onChange={e => setOverrideScore(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-blue-200 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-sm"
                />
                <span className="text-xs text-blue-600 font-semibold">/ {totalPoints}</span>
              </div>
              <p className="text-xs text-blue-600 mt-2">
                Leave empty to use AI score: {gradingResult.totalScore}
              </p>
            </motion.div>
          </div>
        )}
      </div>

      {/* Footer */}
      {gradingResult && (
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-2">
          <button
            onClick={() => copyToClipboard(gradingResult.generalFeedback)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all"
          >
            {copied ? (
              <>
                <Check size={16} /> Copied
              </>
            ) : (
              <>
                <Copy size={16} /> Copy Feedback
              </>
            )}
          </button>
          <button
            onClick={downloadReport}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all"
          >
            <Download size={16} /> Download
          </button>
          <button
            onClick={handleSubmitGrade}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all"
          >
            <CheckCircle2 size={16} /> Submit Grade
          </button>
        </div>
      )}
    </div>
  );
}
