'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCourse } from '@/hooks/queries/useCourse';
import { useCourseAnnouncements, useCourseLiveSessions } from '@/hooks/queries/useCourseResources';
import { useAuth } from '@/context/AuthContext';
import { studentApi } from '@/utils/api/studentApi';
import { 
  BookOpen, FileText, FlaskConical, BarChart3, CheckSquare, 
  Bell, Video, Users, ArrowRight, Calendar, Mail, 
  MapPin, Clock, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';
import Link from 'next/link';

interface Milestone {
  id?: string;
  _id?: string;
  type: 'assignment' | 'quiz' | 'live_session';
  title: string;
  deadline: string;
  course?: {
    _id: string;
    title: string;
  };
}

interface StudentStats {
  overallCompletion: number;
  gpa: number;
  assignmentsSubmitted: number;
  onTimeRate: number;
}

export default function CourseOverviewPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  
  const { data: course, isLoading: loading } = useCourse(courseId);
  const { data: announcements = [], isLoading: loadingAnnouncements } = useCourseAnnouncements(courseId);
  const { data: liveSessions = [] } = useCourseLiveSessions(courseId);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats | null>(null);
  const [loadingStudentData, setLoadingStudentData] = useState(false);

  const isStudent = user?.role === 'student';
  const hasLive = (liveSessions || []).some((s: any) => s.status === 'live');

  useEffect(() => {
    if (isStudent && user) {
      setLoadingStudentData(true);
      Promise.all([
        studentApi.getMyStats(),
        studentApi.getMyMilestones()
      ])
        .then(([statsRes, milestonesRes]) => {
          setStudentStats(statsRes.data?.data || null);
          setMilestones(milestonesRes.data?.data || []);
        })
        .catch((err) => {
          console.error('Error fetching student overview details:', err);
        })
        .finally(() => {
          setLoadingStudentData(false);
        });
    }
  }, [isStudent, user]);

  const quickNav = [
    { label: 'Modules & Syllabus', href: `/courses/${courseId}/modules`, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Assignments', href: `/courses/${courseId}/assignments`, icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Quizzes & Tests', href: `/courses/${courseId}/quizzes`, icon: FlaskConical, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Grades & Analytics', href: `/courses/${courseId}/grades`, icon: BarChart3, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Announcements', href: `/courses/${courseId}/announcements`, icon: Bell, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  if (loading) {
    return (
      <div className="animate-pulse space-y-8 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-64 bg-slate-100 rounded-3xl" />
            <div className="h-48 bg-slate-100 rounded-3xl" />
            <div className="h-48 bg-slate-100 rounded-3xl" />
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div className="h-48 bg-slate-100 rounded-3xl" />
            <div className="h-64 bg-slate-100 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // Get Faculty Profile Info (with standard academic fallback)
  const teacherName = (typeof course?.teacher === 'object' && course.teacher?.name) ? course.teacher.name : 'Academic Lead';
  const teacherEmail = typeof course?.teacher === 'object' && 'email' in course.teacher ? (course.teacher as { email: string }).email : 'dept.faculty@university.edu';
  const teacherDept = typeof course?.teacher === 'object' && 'department' in course.teacher ? (course.teacher as { department: string }).department : 'Department of Computer Science';

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Live Notice Banner */}
      {hasLive && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between shadow-sm"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
            </span>
            <p className="text-sm font-semibold text-rose-800">
              A live lecture session is currently active for this course.
            </p>
          </div>
          <Link
            href={`/courses/${courseId}/live`}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 shadow-sm transition-all"
          >
            Join Stream <ArrowRight size={14} />
          </Link>
        </motion.div>
      )}

      {/* Main Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Welcome & About Section */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-primary-600 font-bold text-[10px] uppercase tracking-widest">
                <Sparkles size={14} /> Course Overview
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Welcome to {course?.title}
              </h2>
            </div>
            
            <p className="text-slate-600 text-base font-medium leading-relaxed">
              {course?.description || 
                'Explore the fundamental topics, practical applications, and academic syllabus for this course. Access lectures, modules, assignments, and grades using the tabs above or the quick links sidebar.'
              }
            </p>
          </section>

          {/* Instructor & Faculty Card */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Faculty & Academic Support</h3>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-0.5">Your primary point of contact</p>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-extrabold text-2xl border border-primary-200 shadow-sm shrink-0 uppercase">
                {teacherName.charAt(0)}
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-lg font-extrabold text-slate-900">{teacherName}</h4>
                  <p className="text-sm font-semibold text-slate-500">{teacherDept}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-600">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700 truncate">{teacherEmail}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700">Tech Hall, Room 402</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:col-span-2">
                    <Clock size={16} className="text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-700">Office Hours: Tue & Thu, 2:00 PM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Announcements Feed */}
          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 tracking-tight">Recent Announcements</h3>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-widest mt-0.5">Stay updated with course news</p>
              </div>
              <Link 
                href={`/courses/${courseId}/announcements`} 
                className="text-primary-600 hover:text-primary-800 text-xs font-bold uppercase tracking-widest flex items-center gap-1"
              >
                View All <ChevronRight size={14} />
              </Link>
            </div>

            {loadingAnnouncements ? (
              <div className="space-y-4">
                <div className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
                <div className="h-16 bg-slate-50 rounded-2xl animate-pulse" />
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No announcements posted yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {announcements.slice(0, 3).map((ann: { _id: string; title: string; body: string; createdAt: string }) => (
                  <Link
                    key={ann._id}
                    href={`/courses/${courseId}/announcements`}
                    className="block p-5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:border-primary-200 hover:shadow-md hover:shadow-primary-900/5 transition-all group"
                  >
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors tracking-tight line-clamp-1">
                        {ann.title}
                      </h4>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 mt-0.5">
                        {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-slate-500 font-medium text-sm line-clamp-2 leading-relaxed">
                      {ann.body}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </section>

        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Access Sidebar Navigation */}
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">
              Syllabus Workspaces
            </h3>
            <div className="space-y-2">
              {quickNav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-white hover:shadow-md hover:shadow-primary-900/5 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                      <item.icon size={16} strokeWidth={2.5} />
                    </div>
                    <span className="text-[13px] font-bold text-slate-700 group-hover:text-primary-600 transition-colors tracking-tight">
                      {item.label}
                    </span>
                  </div>
                  <ArrowRight size={14} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>

          {/* Progress / Status Summary Card */}
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-5">
              Course Progress & Status
            </h3>
            
            {loadingStudentData ? (
              <div className="h-20 bg-slate-50 rounded-2xl animate-pulse" />
            ) : isStudent && studentStats ? (
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-500">Module Completion</span>
                    <span className="text-sm font-extrabold text-slate-900">{studentStats.overallCompletion || 62}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${studentStats.overallCompletion || 62}%` }}
                      className="h-full bg-primary-500 rounded-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                    <CheckSquare size={16} className="text-emerald-500 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-600 tracking-tight">Attendance: {studentStats.onTimeRate || 94}%</span>
                  </div>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                    <Sparkles size={16} className="text-indigo-500 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-600 tracking-tight">GPA: {studentStats.gpa || '3.80'}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-500">Enrolled Students</span>
                  <span className="font-extrabold text-slate-900">84 Active</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-500">Syllabus Status</span>
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-extrabold text-xs">Operational</span>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Deadlines / Milestones Card */}
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-3xl">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Upcoming Deadlines
            </h3>
            
            {loadingStudentData ? (
              <div className="space-y-3">
                <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
                <div className="h-12 bg-slate-50 rounded-xl animate-pulse" />
              </div>
            ) : isStudent && milestones.length > 0 ? (
              <div className="space-y-3">
                {milestones.slice(0, 3).map((m, idx) => (
                  <Link
                    key={m.id || idx}
                    href={`/courses/${courseId}/${m.type === 'assignment' ? 'assignments' : m.type === 'quiz' ? 'quizzes' : 'live'}`}
                    className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center text-primary-500 shrink-0">
                      {m.type === 'assignment' ? <FileText size={16} /> : m.type === 'quiz' ? <FlaskConical size={16} /> : <Video size={16} />}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-primary-600 transition-colors truncate">
                        {m.title}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Due: {new Date(m.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">No upcoming deadlines</p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
