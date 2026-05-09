'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';

interface Course {
  _id: string;
  code: string;
  title: string;
  status: string;
  semester: string;
  academicYear: string;
}

const S: Record<string, React.CSSProperties> = {
  wrap:     { display:'flex', minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:"'Sora','Inter',sans-serif" },
  sidebar:  { width:240, backgroundColor:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', flexShrink:0 },
  logoBox:  { padding:'20px 16px 16px', borderBottom:'1px solid #f1f5f9' },
  logoInner:{ display:'flex', alignItems:'center', gap:10 },
  logoIcon: { width:34, height:34, borderRadius:10, backgroundColor:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  logoText: { fontWeight:700, fontSize:16, color:'#0f172a' },
  userCard: { padding:'12px 16px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:10 },
  avatar:   { width:36, height:36, borderRadius:10, backgroundColor:'#e0e7ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#4338ca', fontWeight:700, fontSize:14, flexShrink:0 },
  nav:      { flex:1, padding:'10px', display:'flex', flexDirection:'column', gap:2 },
  link:     { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#475569', textDecoration:'none', border:'none', background:'transparent', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  linkActive:{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#4338ca', textDecoration:'none', background:'#eef2ff', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  main:     { flex:1, overflowY:'auto', padding:'40px' },
  h1:       { fontSize:24, fontWeight:700, color:'#0f172a', letterSpacing:'-0.025em', margin:0 },
  subtitle: { fontSize:14, color:'#64748b', marginTop:4, marginBottom:0 },
  grid3:    { display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:32 },
  statCard: { backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgb(0 0 0/0.07)', padding:24, display:'flex', alignItems:'center', gap:16 },
  statIcon: { width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:22 },
  courseCard:{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgb(0 0 0/0.07)', padding:20, textDecoration:'none', display:'block', transition:'all 0.2s' },
};

const navItems = [
  { href:'/dashboard/student', label:'Dashboard',     icon:'📊', active:true },
  { href:'/courses',           label:'My Courses',    icon:'📚' },
  { href:'/messages',          label:'Messages',      icon:'💬' },
  { href:'/notifications',     label:'Notifications', icon:'🔔' },
  { href:'/profile',           label:'Profile',       icon:'👤' },
];

export default function StudentDashboard() {
  const { user, logout }      = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    courseApi.getMyCourses()
      .then(res => setCourses(res.data.data || []))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  const active   = courses.filter(c => c.status === 'active').length;
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

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
            <span style={S.logoText}>UniLearn</span>
          </div>
        </div>
        <div style={S.userCard}>
          <div style={S.avatar}>{user?.name?.charAt(0)?.toUpperCase() || 'S'}</div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'Student'}</p>
            <span style={{ fontSize:11, fontWeight:500, backgroundColor:'#d1fae5', color:'#065f46', padding:'1px 8px', borderRadius:9999 }}>student</span>
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
            <h1 style={S.h1}>{greeting}, {user?.name?.split(' ')[0]} 👋</h1>
            <p style={S.subtitle}>Here&apos;s what&apos;s happening with your courses today.</p>
          </div>
          <Link href="/courses" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:12, backgroundColor:'#4f46e5', fontSize:14, fontWeight:500, color:'#fff', textDecoration:'none' }}>
            + Browse Courses
          </Link>
        </div>

        {/* Stats */}
        <div style={S.grid3}>
          {[
            { label:'Enrolled Courses', value: courses.length,               icon:'📚', bg:'#eef2ff' },
            { label:'Active Courses',   value: active,                        icon:'✅', bg:'#f0fdf4' },
            { label:'Department',       value: user?.department || 'N/A',     icon:'🏛️', bg:'#fffbeb' },
          ].map(s => (
            <div key={s.label} style={S.statCard}>
              <div style={{ ...S.statIcon, backgroundColor: s.bg }}>{s.icon}</div>
              <div>
                <p style={{ fontSize:26, fontWeight:700, color:'#0f172a', margin:0, letterSpacing:'-0.02em' }}>{s.value}</p>
                <p style={{ fontSize:13, color:'#64748b', margin:0, marginTop:2 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Courses section */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:0 }}>My Courses</h2>
          <Link href="/courses" style={{ fontSize:13, fontWeight:500, color:'#4f46e5', textDecoration:'none' }}>Browse all →</Link>
        </div>

        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height:130, borderRadius:16, background:'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize:'200% 100%' }} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'48px 24px', textAlign:'center' }}>
            <p style={{ fontSize:40, margin:'0 0 12px' }}>📚</p>
            <h3 style={{ fontSize:15, fontWeight:600, color:'#334155', margin:'0 0 6px' }}>No courses yet</h3>
            <p style={{ fontSize:13, color:'#94a3b8', margin:'0 0 20px' }}>Browse available courses and enroll to get started.</p>
            <Link href="/courses" style={{ display:'inline-flex', padding:'9px 20px', borderRadius:12, backgroundColor:'#4f46e5', color:'#fff', fontSize:14, fontWeight:500, textDecoration:'none' }}>
              Browse Courses
            </Link>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {courses.map(course => (
              <Link key={course._id} href={`/courses/${course._id}`}
                onMouseEnter={() => setHovered(course._id)}
                onMouseLeave={() => setHovered(null)}
                style={{ ...S.courseCard, boxShadow: hovered===course._id ? '0 8px 24px rgb(0 0 0/0.1)' : S.courseCard?.boxShadow, transform: hovered===course._id ? 'translateY(-3px)' : 'none' }}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ fontSize:11, fontWeight:600, backgroundColor:'#e0e7ff', color:'#4338ca', padding:'2px 10px', borderRadius:9999 }}>{course.code}</span>
                  <span style={{ fontSize:11, fontWeight:500, backgroundColor: course.status==='active' ? '#d1fae5' : '#f1f5f9', color: course.status==='active' ? '#065f46' : '#475569', padding:'2px 10px', borderRadius:9999 }}>{course.status}</span>
                </div>
                <h3 style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:'0 0 6px', lineHeight:1.4 }}>{course.title}</h3>
                <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{course.semester} · {course.academicYear}</p>
              </Link>
            ))}
          </div>
        )}

        {/* Info footer */}
        <div style={{ marginTop:32, padding:'16px 20px', backgroundColor:'#fff', borderRadius:14, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, backgroundColor:'#f0fdf4', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>💡</div>
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0 }}>Stay on top of your assignments</p>
            <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Check each course for upcoming deadlines and new content.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
