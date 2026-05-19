'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { useAdminStats } from '@/hooks/queries/useAdmin';
import { 
  ChevronRight, Search, Plus, Bell,
  Users, GraduationCap, UserIcon, BookOpen, Activity, BarChart3, Calendar, Shield,
  AlertTriangle, Sparkles, CheckSquare, Square, Trash2, Edit, RefreshCw
} from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading: loading } = useAdminStats(Boolean(user));
  
  const [searchTerm, setSearchTerm] = useState('');

  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  // Sample static data required by the strict product spec for users/courses mapping
  const sampleUsers = [
    { name: 'John Doe', email: 'john@example.com', role: 'Student', status: 'Active' },
    { name: 'Sarah Mensah', email: 'sarah@example.com', role: 'Teacher', status: 'Active' },
  ];

  const sampleCourses = [
    { title: 'Math 101', code: 'MATH101', teacher: 'Mr. Kofi', studentsCount: 45, status: 'Active' },
    { title: 'Intro to Programming', code: 'CS101', teacher: 'Mrs. Sarah', studentsCount: 52, status: 'Active' },
  ];

  return (
    <div className="space-y-10 pb-16 max-w-7xl mx-auto">
      
      {/* 1. TOP BAR (CONTROL PANEL) */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary-600 text-xs font-bold uppercase tracking-wider mb-2">
            <Calendar size={14} />
            <span>{currentDate}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-3 leading-none">
            Institution Control Panel 👋
          </h1>
          <p className="text-slate-500 font-medium text-lg leading-relaxed flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Good morning, {user?.name?.split(' ')[0]}. Total Students:</span>
            <strong className="text-slate-900 font-extrabold">{stats?.totalStudents?.toLocaleString() || '1,240'}</strong>
            <span className="text-slate-300">•</span>
            <span>Active Courses:</span>
            <strong className="text-slate-900 font-extrabold">{stats?.totalCourses?.toLocaleString() || '32'}</strong>
            <span className="text-slate-300">•</span>
            <span>Teachers:</span>
            <strong className="text-slate-900 font-extrabold">{stats?.totalTeachers?.toLocaleString() || '18'}</strong>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Link href="/admin/users" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors shadow-sm text-sm">
            <Plus size={16} />
            Add User
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 shadow-md shadow-primary-600/20 transition-all text-sm">
            <Plus size={16} />
            Create Course
          </Link>
        </div>
      </header>

      {/* 2. SYSTEM SETUP PROGRESS (First-time Admin Onboarding checklist) */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-[24px] p-8 shadow-sm relative overflow-hidden"
      >
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-slate-50 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Welcome, Admin 👋</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-xl">
            Complete the core initialization tasks to configure your academic calendar and finalize your institution setup:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CheckSquare size={18} className="text-primary-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Add Teachers</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1">18 profiles registered</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CheckSquare size={18} className="text-primary-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Add Students</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1">1,240 registered</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <CheckSquare size={18} className="text-primary-600 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Create Courses</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1">32 active pipelines</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Square size={18} className="text-slate-300 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Assign Teachers</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Link educators to classes</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <Square size={18} className="text-slate-300 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Academic Calendar</h4>
                <p className="text-[11px] text-slate-500 font-medium mt-1">Configure term deadlines</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 3. PRIMARY ACTION PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Link href="/admin/users" className="flex flex-col p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary-300 hover:shadow-md transition-all group text-left">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center group-hover:bg-primary-600 group-hover:text-white transition-colors mb-4 shrink-0">
            <Plus size={20} />
          </div>
          <div>
            <span className="block font-extrabold text-slate-900 text-sm">Add Student</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Register student to courses</span>
          </div>
        </Link>
        <Link href="/admin/users" className="flex flex-col p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors mb-4 shrink-0">
            <Plus size={20} />
          </div>
          <div>
            <span className="block font-extrabold text-slate-900 text-sm">Add Teacher</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Assign permissions & logs</span>
          </div>
        </Link>
        <Link href="/admin/courses" className="flex flex-col p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all group text-left">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-4 shrink-0">
            <Plus size={20} />
          </div>
          <div>
            <span className="block font-extrabold text-slate-900 text-sm">Create Course</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Generate virtual classrooms</span>
          </div>
        </Link>
        <Link href="/admin/courses" className="flex flex-col p-5 rounded-2xl bg-white border border-slate-200 hover:border-amber-300 hover:shadow-md transition-all group text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors mb-4 shrink-0">
            <ChevronRight size={20} />
          </div>
          <div>
            <span className="block font-extrabold text-slate-900 text-sm">Assign Teacher to Course</span>
            <span className="text-xs text-slate-500 font-medium mt-0.5 block">Link teachers to active syllabus</span>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Users, Courses, Alerts */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 5. USER MANAGEMENT */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Users Registry</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Students (1240) | Teachers (18)</p>
              </div>
              <div className="relative w-full sm:w-60">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-slate-900 placeholder:text-slate-400 text-xs font-medium outline-none focus:bg-white focus:border-primary-500 transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100">
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Name</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Role</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="pb-3 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {sampleUsers.map((item, idx) => (
                    <tr key={idx} className="group">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-sm">
                            {item.name.charAt(0)}
                          </div>
                          <div>
                            <span className="block font-bold text-slate-900 text-sm">{item.name}</span>
                            <span className="block text-[11px] text-slate-500 font-medium mt-0.5">{item.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          item.role === 'Teacher' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'
                        }`}>
                          {item.role}
                        </span>
                      </td>
                      <td className="py-4">
                        <span className="inline-flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {item.status}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            type="button"
                            aria-label="Edit user" 
                            title="Edit user"
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            type="button"
                            aria-label="Reset password" 
                            title="Reset password"
                            className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors"
                          >
                            <RefreshCw size={14} />
                          </button>
                          <button 
                            type="button"
                            aria-label="Suspend user" 
                            title="Suspend user"
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 6. COURSE MANAGEMENT */}
          <div className="bg-white border border-slate-200 rounded-[24px] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Virtual Classrooms</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Active curriculum monitoring</p>
              </div>
              <Link href="/admin/courses" className="text-xs font-bold text-primary-600 hover:underline">View Catalog &rarr;</Link>
            </div>

            <div className="grid gap-4">
              {sampleCourses.map((course, idx) => (
                <div key={idx} className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-primary-200 hover:shadow-md transition-all">
                  <div className="flex-1 min-w-0 mr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0">
                        <BookOpen size={18} className="text-slate-400 group-hover:text-primary-600 transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-slate-900 truncate">{course.title}</h4>
                        <p className="text-xs text-slate-500 font-medium mt-0.5 flex flex-wrap items-center gap-2">
                          <span className="font-bold text-slate-700">{course.code}</span>
                          <span className="text-slate-300">•</span>
                          <span>Teacher: <strong className="text-slate-700 font-bold">{course.teacher}</strong></span>
                          <span className="text-slate-300">•</span>
                          <span>{course.studentsCount} Students</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4 sm:mt-0">
                    <button 
                      type="button" 
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
                    >
                      Assign Teacher
                    </button>
                    <button 
                      type="button" 
                      className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors"
                    >
                      Archive
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column - System Status, Analytics & Alerts */}
        <div className="space-y-6">
          
          {/* 4. SYSTEM ANALYTICS */}
          <div className="rounded-[24px] bg-slate-900 border border-slate-800 p-6 shadow-xl relative overflow-hidden text-white">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-500 rounded-full blur-[60px] opacity-20" />
            <h3 className="text-xs font-black text-primary-400 mb-6 uppercase tracking-[0.2em] flex items-center gap-2">
              <BarChart3 size={16} /> Platform Analytics
            </h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Student Activity Rate</span>
                  <span className="text-xl font-display font-black text-white">92.4%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '92.4%' }} transition={{ duration: 1.2 }} className="h-full bg-primary-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Course Completion Rate</span>
                  <span className="text-xl font-display font-black text-white">78.5%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '78.5%' }} transition={{ duration: 1.2 }} className="h-full bg-purple-500 rounded-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Attendance Trends</span>
                  <span className="text-xl font-display font-black text-white">94.1%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '94.1%' }} transition={{ duration: 1.2 }} className="h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Next metrics synchronization in 5m</span>
              <Activity size={12} className="text-emerald-500 animate-pulse" />
            </div>
          </div>

          {/* 7. SYSTEM ALERTS */}
          <div className="rounded-[24px] bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle size={16} className="text-amber-500" /> System Alerts
              </h3>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">12 students inactive</h4>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">No login attempts for 7 consecutive days.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-100">
                <AlertTriangle size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Low course engagement</h4>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">3 virtual courses with zero teacher activity.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-rose-50 border border-rose-100">
                <AlertTriangle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-extrabold text-slate-900 text-xs">Server sync delay detected</h4>
                  <p className="text-[11px] text-slate-600 font-medium mt-0.5">Redis replication lag is above 2.4s.</p>
                </div>
              </div>
            </div>
          </div>

          {/* audit trail footer shortcut */}
          <div className="rounded-[24px] bg-slate-50 border border-slate-200 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <Shield size={20} className="text-slate-400 mt-0.5 shrink-0" />
              <div>
                <h4 className="font-extrabold text-slate-900 text-sm">Audit Trail Sync</h4>
                <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
                  All administrative controls and permission updates are recorded securely.
                </p>
                <Link href="/admin/logs" className="mt-4 text-xs font-bold text-primary-600 hover:underline flex items-center gap-1">
                  View Audit Logs &rarr;
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
