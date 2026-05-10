'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '@/utils/api/courseApi';
import { useAuth } from '@/context/AuthContext';
import { 
  Video, Radio, Plus, Search, Filter, 
  ChevronRight, Calendar, User, Clock, 
  Sparkles, Monitor, Camera, Users,
  Play, ExternalLink, Loader2, Info
} from 'lucide-react';

interface LiveSession {
  _id: string;
  title: string;
  startTime: string;
  duration: number;
  status: 'upcoming' | 'live' | 'ended';
  meetingLink: string;
  description?: string;
}

export default function LivePage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const [sessions, setSessions] = useState<LiveSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    courseApi.getLiveSessions(courseId)
      .then(res => setSessions(res.data.data || []))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  const liveSessions = sessions.filter(s => s.status === 'live');
  const upcomingSessions = sessions.filter(s => s.status === 'upcoming');

  return (
    <div className="max-w-[1200px] mx-auto p-8 lg:p-12">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <Radio size={14} className="animate-pulse" />
            Synchronous Learning
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6"
          >
            Live <span className="text-blue-600">Sessions.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed"
          >
            Join real-time lectures, workshops, and office hours. Connect with your instructors and peers instantly.
          </motion.p>
        </div>

        {user?.role === 'teacher' && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
          >
            <Plus size={20} strokeWidth={3} /> Schedule Session
          </motion.button>
        )}
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[40px] animate-pulse border border-slate-200" />)}
        </div>
      ) : (
        <div className="space-y-20">
          
          {/* Live Now Section */}
          {liveSessions.length > 0 && (
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-600"></span>
                </div>
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Happening Now</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {liveSessions.map((session, i) => (
                  <motion.div 
                    key={session._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="relative p-10 rounded-[48px] bg-slate-900 text-white overflow-hidden group shadow-2xl shadow-blue-900/20 border border-white/5"
                  >
                    <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                      <Camera size={160} />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-8">
                        <span className="px-4 py-1.5 rounded-full bg-rose-600 text-[10px] font-black uppercase tracking-widest">Live Now</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                           <Users size={14} /> 42 Joined
                        </span>
                      </div>
                      <h3 className="text-3xl font-black mb-4 tracking-tight leading-none">{session.title}</h3>
                      <p className="text-slate-400 font-medium mb-10 text-lg leading-relaxed max-w-md">
                        {session.description || 'Jump into the live session and participate in real-time discussion.'}
                      </p>
                      <a 
                        href={session.meetingLink} target="_blank" rel="noreferrer"
                        className="inline-flex items-center justify-center gap-3 h-16 px-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-black text-lg transition-all active:scale-95 shadow-xl shadow-blue-900/50 uppercase tracking-widest"
                      >
                        <Play size={20} fill="currentColor" /> Join Session
                      </a>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Upcoming Section */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-8">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Upcoming Schedule</h2>
              <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 transition-colors">Sync Calendar</button>
            </div>

            {upcomingSessions.length === 0 && liveSessions.length === 0 ? (
               <div className="bg-white rounded-[48px] border border-slate-200 p-24 text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-10">
                    <Monitor size={48} className="text-blue-200" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">No sessions scheduled.</h3>
                  <p className="text-slate-500 font-medium max-w-sm mx-auto leading-relaxed">
                    Check back soon or contact your instructor for information about upcoming live sessions.
                  </p>
               </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {upcomingSessions.map((session, i) => (
                  <motion.div 
                    key={session._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-[40px] border border-slate-200 p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <Calendar size={28} />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Start Time</span>
                        <span className="text-sm font-black text-slate-900 uppercase">
                          {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                      {session.title}
                    </h4>
                    
                    <div className="flex items-center gap-3 mb-8 text-slate-400">
                       <Clock size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">{session.duration} Minutes</span>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</span>
                          <span className="text-sm font-black text-slate-900 uppercase">
                            {new Date(session.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                          </span>
                       </div>
                       <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-blue-600 hover:text-white transition-all font-black text-[10px] uppercase tracking-widest">
                         Details <Info size={14} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Engagement Stats Panel (Teacher only) */}
      {user?.role === 'teacher' && sessions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="mt-24 bg-white rounded-[48px] border border-slate-200 p-12 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-12"
        >
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Session Engagement Analytics.</h2>
            <p className="text-slate-500 font-medium text-lg max-w-xl leading-relaxed">
              Track student attendance, participation rates, and engagement duration for all your synchronous sessions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 shrink-0">
             <div className="text-center">
                <p className="text-4xl font-black text-blue-600 tracking-tighter">92%</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Avg Attendance</p>
             </div>
             <div className="text-center">
                <p className="text-4xl font-black text-blue-600 tracking-tighter">4.8/5</p>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Satisfaction</p>
             </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
