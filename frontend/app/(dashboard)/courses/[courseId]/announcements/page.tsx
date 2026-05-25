'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { courseApi } from '@/utils/api/courseApi';
import { useCourseAnnouncements } from '@/hooks/queries/useCourseResources';
import { queryKeys } from '@/lib/queryKeys';
import { useAuth } from '@/context/AuthContext';
import { Bell, Megaphone, Plus, Search, Clock, User, Loader2, X, ChevronDown, ChevronUp, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

interface Announcement {
  _id: string;
  title: string;
  body: string;
  isPinned?: boolean;
  createdAt: string;
  author: { _id: string; name: string; role: string };
}

export default function AnnouncementsPage() {
  const { courseId } = useParams() as { courseId: string };
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: announcementsData = [], isLoading: loading } = useCourseAnnouncements(courseId);
  const announcements = announcementsData as Announcement[];

  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', body: '' });
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const isTeacher = user?.role === 'teacher' || user?.role === 'admin';

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      await courseApi.createAnnouncement(courseId, form);
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.announcements(courseId) });
      setForm({ title: '', body: '' });
      setShowForm(false);
      toast.success('Announcement posted.');
    } catch {
      toast.error('Failed to post announcement.');
    } finally {
      setCreating(false);
    }
  };

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    (a.body || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 pb-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="page-title flex items-center gap-2">
            <Bell size={20} className="text-slate-400" /> Announcements
          </h1>
          <p className="page-subtitle mt-0.5">Course updates and notices from your instructor.</p>
        </div>
        {isTeacher && (
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm gap-1.5 self-start sm:self-auto">
            <Plus size={14} /> New Announcement
          </button>
        )}
      </header>

      {/* Search */}
      <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
          <input
            aria-label="Search announcements"
            className="input-premium pl-8 h-8 text-xs w-full"
            placeholder="Search announcements..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-xl bg-slate-100 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-12 text-center bg-white rounded-xl border border-dashed border-slate-200 shadow-sm">
          <Inbox size={20} className="text-slate-300 mx-auto mb-2" />
          <h3 className="text-sm font-semibold text-slate-700">No Announcements</h3>
          <p className="text-[11px] text-slate-400 mt-1">
            {search ? 'No announcements match your search.' : 'No announcements have been posted yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((ann, i) => {
            const isExpanded = expanded[ann._id];
            const isLong = ann.body?.length > 280;
            const displayBody = isLong && !isExpanded ? ann.body.slice(0, 280) + '...' : ann.body;

            return (
              <motion.div
                key={ann._id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white rounded-xl border border-slate-200 p-4 hover:border-slate-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Megaphone size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">{ann.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 mb-2">
                      <span className="flex items-center gap-1"><User size={10} /> {ann.author?.name || 'Instructor'}</span>
                      <span className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(ann.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{displayBody}</p>
                    {isLong && (
                      <button
                        onClick={() => setExpanded(p => ({ ...p, [ann._id]: !isExpanded }))}
                        className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                      >
                        {isExpanded ? <><ChevronUp size={12} /> Show less</> : <><ChevronDown size={12} /> Read more</>}
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
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
                <h3 className="text-base font-semibold text-slate-900">New Announcement</h3>
                <button onClick={() => setShowForm(false)} aria-label="Close" className="text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="ann-title" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Title *</label>
                  <input
                    id="ann-title" required
                    placeholder="e.g. Schedule change for Week 4"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm"
                    value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="ann-body" className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Message *</label>
                  <textarea
                    id="ann-body" required rows={5}
                    placeholder="Write your announcement here..."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all text-sm resize-none"
                    value={form.body}
                    onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary flex-1 text-sm">Cancel</button>
                  <button type="submit" disabled={creating} className="btn btn-primary flex-[2] text-sm gap-1.5">
                    {creating ? <Loader2 size={13} className="animate-spin" /> : <Megaphone size={13} />}
                    {creating ? 'Posting...' : 'Post Announcement'}
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
