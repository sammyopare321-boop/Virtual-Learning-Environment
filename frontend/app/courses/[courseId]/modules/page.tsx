'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import CourseShell from '@/components/shared/CourseShell';
import { Course } from '@/types';
import { 
  FileText, Video, Presentation, FileCode2, Image as ImageIcon, 
  ChevronDown, Plus, ExternalLink, Trash2, Paperclip, Loader2, BookOpen,
  Layout, Calendar, Layers, Sparkles, Filter, Search, Info, AlertCircle,
  ArrowRight, Download, CheckCircle2
} from 'lucide-react';
import { AxiosError } from 'axios';

interface Module {
  _id: string;
  title: string;
  weekNumber: number;
  order: number;
}

interface ContentItem {
  _id: string;
  title: string;
  type: 'pdf' | 'video' | 'slide' | 'note' | 'image';
  fileUrl: string;
}

const contentMeta = {
  pdf:   { icon: FileText,     bg: 'bg-rose-50',    text: 'text-rose-600',    border: 'border-rose-100',    label: 'Document' },
  video: { icon: Video,        bg: 'bg-blue-50',    text: 'text-blue-600',    border: 'border-blue-100',    label: 'Video Lecture' },
  slide: { icon: Presentation, bg: 'bg-amber-50',   text: 'text-amber-600',   border: 'border-amber-100',   label: 'Presentation' },
  note:  { icon: FileCode2,    bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', label: 'Reading Note' },
  image: { icon: ImageIcon,    bg: 'bg-purple-50',  text: 'text-purple-600',  border: 'border-purple-100',  label: 'Diagram' }
};

export default function ModulesPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user, logout }       = useAuth();
  
  const [course, setCourse]    = useState<Course | null>(null);
  const [modules, setModules]  = useState<Module[]>([]);
  const [expanded, setExpanded]= useState<Record<string, boolean>>({});
  const [content, setContent]  = useState<Record<string, ContentItem[]>>({});
  const [loading, setLoading]  = useState(true);
  
  const [showModForm, setShowModForm] = useState(false);
  const [modForm, setModForm]  = useState({ title:'', weekNumber:'', order:'' });
  const [creating, setCreating]= useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast]      = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const isTeacher = user?.role === 'teacher';
  const isOwner = isTeacher && (
    (typeof course?.teacher === 'object' && course.teacher?._id === user?._id) ||
    (course?.teacher === user?._id)
  );

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadContent = useCallback(async (moduleId: string) => {
    if (content[moduleId]) return;
    try {
      const res = await courseApi.getModuleContent(moduleId);
      setContent(p => ({ ...p, [moduleId]: res.data.data || [] }));
    } catch { 
      setContent(p => ({ ...p, [moduleId]: [] })); 
    }
  }, [content]);

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      if (!courseId) return;
      try {
        const [c, m] = await Promise.all([
          courseApi.getOne(courseId),
          courseApi.getModules(courseId),
        ]);
        if (!ignore) {
          setCourse(c.data.data);
          const mods = m.data.data || [];
          setModules(mods);
          if (mods.length > 0) {
            setExpanded({ [mods[0]._id]: true });
            courseApi.getModuleContent(mods[0]._id).then(res => {
              if (!ignore) setContent(p => ({ ...p, [mods[0]._id]: res.data.data || [] }));
            });
          }
        }
      } catch (err) {} finally {
        if (!ignore) setLoading(false);
      }
    }
    startFetching();
    return () => { ignore = true; };
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    const willOpen = !expanded[moduleId];
    setExpanded(p => ({ ...p, [moduleId]: willOpen }));
    if (willOpen) loadContent(moduleId);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modForm.title || !modForm.weekNumber) return;
    setCreating(true);
    try {
      const res = await courseApi.createModule(courseId, {
        title: modForm.title,
        weekNumber: parseInt(modForm.weekNumber),
        order: parseInt(modForm.order) || modules.length + 1,
      });
      setModules(p => [...p, res.data.data]);
      setModForm({ title:'', weekNumber:'', order:'' });
      setShowModForm(false);
      showToast('Module created successfully');
    } catch (err) {
      const error = err as AxiosError<{message: string}>;
      showToast(error.response?.data?.message || 'Failed to create module', 'error');
    } finally { setCreating(false); }
  };

  const handleUploadContent = async (moduleId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const typeMap: Record<string, ContentItem['type']> = { 
      pdf:'pdf', mp4:'video', mov:'video', 
      ppt:'slide', pptx:'slide', 
      txt:'note', md:'note', 
      png:'image', jpg:'image', jpeg:'image' 
    };
    const type = typeMap[ext] || 'note';
    setUploading(moduleId);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name.replace(/\.[^.]+$/, ''));
      fd.append('type', type);
      fd.append('order', String((content[moduleId]?.length || 0) + 1));
      const res = await courseApi.uploadContent(moduleId, fd);
      setContent(p => ({ ...p, [moduleId]: [...(p[moduleId] || []), res.data.data] }));
      showToast('Material uploaded successfully');
    } catch (err) {
      const error = err as AxiosError<{message: string}>;
      showToast(error.response?.data?.message || 'Upload failed', 'error');
    } finally { setUploading(null); if (e.target) e.target.value = ''; }
  };

  const handleDeleteContent = async (moduleId: string, contentId: string) => {
    if (!window.confirm('Delete this material?')) return;
    try {
      await courseApi.deleteContent(contentId);
      setContent(p => ({ ...p, [moduleId]: p[moduleId].filter(c => c._id !== contentId) }));
      showToast('Material deleted');
    } catch { 
      showToast('Delete failed', 'error'); 
    }
  };

  return (
    <CourseShell course={course} courseId={courseId} user={user} logout={logout}>
      <div className="max-w-6xl mx-auto px-6 lg:px-8 py-12">
        
        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
              className={`fixed top-12 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-black text-sm uppercase tracking-widest border-2 ${
                toast.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-rose-50 border-rose-100 text-rose-600'
              }`}
            >
              {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
              {toast.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Area */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="flex-1">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-blue-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4"
            >
              <BookOpen size={14} />
              Curriculum Hub
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-none mb-6"
            >
              Course <span className="text-blue-600">Modules.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-slate-500 text-lg font-medium max-w-xl leading-relaxed"
            >
              Master the curriculum through our structured learning paths, premium lecture materials, and interactive weekly resources.
            </motion.p>
          </div>

          {isOwner && (
            <motion.button 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              onClick={() => setShowModForm(p => !p)}
              className={`flex items-center justify-center gap-3 px-10 py-5 rounded-[24px] font-black text-lg shadow-2xl transition-all hover:-translate-y-1 active:scale-95 uppercase tracking-widest ${
                showModForm 
                  ? 'bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50' 
                  : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'
              }`}
            >
              {showModForm ? 'Dismiss' : <><Plus size={20} strokeWidth={3} /> Create Module</>}
            </motion.button>
          )}
        </header>

        {/* Create Module Form */}
        <AnimatePresence>
          {showModForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 48 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-[32px] border-2 border-blue-100 p-8 lg:p-10 shadow-xl shadow-blue-900/5">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Layers size={24} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">New Curriculum Block</h3>
                </div>
                <form onSubmit={handleCreateModule}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-10">
                    <div className="md:col-span-6">
                      <label htmlFor="mod-title" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Module Title *</label>
                      <input 
                        id="mod-title"
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 h-14 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold" 
                        placeholder="e.g. Fundamental Principles" 
                        value={modForm.title} 
                        onChange={e => setModForm(p=>({...p,title:e.target.value}))} 
                        required 
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="mod-week" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Week Number *</label>
                      <input 
                        id="mod-week"
                        type="number" 
                        min="1" 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 h-14 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold" 
                        placeholder="1" 
                        value={modForm.weekNumber} 
                        onChange={e => setModForm(p=>({...p,weekNumber:e.target.value}))} 
                        required 
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label htmlFor="mod-order" className="block text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Sequence Order</label>
                      <input 
                        id="mod-order"
                        type="number" 
                        min="1" 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 h-14 rounded-2xl focus:bg-white focus:border-blue-500 transition-all outline-none font-bold" 
                        placeholder={String(modules.length + 1)} 
                        value={modForm.order} 
                        onChange={e => setModForm(p=>({...p,order:e.target.value}))} 
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" disabled={creating} className="flex-1 h-16 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 uppercase tracking-widest text-xs">
                      {creating ? <Loader2 size={20} className="animate-spin" /> : <><Sparkles size={18} /> Initialize Module</>}
                    </button>
                    <button type="button" onClick={() => setShowModForm(false)} className="px-10 h-16 rounded-2xl bg-slate-100 text-slate-600 font-black hover:bg-slate-200 transition-all uppercase tracking-widest text-xs">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-12">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={20} />
            <input 
              aria-label="Filter modules"
              type="text" 
              placeholder="Search curriculum materials..."
              className="w-full bg-white border border-slate-200 text-slate-900 pl-14 pr-6 h-16 rounded-3xl focus:border-blue-500 focus:ring-8 focus:ring-blue-500/5 transition-all outline-none font-bold shadow-sm"
            />
          </div>
          <button className="h-16 px-10 rounded-3xl bg-white border border-slate-200 text-slate-600 font-black flex items-center gap-3 hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest text-xs shadow-sm">
            <Filter size={18} /> Expand All
          </button>
        </div>

        {/* Module List */}
        {loading ? (
          <div className="space-y-6">
            {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white border border-slate-100 rounded-[32px] animate-pulse shadow-sm" />)}
          </div>
        ) : modules.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[48px] border-2 border-dashed border-slate-200 p-20 text-center shadow-sm"
          >
            <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-blue-100 shadow-inner">
              <BookOpen size={40} className="text-blue-600/30" />
            </div>
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Curriculum Pending</h3>
            <p className="text-slate-500 text-lg font-medium max-w-sm mx-auto mb-10 leading-relaxed">
              {isOwner 
                ? 'Your syllabus is currently empty. Start building your course by adding the first module block.' 
                : 'The instructor has not published any curriculum materials for this course yet.'}
            </p>
            {isOwner && (
              <button onClick={() => setShowModForm(true)} className="px-10 py-5 rounded-2xl bg-blue-600 text-white font-black hover:bg-blue-700 transition-all active:scale-95 uppercase tracking-widest text-xs shadow-xl shadow-blue-600/20">
                Create First Module
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            {modules.sort((a,b) => a.weekNumber - b.weekNumber).map((mod, modIdx) => {
              const isOpen = expanded[mod._id];
              const items  = content[mod._id] || [];
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: modIdx * 0.1 }}
                  key={mod._id} 
                  className={`bg-white rounded-[40px] border-2 transition-all duration-500 overflow-hidden ${isOpen ? 'border-blue-500 shadow-2xl shadow-blue-900/10' : 'border-slate-100 shadow-sm hover:border-slate-200'}`}
                >
                  
                  {/* Module Header */}
                  <button 
                    onClick={() => toggleModule(mod._id)} 
                    className={`w-full flex items-center gap-6 p-6 lg:p-8 text-left transition-colors ${isOpen ? 'bg-blue-50/30' : 'hover:bg-slate-50/50'}`}
                  >
                    <div className={`w-16 h-16 rounded-[24px] flex flex-col items-center justify-center font-black transition-all duration-500 shrink-0 border-2 ${isOpen ? 'bg-blue-600 border-blue-400 text-white shadow-xl shadow-blue-600/20 -translate-y-1' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                      <span className="text-[10px] uppercase tracking-tighter opacity-70">Week</span>
                      <span className="text-xl leading-none">{mod.weekNumber}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h4 className={`font-black text-xl lg:text-2xl tracking-tight truncate transition-colors ${isOpen ? 'text-blue-700' : 'text-slate-900'}`}>{mod.title}</h4>
                        {isOpen && <Sparkles size={16} className="text-blue-500 animate-pulse" />}
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs font-black text-slate-400 uppercase tracking-widest">
                          <Layers size={14} /> {items.length} Materials
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                        <span className="text-xs font-black text-blue-600/60 uppercase tracking-widest">In Progress</span>
                      </div>
                    </div>
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${isOpen ? 'bg-blue-600 text-white rotate-180' : 'bg-slate-100 text-slate-400'}`}>
                      <ChevronDown size={24} strokeWidth={3} />
                    </div>
                  </button>

                  {/* Content Items */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 lg:px-8 pb-8 pt-2">
                          <div className="h-px bg-slate-100 mb-8" />
                          
                          {items.length === 0 ? (
                            <div className="py-12 text-center rounded-[32px] bg-slate-50/50 border-2 border-dashed border-slate-100 flex flex-col items-center">
                              <Info size={32} className="text-slate-300 mb-4" />
                              <p className="text-slate-500 font-bold">No academic materials have been cataloged for this week.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-10">
                              {items.map((item, idx) => {
                                const meta = contentMeta[item.type] || contentMeta.note;
                                const MetaIcon = meta.icon;
                                return (
                                  <motion.div 
                                    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }}
                                    key={item._id} 
                                    className="group flex items-center gap-5 p-5 rounded-[28px] bg-white border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300"
                                  >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 ${meta.bg} ${meta.text} ${meta.border} transition-transform group-hover:scale-110 duration-500`}>
                                      <MetaIcon size={24} />
                                    </div>
                                    
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-black text-slate-900 truncate mb-1.5 group-hover:text-blue-600 transition-colors">{item.title}</h5>
                                      <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${meta.bg} ${meta.text} ${meta.border}`}>
                                          {meta.label}
                                        </span>
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                          {item.type.toUpperCase()}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                      <a 
                                        aria-label={`Download ${item.title}`} 
                                        title={`Download ${item.title}`} 
                                        href={item.fileUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="flex items-center justify-center w-11 h-11 rounded-2xl bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all active:scale-90"
                                      >
                                        <Download size={18} />
                                      </a>
                                      {isOwner && (
                                        <button 
                                          aria-label={`Delete ${item.title}`} 
                                          title={`Delete ${item.title}`} 
                                          onClick={() => handleDeleteContent(mod._id, item._id)} 
                                          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all active:scale-90"
                                        >
                                          <Trash2 size={18} />
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          )}

                          {/* Upload Section */}
                          {isOwner && (
                            <div className="mt-4">
                              <label htmlFor={`upload-${mod._id}`} className={`flex flex-col items-center justify-center gap-4 w-full py-10 rounded-[32px] border-2 border-dashed font-black transition-all duration-500 cursor-pointer ${
                                uploading === mod._id 
                                  ? 'border-blue-400 bg-blue-50 text-blue-600' 
                                  : 'border-slate-200 bg-slate-50 text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 hover:text-blue-600'
                              }`}>
                                {uploading === mod._id ? (
                                  <>
                                    <div className="w-12 h-12 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" />
                                    <span className="uppercase tracking-[0.2em] text-xs">Cataloging material...</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                      <Paperclip size={24} />
                                    </div>
                                    <div className="text-center">
                                      <span className="block uppercase tracking-[0.2em] text-xs mb-1">Append Syllabus Material</span>
                                      <span className="text-[10px] font-bold opacity-60">PDF, VIDEO, SLIDES (MAX 50MB)</span>
                                    </div>
                                  </>
                                )}
                                <input 
                                  id={`upload-${mod._id}`}
                                  type="file" 
                                  className="hidden" 
                                  disabled={uploading === mod._id} 
                                  accept=".pdf,.ppt,.pptx,.mp4,.mov,.txt,.md,.png,.jpg,.jpeg" 
                                  onChange={e => handleUploadContent(mod._id, e)} 
                                />
                              </label>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </CourseShell>
  );
}
