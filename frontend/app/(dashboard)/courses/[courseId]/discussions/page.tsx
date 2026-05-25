'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useCourseDiscussions } from '@/hooks/queries/useCourseResources';
import { queryKeys } from '@/lib/queryKeys';
import { communicationApi } from '@/utils/api/communicationApi';
import { useAuth } from '@/context/AuthContext';
import {
  MessageSquare, Plus, Search, ThumbsUp, Reply,
  Loader2, X, Send, Inbox, ArrowRight
} from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

interface Discussion {
  _id: string;
  title: string;
  body: string;
  author: { _id: string; name: string; role: string };
  replies: unknown[];
  likes: string[];
  isPinned: boolean;
  createdAt: string;
}

export default function DiscussionsPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: discussionsData = [], isLoading: loading } = useCourseDiscussions(courseId);
  const discussions = discussionsData as Discussion[];

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [posting, setPosting] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.body.trim()) {
      toast.error('Title and content are required.');
      return;
    }
    setPosting(true);
    try {
      await communicationApi.startDiscussion(courseId, form);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.discussions(courseId) });
      setShowForm(false);
      setForm({ title: '', body: '' });
      toast.success('Discussion posted.');
    } catch {
      toast.error('Failed to post discussion.');
    } finally {
      setPosting(false);
    }
  };

  const filtered = discussions.filter(d =>
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Section */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 lg:p-8 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-primary-600 font-bold text-[10px] uppercase tracking-widest">
              <MessageSquare size={14} /> Community
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Discussions
            </h2>
            <p className="text-slate-500 font-medium text-sm">
              {discussions.length > 0
                ? `${discussions.length} thread${discussions.length > 1 ? 's' : ''} - Ask questions and collaborate with classmates`
                : 'Ask questions and collaborate with your classmates'}
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary h-12 px-6 gap-2 text-xs font-bold shadow-sm transition-all rounded-xl self-start md:self-auto"
          >
            <Plus size={16} /> New Discussion
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center border border-primary-100">
            <MessageSquare size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Threads</p>
            <p className="text-2xl font-extrabold text-slate-900">{discussions.length}</p>
          </div>
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <Reply size={18} />
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Replies</p>
            <p className="text-2xl font-extrabold text-emerald-600">
              {discussions.reduce((s, d) => s + d.replies.length, 0)}
            </p>
          </div>
          <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }} />
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            aria-label="Search discussions"
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
            placeholder="Search discussions..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-dashed border-slate-200 shadow-sm">
          <Inbox size={36} className="text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Discussions Yet</h3>
          <p className="text-sm text-slate-500 mt-1.5">
            {search ? 'No discussions match your search.' : 'Be the first to start a discussion.'}
          </p>
          {!search && (
            <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm mt-5 gap-1.5">
              <Plus size={14} /> Start Discussion
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((disc, i) => (
            <motion.div
              key={disc._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white rounded-2xl border border-slate-200 p-5 hover:border-primary-200 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center text-xs font-bold shrink-0 border border-primary-200">
                  {disc.author.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {disc.title}
                    </h3>
                    {disc.isPinned && (
                      <span className="px-2.5 py-1 rounded-lg bg-primary-50 text-primary-600 border border-primary-200 text-[10px] font-bold shrink-0">
                        Pinned
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">{disc.body}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="font-medium">{disc.author.name}</span>
                      <span>·</span>
                      <span>{format(new Date(disc.createdAt), 'MMM d, yyyy')}</span>
                      <span className="flex items-center gap-1.5 text-primary-600 font-semibold">
                        <ThumbsUp size={12} /> {disc.likes.length}
                      </span>
                      <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                        <Reply size={12} /> {disc.replies.length}
                      </span>
                    </div>
                    <Link
                      href={`/courses/${courseId}/discussions/${disc._id}`}
                      className="flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                    >
                      View <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 8 }}
              className="relative bg-white rounded-xl max-w-lg w-full border border-slate-200 shadow-xl p-6 space-y-5 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-base font-semibold text-slate-900">New Discussion</h3>
                <button onClick={() => setShowForm(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="disc-title" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Title *</label>
                  <input
                    id="disc-title" required
                    placeholder="e.g. Question about Chapter 3 concepts"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="disc-content" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Content *</label>
                  <textarea
                    id="disc-content" required rows={5}
                    placeholder="Share your question or thoughts..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm resize-none"
                    value={form.body}
                    onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1 text-sm">Cancel</button>
                  <button type="submit" disabled={posting} className="btn btn-primary flex-[2] text-sm gap-1.5">
                    {posting ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    {posting ? 'Posting...' : 'Post Discussion'}
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
