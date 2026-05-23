'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCourse } from '@/hooks/queries/useCourse';
import { useCourseLiveSessions } from '@/hooks/queries/useCourseResources';
import { useAuth } from '@/context/AuthContext';
import { studentApi } from '@/utils/api/studentApi';
import {
  FileText, FlaskConical,
  Video, ArrowRight, Mail,
  MapPin, Clock, Sparkles, AlertCircle
} from 'lucide-react';
import Link from 'next/link';

interface Milestone {
  id?: string;
  _id?: string;
  type: 'assignment' | 'quiz' | 'live_session';
  title: string;
  deadline: string;
  course?: { _id: string; title: string };
}

export default function CourseOverviewPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();

  const { data: course, isLoading: loading } = useCourse(courseId);
  const { data: liveSessions = [] } = useCourseLiveSessions(courseId);

  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loadingStudentData, setLoadingStudentData] = useState(false);

  const isStudent = user?.role === 'student';
  const hasLive = (liveSessions as { status: string }[] || []).some(s => s.status === 'live');

  useEffect(() => {
    if (isStudent && user) {
      setLoadingStudentData(true);
      studentApi.getMyMilestones()
        .then(res => setMilestones(res.data?.data || []))
        .catch(err => console.error('Error fetching milestones:', err))
        .finally(() => setLoadingStudentData(false));
    }
  }, [isStudent, user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          <div className="h-36 bg-slate-100 rounded-xl animate-pulse" />
          <div className="h-32 bg-slate-100 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-3">
          <div className="h-44 bg-slate-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  const teacherName = (typeof course?.teacher === 'object' && course.teacher?.name)
    ? course.teacher.name : 'Academic Lead';
  const teacherEmail = typeof course?.teacher === 'object' && 'email' in course.teacher
    ? (course.teacher as { email: string }).email : 'dept.faculty@university.edu';
  const teacherDept = typeof course?.teacher === 'object' && 'department' in course.teacher
    ? (course.teacher as { department: string }).department : 'Department of Computer Science';

  return (
    <div className="space-y-4 pb-8">
      {/* Live Banner */}
      {hasLive && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500" />
            </span>
            <p className="text-sm font-medium text-rose-800">A live lecture is active right now.</p>
          </div>
          <Link
            href={`/courses/${courseId}/live`}
            className="btn btn-sm gap-1 bg-rose-600 text-white hover:bg-rose-700 shrink-0"
          >
            Join <ArrowRight size={12} />
          </Link>
        </motion.div>
      )}

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">

        {/* Left: Main Content */}
        <div className="lg:col-span-2 space-y-4">

          {/* About */}
          <section className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-1.5 text-[11px] text-primary-600 font-semibold uppercase tracking-wider mb-2">
              <Sparkles size={11} />
              Course Overview
            </div>
            <h2 className="text-[15px] font-semibold text-slate-900 mb-2 leading-snug">
              Welcome to {course?.title}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {course?.description ||
                'Explore topics, practical applications, and the syllabus for this course. Access lectures, modules, assignments, and grades using the tabs above.'}
            </p>
          </section>

          {/* Instructor */}
          <section className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Instructor</h3>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm border border-primary-200 shrink-0 uppercase">
                {teacherName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold text-slate-900">{teacherName}</h4>
                <p className="text-[11px] text-slate-400 mb-2">{teacherDept}</p>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <Mail size={12} className="text-slate-400 shrink-0" />
                    <span className="truncate">{teacherEmail}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <MapPin size={12} className="text-slate-400 shrink-0" />
                    <span>Tech Hall, Room 402</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-500">
                    <Clock size={12} className="text-slate-400 shrink-0" />
                    <span>Office Hours: Tue &amp; Thu, 2:00–4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right: Sidebar */}
        <div className="space-y-4">
          {/* Upcoming Deadlines */}
          <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Upcoming Deadlines
            </h3>

            {loadingStudentData ? (
              <div className="space-y-2">
                <div className="h-10 bg-slate-50 rounded-lg animate-pulse" />
                <div className="h-10 bg-slate-50 rounded-lg animate-pulse" />
              </div>
            ) : isStudent && milestones.length > 0 ? (
              <div className="space-y-1.5">
                {milestones.slice(0, 4).map((m, idx) => (
                  <Link
                    key={m.id || idx}
                    href={`/courses/${courseId}/${m.type === 'assignment' ? 'assignments' : m.type === 'quiz' ? 'quizzes' : 'live'}`}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all group"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 shrink-0 group-hover:text-primary-600 group-hover:bg-primary-50 transition-colors">
                      {m.type === 'assignment' ? <FileText size={13} /> : m.type === 'quiz' ? <FlaskConical size={13} /> : <Video size={13} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-medium text-slate-700 truncate group-hover:text-primary-600">{m.title}</p>
                      <p className="text-[10px] text-slate-400">
                        Due {new Date(m.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <AlertCircle size={18} className="text-slate-200 mb-1.5" />
                <p className="text-[11px] text-slate-400">No upcoming deadlines</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
