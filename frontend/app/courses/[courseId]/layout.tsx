'use client';
import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import Sidebar from '@/components/shared/Sidebar';
import { Course } from '@/types';
import { 
  Home, BookOpen, FileText, FlaskConical, BarChart3, 
  CheckSquare, MessageSquare, Bell, Video, ChevronRight, Loader2 
} from 'lucide-react';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const courseId = params.courseId as string;
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [toast, setToast] = useState<{ msg: string, type: string } | null>(null);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isOwner = isTeacher && (
    (typeof course?.teacher === 'object' && course.teacher?._id === user?._id) ||
    (course?.teacher === user?._id)
  );

  const showToast = (msg: string, type: string = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      if (!courseId) return;
      try {
        const res = await courseApi.getOne(courseId);
        if (!ignore) setCourse(res.data.data);
      } catch {
        if (!ignore) setCourse(null);
      } finally {
        if (!ignore) setLoading(false);
      }

      if (isStudent && !ignore) {
        try {
          const res = await courseApi.getMyCourses();
          const ids = (res.data.data || []).map((c: { _id: string }) => c._id);
          if (!ignore) setEnrolled(ids.includes(courseId));
        } catch {}
      }
    }
    startFetching();
    return () => { ignore = true; };
  }, [courseId, isStudent]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await courseApi.enroll(courseId);
      setEnrolled(true);
      showToast('Enrolled successfully!');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Enrollment failed.', 'error');
    } finally { setEnrolling(false); }
  };

  const handleDrop = async () => {
    setEnrolling(true);
    try {
      await courseApi.drop(courseId);
      setEnrolled(false);
      showToast('Course dropped.');
    } catch (err: any) {
      showToast(err.response?.data?.message || 'Failed to drop course.', 'error');
    } finally { setEnrolling(false); }
  };

  const tabs = [
    { label: 'Overview',     href: `/courses/${courseId}`,               icon: Home },
    { label: 'Modules',      href: `/courses/${courseId}/modules`,       icon: BookOpen },
    { label: 'Assignments',  href: `/courses/${courseId}/assignments`,    icon: FileText },
    { label: 'Quizzes',      href: `/courses/${courseId}/quizzes`,        icon: FlaskConical },
    { label: 'Grades',       href: `/courses/${courseId}/grades`,         icon: BarChart3 },
    { label: 'Attendance',   href: `/courses/${courseId}/attendance`,     icon: CheckSquare },
    { label: 'Discussions',  href: `/courses/${courseId}/discussions`,    icon: MessageSquare },
    { label: 'Announcements',href: `/courses/${courseId}/announcements`,  icon: Bell },
    { label: 'Live',         href: `/courses/${courseId}/live`,           icon: Video },
  ];

  if (loading) return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Loading course details...</p>
        </div>
      </main>
    </div>
  );

  if (!course) return (
    <div className="flex h-screen bg-slate-50 font-sans">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center bg-white border border-slate-200 rounded-[32px] p-12 max-w-lg shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-slate-100">
            <BookOpen size={32} className="text-slate-400" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Course not found</h2>
          <p className="text-slate-500 mb-8 font-medium">The course you are looking for does not exist or you do not have permission to view it.</p>
          <Link href="/courses" className="inline-flex items-center justify-center h-12 px-8 rounded-full bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5">
            Back to Catalog
          </Link>
        </div>
      </main>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-xl border flex items-center gap-2 ${
              toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {toast.type === 'error' ? <Bell size={16} /> : <CheckSquare size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <Sidebar />

      <main className="flex-1 flex flex-col h-full overflow-hidden relative z-10">
        
        {/* Top Header */}
        <div className="bg-white border-b border-slate-200 px-8 lg:px-12 pt-8 pb-0 shrink-0">
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">
            <Link href="/courses" className="hover:text-blue-600 transition-colors">Courses</Link>
            <ChevronRight size={14} />
            <span className="text-slate-900 truncate max-w-[200px]">{course.title}</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className="px-3 py-1 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold uppercase tracking-wider">
                  {course.code}
                </span>
                <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  course.status === 'active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {course.status}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  {course.semester} · {course.academicYear}
                </span>
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-2 truncate">
                {course.title}
              </h1>
              
              {course.description && (
                <p className="text-slate-500 font-medium max-w-3xl truncate">{course.description}</p>
              )}
            </div>

            {/* Actions */}
            <div className="shrink-0 flex items-center gap-3">
              {isStudent && course.status === 'active' && (
                enrolled ? (
                  <button onClick={handleDrop} disabled={enrolling} className="flex items-center justify-center h-11 px-6 rounded-xl bg-white border border-rose-200 text-rose-600 font-bold hover:bg-rose-50 shadow-sm transition-all disabled:opacity-50">
                    {enrolling ? <Loader2 size={18} className="animate-spin" /> : 'Drop Course'}
                  </button>
                ) : (
                  <button onClick={handleEnroll} disabled={enrolling} className="flex items-center justify-center h-11 px-6 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 hover:-translate-y-0.5">
                    {enrolling ? <Loader2 size={18} className="animate-spin" /> : 'Enroll Now'}
                  </button>
                )
              )}
              {isOwner && (
                <Link href={`/courses/${courseId}/settings`} className="flex items-center justify-center h-11 px-6 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 shadow-md shadow-slate-900/10 transition-all hover:-translate-y-0.5">
                  Manage Course
                </Link>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0 border-b-0 border-slate-200">
            {tabs.map(tab => {
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href} className={`flex items-center gap-2 px-4 py-3 border-b-2 font-bold text-sm whitespace-nowrap transition-colors ${
                  isActive 
                    ? 'border-blue-600 text-blue-600' 
                    : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
                }`}>
                  <tab.icon size={16} />
                  {tab.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </div>

      </main>
    </div>
  );
}
