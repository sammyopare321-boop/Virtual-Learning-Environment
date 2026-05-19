'use client';

import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useCourse } from '@/hooks/queries/useCourse';
import { useCourseLiveSessions } from '@/hooks/queries/useCourseResources';
import { LiveSession } from '@/types';
import CourseIntelligence from '@/components/dashboard/CourseIntelligence';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, FileText, FlaskConical, BarChart3, CheckSquare, 
  MessageSquare, Bell, Video, GraduationCap,
  Calendar, Building2, User, Activity, ArrowRight,
  Sparkles, Layers, Settings, Users, Share2
} from 'lucide-react';
import Link from 'next/link';
import { communicationApi } from '@/utils/api/communicationApi';

export default function CourseOverviewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user } = useAuth();
  const { data: course, isLoading: loading } = useCourse(courseId);
  const { data: liveSessions = [] } = useCourseLiveSessions(courseId);
  const hasLive = liveSessions.some((s: LiveSession) => s.status === 'live');

  const navigation = [
    { label:'Module Content', href:`/courses/${courseId}/modules`,       icon:BookOpen,      color:'text-blue-500',    bg:'bg-blue-50' },
    { label:'Assignments',   href:`/courses/${courseId}/assignments`,    icon:FileText,      color:'text-indigo-500',  bg:'bg-indigo-50' },
    { label:'Assessments',   href:`/courses/${courseId}/quizzes`,        icon:FlaskConical,  color:'text-purple-500',  bg:'bg-purple-50' },
    { label:'Academic Hub',  href:`/courses/${courseId}/grades`,         icon:BarChart3,     color:'text-emerald-500', bg:'bg-emerald-50' },
    { label:'Communications', href:`/courses/${courseId}/announcements`,  icon:Bell,          color:'text-amber-500',   bg:'bg-amber-50' },
  ];

  if (loading) return (
    <div className="animate-pulse space-y-8">
      <div className="h-40 bg-slate-50 rounded-[32px]" />
      <div className="grid grid-cols-12 gap-8">
        <div className="col-span-9 h-96 bg-slate-50 rounded-[32px]" />
        <div className="col-span-3 space-y-4">
           {[1,2,3,4].map(i => <div key={i} className="h-16 bg-slate-50 rounded-2xl" />)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      {/* Course Header Hero */}
      <section className="relative rounded-[24px] overflow-hidden bg-slate-900 text-white shadow-xl shadow-slate-900/10 max-w-6xl mx-auto min-h-[320px] lg:min-h-[380px] flex flex-col justify-end">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent z-10" />
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-40 bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80')] bg-cover bg-center" />
        
        <div className="relative z-20 p-8 lg:p-12 flex flex-col md:flex-row md:items-end justify-between gap-8 mt-auto">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-lg bg-primary-500 text-[11px] font-bold tracking-wide">
                {course?.code}
              </span>
              <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/10 text-[11px] font-bold tracking-wide">
                {course?.semester} • {course?.academicYear}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold tracking-tight max-w-2xl leading-[1.1]">
              {course?.title}
            </h1>
            <div className="flex items-center gap-6 pt-4">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center font-bold text-xs uppercase">
                    {typeof course?.teacher === 'object' ? course.teacher?.name?.charAt(0) : 'T'}
                  </div>
                  <span className="text-sm font-bold text-slate-300">
                    Faculty: <span className="text-white">{typeof course?.teacher === 'object' ? course.teacher?.name : 'Academic Lead'}</span>
                  </span>
               </div>
               <div className="flex items-center gap-2">
                  <Users size={16} className="text-primary-400" />
                  <span className="text-sm font-bold text-slate-300">84 Students Enrolled</span>
               </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {hasLive && (
              <Link href={`/courses/${courseId}/live`} className="btn bg-rose-500 hover:bg-rose-600 text-white h-14 px-8 shadow-xl shadow-rose-500/30">
                <div className="w-2 h-2 rounded-full bg-white animate-ping mr-2" />
                Join Live Now
              </Link>
            )}
            <div className="flex gap-2">
              <button 
                aria-label="Share Course"
                title="Share Course"
                className="btn btn-secondary h-12 w-12 p-0 rounded-xl"
              >
                <Share2 size={18} />
              </button>
              <Link 
                href={`/courses/${courseId}/settings`} 
                aria-label="Course Settings"
                title="Course Settings"
                className="btn btn-secondary h-12 w-12 p-0 rounded-xl"
              >
                <Settings size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
        
        {/* Main Intelligence Panel */}
        <div className="lg:col-span-8">
          <CourseIntelligence />
        </div>

        {/* Quick Access Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-[24px]">
            <h3 className="text-[13px] font-bold text-slate-900 mb-4 px-2 flex items-center gap-2">
              <Layers size={16} className="text-primary-500" /> Knowledge Access
            </h3>
            <div className="space-y-1.5">
              {navigation.map((item, idx) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link 
                    href={item.href}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary-200 hover:bg-white hover:shadow-md hover:shadow-primary-900/5 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                        <item.icon size={16} strokeWidth={2.5} />
                      </div>
                      <span className="text-[13px] font-semibold text-slate-700 group-hover:text-primary-600 transition-colors tracking-tight">{item.label}</span>
                    </div>
                    <ArrowRight size={14} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Smart Summary Card */}
          <div className="p-6 bg-white border border-slate-200 shadow-sm rounded-[24px] overflow-hidden relative group">
             <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary-500/10 transition-colors" />
             <h4 className="text-[13px] font-bold text-slate-900 mb-5 flex items-center gap-2">
               <Activity size={16} className="text-primary-500" /> Syllabus Status
             </h4>
             <div className="space-y-5">
                <div>
                  <div className="flex justify-between items-end mb-2">
                     <span className="text-xs font-semibold text-slate-500">Module Completion</span>
                     <span className="text-sm font-bold text-slate-900">62%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                     <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '62%' }}
                      className="h-full bg-primary-500 rounded-full" 
                     />
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                   <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                      <CheckSquare size={16} />
                   </div>
                   <span className="text-[12px] font-semibold text-slate-600 tracking-wide">Attendance: 94%</span>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
