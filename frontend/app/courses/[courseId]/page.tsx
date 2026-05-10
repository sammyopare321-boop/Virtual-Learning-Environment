'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { courseApi } from '@/utils/api/courseApi';
import { Course } from '@/types';
import { 
  BookOpen, FileText, FlaskConical, BarChart3, CheckSquare, 
  MessageSquare, Bell, Video, ChevronRight, GraduationCap,
  Calendar, Building2, User, Activity
} from 'lucide-react';

export default function CourseOverviewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (courseId) {
      courseApi.getOne(courseId)
        .then(res => setCourse(res.data.data))
        .finally(() => setLoading(false));
    }
  }, [courseId]);

  const tabs = [
    { label:'Modules',       href:`/courses/${courseId}/modules`,       icon:BookOpen,      color:'text-blue-600',    bg:'bg-blue-50' },
    { label:'Assignments',   href:`/courses/${courseId}/assignments`,    icon:FileText,      color:'text-indigo-600',  bg:'bg-indigo-50' },
    { label:'Quizzes',       href:`/courses/${courseId}/quizzes`,        icon:FlaskConical,  color:'text-purple-600',  bg:'bg-purple-50' },
    { label:'Grades',        href:`/courses/${courseId}/grades`,         icon:BarChart3,     color:'text-emerald-600', bg:'bg-emerald-50' },
    { label:'Attendance',    href:`/courses/${courseId}/attendance`,     icon:CheckSquare,   color:'text-teal-600',    bg:'bg-teal-50' },
    { label:'Discussions',   href:`/courses/${courseId}/discussions`,    icon:MessageSquare, color:'text-amber-600',   bg:'bg-amber-50' },
    { label:'Announcements', href:`/courses/${courseId}/announcements`,  icon:Bell,          color:'text-rose-600',    bg:'bg-rose-50' },
    { label:'Live Sessions', href:`/courses/${courseId}/live`,           icon:Video,         color:'text-red-600',     bg:'bg-red-50' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Left — Quick Links Grid */}
      <div className="flex-1 order-2 lg:order-1">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Course Sections</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {tabs.map((tab, idx) => (
            <motion.div 
              key={tab.href}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Link href={tab.href} className="group block relative overflow-hidden rounded-[24px] bg-white border border-slate-200 p-6 hover:border-blue-300 transition-all shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 h-full">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight size={20} className="text-blue-500" />
                </div>
                
                <div className={`w-14 h-14 rounded-2xl ${tab.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                  <tab.icon size={26} className={tab.color} />
                </div>
                
                <h3 className="text-lg font-extrabold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {tab.label}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  Access section tools
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Right — Course Info Sidebar */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0 order-1 lg:order-2">
        <h2 className="text-xl font-extrabold text-slate-900 mb-6">Course Details</h2>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden"
        >
          {/* Header Banner */}
          <div className="h-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            {course && (
              <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-2xl bg-white border-4 border-slate-50 flex items-center justify-center shadow-md">
                <GraduationCap size={28} className="text-blue-600" />
              </div>
            )}
          </div>

          <div className="pt-12 p-6">
            {loading ? (
              <div className="space-y-4">
                {[1,2,3,4].map(i => <div key={i} className="h-10 bg-slate-100 rounded-xl animate-pulse" />)}
              </div>
            ) : course ? (
              <div className="space-y-1">
                {[
                  { icon: BookOpen,   label: 'Course Code',   value: course.code },
                  { icon: Calendar,   label: 'Semester',      value: course.semester },
                  { icon: Activity,   label: 'Academic Year', value: course.academicYear },
                  { icon: Building2,  label: 'Department',    value: (course.teacher as any)?.department || 'N/A' },
                  { icon: User,       label: 'Instructor',    value: (course.teacher as any)?.name || 'TBA' },
                ].map((row, i) => (
                  <div key={row.label} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                    <div className="flex items-center gap-3">
                      <row.icon size={16} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">{row.label}</span>
                    </div>
                    <span className="text-sm font-extrabold text-slate-900 text-right">{row.value}</span>
                  </div>
                ))}
                
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className={`inline-flex items-center justify-center w-full px-4 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest ${
                    course.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border border-amber-100'
                  }`}>
                    {course.status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-slate-500 font-medium">Course data unavailable.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
