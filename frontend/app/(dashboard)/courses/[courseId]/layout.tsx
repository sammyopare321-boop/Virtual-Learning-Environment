'use client';
import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useCourse } from '@/hooks/queries/useCourse';
import {
  Home, BookOpen, FileText, FlaskConical, BarChart3,
  CheckSquare, MessageSquare, Bell, Video, ChevronRight,
  Loader2, Sparkles, GraduationCap, Settings as SettingsIcon
} from 'lucide-react';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const courseId = params.courseId as string;
  const pathname = usePathname();
  const { user } = useAuth();

  const { data: course, isLoading, isError } = useCourse(courseId);

  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const isOwner =
    isAdmin ||
    (isTeacher &&
      ((typeof course?.teacher === 'object' && course.teacher?._id === user?._id) ||
        course?.teacher === user?._id));

  const tabs = [
    { label: 'Overview', href: `/courses/${courseId}`, icon: Home },
    { label: 'Modules', href: `/courses/${courseId}/modules`, icon: BookOpen },
    { label: 'Assignments', href: `/courses/${courseId}/assignments`, icon: FileText },
    { label: 'Quizzes', href: `/courses/${courseId}/quizzes`, icon: FlaskConical },
    { label: 'Grades', href: `/courses/${courseId}/grades`, icon: BarChart3 },
    { label: 'Attendance', href: `/courses/${courseId}/attendance`, icon: CheckSquare },
    { label: 'Discussions', href: `/courses/${courseId}/discussions`, icon: MessageSquare },
    { label: 'Announcements', href: `/courses/${courseId}/announcements`, icon: Bell },
    { label: 'Live', href: `/courses/${courseId}/live`, icon: Video },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading workspace environment...</p>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex items-center justify-center p-8 min-h-[400px]">
        <div className="text-center bg-white border border-slate-200 rounded-[40px] p-16 max-w-lg shadow-sm">
          <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-rose-100 text-rose-600">
            <GraduationCap size={32} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Course not found.</h2>
          <p className="text-slate-500 mb-10 font-medium leading-relaxed">
            The academic program you are looking for does not exist or has been archived.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center h-14 px-10 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-95 uppercase tracking-widest text-xs"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-[24px] border border-slate-100 p-6 lg:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 text-[11px] font-semibold text-slate-500 tracking-wide">
                <Link href="/courses" className="hover:text-primary-600 transition-colors">Courses</Link>
                <ChevronRight size={12} className="text-slate-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-primary-50 text-primary-700 text-[11px] font-semibold tracking-wide">
                {course.code}
              </span>
              <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold tracking-wide ${ course.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600' }`}>
                {course.status}
              </span>
            </div>

            <div className="flex items-end gap-4">
              <h1 className="text-2xl lg:text-3xl font-display font-bold text-slate-900 tracking-tight leading-tight">
                {course.title}
              </h1>
              <div className="hidden sm:flex items-center gap-1.5 text-[12px] font-medium text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 mb-1">
                <Sparkles size={14} className="text-amber-400" />
                {course.semester} · {course.academicYear}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isOwner && (
              <Link
                href={`/courses/${courseId}/settings`}
                className="btn btn-primary h-10 px-5 gap-2 text-sm shadow-md shadow-primary-500/10 rounded-xl"
              >
                <SettingsIcon size={16} /> Manage Course
              </Link>
            )}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <div className="flex flex-wrap bg-slate-100/80 p-1.5 rounded-[16px] gap-1 relative z-10">
            {tabs.map((tab) => {
              const isActive =
                pathname === tab.href ||
                (tab.href !== `/courses/${courseId}` && pathname.startsWith(tab.href));
              return (
                <Link
                  key={tab.href}
                  href={tab.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-[13px] transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50 border border-transparent'
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="min-h-[500px]"
      >
        {children}
      </motion.div>
    </div>
  );
}
