'use client';
import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { communicationApi } from '@/utils/api/communicationApi';
import { courseApi } from '@/utils/api/courseApi';
import {
  MessageSquare, ArrowLeft, Send, ThumbsUp,
  Pin, Hash, Loader2, Reply, User as UserIcon, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Reply {
  _id: string;
  author: { _id: string; name: string };
  body: string;
  createdAt: string;
}

interface Discussion {
  _id: string;
  title: string;
  content: string;
  author: { _id: string; name: string; role: string };
  replies: Reply[];
  likes: string[];
  isPinned: boolean;
  tags?: string[];
  createdAt: string;
}

export default function DiscussionThreadPage() {
  const { courseId, discussionId } = useParams() as { courseId: string; discussionId: string };
  const { user } = useAuth();

  const [thread, setThread] = useState<Discussion | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch thread
  useEffect(() => {
    communicationApi.getDiscussion(discussionId)
      .then(res => setThread(res.data.data))
      .catch(() => toast.error('Failed to load thread.'))
      .finally(() => setLoading(false));
  }, [discussionId]);

  // Auto-scroll on new replies
  useEffect(() => {
    if (!loading) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [thread?.replies?.length, loading]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    setPosting(true);
    try {
      const res = await communicationApi.replyDiscussion(discussionId, { content: replyText });
      setThread(res.data.data);
      setReplyText('');
      toast.success('Reply posted!');
    } catch {
      toast.error('Failed to post reply.');
    } finally {
      setPosting(false);
    }
  };

  const avatarLetter = (name: string) => name?.charAt(0)?.toUpperCase() ?? '?';
  const formatTime = (d: string) =>
    new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  if (loading) {
    return (
      <div className="max-w-[860px] mx-auto p-8 lg:p-12 space-y-6">
        <div className="h-10 w-40 bg-slate-100 animate-pulse rounded-xl" />
        <div className="h-60 bg-slate-100 animate-pulse rounded-[32px]" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-28 bg-slate-100 animate-pulse rounded-[24px]" />
        ))}
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="max-w-[860px] mx-auto p-12 text-center">
        <div className="w-20 h-20 rounded-3xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-6">
          <MessageSquare size={32} className="text-rose-400" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Thread not found</h2>
        <p className="text-slate-500 mb-8">This discussion may have been deleted or you may not have access.</p>
        <Link href={`/courses/${courseId}/discussions`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors">
          <ArrowLeft size={16} /> Back to Discussions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[860px] mx-auto p-8 lg:p-12">
      {/* Back nav */}
      <Link
        href={`/courses/${courseId}/discussions`}
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        Back to Discussions
      </Link>

      {/* ── Original Post ─────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-slate-200 rounded-[32px] p-8 mb-8 shadow-sm"
      >
        {/* Meta row */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-indigo-100 border border-indigo-200 flex items-center justify-center text-indigo-700 font-black text-sm shrink-0">
            {avatarLetter(thread.author.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold text-slate-900 leading-none mb-1">{thread.author.name}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <Clock size={10} /> {formatTime(thread.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {thread.isPinned && (
              <span className="flex items-center gap-1.5 text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 uppercase tracking-wider">
                <Pin size={10} fill="currentColor" /> Pinned
              </span>
            )}
            <span className="text-[10px] font-black px-2.5 py-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 uppercase tracking-wider">
              {thread.author.role}
            </span>
          </div>
        </div>

        {/* Title + body */}
        <h1 className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight leading-tight mb-5">
          {thread.title}
        </h1>
        <p className="text-slate-600 leading-relaxed font-medium text-base mb-7 whitespace-pre-wrap">
          {thread.content}
        </p>

        {/* Tags + stats */}
        <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
          {(thread.tags || ['General']).map(tag => (
            <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <Hash size={10} /> {tag}
            </span>
          ))}
          <div className="ml-auto flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <ThumbsUp size={14} /> {thread.likes.length}
            </span>
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <Reply size={14} /> {thread.replies.length} replies
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── Replies ───────────────────────────────────────────── */}
      <div className="space-y-4 mb-8">
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Reply size={14} /> {thread.replies.length} {thread.replies.length === 1 ? 'Reply' : 'Replies'}
        </h2>

        {thread.replies.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white border border-dashed border-slate-200 rounded-[24px] p-10 text-center"
          >
            <MessageSquare size={28} className="text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-slate-400">No replies yet — be the first to respond!</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {thread.replies.map((reply, idx) => (
              <motion.div
                key={reply._id ?? idx}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                className={`flex gap-4 p-6 rounded-[24px] border transition-colors ${
                  reply.author._id === thread.author._id
                    ? 'bg-indigo-50 border-indigo-100'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                  reply.author._id === thread.author._id
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 border border-slate-200 text-slate-600'
                }`}>
                  {avatarLetter(reply.author.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-2 flex-wrap">
                    <span className="text-sm font-extrabold text-slate-900">{reply.author.name}</span>
                    {reply.author._id === thread.author._id && (
                      <span className="text-[9px] font-black px-2 py-0.5 rounded bg-indigo-600 text-white uppercase tracking-widest">OP</span>
                    )}
                    <span className="text-[10px] font-bold text-slate-400 ml-auto">{formatTime(reply.createdAt)}</span>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed text-sm whitespace-pre-wrap">{reply.body}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
        <div ref={bottomRef} />
      </div>

      {/* ── Reply Composer ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white border border-slate-200 rounded-[28px] p-6 shadow-sm"
      >
        <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
          <Send size={14} /> Post a Reply
        </h3>
        <div className="flex gap-4">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-xs shrink-0">
            {avatarLetter(user?.name ?? 'U')}
          </div>
          <form onSubmit={handleReply} className="flex-1 flex flex-col gap-3">
            <textarea
              rows={4}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              placeholder="Share your thoughts, answer a question, or ask for clarification..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-900 font-medium text-sm focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none leading-relaxed placeholder:text-slate-400"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={posting || !replyText.trim()}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/20 hover:-translate-y-0.5 active:scale-95 transition-all"
              >
                {posting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {posting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
