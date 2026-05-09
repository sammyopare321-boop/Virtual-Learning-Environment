'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/utils/api/adminApi';

interface DashboardStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  activeCourses: number;
  totalEnrollments: number;
  [key: string]: number | undefined;
}

const S: Record<string, React.CSSProperties> = {
  wrap:       { display:'flex', minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:"'Sora', 'Inter', sans-serif" },
  sidebar:    { width:240, backgroundColor:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', flexShrink:0 },
  sidebarTop: { padding:'20px 16px 16px', borderBottom:'1px solid #f1f5f9' },
  logo:       { display:'flex', alignItems:'center', gap:10 },
  logoBox:    { width:34, height:34, borderRadius:10, backgroundColor:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  logoText:   { fontWeight:700, fontSize:16, color:'#0f172a' },
  userCard:   { padding:'12px 16px', borderBottom:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:10 },
  avatar:     { width:36, height:36, borderRadius:10, backgroundColor:'#e0e7ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#4338ca', fontWeight:700, fontSize:14, flexShrink:0 },
  nav:        { flex:1, padding:'10px 10px', display:'flex', flexDirection:'column', gap:2 },
  navLink:    { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#475569', textDecoration:'none', transition:'all 0.15s', border:'none', background:'transparent', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  navLinkActive:{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#4338ca', textDecoration:'none', background:'#eef2ff', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  main:       { flex:1, overflowY:'auto', padding:'40px 40px' },
  header:     { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32 },
  h1:         { fontSize:24, fontWeight:700, color:'#0f172a', letterSpacing:'-0.025em', margin:0 },
  subtitle:   { fontSize:14, color:'#64748b', marginTop:4 },
  grid3:      { display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:16, marginBottom:32 },
  grid4:      { display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:16 },
  statCard:   { backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgb(0 0 0/0.07)', padding:24, display:'flex', alignItems:'center', gap:16, textDecoration:'none', transition:'all 0.2s', cursor:'pointer' },
  statIcon:   { width:48, height:48, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:20 },
  statVal:    { fontSize:28, fontWeight:700, color:'#0f172a', letterSpacing:'-0.02em', lineHeight:1 },
  statLabel:  { fontSize:13, color:'#64748b', marginTop:4 },
  actionCard: { backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgb(0 0 0/0.07)', padding:24, textDecoration:'none', transition:'all 0.2s', cursor:'pointer', display:'block' },
  actionIcon: { width:44, height:44, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:14, fontSize:20 },
  sectionTitle:{ fontSize:16, fontWeight:600, color:'#0f172a', marginBottom:16, marginTop:0 },
  badge:      { display:'inline-flex', alignItems:'center', padding:'2px 10px', borderRadius:9999, fontSize:12, fontWeight:500, backgroundColor:'#e0e7ff', color:'#4338ca' },
  skeletonCard:{ backgroundColor:'#f1f5f9', borderRadius:16, height:96, animation:'pulse 2s infinite' },
  logoutBtn:  { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#ef4444', background:'transparent', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif", marginTop:'auto' },
};

const navItems = [
  { href:'/dashboard/admin', label:'Dashboard',     icon:'📊', active:true },
  { href:'/admin/users',     label:'Users',          icon:'👥' },
  { href:'/admin/courses',   label:'Courses',        icon:'📚' },
  { href:'/admin/analytics', label:'Analytics',      icon:'📈' },
  { href:'/admin/logs',      label:'Activity Logs',  icon:'📋' },
  { href:'/profile',         label:'Profile',        icon:'👤' },
];

const statDefs = [
  { key:'totalUsers',       label:'Total Users',       icon:'👥', bg:'#eef2ff', href:'/admin/users' },
  { key:'totalStudents',    label:'Students',           icon:'🎓', bg:'#f0fdf4', href:'/admin/users?role=student' },
  { key:'totalTeachers',    label:'Teachers',           icon:'🏫', bg:'#faf5ff', href:'/admin/users?role=teacher' },
  { key:'totalCourses',     label:'Total Courses',      icon:'📚', bg:'#ecfdf5', href:'/admin/courses' },
  { key:'activeCourses',    label:'Active Courses',     icon:'✅', bg:'#f0fdfa', href:'/admin/courses?status=active' },
  { key:'totalEnrollments', label:'Total Enrollments',  icon:'📋', bg:'#fffbeb', href:'/admin/analytics' },
];

const quickActions = [
  { href:'/admin/users',     label:'Manage Users',    icon:'👥', bg:'#eef2ff', desc:'View, suspend, change roles, delete users' },
  { href:'/admin/courses',   label:'Manage Courses',  icon:'📚', bg:'#ecfdf5', desc:'Reassign teachers, archive courses' },
  { href:'/admin/analytics', label:'Analytics',       icon:'📈', bg:'#faf5ff', desc:'Platform-wide performance & grade stats' },
  { href:'/admin/logs',      label:'Activity Logs',   icon:'📋', bg:'#fffbeb', desc:'Full audit trail of all admin actions' },
];

export default function AdminDashboard() {
  const { user, logout }    = useAuth();
  const [stats, setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredStat, setHoveredStat]     = useState<string | null>(null);
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  useEffect(() => {
    adminApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => setStats({ totalUsers:0, totalStudents:0, totalTeachers:0, totalCourses:0, activeCourses:0, totalEnrollments:0 }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={S.wrap}>
      {/* ── Sidebar ───────────────────────────────────── */}
      <aside style={S.sidebar}>
        {/* Logo */}
        <div style={S.sidebarTop}>
          <div style={S.logo}>
            <div style={S.logoBox}>
              <svg width="18" height="18" fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
            </div>
            <span style={S.logoText}>UniLearn</span>
          </div>
        </div>

        {/* User card */}
        <div style={S.userCard}>
          <div style={S.avatar}>{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {user?.name || 'Admin'}
            </p>
            <span style={{ fontSize:11, fontWeight:500, backgroundColor:'#e0e7ff', color:'#4338ca', padding:'1px 8px', borderRadius:9999 }}>
              admin
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={S.nav}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href}
              style={item.active ? S.navLinkActive : S.navLink}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ padding:'10px 10px', borderTop:'1px solid #f1f5f9' }}>
          <button onClick={logout} style={S.logoutBtn}>
            <span style={{ fontSize:16 }}>🚪</span>
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content ──────────────────────────────── */}
      <main style={S.main}>
        {/* Header */}
        <div style={S.header}>
          <div>
            <h1 style={S.h1}>Admin Dashboard</h1>
            <p style={S.subtitle}>Platform overview and management tools.</p>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <Link href="/admin/users"
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:12, backgroundColor:'#fff', border:'1px solid #e2e8f0', fontSize:14, fontWeight:500, color:'#334155', textDecoration:'none' }}>
              + Register User
            </Link>
            <Link href="/admin/analytics"
              style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 18px', borderRadius:12, backgroundColor:'#4f46e5', fontSize:14, fontWeight:500, color:'#fff', textDecoration:'none' }}>
              View Analytics
            </Link>
          </div>
        </div>

        {/* Stats grid */}
        <p style={S.sectionTitle}>Platform Overview</p>
        {loading ? (
          <div style={S.grid3}>
            {[1,2,3,4,5,6].map(i => (
              <div key={i} style={{ ...S.skeletonCard, background:'linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)', backgroundSize:'200% 100%' }} />
            ))}
          </div>
        ) : (
          <div style={S.grid3}>
            {statDefs.map(s => {
              const isHovered = hoveredStat === s.key;
              return (
                <Link key={s.key} href={s.href} style={{ textDecoration:'none' }}>
                  <div
                    onMouseEnter={() => setHoveredStat(s.key)}
                    onMouseLeave={() => setHoveredStat(null)}
                    style={{
                      ...S.statCard,
                      boxShadow: isHovered ? '0 8px 24px rgb(0 0 0/0.1)' : S.statCard?.boxShadow,
                      transform: isHovered ? 'translateY(-3px)' : 'none',
                    }}>
                    <div style={{ ...S.statIcon, backgroundColor: s.bg }}>
                      {s.icon}
                    </div>
                    <div>
                      <div style={S.statVal}>{stats?.[s.key]?.toLocaleString() ?? '—'}</div>
                      <div style={S.statLabel}>{s.label}</div>
                    </div>
                    <div style={{ marginLeft:'auto', color:'#c7d2fe', fontSize:18 }}>→</div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Divider */}
        <div style={{ height:1, backgroundColor:'#f1f5f9', marginBottom:28 }} />

        {/* Quick actions */}
        <p style={S.sectionTitle}>Quick Actions</p>
        <div style={S.grid4}>
          {quickActions.map(a => {
            const isHovered = hoveredAction === a.href;
            return (
              <Link key={a.href} href={a.href} style={{ textDecoration:'none' }}>
                <div
                  onMouseEnter={() => setHoveredAction(a.href)}
                  onMouseLeave={() => setHoveredAction(null)}
                  style={{
                    ...S.actionCard,
                    boxShadow: isHovered ? '0 8px 24px rgb(0 0 0/0.1)' : S.actionCard?.boxShadow,
                    transform: isHovered ? 'translateY(-3px)' : 'none',
                  }}>
                  <div style={{ ...S.actionIcon, backgroundColor: a.bg }}>{a.icon}</div>
                  <p style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:'0 0 6px' }}>{a.label}</p>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0, lineHeight:1.5 }}>{a.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer note */}
        <div style={{ marginTop:40, padding:'16px 20px', backgroundColor:'#fff', borderRadius:14, border:'1px solid #e2e8f0', display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:36, height:36, borderRadius:10, backgroundColor:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🛡️</div>
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0 }}>You have full admin access</p>
            <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>All actions are logged to the activity audit trail.</p>
          </div>
          <Link href="/admin/logs"
            style={{ marginLeft:'auto', fontSize:13, fontWeight:500, color:'#4f46e5', textDecoration:'none', whiteSpace:'nowrap' }}>
            View logs →
          </Link>
        </div>
      </main>
    </div>
  );
}
