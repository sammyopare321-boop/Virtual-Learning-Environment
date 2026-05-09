'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import { Course } from '@/types';
import styles from './modules.module.css';

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

const contentTypeIcon = { pdf:'📄', video:'🎬', slide:'📑', note:'📝', image:'🖼️' };
const contentTypeBg   = { pdf:'#fee2e2', video:'#dbeafe', slide:'#fef3c7', note:'#d1fae5', image:'#faf5ff' };
const contentTypeColor= { pdf:'#991b1b', video:'#1e40af', slide:'#92400e', note:'#065f46', image:'#6b21a8' };

export default function ModulesPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user }               = useAuth();
  
  const [course, setCourse]    = useState<Course | null>(null);
  const [modules, setModules]  = useState<Module[]>([]);
  const [expanded, setExpanded]= useState<Record<string, boolean>>({});
  const [content, setContent]  = useState<Record<string, ContentItem[]>>({});
  const [loading, setLoading]  = useState(true);
  
  const [showModForm, setShowModForm] = useState(false);
  const [modForm, setModForm]  = useState({ title:'', weekNumber:'', order:'' });
  const [creating, setCreating]= useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast]      = useState<{ msg: string, type: string } | null>(null);

  const isTeacher = user?.role === 'teacher';
  const isOwner = isTeacher && (
    (typeof course?.teacher === 'object' && course.teacher?._id === user?._id) ||
    (course?.teacher === user?._id)
  );

  const showToast = (msg: string, type: string = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
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
            // For the first module, we can also load content here or let the toggle handle it
            courseApi.getModuleContent(mods[0]._id).then(res => {
              if (!ignore) setContent(p => ({ ...p, [mods[0]._id]: res.data.data || [] }));
            });
          }
        }
      } catch (err) {
        // Handle error
      } finally {
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
      showToast('Module created!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to create module.', 'error');
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
      showToast('Content uploaded!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Upload failed.', 'error');
    } finally { setUploading(null); if (e.target) e.target.value = ''; }
  };

  const handleDeleteContent = async (moduleId: string, contentId: string) => {
    try {
      await courseApi.deleteContent(contentId);
      setContent(p => ({ ...p, [moduleId]: p[moduleId].filter(c => c._id !== contentId) }));
      showToast('Content removed.');
    } catch { 
      showToast('Delete failed.', 'error'); 
    }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      {toast && (
        <div className={styles.toast} style={{ backgroundColor: toast.type==='error'?'#fee2e2':'#d1fae5', color: toast.type==='error'?'#991b1b':'#065f46' }}>
          {toast.msg}
        </div>
      )}

      {/* Actions bar */}
      <div className={styles.actionsBar}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0f172a', margin:0 }}>Course Content</h2>
          <p style={{ fontSize:14, color:'#64748b', margin:0 }}>{modules.length} module{modules.length !== 1 ? 's' : ''} total</p>
        </div>
        {isOwner && (
          <button onClick={() => setShowModForm(p => !p)} className={`${styles.btnAdd} ${showModForm ? styles.btnAddActive : ''}`}>
            {showModForm ? '✕ Cancel' : '+ Add Module'}
          </button>
        )}
      </div>

      {/* Create module form */}
      {showModForm && (
        <div className={styles.formCard}>
          <h3 style={{ fontSize:15, fontWeight:600, color:'#0f172a', margin:'0 0 16px' }}>New Module</h3>
          <form onSubmit={handleCreateModule}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:14, marginBottom:16 }}>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:6 }}>Module Title *</label>
                <input className={styles.input} placeholder="Week 1 — Introduction" value={modForm.title} onChange={e => setModForm(p=>({...p,title:e.target.value}))} required />
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:6 }}>Week Number *</label>
                <input type="number" min="1" className={styles.input} placeholder="1" value={modForm.weekNumber} onChange={e => setModForm(p=>({...p,weekNumber:e.target.value}))} required />
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:6 }}>Order</label>
                <input type="number" min="1" className={styles.input} placeholder={String(modules.length + 1)} value={modForm.order} onChange={e => setModForm(p=>({...p,order:e.target.value}))} />
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" disabled={creating} className={styles.btnAdd} style={{ opacity: creating?0.6:1 }}>
                {creating ? 'Creating...' : 'Create Module'}
              </button>
              <button type="button" onClick={() => setShowModForm(false)} className={styles.btnAdd} style={{ backgroundColor:'#f1f5f9', color:'#334155' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Module list */}
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : modules.length === 0 ? (
        <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'56px 24px', textAlign:'center' }}>
          <p style={{ fontSize:40, margin:'0 0 12px' }}>📖</p>
          <h3 style={{ fontSize:15, fontWeight:600, color:'#334155', margin:'0 0 6px' }}>No modules yet</h3>
          <p style={{ fontSize:13, color:'#94a3b8' }}>{isOwner ? 'Create your first module to start adding content.' : 'No modules have been added to this course yet.'}</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {modules.sort((a,b) => a.weekNumber - b.weekNumber).map(mod => {
            const isOpen = expanded[mod._id];
            const items  = content[mod._id] || [];
            return (
              <div key={mod._id} className={styles.moduleItem}>
                {/* Module header */}
                <button onClick={() => toggleModule(mod._id)} className={styles.moduleHeader}>
                  <div className={styles.weekBadge}>W{mod.weekNumber}</div>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:0 }}>{mod.title}</p>
                    <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Week {mod.weekNumber} · {items.length || 0} items</p>
                  </div>
                  <span style={{ fontSize:16, color:'#94a3b8', transform: isOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }}>▾</span>
                </button>

                {/* Content items */}
                {isOpen && (
                  <div className={styles.contentList}>
                    {items.length === 0 ? (
                      <p style={{ fontSize:13, color:'#94a3b8', padding:'8px 0', margin:0 }}>No content yet.{isOwner ? ' Upload files below.' : ''}</p>
                    ) : (
                      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom: isOwner ? 12 : 0 }}>
                        {items.map(item => (
                          <div key={item._id} className={styles.contentItem}>
                            <div className={styles.iconBox} style={{ backgroundColor: contentTypeBg[item.type] || '#f1f5f9', color: contentTypeColor[item.type] || '#475569' }}>
                              {contentTypeIcon[item.type] || '📄'}
                            </div>
                            <div style={{ flex:1, minWidth:0 }}>
                              <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{item.title}</p>
                              <span style={{ fontSize:11, fontWeight:500, backgroundColor: contentTypeBg[item.type] || '#f1f5f9', color: contentTypeColor[item.type] || '#475569', padding:'1px 8px', borderRadius:9999 }}>{item.type}</span>
                            </div>
                            <a href={item.fileUrl} target="_blank" rel="noopener noreferrer"
                              style={{ padding:'5px 12px', borderRadius:8, backgroundColor:'#eef2ff', color:'#4338ca', fontSize:12, fontWeight:500, textDecoration:'none' }}>
                              Open ↗
                            </a>
                            {isOwner && (
                              <button onClick={() => handleDeleteContent(mod._id, item._id)}
                                style={{ padding:'5px 10px', borderRadius:8, backgroundColor:'#fee2e2', color:'#991b1b', fontSize:12, border:'none', cursor:'pointer', fontFamily:"'Sora','Inter',sans-serif" }}>
                                🗑️
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload button for teachers */}
                    {isOwner && (
                      <label className={styles.uploadLabel} style={{ backgroundColor: uploading===mod._id ? '#f1f5f9' : '#f0fdf4' }}>
                        <span>📎</span>
                        <span>{uploading === mod._id ? 'Uploading...' : 'Upload Content'}</span>
                        <input type="file" style={{ display:'none' }} disabled={uploading === mod._id}
                          accept=".pdf,.ppt,.pptx,.mp4,.mov,.txt,.md,.png,.jpg,.jpeg"
                          onChange={e => handleUploadContent(mod._id, e)} />
                      </label>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
