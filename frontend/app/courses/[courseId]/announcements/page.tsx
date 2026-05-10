'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '@/utils/api/courseApi';
import { useAuth } from '@/context/AuthContext';
import { 
  Bell, Megaphone, Plus, Search, Filter, 
  ChevronRight, Calendar, User, Clock, 
  Sparkles, Pin, MoreVertical, Trash2, 
  Edit3, MessageCircle, Info, Loader2
} from 'lucide-react';

interface Announcement {
  _id: string;
  title: string;
  content: string;
  isPinned: boolean;
  createdAt: string;
  author: {
    _id: string;
    name: string;
    role: string;
  };
}

export default function AnnouncementsPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    courseApi.getAnnouncements(courseId)
      .then(res => setAnnouncements(res.data.data || []))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  const filteredAnnouncements = announcements.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto p-8 lg:p-12">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
          >
            <Bell size={14} />
            Communication Hub
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6"
          >
            Course <span className="text-blue-600">Announcements.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed"
          >
            Stay updated with the latest news, deadlines, and important updates directly from your instructors.
          </motion.p>
        </div>

        {user?.role === 'teacher' && (
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
          >
            <Plus size={20} strokeWidth={3} /> New Announcement
          </motion.button>
        )}
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search announcements..."
            className="w-full bg-white border border-slate-200 text-slate-900 pl-14 pr-6 h-16 rounded-2xl focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none font-bold shadow-sm"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="h-16 px-8 rounded-2xl bg-white border border-slate-200 text-slate-600 font-black flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest text-xs">
          <Filter size={18} /> Filters
        </button>
      </div>

      {loading ? (
        <div className="space-y-6">
          {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-100 rounded-[32px] animate-pulse border border-slate-200" />)}
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-sm"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
            <Megaphone size={40} className="text-blue-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Quiet in the halls.</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
            There are no announcements for this course yet. Check back later for updates!
          </p>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {filteredAnnouncements.map((ann, i) => (
            <motion.div
              key={ann._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white rounded-[32px] border border-slate-200 p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500"
            >
              {ann.isPinned && (
                <div className="absolute top-8 right-8 text-blue-600 flex items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-widest">Pinned</span>
                  <Pin size={16} fill="currentColor" />
                </div>
              )}
              
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shrink-0">
                  <Megaphone size={28} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <User size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{ann.author.name}</span>
                    </div>
                    <div className="hidden md:block w-1 h-1 rounded-full bg-slate-200" />
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock size={14} />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                    {ann.title}
                  </h3>
                  <div className="text-slate-600 font-medium leading-relaxed mb-8 prose prose-slate max-w-none">
                    {ann.content}
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                    <div className="flex gap-4">
                       <button className="flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-xs font-bold uppercase tracking-widest">
                         <MessageCircle size={16} /> 0 Comments
                       </button>
                    </div>
                    
                    {user?.role === 'teacher' && (
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button aria-label="Edit announcement" title="Edit announcement" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"><Edit3 size={16} /></button>
                        <button aria-label="Delete announcement" title="Delete announcement" className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all"><Trash2 size={16} /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Bottom Engagement Panel */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mt-16 bg-blue-600 rounded-[40px] p-12 text-white relative overflow-hidden group shadow-2xl shadow-blue-600/30"
      >
        <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-white/10 rounded-full blur-[100px] group-hover:scale-110 transition-transform duration-1000" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="max-w-xl text-center md:text-left">
            <h2 className="text-3xl font-black mb-4 tracking-tight leading-none">Stay in the loop.</h2>
            <p className="text-blue-100 font-medium text-lg leading-relaxed">
              Enable push notifications to never miss an update, deadline change, or new resource from your course instructor.
            </p>
          </div>
          <button className="h-16 px-10 rounded-2xl bg-white text-blue-600 font-black text-lg hover:bg-blue-50 transition-all active:scale-95 shadow-xl shadow-blue-900/10 uppercase tracking-widest shrink-0">
            Enable Alerts
          </button>
        </div>
      </motion.div>
    </div>
  );
}
