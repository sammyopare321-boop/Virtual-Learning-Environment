'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { courseApi } from '@/utils/api/courseApi';
import { communicationApi } from '@/utils/api/communicationApi';
import { useAuth } from '@/context/AuthContext';
import { 
  MessageSquare, MessageCircle, Plus, Search, Filter, 
  ChevronRight, Calendar, User, Clock, 
  Sparkles, Pin, MoreVertical, Trash2, 
  Edit3, ThumbsUp, Reply, Hash, Loader2, X, Send
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: {
    _id: string;
    name: string;
    role: string;
  };
  replies: any[];
  likes: string[];
  isPinned: boolean;
  createdAt: string;
  tags?: string[];
}

export default function DiscussionsPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => {
    courseApi.getDiscussions(courseId)
      .then(res => setDiscussions(res.data.data || []))
      .catch(() => setDiscussions([]))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      toast.error('Title and content are required.');
      return;
    }
    setPosting(true);
    try {
      const res = await communicationApi.startDiscussion(courseId, form);
      setDiscussions(prev => [res.data.data, ...prev]);
      setShowForm(false);
      setForm({ title: '', content: '' });
      toast.success('Thread started!');
    } catch {
      toast.error('Failed to start thread.');
    } finally {
      setPosting(false);
    }
  };

  const filteredDiscussions = discussions.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.content.toLowerCase().includes(search.toLowerCase())
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
            <MessageSquare size={14} />
            Peer Collaboration
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter leading-none mb-6"
          >
            Course <span className="text-blue-600">Discussions.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed"
          >
            Connect with peers, ask questions, and share insights. Collaboration starts with a single thread.
          </motion.p>
        </div>

        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest"
        >
          <Plus size={20} strokeWidth={3} /> Start Thread
        </motion.button>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Search discussions..."
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-slate-100 rounded-[32px] animate-pulse border border-slate-200" />)}
        </div>
      ) : filteredDiscussions.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] border border-slate-200 p-20 text-center shadow-sm"
        >
          <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8">
            <MessageCircle size={40} className="text-blue-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">Begin the conversation.</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mb-10 leading-relaxed">
            No discussion threads have been started in this course yet. Be the first to ask a question!
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredDiscussions.map((disc, i) => (
            <motion.div
              key={disc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group relative bg-white rounded-[32px] border border-slate-200 p-8 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 flex flex-col"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 font-black text-xs border border-blue-200 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                     {disc.author.name.charAt(0)}
                   </div>
                   <div>
                     <p className="text-sm font-black text-slate-900 leading-none mb-1">{disc.author.name}</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(disc.createdAt).toLocaleDateString()}</p>
                   </div>
                </div>
                {disc.isPinned && <Pin size={16} className="text-blue-600" fill="currentColor" />}
              </div>
              
              <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                {disc.title}
              </h3>
              <p className="text-slate-600 font-medium leading-relaxed mb-8 line-clamp-3 text-sm">
                {disc.content}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                 {(disc.tags || ['General', 'Question']).map(tag => (
                   <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                     <Hash size={12} /> {tag}
                   </span>
                 ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-6 border-t border-slate-50">
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ThumbsUp size={16} />
                    <span className="text-xs font-bold">{disc.likes.length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <Reply size={16} />
                    <span className="text-xs font-bold">{disc.replies.length}</span>
                  </div>
                </div>
                <Link href={`/courses/${courseId}/discussions/${disc._id}`} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white font-black text-[10px] hover:bg-blue-600 transition-all uppercase tracking-[0.2em] group/btn">
                  Join Thread <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Create Thread Modal ───────────────────────────────── */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-[32px] shadow-2xl p-8 sm:p-10"
            >
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Start a Thread</h2>
                  <p className="text-slate-500 font-medium text-sm">Ask a question or share knowledge with your classmates.</p>
                </div>
                <button aria-label="Close" onClick={() => setShowForm(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 hover:text-slate-900 transition-all">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label htmlFor="disc-title" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Thread Title</label>
                  <input
                    id="disc-title"
                    required
                    placeholder="e.g. How does backpropagation work?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 h-12 text-slate-900 font-bold text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label htmlFor="disc-body" className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Content</label>
                  <textarea
                    id="disc-body"
                    required
                    rows={5}
                    placeholder="Share the details of your question or topic..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none leading-relaxed"
                    value={form.content}
                    onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)}
                    className="px-6 h-11 rounded-xl text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" disabled={posting}
                    className="flex items-center gap-2 px-7 h-11 rounded-xl bg-blue-600 text-white text-sm font-bold shadow-md shadow-blue-600/20 hover:bg-blue-700 disabled:opacity-50 transition-all">
                    {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    {posting ? 'Posting...' : 'Start Thread'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
