'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/utils/api/adminApi';
import { AxiosError } from 'axios';

interface Course {
  _id: string;
  code: string;
  title: string;
  status: string;
  semester: string;
  academicYear: string;
  enrollmentCount?: number;
  teacher?: { _id: string; name: string; email: string; } | string | any;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
}

interface ConfirmState {
  type: 'delete' | 'archive' | 'reactivate';
  course: Course;
}

interface ToastState {
  msg: string;
  type: string;
}

const S: Record<string, React.CSSProperties> = {
  wrap:       { display:'flex', minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:"'Sora','Inter',sans-serif" },
  sidebar:    { width:240, backgroundColor:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', flexShrink:0 },
  logoBox:    { padding:'20px 16px 16px', borderBottom:'1px solid #f1f5f9' },
  logoInner:  { display:'flex', alignItems:'center', gap:10 },
  logoIcon:   { width:34, height:34, borderRadius:10, backgroundColor:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  nav:        { flex:1, padding:'10px', display:'flex', flexDirection:'column', gap:2 },
  link:       { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#475569', textDecoration:'none', border:'none', background:'transparent', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  linkActive: { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#4338ca', textDecoration:'none', background:'#eef2ff', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  main:       { flex:1, overflowY:'auto', padding:'40px' },
  input:      { padding:'9px 14px', borderRadius:10, border:'1px solid #e2e8f0', backgroundColor:'#fff', color:'#0f172a', fontSize:14, fontFamily:"'Sora','Inter',sans-serif", outline:'none' },
  btn:        { display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, fontSize:13, fontWeight:500, border:'none', cursor:'pointer', fontFamily:"'Sora','Inter',sans-serif", transition:'all 0.15s' },
};

const navItems = [
  { href:'/dashboard/admin', label:'Dashboard',    icon:'📊' },
  { href:'/admin/users',     label:'Users',         icon:'👥' },
  { href:'/admin/courses',   label:'Courses',       icon:'📚', active:true },
  { href:'/admin/analytics', label:'Analytics',     icon:'📈' },
  { href:'/admin/logs',      label:'Activity Logs', icon:'📋' },
  { href:'/profile',         label:'Profile',       icon:'👤' },
];

const statusColor: Record<string, {bg: string, color: string}> = {
  active:   { bg:'#d1fae5', color:'#065f46' },
  draft:    { bg:'#fef3c7', color:'#92400e' },
  archived: { bg:'#f1f5f9', color:'#475569' },
};

export default function AdminCoursesPage() {
  const { user, logout }      = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [reassignModal, setReassignModal] = useState<Course | null>(null);
  const [newTeacherId, setNewTeacherId]   = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast]     = useState<ToastState | null>(null);

  const showToast = (msg: string, type: string = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCourses = useCallback(() => {
    setLoading(true);
    const params: any = { page, limit:10 };
    if (search)               params.search = search;
    if (statusFilter !== 'all') params.status = statusFilter;
    adminApi.getAllCourses(params)
      .then(res => { setCourses(res.data.data || []); setTotalPages(res.data.totalPages || 1); })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  useEffect(() => {
    adminApi.getAllUsers({ role:'teacher', limit:100 })
      .then(res => setTeachers(res.data.data || []))
      .catch(() => {});
  }, []);

  const handleStatusChange = async (course: Course, newStatus: string) => {
    setActionLoading(course._id + '_status');
    try {
      await adminApi.changeCourseStatus(course._id, newStatus);
      setCourses(p => p.map(c => c._id === course._id ? { ...c, status: newStatus } : c));
      showToast(`Course ${newStatus === 'archived' ? 'archived' : 'reactivated'} successfully.`);
    } catch (e: unknown) {
      const err = e as AxiosError<{message: string}>;
      showToast(err.response?.data?.message || 'Action failed.', 'error');
    } finally { setActionLoading(null); setConfirm(null); }
  };

  const handleDelete = async (course: Course) => {
    setActionLoading(course._id + '_delete');
    try {
      await adminApi.deleteCourse(course._id);
      setCourses(p => p.filter(c => c._id !== course._id));
      showToast('Course and all related data deleted.');
    } catch (e: unknown) {
      const err = e as AxiosError<{message: string}>;
      showToast(err.response?.data?.message || 'Delete failed.', 'error');
    } finally { setActionLoading(null); setConfirm(null); }
  };

  const handleReassign = async () => {
    if (!newTeacherId || !reassignModal) return;
    setActionLoading(reassignModal._id + '_reassign');
    try {
      await adminApi.reassignTeacher(reassignModal._id, newTeacherId);
      const teacher = teachers.find(t => t._id === newTeacherId);
      setCourses(p => p.map(c => c._id === reassignModal._id ? { ...c, teacher: teacher as any } : c));
      showToast('Teacher reassigned successfully.');
      setReassignModal(null); setNewTeacherId('');
    } catch (e: unknown) {
      const err = e as AxiosError<{message: string}>;
      showToast(err.response?.data?.message || 'Reassignment failed.', 'error');
    } finally { setActionLoading(null); }
  };

  return (
    <div style={S.wrap}>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:9999, padding:'12px 20px', borderRadius:12, backgroundColor: toast.type==='error'?'#fee2e2':'#d1fae5', color: toast.type==='error'?'#991b1b':'#065f46', fontSize:14, fontWeight:500, boxShadow:'0 4px 12px rgb(0 0 0/0.15)' }}>
          {toast.msg}
        </div>
      )}

      {/* Confirm dialog */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgb(0 0 0/0.4)', zIndex:9998, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ backgroundColor:'#fff', borderRadius:20, padding:32, maxWidth:420, width:'90%', boxShadow:'0 25px 50px rgb(0 0 0/0.25)' }}>
            <div style={{ width:48, height:48, borderRadius:14, backgroundColor:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:16 }}>⚠️</div>
            <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', margin:'0 0 8px' }}>
              {confirm.type === 'delete' ? 'Delete Course' : confirm.type === 'archive' ? 'Archive Course' : 'Reactivate Course'}
            </h3>
            <p style={{ fontSize:14, color:'#64748b', margin:'0 0 24px', lineHeight:1.6 }}>
              {confirm.type === 'delete'
                ? `This will permanently delete "${confirm.course.title}" and ALL related data — modules, content, assignments, submissions, grades, quizzes. This cannot be undone.`
                : confirm.type === 'archive'
                ? `"${confirm.course.title}" will be archived and hidden from students.`
                : `"${confirm.course.title}" will be reactivated and visible to students.`}
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setConfirm(null)} style={{ ...S.btn, flex:1, backgroundColor:'#f1f5f9', color:'#334155', justifyContent:'center' }}>Cancel</button>
              <button onClick={() => confirm.type === 'delete' ? handleDelete(confirm.course) : handleStatusChange(confirm.course, confirm.type === 'archive' ? 'archived' : 'active')}
                style={{ ...S.btn, flex:1, backgroundColor: confirm.type === 'reactivate' ? '#4f46e5' : '#ef4444', color:'#fff', justifyContent:'center' }}>
                {confirm.type === 'delete' ? 'Delete' : confirm.type === 'archive' ? 'Archive' : 'Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reassign teacher modal */}
      {reassignModal && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgb(0 0 0/0.4)', zIndex:9998, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ backgroundColor:'#fff', borderRadius:20, padding:32, maxWidth:440, width:'90%', boxShadow:'0 25px 50px rgb(0 0 0/0.25)' }}>
            <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', margin:'0 0 4px' }}>Reassign Teacher</h3>
            <p style={{ fontSize:13, color:'#64748b', margin:'0 0 20px' }}>Course: <strong>{reassignModal.title}</strong></p>
            <label htmlFor="reassign-teacher" style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:8 }}>Select new teacher</label>
            <select id="reassign-teacher" style={{ ...S.input, width:'100%', marginBottom:20 }} value={newTeacherId} onChange={e => setNewTeacherId(e.target.value)}>
              <option value="">— Choose a teacher —</option>
              {teachers.map(t => <option key={t._id} value={t._id}>{t.name} ({t.email})</option>)}
            </select>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => { setReassignModal(null); setNewTeacherId(''); }} style={{ ...S.btn, flex:1, backgroundColor:'#f1f5f9', color:'#334155', justifyContent:'center' }}>Cancel</button>
              <button onClick={handleReassign} disabled={!newTeacherId || !!actionLoading} style={{ ...S.btn, flex:1, backgroundColor:'#4f46e5', color:'#fff', justifyContent:'center', opacity: !newTeacherId ? 0.5 : 1 }}>
                {actionLoading ? 'Saving...' : 'Reassign'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside style={S.sidebar}>
        <div style={S.logoBox}>
          <div style={S.logoInner}>
            <div style={S.logoIcon}>
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span style={{ fontWeight:700, fontSize:16, color:'#0f172a' }}>UniLearn</span>
          </div>
        </div>
        <div style={{ padding:'12px 16px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, backgroundColor:'#e0e7ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#4338ca', fontWeight:700, fontSize:14, flexShrink:0 }}>{user?.name?.charAt(0)?.toUpperCase()||'A'}</div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name||'Admin'}</p>
            <span style={{ fontSize:11, fontWeight:500, backgroundColor:'#e0e7ff', color:'#4338ca', padding:'1px 8px', borderRadius:9999 }}>admin</span>
          </div>
        </div>
        <nav style={S.nav}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={item.active ? S.linkActive : S.link}>
              <span style={{ fontSize:16 }}>{item.icon}</span><span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding:'10px', borderTop:'1px solid #f1f5f9' }}>
          <button onClick={logout} style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#ef4444', background:'transparent', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" }}>
            <span style={{ fontSize:16 }}>🚪</span><span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:'#0f172a', letterSpacing:'-0.025em', margin:0 }}>Course Management</h1>
            <p style={{ fontSize:14, color:'#64748b', marginTop:4 }}>Manage all courses — reassign teachers, archive, or delete.</p>
          </div>
        </div>

        {/* Filters */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'16px 20px', marginBottom:16, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <label htmlFor="search-input" className="sr-only">Search</label>
          <input id="search-input" style={{ ...S.input, flex:1, minWidth:200 }} placeholder="🔍  Search by title or code..."
            value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} />
          <label htmlFor="status-filter" className="sr-only">Status Filter</label>
          <select id="status-filter" style={{ ...S.input, minWidth:150 }} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
          {(search || statusFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setStatusFilter('all'); setPage(1); }} style={{ ...S.btn, backgroundColor:'#fee2e2', color:'#991b1b' }}>✕ Clear</button>
          )}
        </div>

        {/* Table */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', overflow:'hidden' }}>
          <div style={{ display:'grid', gridTemplateColumns:'2.5fr 1.5fr 1fr 1fr 1fr', padding:'10px 20px', backgroundColor:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
            {['Course','Teacher','Status','Students','Actions'].map(h => (
              <span key={h} style={{ fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</span>
            ))}
          </div>
          {loading ? (
            <div style={{ padding:40, textAlign:'center', color:'#94a3b8', fontSize:14 }}>Loading courses...</div>
          ) : courses.length === 0 ? (
            <div style={{ padding:'48px 24px', textAlign:'center' }}>
              <p style={{ fontSize:32, margin:'0 0 12px' }}>📚</p>
              <p style={{ fontSize:15, fontWeight:600, color:'#334155', margin:'0 0 4px' }}>No courses found</p>
              <p style={{ fontSize:13, color:'#94a3b8' }}>Try adjusting your filters.</p>
            </div>
          ) : courses.map((course, idx) => {
            const sc = statusColor[course.status] || statusColor.archived;
            return (
              <div key={course._id} style={{ display:'grid', gridTemplateColumns:'2.5fr 1.5fr 1fr 1fr 1fr', padding:'14px 20px', alignItems:'center', borderBottom: idx===courses.length-1?'none':'1px solid #f1f5f9' }}>
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
                    <span style={{ fontSize:11, fontWeight:600, backgroundColor:'#e0e7ff', color:'#4338ca', padding:'2px 8px', borderRadius:9999 }}>{course.code}</span>
                  </div>
                  <Link href={`/admin/courses/${course._id}`} style={{ textDecoration:'none' }}>
                    <p style={{ fontSize:14, fontWeight:600, color:'#4f46e5', margin:'4px 0 2px', cursor:'pointer' }}>{course.title}</p>
                  </Link>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{course.semester} · {course.academicYear}</p>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:30, height:30, borderRadius:8, backgroundColor:'#faf5ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#7c3aed', fontWeight:700, fontSize:12, flexShrink:0 }}>
                    {typeof course.teacher === 'object' && course.teacher?.name ? course.teacher.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <p style={{ fontSize:13, color:'#334155', margin:0 }}>{typeof course.teacher === 'object' ? course.teacher?.name : '—'}</p>
                </div>
                <div>
                  <span style={{ fontSize:12, fontWeight:500, backgroundColor: sc.bg, color: sc.color, padding:'3px 10px', borderRadius:9999 }}>{course.status}</span>
                </div>
                <div style={{ fontSize:13, color:'#64748b' }}>{course.enrollmentCount ?? '—'}</div>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <button onClick={() => setReassignModal(course)} title="Reassign teacher" aria-label="Reassign teacher"
                    style={{ padding:'5px 10px', borderRadius:8, backgroundColor:'#eef2ff', color:'#4338ca', border:'none', cursor:'pointer', fontSize:12, fontWeight:500, fontFamily:"'Sora','Inter',sans-serif" }}>👨🏫</button>
                  {course.status !== 'archived' ? (
                    <button onClick={() => setConfirm({ type:'archive', course })} title="Archive" aria-label="Archive"
                      style={{ padding:'5px 10px', borderRadius:8, backgroundColor:'#fef3c7', color:'#92400e', border:'none', cursor:'pointer', fontSize:12, fontFamily:"'Sora','Inter',sans-serif" }}>📦</button>
                  ) : (
                    <button onClick={() => setConfirm({ type:'reactivate', course })} title="Reactivate" aria-label="Reactivate"
                      style={{ padding:'5px 10px', borderRadius:8, backgroundColor:'#d1fae5', color:'#065f46', border:'none', cursor:'pointer', fontSize:12, fontFamily:"'Sora','Inter',sans-serif" }}>✅</button>
                  )}
                  <button onClick={() => setConfirm({ type:'delete', course })} title="Delete" aria-label="Delete"
                    style={{ padding:'5px 10px', borderRadius:8, backgroundColor:'#fee2e2', color:'#991b1b', border:'none', cursor:'pointer', fontSize:12, fontFamily:"'Sora','Inter',sans-serif" }}>🗑️</button>
                </div>
              </div>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16 }}>
            <p style={{ fontSize:13, color:'#64748b' }}>Page {page} of {totalPages}</p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ ...S.btn, backgroundColor:'#fff', border:'1px solid #e2e8f0', color:'#334155', opacity:page===1?0.4:1 }}>← Previous</button>
              <button onClick={() => setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages} style={{ ...S.btn, backgroundColor:'#4f46e5', color:'#fff', opacity:page===totalPages?0.4:1 }}>Next →</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
