'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '@/utils/api/courseApi';
import { useAuth } from '@/context/AuthContext';
import { 
  Users, Calendar, CheckCircle2, XCircle, 
  Clock, Filter, Search, Plus, 
  BarChart3, UserCheck, AlertCircle, 
  ChevronRight, ArrowRight, Loader2, Sparkles
} from 'lucide-react';

interface AttendanceRecord {
  _id: string;
  date: string;
  isPresent: boolean;
  notes?: string;
  course: string;
  student: {
    _id: string;
    name: string;
    email: string;
  };
}

interface AttendanceSession {
  date: string;
  presentCount: number;
  absentCount: number;
  totalCount: number;
}

export default function AttendancePage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'calendar' | 'list'>('list');

  useEffect(() => {
    courseApi.getAttendance(courseId)
      .then(res => setAttendance(res.data.data || []))
      .catch(() => setAttendance([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  // Aggregate stats for teachers
  const sessions: AttendanceSession[] = Array.from(new Set(attendance.map(a => a.date.split('T')[0]))).map(date => {
    const records = attendance.filter(a => a.date.startsWith(date));
    return {
      date,
      presentCount: records.filter(r => r.isPresent).length,
      absentCount: records.filter(r => !r.isPresent).length,
      totalCount: records.length
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Student specific stats
  const studentStats = {
    present: attendance.filter(a => a.isPresent).length,
    absent: attendance.filter(a => !a.isPresent).length,
    total: attendance.length,
    rate: attendance.length > 0 ? Math.round((attendance.filter(a => a.isPresent).length / attendance.length) * 100) : 0
  };

  return (
    <div className="max-w-[1200px] mx-auto p-8 lg:p-12">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <UserCheck size={14} />
            Academic Presence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6"
          >
            Attendance <span className="text-blue-600">Tracking.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed"
          >
            {user?.role === 'teacher' 
              ? 'Oversee and manage student attendance records for your course sessions.' 
              : 'Track your attendance history and maintain your academic standing.'}
          </motion.p>
        </div>

        {user?.role === 'teacher' && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
          >
            <Plus size={20} strokeWidth={3} /> Mark Attendance
          </motion.button>
        )}
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {[
          { label: user?.role === 'student' ? 'My Presence' : 'Overall Attendance', value: `${studentStats.rate}%`, icon: UserCheck, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Sessions Logged', value: user?.role === 'student' ? studentStats.total : sessions.length, icon: Calendar, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
          { label: 'Status', value: studentStats.rate > 75 ? 'Healthy' : 'At Risk', icon: AlertCircle, color: studentStats.rate > 75 ? 'text-emerald-600' : 'text-rose-600', bg: studentStats.rate > 75 ? 'bg-emerald-50' : 'bg-rose-50', border: studentStats.rate > 75 ? 'border-emerald-100' : 'border-rose-100' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="p-8 rounded-[32px] bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.border} border flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              <stat.icon size={28} className={stat.color} />
            </div>
            <p className="text-4xl font-black text-slate-900 mb-1 tracking-tighter">{stat.value}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3,4,5].map(i => <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />)}
        </div>
      ) : user?.role === 'student' ? (
        /* Student View: History List */
        <div className="bg-white rounded-[40px] border border-slate-200 overflow-hidden shadow-sm">
          <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Attendance History</h3>
            <div className="flex gap-2">
               <button aria-label="Filter attendance" title="Filter attendance" className="p-2 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-blue-600 transition-colors"><Filter size={18} /></button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white border-b border-slate-100">
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Date</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Session Note</th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {attendance.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <p className="text-slate-400 font-bold">No attendance records found yet.</p>
                    </td>
                  </tr>
                ) : attendance.map((record) => (
                  <tr key={record._id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                          <Calendar size={18} />
                        </div>
                        <span className="font-bold text-slate-700">{new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                        record.isPresent ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}>
                        {record.isPresent ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {record.isPresent ? 'Present' : 'Absent'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-medium text-slate-500">{record.notes || 'Regular Class Session'}</span>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <button aria-label="View record details" title="View record details" className="text-slate-400 hover:text-slate-900 transition-colors"><ChevronRight size={20} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Teacher View: Sessions List */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.length === 0 ? (
            <div className="col-span-full bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-sm">
               <div className="w-24 h-24 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
                  <UserCheck size={48} className="text-slate-200" />
               </div>
               <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">No sessions logged.</h3>
               <p className="text-slate-500 font-medium max-w-xs mx-auto mb-10 leading-relaxed">
                 You haven&apos;t marked attendance for any sessions in this course yet.
               </p>
               <button className="px-8 py-4 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 uppercase tracking-widest text-sm">
                 Create First Session
               </button>
            </div>
          ) : sessions.map((session, i) => (
            <motion.div 
              key={session.date}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-white rounded-[32px] border border-slate-200 p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                  <Calendar size={24} />
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{session.date}</span>
              </div>
              
              <h4 className="text-xl font-black text-slate-900 mb-8 tracking-tight">
                {new Date(session.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
              </h4>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500 uppercase tracking-widest">Attendance Rate</span>
                  <span className="text-slate-900">{Math.round((session.presentCount / session.totalCount) * 100)}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${(session.presentCount / session.totalCount) * 100}%` }} transition={{ duration: 1 }} className="h-full bg-blue-600" />
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest leading-none mb-1">Present</span>
                    <span className="text-lg font-black text-slate-900">{session.presentCount}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-rose-600 uppercase tracking-widest leading-none mb-1">Absent</span>
                    <span className="text-lg font-black text-slate-900">{session.absentCount}</span>
                  </div>
                </div>
                <button aria-label="View session details" title="View session details" className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center group/btn">
                  <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
