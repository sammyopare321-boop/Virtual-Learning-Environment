'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle, TrendingDown, Users, Target, CheckCircle2,
  ChevronDown, ChevronUp, Download, Filter, RefreshCw, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface RiskFactor {
  factor: string;
  severity: number;
  description: string;
  trend: 'improving' | 'stable' | 'declining';
}

interface AtRiskStudent {
  studentId: string;
  name: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  primaryConcerns: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
  riskFactors?: RiskFactor[];
}

interface RiskReport {
  reportDate: string;
  courseOverview: string;
  totalStudents: number;
  atRiskCount: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  commonRiskFactors: string[];
  trends: string[];
  recommendations: string[];
  resourcesNeeded: string[];
}

interface RiskDashboardProps {
  courseId: string;
  courseName: string;
  onClose?: () => void;
}

const getRiskColor = (level: string) => {
  switch (level) {
    case 'critical':
      return 'bg-red-50 border-red-200 text-red-900';
    case 'high':
      return 'bg-orange-50 border-orange-200 text-orange-900';
    case 'medium':
      return 'bg-yellow-50 border-yellow-200 text-yellow-900';
    default:
      return 'bg-green-50 border-green-200 text-green-900';
  }
};

const getRiskBadgeColor = (level: string) => {
  switch (level) {
    case 'critical':
      return 'bg-red-100 text-red-700';
    case 'high':
      return 'bg-orange-100 text-orange-700';
    case 'medium':
      return 'bg-yellow-100 text-yellow-700';
    default:
      return 'bg-green-100 text-green-700';
  }
};

export default function RiskDashboard({
  courseId,
  courseName,
  onClose,
}: RiskDashboardProps) {
  const [atRiskStudents, setAtRiskStudents] = useState<AtRiskStudent[]>([]);
  const [report, setReport] = useState<RiskReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');

  const handleAnalyzeRisk = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/at-risk-students', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze risk');
      }

      const data = await response.json();
      setAtRiskStudents(data.students || []);
      setReport(data.report || null);
      toast.success('Risk analysis completed');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to analyze risk');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = atRiskStudents.filter(
    (student) => filterLevel === 'all' || student.riskLevel === filterLevel
  );

  const downloadReport = () => {
    if (!report) return;

    const reportText = `
RISK ANALYSIS REPORT
====================
Course: ${courseName}
Report Date: ${report.reportDate}

OVERVIEW:
${report.courseOverview}

STATISTICS:
Total Students: ${report.totalStudents}
At-Risk Students: ${report.atRiskCount}

RISK DISTRIBUTION:
- Low Risk: ${report.riskDistribution.low}
- Medium Risk: ${report.riskDistribution.medium}
- High Risk: ${report.riskDistribution.high}
- Critical Risk: ${report.riskDistribution.critical}

COMMON RISK FACTORS:
${report.commonRiskFactors.map((f, i) => `${i + 1}. ${f}`).join('\n')}

TRENDS:
${report.trends.map((t, i) => `${i + 1}. ${t}`).join('\n')}

RECOMMENDATIONS:
${report.recommendations.map((r, i) => `${i + 1}. ${r}`).join('\n')}

RESOURCES NEEDED:
${report.resourcesNeeded.map((r, i) => `${i + 1}. ${r}`).join('\n')}
    `.trim();

    const element = document.createElement('a');
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(reportText)}`);
    element.setAttribute('download', `risk_report_${courseId}.txt`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
            <AlertTriangle size={20} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Risk Dashboard</h3>
            <p className="text-white/80 text-xs">{courseName}</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {!report ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4 border border-red-100">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            <h4 className="text-slate-900 font-bold text-sm mb-1">Analyze Student Risk</h4>
            <p className="text-slate-500 text-xs max-w-xs mb-6">
              Click the button below to analyze student performance and identify at-risk students.
            </p>
            <button
              onClick={handleAnalyzeRisk}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <AlertTriangle size={16} />
                  Analyze Risk
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Report Overview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-4"
            >
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-red-900">Total Students</span>
                  <Users size={16} className="text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-900">{report.totalStudents}</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl border border-orange-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-orange-900">At-Risk</span>
                  <AlertTriangle size={16} className="text-orange-600" />
                </div>
                <p className="text-2xl font-bold text-orange-900">{report.atRiskCount}</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-yellow-900">High Risk</span>
                  <TrendingDown size={16} className="text-yellow-600" />
                </div>
                <p className="text-2xl font-bold text-yellow-900">{report.riskDistribution.high}</p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl border border-red-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-red-900">Critical</span>
                  <AlertTriangle size={16} className="text-red-600" />
                </div>
                <p className="text-2xl font-bold text-red-900">{report.riskDistribution.critical}</p>
              </div>
            </motion.div>

            {/* Risk Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-50 rounded-2xl border border-slate-200 p-4"
            >
              <h4 className="font-bold text-slate-900 text-sm mb-4">Risk Distribution</h4>
              <div className="space-y-3">
                {[
                  { level: 'Low', count: report.riskDistribution.low, color: 'bg-green-500' },
                  { level: 'Medium', count: report.riskDistribution.medium, color: 'bg-yellow-500' },
                  { level: 'High', count: report.riskDistribution.high, color: 'bg-orange-500' },
                  { level: 'Critical', count: report.riskDistribution.critical, color: 'bg-red-500' },
                ].map((item) => (
                  <div key={item.level} className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-600 w-16">{item.level}</span>
                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{
                          width: `${(item.count / report.totalStudents) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-xs font-bold text-slate-900 w-8 text-right">{item.count}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* At-Risk Students */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} className="text-red-600" />
                  At-Risk Students ({filteredStudents.length})
                </h4>
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700"
                >
                  <option value="all">All Levels</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              {filteredStudents.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 size={32} className="text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-slate-600">No students at this risk level</p>
                </div>
              ) : (
                filteredStudents.map((student) => (
                  <div
                    key={student.studentId}
                    className={`border rounded-xl overflow-hidden hover:border-slate-300 transition-all ${getRiskColor(student.riskLevel)}`}
                  >
                    <button
                      onClick={() =>
                        setExpandedStudent(
                          expandedStudent === student.studentId ? null : student.studentId
                        )
                      }
                      className="w-full flex items-center justify-between p-4 hover:opacity-80 transition-opacity"
                    >
                      <div className="flex items-center gap-3 flex-1 text-left">
                        <div className={`w-10 h-10 rounded-lg ${getRiskBadgeColor(student.riskLevel)} flex items-center justify-center`}>
                          <span className="text-xs font-bold">{student.riskScore}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{student.name}</p>
                          <p className="text-xs opacity-75 mt-0.5">
                            {student.primaryConcerns.slice(0, 2).join(', ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-lg ${getRiskBadgeColor(student.riskLevel)}`}>
                          {student.riskLevel.toUpperCase()}
                        </span>
                        {expandedStudent === student.studentId ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </button>

                    <AnimatePresence>
                      {expandedStudent === student.studentId && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-current opacity-50 bg-black/5 p-4 space-y-3"
                        >
                          <div>
                            <p className="text-xs font-semibold opacity-75 mb-1">Primary Concerns</p>
                            <ul className="space-y-1">
                              {student.primaryConcerns.map((concern, i) => (
                                <li key={i} className="text-xs opacity-75 flex items-start gap-2">
                                  <span className="opacity-50 mt-1">•</span>
                                  <span>{concern}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <p className="text-xs font-semibold opacity-75 mb-1">Recommended Action</p>
                            <p className="text-xs opacity-75">{student.recommendedAction}</p>
                          </div>

                          <div className="flex gap-2 pt-2">
                            <button className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-semibold">
                              Create Plan
                            </button>
                            <button className="flex-1 text-xs px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition-colors font-semibold">
                              Contact
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))
              )}
            </motion.div>

            {/* Recommendations */}
            {report.recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-blue-50 border border-blue-200 rounded-xl p-4"
              >
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-2 mb-3">
                  <Target size={16} className="text-blue-600" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, i) => (
                    <li key={i} className="text-xs text-blue-800 flex items-start gap-2">
                      <span className="text-blue-600 mt-1">→</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {report && (
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex gap-2">
          <button
            onClick={downloadReport}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-sm transition-all"
          >
            <Download size={16} /> Download
          </button>
          <button
            onClick={handleAnalyzeRisk}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-sm transition-all"
          >
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      )}
    </div>
  );
}
