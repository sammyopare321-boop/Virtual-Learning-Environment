'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, AlertTriangle, CheckCircle2, AlertCircle, Copy, Check,
  Download, Eye, X, TrendingUp, Flag, Shield
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SuspiciousSegment {
  text: string;
  similarity: number;
  reason: string;
}

interface WritingPatternAnalysis {
  consistency: string;
  vocabulary: string;
  complexity: string;
}

interface PlagiarismResult {
  similarityScore: number;
  plagiarismRisk: 'low' | 'medium' | 'high' | 'critical';
  suspiciousSegments: SuspiciousSegment[];
  writingPatternAnalysis: WritingPatternAnalysis;
  potentialSources: string[];
  recommendations: string;
  flaggedForReview: boolean;
  submissionId: string;
  checkedAt: Date;
}

interface PlagiarismReportProps {
  submissionId: string;
  studentName: string;
  assignmentTitle: string;
  onClose?: () => void;
  onFlagForReview?: (submissionId: string) => void;
}

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'critical':
      return 'from-red-600 to-red-700';
    case 'high':
      return 'from-orange-600 to-orange-700';
    case 'medium':
      return 'from-amber-600 to-amber-700';
    case 'low':
      return 'from-emerald-600 to-emerald-700';
    default:
      return 'from-slate-600 to-slate-700';
  }
};

const getRiskBgColor = (risk: string) => {
  switch (risk) {
    case 'critical':
      return 'bg-red-50 border-red-200';
    case 'high':
      return 'bg-orange-50 border-orange-200';
    case 'medium':
      return 'bg-amber-50 border-amber-200';
    case 'low':
      return 'bg-emerald-50 border-emerald-200';
    default:
      return 'bg-slate-50 border-slate-200';
  }
};

const getRiskTextColor = (risk: string) => {
  switch (risk) {
    case 'critical':
      return 'text-red-900';
    case 'high':
      return 'text-orange-900';
    case 'medium':
      return 'text-amber-900';
    case 'low':
      return 'text-emerald-900';
    default:
      return 'text-slate-900';
  }
};

export default function PlagiarismReport({
  submissionId,
  studentName,
  assignmentTitle,
  onClose,
  onFlagForReview,
}: PlagiarismReportProps) {
  const [report, setReport] = useState<PlagiarismResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [expandedSegment, setExpandedSegment] = useState<number | null>(null);

  const handleCheckPlagiarism = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/check-plagiarism', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          submissionId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to check plagiarism');
      }

      const data = await response.json();
      setReport(data);
      toast.success('Plagiarism check completed');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to check plagiarism');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    if (!report) return;

    const reportText = `
PLAGIARISM DETECTION REPORT
===========================
Student: ${studentName}
Assignment: ${assignmentTitle}
Submission ID: ${submissionId}
Checked: ${new Date(report.checkedAt).toLocaleString()}

SIMILARITY SCORE: ${report.similarityScore}%
PLAGIARISM RISK: ${report.plagiarismRisk.toUpperCase()}
FLAGGED FOR REVIEW: ${report.flaggedForReview ? 'YES' : 'NO'}

WRITING PATTERN ANALYSIS:
- Consistency: ${report.writingPatternAnalysis.consistency}
- Vocabulary: ${report.writingPatternAnalysis.vocabulary}
- Complexity: ${report.writingPatternAnalysis.complexity}

SUSPICIOUS SEGMENTS:
${report.suspiciousSegments
  .map(
    (s, i) =>
      `${i + 1}. "${s.text}"\n   Similarity: ${s.similarity}%\n   Reason: ${s.reason}`
  )
  .join('\n\n')}

POTENTIAL SOURCES:
${report.potentialSources.map((s, i) => `${i + 1}. ${s}`).join('\n')}

RECOMMENDATIONS:
${report.recommendations}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(reportText)}`);
    element.setAttribute('download', `plagiarism_report_${submissionId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getRiskColor(report?.plagiarismRisk || 'low')} px-6 py-4 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Shield size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Plagiarism Detector</h3>
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
        {!report ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 border border-slate-100">
              <Shield size={32} className="text-slate-400" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">Check for Plagiarism</h4>
            <p className="text-slate-500 text-xs max-w-xs mb-6">
              Click the button below to analyze this submission for plagiarism and academic dishonesty.
            </p>
            <button
              onClick={handleCheckPlagiarism}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Checking...
                </>
              ) : (
                <>
                  <Shield size={16} />
                  Check Plagiarism
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Risk Summary */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl border p-6 ${getRiskBgColor(report.plagiarismRisk)}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {report.plagiarismRisk === 'low' ? (
                    <CheckCircle2 size={24} className="text-emerald-600" />
                  ) : report.plagiarismRisk === 'critical' ? (
                    <AlertTriangle size={24} className="text-red-600" />
                  ) : (
                    <AlertCircle size={24} className="text-amber-600" />
                  )}
                  <div>
                    <p className={`font-bold text-xs uppercase tracking-widest ${getRiskTextColor(report.plagiarismRisk)}`}>
                      Plagiarism Risk
                    </p>
                    <p className={`text-2xl font-black ${getRiskTextColor(report.plagiarismRisk)}`}>
                      {report.plagiarismRisk.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-bold text-xs uppercase tracking-widest ${getRiskTextColor(report.plagiarismRisk)}`}>
                    Similarity
                  </p>
                  <p className={`text-3xl font-black ${getRiskTextColor(report.plagiarismRisk)}`}>
                    {report.similarityScore}%
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    report.plagiarismRisk === 'critical'
                      ? 'bg-red-600'
                      : report.plagiarismRisk === 'high'
                      ? 'bg-orange-600'
                      : report.plagiarismRisk === 'medium'
                      ? 'bg-amber-600'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: `${report.similarityScore}%` }}
                />
              </div>
            </motion.div>

            {/* Writing Pattern Analysis */}
            {report.writingPatternAnalysis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4"
              >
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2 mb-3">
                  <TrendingUp size={16} className="text-primary-600" />
                  Writing Pattern Analysis
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Consistency</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">
                      {report.writingPatternAnalysis.consistency}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Vocabulary</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">
                      {report.writingPatternAnalysis.vocabulary}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-slate-200">
                    <p className="text-xs text-slate-500 font-semibold mb-1">Complexity</p>
                    <p className="text-sm font-bold text-slate-900 capitalize">
                      {report.writingPatternAnalysis.complexity}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Suspicious Segments */}
            {report.suspiciousSegments.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-3"
              >
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Flag size={16} className="text-amber-600" />
                  Suspicious Segments ({report.suspiciousSegments.length})
                </h4>
                {report.suspiciousSegments.map((segment, idx) => (
                  <div
                    key={idx}
                    className="bg-amber-50 border border-amber-200 rounded-xl p-4 cursor-pointer hover:border-amber-300 transition-all"
                    onClick={() => setExpandedSegment(expandedSegment === idx ? null : idx)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-amber-900 font-semibold mb-1">
                          Similarity: {segment.similarity}%
                        </p>
                        <p className="text-xs text-amber-800 line-clamp-2 italic">
                          "{segment.text}"
                        </p>
                      </div>
                      <Eye size={16} className="text-amber-600 shrink-0 mt-1" />
                    </div>

                    <AnimatePresence>
                      {expandedSegment === idx && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-amber-200"
                        >
                          <p className="text-xs text-amber-900 font-semibold mb-1">Reason:</p>
                          <p className="text-xs text-amber-800">{segment.reason}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </motion.div>
            )}

            {/* Potential Sources */}
            {report.potentialSources.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <h4 className="font-bold text-blue-900 text-sm mb-3">Potential Sources</h4>
                <ul className="space-y-2">
                  {report.potentialSources.map((source, idx) => (
                    <li key={idx} className="text-xs text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>{source}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-50 border border-slate-200 rounded-xl p-4"
            >
              <h4 className="font-bold text-slate-900 text-sm mb-3">Recommendations</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{report.recommendations}</p>
            </motion.div>

            {/* Flagged Status */}
            {report.flaggedForReview && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  <p className="text-xs font-bold text-red-900">
                    This submission has been flagged for manual review
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {report && (
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-2">
          <button
            onClick={() => copyToClipboard(report.recommendations)}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all"
          >
            {copied ? (
              <>
                <Check size={16} /> Copied
              </>
            ) : (
              <>
                <Copy size={16} /> Copy
              </>
            )}
          </button>
          <button
            onClick={downloadReport}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all"
          >
            <Download size={16} /> Download
          </button>
          {onFlagForReview && (
            <button
              onClick={() => onFlagForReview(submissionId)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all"
            >
              <Flag size={16} /> Flag for Review
            </button>
          )}
        </div>
      )}
    </div>
  );
}
