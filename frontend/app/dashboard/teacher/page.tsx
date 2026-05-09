'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import { AxiosError } from 'axios';

interface Course {
  _id: string;
  code: string;
  title: string;
  status: string;
  semester: string;
  academicYear: string;
  teacher?: { _id: string } | string;
}

const S: Record<string, React.CSSProperties> = {
  wrap:      { display:'flex', minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:"'Sora','Inter',sans-serif" },
  sidebar:   { width:240, backgroundColor:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', flexShrink:0 },
  logoBox:   { padding:'20px 16px 16px', borderBottom:'1px solid #f1f5f9' },
  logoInner: { display:'flex', alignItems:'center', gap:10 },
  logoIcon:  { width:34, height:34, borderRadius:10, backgroundColor:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  nav:       { flex:1, padding:'10px', display:'flex', flexDirection:'column', gap:2 },
  link:      { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#475569', textDecoration:'none', border:'none', background:'transparent', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  linkActive:{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#4338ca', textDecoration:'none', background:'#eef2ff', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  main:      { flex:1, overflowY:'auto', padding:'40px' },
  statCard:  { backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgb(0 0 0/0.07)', padding:24, display:'flex', alignItems:'center', gap:16 },
  courseCard:{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgb(0 0 0/0.07)', padding:20, textDecoration:'none', display:'block', transition:'all 0.2s' },
  input:     { width:'100%', padding:'10px 14px', borderRadius:10, border:'1px solid #e2e8f0', backgroundColor:'#fff', color:'#0f172a', fontSize:14, fontFamily:"'Sora','Inter',sans-serif", outline:'none', boxSizing:'border-box' },
  label:     { display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:6 },
};

const navItems = [
  { href:'/dashboard/teacher', label:'Dashboard',     icon:'📊', active:true },
  { href:'/courses',           label:'My Courses',    icon:'📚' },
  { href:'/messages',          label:'Messages',      icon:'💬' },
  { href:'/notifications',     label:'Notifications', icon:'🔔' },
  { href:'/profile',           label:'Profile',       icon:'👤' },
];

const statusColor: Record<string, {bg: string, color: string}> = {
  active:   { bg:'#d1fae5', color:'#065f46' },
  draft:    { bg:'#fef3c7', color:'#92400e' },
  archived: { bg:'#f1f5f9', color:'#475569' },
};

export default function TeacherDashboard() {
  const { user, logout }        = useAuth();
  const [courses, setCourses]   = useState<Course[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [hovered, setHovered]   = useState<string | null>(null);
  const [form, setForm]         = useState({ title:'', code:'', description:'', semester:'Semester 1', academicYear:'2025/2026' });
  const [err, setErr]           = useState('');

  useEffect(() => {
    courseApi.getAll()
      .then(res => {
        const all = res.data.data || [];
        setCourses(all.filter((c: Course) => {
          if (!c.teacher) return false;
          if (typeof c.teacher === 'object') return c.teacher._id === user?._id;
          return c.teacher === user?._id;
        }));
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.code) { setErr('Title and code are required.'); return; }
    setCreating(true); setErr('');
    try {
      const res = await courseApi.create(form);
      setCourses(p => [res.data.data, ...p]);
      setShowForm(false);
      setForm({ title:'', code:'', description:'', semester:'Semester 1', academicYear:'2025/2026' });
    } catch (e: unknown) {
      const err = e as AxiosError<{message: string}>;
      setErr(err.response?.data?.message || 'Failed to create course.');
    } finally { setCreating(false); }
  };

  const stats = [
    { label:'Total Courses',   value: courses.length,                                 icon:'📚', bg:'#eef2ff' },
    { label:'Active Courses',  value: courses.filter(c=>c.status==='active').length,  icon:'✅', bg:'#f0fdf4' },
    { label:'Draft Courses',   value: courses.filter(c=>c.status==='draft').length,   icon:'📝', bg:'#fffbeb' },
  ];

  return (
    <div style={S.wrap}>
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
          <div style={{ width:36, height:36, borderRadius:10, backgroundColor:'#faf5ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#7c3aed', fontWeight:700, fontSize:14, flexShrink:0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'T'}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'Teacher'}</p>
            <span style={{ fontSize:11, fontWeight:500, backgroundColor:'#faf5ff', color:'#7c3aed', padding:'1px 8px', borderRadius:9999 }}>teacher</span>
          </div>
        </div>
        <nav style={S.nav}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={item.active ? S.linkActive : S.link}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span>{item.label}</span>
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
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:'#0f172a', letterSpacing:'-0.025em', margin:0 }}>
              Welcome, {user?.name?.split(' ')[0]} 👨‍🏫
            </h1>
            <p style={{ fontSize:14, color:'#64748b', marginTop:4 }}>Manage your courses and student progress.</p>
          </div>
          <button
            onClick={() => { setShowForm(p => !p); setErr(''); }}
            style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:12, backgroundColor: showForm ? '#f1f5f9' : '#4f46e5', fontSize:14, fontWeight:500, color: showForm ? '#334155' : '#fff', border:'none', cursor:'pointer', fontFamily:"'Sora','Inter',sans-serif" }}>
            {showForm ? '✕ Cancel' : '+ New Course'}
          </button>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 }}>
          {stats.map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={{ width:48, height:48, borderRadius:14, backgroundColor:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, flexShrink:0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize:26, fontWeight:700, color:'#0f172a', margin:0, letterSpacing:'-0.02em' }}>{s.value}</p>
                <p style={{ fontSize:13, color:'#64748b', margin:0, marginTop:2 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Create form */}
        {showForm && (
          <div style={{ backgroundColor:'#fff', borderRadius:16, border:'2px solid #e0e7ff', padding:24, marginBottom:24 }}>
            <h3 style={{ fontSize:15, fontWeight:600, color:'#0f172a', margin:'0 0 20px' }}>Create New Course</h3>
            {err && <p style={{ fontSize:13, color:'#ef4444', marginBottom:12 }}>{err}</p>}
            <form onSubmit={handleCreate}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                <div>
                  <label style={S.label} htmlFor="course-title">Course Title *</label>
                  <input id="course-title" style={S.input} placeholder="Introduction to Computer Science"
                    value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} />
                </div>
                <div>
                  <label style={S.label} htmlFor="course-code">Course Code *</label>
                  <input id="course-code" style={S.input} placeholder="CS101"
                    value={form.code} onChange={e => setForm(p=>({...p,code:e.target.value}))} />
                </div>
                <div style={{ gridColumn:'1/-1' }}>
                  <label style={S.label} htmlFor="course-desc">Description</label>
                  <textarea id="course-desc" style={{ ...S.input, resize:'none', height:72 }} placeholder="Course description..."
                    value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} />
                </div>
                <div>
                  <label style={S.label} htmlFor="course-semester">Semester</label>
                  <select id="course-semester" style={S.input} value={form.semester} onChange={e => setForm(p=>({...p,semester:e.target.value}))}>
                    <option>Semester 1</option>
                    <option>Semester 2</option>
                  </select>
                </div>
                <div>
                  <label style={S.label} htmlFor="course-year">Academic Year</label>
                  <input id="course-year" style={S.input} placeholder="2025/2026"
                    value={form.academicYear} onChange={e => setForm(p=>({...p,academicYear:e.target.value}))} />
                </div>
              </div>
              <div style={{ display:'flex', gap:10 }}>
                <button type="submit" disabled={creating}
                  style={{ padding:'9px 20px', borderRadius:12, backgroundColor:'#4f46e5', color:'#fff', fontSize:14, fontWeight:500, border:'none', cursor:'pointer', fontFamily:"'Sora','Inter',sans-serif", opacity: creating ? 0.6 : 1 }}>
                  {creating ? 'Creating...' : 'Create Course'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  style={{ padding:'9px 20px', borderRadius:12, backgroundColor:'#f1f5f9', color:'#334155', fontSize:14, fontWeight:500, border:'none', cursor:'pointer', fontFamily:"'Sora','Inter',sans-serif" }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Courses */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:0 }}>My Courses</h2>
          <span style={{ fontSize:13, color:'#94a3b8' }}>{courses.length} course{courses.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[1,2,3].map(i => <div key={i} style={{ height:130, borderRadius:16, background:'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize:'200% 100%' }} />)}
          </div>
        ) : courses.length === 0 ? (
          <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'48px 24px', textAlign:'center' }}>
            <p style={{ fontSize:40, margin:'0 0 12px' }}>📚</p>
            <h3 style={{ fontSize:15, fontWeight:600, color:'#334155', margin:'0 0 6px' }}>No courses yet</h3>
            <p style={{ fontSize:13, color:'#94a3b8', margin:'0 0 20px' }}>Create your first course to get started.</p>
            <button onClick={() => setShowForm(true)}
              style={{ display:'inline-flex', padding:'9px 20px', borderRadius:12, backgroundColor:'#4f46e5', color:'#fff', fontSize:14, fontWeight:500, border:'none', cursor:'pointer', fontFamily:"'Sora','Inter',sans-serif" }}>
              Create a Course
            </button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {courses.map(course => {
              const sc = statusColor[course.status] || statusColor.archived;
              return (
                <Link key={course._id} href={`/courses/${course._id}`}
                  onMouseEnter={() => setHovered(course._id)}
                  onMouseLeave={() => setHovered(null)}
                  style={{ ...S.courseCard, boxShadow: hovered===course._id ? '0 8px 24px rgb(0 0 0/0.1)' : S.courseCard?.boxShadow, transform: hovered===course._id ? 'translateY(-3px)' : 'none' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                    <span style={{ fontSize:11, fontWeight:600, backgroundColor:'#e0e7ff', color:'#4338ca', padding:'2px 10px', borderRadius:9999 }}>{course.code}</span>
                    <span style={{ fontSize:11, fontWeight:500, backgroundColor: sc.bg, color: sc.color, padding:'2px 10px', borderRadius:9999 }}>{course.status}</span>
                  </div>
                  <h3 style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:'0 0 6px', lineHeight:1.4 }}>{course.title}</h3>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:'0 0 14px' }}>{course.semester} · {course.academicYear}</p>
                  <div style={{ display:'flex', gap:8 }}>
                    {/* span instead of Link — the whole card is already a Link, nested <a> is invalid HTML */}
                    <span
                      style={{ fontSize:12, fontWeight:500, color:'#4f46e5', textDecoration:'none', padding:'5px 12px', borderRadius:8, backgroundColor:'#eef2ff', display:'inline-block' }}>
                      Manage →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
