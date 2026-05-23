'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import { useCoursesCatalog, useEnrolledCourseIds } from '@/hooks/queries/useCoursesCatalog';
import { queryKeys } from '@/lib/queryKeys';
import { AxiosError } from 'axios';
import {
  Search, Plus, BookOpen, User,
  ChevronRight, AlertCircle, CheckCircle2,
  SlidersHorizontal, Trash2, ArrowUpRight
} from 'lucide-react';

const statusColor: Record<string, { bg: string; text: string; border: string }> = {
  active:   { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-200' },
  draft:    { bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-200'   },
  archived: { bg: 'bg-slate-100',   text: 'text-slate-500',   border: 'border-slate-200'   },
};

export default function CoursesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: string } | null>(null);

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  const catalogParams = {
    ...(search ? { search } : {}),
    ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
  };

  const { data: courses = [], isLoading: loading } = useCoursesCatalog(catalogParams, {
    teacherId: user?._id,
    isTeacher,
    enabled: Boolean(user),
  });
  const { data: enrolled = new Set<string>() } = useEnrolledCourseIds(isStudent);

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      await courseApi.enroll(courseId);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.enrolled });
      showToast('Enrolled successfully!');
    } catch (err: unknown) {
      let msg = 'Failed to enroll';
      if (err instanceof AxiosError) msg = err.response?.data?.message || msg;
      showToast(msg, 'error');
    } finally {
      setEnrolling(null);
    }
  };

  const handleDelete = async (courseId: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      await courseApi.delete(courseId);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      showToast('Course deleted.');
    } catch (err: unknown) {
      let msg = 'Failed to delete course';
      if (err instanceof AxiosError) msg = err.response?.data?.message || msg;
      showToast(msg, 'error');
    }
  };

  const filterTabs = ['all', 'active', 'draft', 'archived'];

  return (
    <div className="space-y-5 pb-12">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -12, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -12, x: '-50%' }}
            className={`fixed top-4 left-1/2 z-[100] px-4 py-2.5 rounded-xl font-medium shadow-xl border flex items-center gap-2 text-sm ${
              toast.type === 'error'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title">
            {isTeacher ? 'My Courses' : 'Course Library'}
          </h1>
          <p className="page-subtitle mt-0.5">
            {isTeacher
              ? 'Manage your curriculum and track student progress.'
              : 'Explore and enroll in available courses.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search courses..."
              className="input-premium pl-8 pr-3 h-8 w-52 text-xs"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {user?.role === 'admin' && (
            <Link href="/admin/courses/new" className="btn btn-primary gap-1.5">
              <Plus size={14} strokeWidth={2.5} />
              New Course
            </Link>
          )}
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-0.5 border-b border-slate-100">
        {filterTabs.map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`relative px-3 py-2 text-[12px] font-medium capitalize transition-colors ${
              statusFilter === status
                ? 'text-primary-600'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {status}
            {statusFilter === status && (
              <motion.div
                layoutId="status-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      <section>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-56 rounded-xl bg-slate-100 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-slate-200 rounded-xl">
            <div className="w-12 h-12 bg-slate-50 rounded-xl mx-auto flex items-center justify-center mb-3 border border-slate-100">
              <BookOpen size={20} className="text-slate-300" />
            </div>
            <h3 className="text-sm font-semibold text-slate-700 mb-1">No courses found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {courses.map((course, idx) => {
              const isEnrolled = enrolled.has(course._id);
              const status = statusColor[course.status] || statusColor.active;
              const teacherName = typeof course.teacher === 'object'
                ? course.teacher?.name
                : 'Academic Faculty';

              return (
                <motion.div
                  key={course._id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                  className="group bg-white border border-slate-100 rounded-xl overflow-hidden flex flex-col hover:shadow-md hover:border-slate-200 transition-all duration-200"
                >
                  {/* Card header bar */}
                  <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 relative shrink-0">
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-white text-[10px] font-semibold backdrop-blur-sm">
                        {course.code}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                        {course.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3">
                      <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center">
                        <BookOpen size={14} className="text-white/70" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-3 flex-1 flex flex-col gap-2">
                    <div>
                      <h3 className="text-[13px] font-semibold text-slate-900 leading-tight line-clamp-2 group-hover:text-primary-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                        {course.description || 'No description provided.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-auto">
                      <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center">
                        <User size={10} className="text-slate-400" />
                      </div>
                      <p className="text-[11px] text-slate-500 truncate" title={teacherName}>{teacherName}</p>
                    </div>

                    {/* Action button */}
                    {isStudent ? (
                      isEnrolled ? (
                        <Link
                          href={`/courses/${course._id}`}
                          className="btn btn-primary btn-sm w-full mt-1 gap-1"
                        >
                          Continue <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </Link>
                      ) : (
                        <button
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrolling === course._id}
                          className="btn btn-secondary btn-sm w-full mt-1 hover:border-primary-500 hover:text-primary-600"
                        >
                          {enrolling === course._id ? 'Enrolling...' : 'Enroll'}
                        </button>
                      )
                    ) : (
                      <div className="flex gap-1.5 mt-1">
                        <Link
                          href={`/courses/${course._id}`}
                          className="btn btn-secondary btn-sm flex-1 gap-1 hover:border-primary-500 hover:text-primary-600"
                        >
                          Open <ArrowUpRight size={11} />
                        </Link>
                        <button
                          onClick={() => handleDelete(course._id, course.title)}
                          className="w-7 h-7 rounded-md border border-red-100 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center shrink-0"
                          title="Delete Course"
                          aria-label={`Delete course ${course.title}`}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
