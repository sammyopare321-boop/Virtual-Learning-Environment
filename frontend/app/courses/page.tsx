'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import { Course } from '@/types';
import { AxiosError } from 'axios';
import Sidebar from '@/components/shared/Sidebar';
import { 
  Search, Filter, Plus, BookOpen, User, 
  ChevronRight, Sparkles, AlertCircle, CheckCircle2 
} from 'lucide-react';

const statusColor: Record<string, { bg: string, text: string, border: string }> = {
  active:   { bg: 'bg-emerald-50',  text: 'text-emerald-700', border: 'border-emerald-100' },
  draft:    { bg: 'bg-amber-50',    text: 'text-amber-700',   border: 'border-amber-100' },
  archived: { bg: 'bg-slate-100',   text: 'text-slate-600',   border: 'border-slate-200' },
};

const cardAccents = [
  'from-blue-600 to-indigo-700',
  'from-emerald-600 to-teal-700',
  'from-violet-600 to-purple-700',
  'from-rose-600 to-pink-700',
  'from-amber-600 to-orange-700',
  'from-sky-600 to-blue-700',
];

export default function CoursesPage() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string, type: string } | null>(null);

  const showToast = (msg: string, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    if (isStudent) {
      courseApi.getMyCourses()
        .then(res => {
          const ids = new Set<string>((res.data.data || []).map((c: Course) => c._id));
          setEnrolled(ids);
        })
        .catch(() => {});
    }
  }, [isStudent]);

  const fetchCourses = useCallback(() => {
    const params: { search?: string; status?: string } = {};
    if (search) params.search = search;
    if (statusFilter !== 'all') params.status = statusFilter;
    
    courseApi.getAll(params)
      .then(res => {
        let all: Course[] = res.data.data || [];
        if (isTeacher) {
          all = all.filter((c: Course) => {
            const tId = typeof c.teacher === 'object' ? c.teacher?._id : c.teacher;
            return tId === user?._id;
          });
        }
        setCourses(all);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [search, statusFilter, isTeacher, user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      await courseApi.enroll(courseId);
      setEnrolled(prev => new Set([...prev, courseId]));
      showToast('Successfully enrolled in course!');
    } catch (err: unknown) {
      let msg = 'Failed to enroll';
      if (err instanceof AxiosError) msg = err.response?.data?.message || msg;
      showToast(msg, 'error');
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, x: '-50%' }} animate={{ opacity: 1, y: 0, x: '-50%' }} exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-8 left-1/2 z-50 px-6 py-3 rounded-full font-bold shadow-xl border flex items-center gap-2 ${
              toast.type === 'error' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}
          >
            {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 overflow-y-auto p-8 lg:p-12 scroll-smooth">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="flex-1">
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
              >
                <Sparkles size={14} />
                Knowledge Ecosystem
              </motion.div>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6"
              >
                {isTeacher ? 'My Teaching' : 'Explore'} <span className="text-blue-600">Courses.</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed"
              >
                {isTeacher 
                  ? 'Manage your academic curriculum, track student progress, and organize your teaching materials.' 
                  : 'Expand your horizons with our curated selection of professional and academic courses.'}
              </motion.p>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
                <input 
                  type="text" 
                  placeholder="Search courses..."
                  className="bg-white border border-slate-200 text-slate-900 pl-14 pr-6 h-16 rounded-2xl focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none font-bold shadow-sm w-full md:w-80"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              {user?.role === 'admin' && (
                <Link href="/admin/courses/new" className="h-16 px-8 rounded-2xl bg-blue-600 text-white font-black flex items-center gap-3 hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest text-sm">
                  <Plus size={20} strokeWidth={3} /> Create
                </Link>
              )}
            </div>
          </header>

          {/* Filter Bar */}
          <div className="flex items-center gap-4 mb-10 overflow-x-auto pb-4 no-scrollbar">
            {['all', 'active', 'draft', 'archived'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-slate-900 text-white shadow-lg' 
                    : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-[400px] rounded-[40px] bg-white border border-slate-100 animate-pulse" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-sm"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-inner">
                <BookOpen size={48} className="text-blue-600/20" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">No courses found.</h3>
              <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                We couldn't find any courses matching your current search or filters.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {courses.map((course, idx) => {
                const accent = cardAccents[idx % cardAccents.length];
                const isEnrolled = enrolled.has(course._id);
                const status = statusColor[course.status] || statusColor.active;
                const teacherName = typeof course.teacher === 'object' ? course.teacher?.name : 'TBA';

                return (
                  <motion.div
                    key={course._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="group relative bg-white rounded-[40px] border border-slate-200 hover:border-blue-500 transition-all duration-500 overflow-hidden hover:shadow-2xl hover:shadow-blue-900/5 hover:-translate-y-1"
                  >
                    {/* Course Banner */}
                    <div className={`h-32 bg-gradient-to-br ${accent} p-8 relative overflow-hidden`}>
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
                      <div className="relative z-10 flex justify-between items-start">
                        <span className="px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
                          {course.code}
                        </span>
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${status.bg} ${status.text} ${status.border}`}>
                          {course.status}
                        </span>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col h-[calc(100%-128px)]">
                      <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-slate-500 font-medium line-clamp-2 mb-8 text-sm leading-relaxed">
                        {course.description || 'No description provided for this academic program.'}
                      </p>

                      <div className="mt-auto">
                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 mb-8">
                          <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Instructor</p>
                            <p className="text-sm font-black text-slate-700 leading-none">{teacherName}</p>
                          </div>
                        </div>

                        {isStudent ? (
                          isEnrolled ? (
                            <Link 
                              href={`/courses/${course._id}`}
                              className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-slate-900 text-white font-black text-sm hover:bg-blue-600 transition-all uppercase tracking-widest shadow-xl shadow-slate-900/10 group/btn"
                            >
                              Continue Learning <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                          ) : (
                            <button 
                              onClick={() => handleEnroll(course._id)}
                              disabled={enrolling === course._id}
                              className="w-full h-14 rounded-2xl border-2 border-slate-200 text-slate-900 font-black text-sm hover:border-blue-500 hover:text-blue-600 transition-all uppercase tracking-widest disabled:opacity-50"
                            >
                              {enrolling === course._id ? 'Enrolling...' : 'Enroll in Course'}
                            </button>
                          )
                        ) : (
                          <Link 
                            href={`/courses/${course._id}`}
                            className="flex items-center justify-center gap-2 w-full h-14 rounded-2xl bg-slate-100 text-slate-600 font-black text-sm hover:bg-slate-200 transition-all uppercase tracking-widest"
                          >
                            View Course Hub <ChevronRight size={18} />
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
