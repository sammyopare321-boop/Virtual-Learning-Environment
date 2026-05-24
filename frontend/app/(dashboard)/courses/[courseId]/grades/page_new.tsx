'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCourse } from '@/hooks/queries/useCourse';
import { courseApi } from '@/utils/api/courseApi';
import {
  Trophy, BarChart3, TrendingUp, AlertCircle, CheckCircle2,
  Search, Filter, Loader2, Target, Award, Activity,
  FileText, Save, X, Scale, PieChart, ShieldAlert, Mail,
  BookOpen, HelpCircle, ShieldCheck, Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentGrade {
  studentId: string;
  studentName: string;
  email: string;
  assignmentAverage: number;
  quizAverage: number;
  finalPercentage: number;
}

interface GradeItem {
  _id: string;
  title: string;
  type: 'assignment' | 'quiz';
  score: number;
  maxScore: number;
  gradedAt: string;
}

export default function GradesPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();

  const { data: course } = useCourse(courseId);
  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const [myGrades, setMyGrades] = useState<GradeItem[]>([]);
  const [gradebook, setGradebook] = useState<StudentGrade[]>([]);
  const [weights, setWeights] = useState({ assignments: 60, quizzes: 40 });
  const [finalGrade, setFinalGrade] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showWeightForm, setShowWeightForm] = useState(false);
  const [newWeights, setNewWeights] = useState({ assignments: 60, quizzes: 40 });
  const [savingWeights, setSavingWeights] = useState(false);

  useEffect(() => {
    const loadGrades = async () => {
      try {
        setLoading(true);
        if (isStudent) {
          const res = await courseApi.getStudentGrades(courseId);
          setMyGrades(res.data?.data?.grades || []);
          setFinalGrade(res.data?.data?.finalGrade || 0);
        } else if (isTeacher) {
          const res = await courseApi.getGradebook(courseId);
          setGradebook(res.data?.data || []);
        }
      } catch (error) {
        console.error('Failed to load grades:', error);
        toast.error('Failed to load grades');
      } finally {
        setLoading(false);
      }
    };

    loadGrades();
  }, [courseId, isStudent, isTeacher]);

  const handleSaveWeights = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWeights.assignments + newWeights.quizzes !== 100) {
      toast.error('Weights must add up to 100%');
      return;
    }

    setSavingWeights(true);
    try {
      await courseApi.setGradeWeights(courseId, newWeights);
      setWeights(newWeights);
      setShowWeightForm(false);
      toast.success('Grade weights updated');
    } catch (error) {
      toast.error('Failed to save weights');
    } finally {
      setSavingWeights(false);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    if (percentage >= 80) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (percentage >= 70) return 'text-amber-600 bg-amber-50 border-amber-100';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50 border-orange-100';
    return 'text-rose-600 bg-rose-50 border-rose-100';
  };

  const getGradeLabel = (percentage: number) => {
    if (percentage >= 90) return 'A (Excellent)';
    if (percentage >= 80) return 'B (Good)';
    if (percentage >= 70) return 'C (Satisfactory)';
    if (percentage >= 60) return 'D (Passing)';
    return 'F (Failing)';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">Grades & Performance</h1>
          <p className="page-subtitle mt-0.5">
            {isStudent ? 'View your grades and academic performance' : 'Manage grades and class analytics'}
          </p>
        </div>

        {isTeacher && (
          <button
            onClick={() => setShowWeightForm(!showWeightForm)}
            className={`btn h-10 px-4 gap-2 text-xs font-bold ${
              showWeightForm ? 'bg-slate-900 text-white' : 'btn-secondary'
            }`}
          >
            {showWeightForm ? <X size={14} /> : <Scale size={14} />}
            {showWeightForm ? 'Close' : 'Configure Weights'}
          </button>
        )}
      </header>

      {/* Weight Configuration Form */}
      <AnimatePresence>
        {showWeightForm && isTeacher && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm overflow-hidden"
          >
            <form onSubmit={handleSaveWeights} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-2 block">Assignment Weight (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newWeights.assignments}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setNewWeights({ assignments: val, quizzes: 100 - val });
                    }}
                    className="input-premium h-10 text-sm w-full"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-2 block">Quiz Weight (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newWeights.quizzes}
                    onChange={(e) => {
                      const val = parseInt(e.target.value) || 0;
                      setNewWeights({ quizzes: val, assignments: 100 - val });
                    }}
                    className="input-premium h-10 text-sm w-full"
                  />
                </div>
              </div>

              <div className={`p-3 rounded-lg border text-xs font-semibold flex items-center gap-2 ${
                newWeights.assignments + newWeights.quizzes === 100
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                  : 'bg-rose-50 border-rose-200 text-rose-700'
              }`}>
                {newWeights.assignments + newWeights.quizzes === 100 ? (
                  <CheckCircle2 size={16} />
                ) : (
                  <AlertCircle size={16} />
                )}
                Total: {newWeights.assignments + newWeights.quizzes}%
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={savingWeights || newWeights.assignments + newWeights.quizzes !== 100}
                  className="btn btn-primary btn-sm"
                >
                  {savingWeights ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setShowWeightForm(false)}
                  className="btn btn-secondary btn-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {isStudent ? (
        <div className="space-y-6">
          {/* Overall Grade Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Overall Grade</h2>
                <p className="text-xs text-slate-500 mt-1">Final course performance</p>
              </div>
              <Trophy className="text-primary-600" size={24} />
            </div>

            <div className="flex items-end gap-6">
              <div className="flex-1">
                <div className="text-4xl font-bold text-slate-900 mb-2">{Math.round(finalGrade)}%</div>
                <div className={`inline-block px-4 py-2 rounded-lg text-sm font-bold border ${getGradeColor(finalGrade)}`}>
                  {getGradeLabel(finalGrade)}
                </div>
              </div>

              <div className="w-32 h-32 rounded-full border-8 border-slate-100 flex items-center justify-center bg-slate-50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{Math.round(finalGrade)}</div>
                  <div className="text-xs text-slate-500 font-semibold">%</div>
                </div>
              </div>
            </div>
          </div>

          {/* Grade Breakdown */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-semibold mb-2">Assignment Average</p>
              <p className="text-2xl font-bold text-slate-900">
                {myGrades.filter(g => g.type === 'assignment').length > 0
                  ? Math.round(
                      myGrades
                        .filter(g => g.type === 'assignment')
                        .reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
                      myGrades.filter(g => g.type === 'assignment').length
                    )
                  : 0}%
              </p>
              <p className="text-xs text-slate-400 mt-1">{weights.assignments}% weight</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <p className="text-xs text-slate-500 font-semibold mb-2">Quiz Average</p>
              <p className="text-2xl font-bold text-slate-900">
                {myGrades.filter(g => g.type === 'quiz').length > 0
                  ? Math.round(
                      myGrades
                        .filter(g => g.type === 'quiz')
                        .reduce((sum, g) => sum + (g.score / g.maxScore) * 100, 0) /
                      myGrades.filter(g => g.type === 'quiz').length
                    )
                  : 0}%
              </p>
              <p className="text-xs text-slate-400 mt-1">{weights.quizzes}% weight</p>
            </div>
          </div>

          {/* Grade Details Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900">Grade Details</h3>
              <p className="text-xs text-slate-500 mt-1">All graded assessments</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Assessment</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Score</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-600">%</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {myGrades.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                        No grades posted yet
                      </td>
                    </tr>
                  ) : (
                    myGrades.map((grade) => {
                      const percentage = Math.round((grade.score / grade.maxScore) * 100);
                      return (
                        <tr key={grade._id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-medium text-slate-900">{grade.title}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              grade.type === 'quiz'
                                ? 'bg-purple-50 text-purple-600'
                                : 'bg-blue-50 text-blue-600'
                            }`}>
                              {grade.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-600">
                            {grade.score} / {grade.maxScore}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`font-bold ${getGradeColor(percentage)}`}>
                              {percentage}%
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Gradebook Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-premium pl-10 h-10 w-full text-sm"
            />
          </div>

          {/* Gradebook Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h3 className="font-bold text-slate-900">Class Gradebook</h3>
              <p className="text-xs text-slate-500 mt-1">{gradebook.length} students</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Assignments</th>
                    <th className="px-4 py-3 text-left text-xs font-bold text-slate-600">Quizzes</th>
                    <th className="px-4 py-3 text-right text-xs font-bold text-slate-600">Final Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {gradebook
                    .filter(
                      (g) =>
                        g.studentName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        g.email?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((entry) => (
                      <tr key={entry.studentId} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-slate-900">{entry.studentName}</p>
                            <p className="text-xs text-slate-500">{entry.email}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900">
                            {Math.round(entry.assignmentAverage)}%
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-semibold text-slate-900">
                            {Math.round(entry.quizAverage)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-bold px-3 py-1 rounded-lg border ${getGradeColor(entry.finalPercentage)}`}>
                            {Math.round(entry.finalPercentage)}%
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
