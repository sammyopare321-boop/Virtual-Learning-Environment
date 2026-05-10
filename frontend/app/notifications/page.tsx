'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

type FilterType = 'all' | 'unread' | 'grades' | 'messages' | 'announcements';

const NOTIFICATIONS = [
  { id: 1, type: 'grades', read: false, title: 'Assignment graded', message: 'Your CS101 Assignment #3 has been graded. You scored 88/100.', time: '2 minutes ago' },
  { id: 2, type: 'messages', read: false, title: 'New message from Prof. Turing', message: 'Prof. Alan Turing sent you a message: "The assignment looks good!"', time: '15 minutes ago' },
  { id: 3, type: 'announcements', read: false, title: 'Course announcement', message: 'MATH201: The mid-semester exam has been rescheduled to next Friday.', time: '1 hour ago' },
  { id: 4, type: 'grades', read: true, title: 'Quiz result available', message: 'Your Physics Quiz #2 result is now available. Check your grades.', time: '3 hours ago' },
  { id: 5, type: 'announcements', read: true, title: 'New course material uploaded', message: 'ENG105: Week 7 lecture slides have been uploaded to the Modules section.', time: 'Yesterday' },
  { id: 6, type: 'messages', read: true, title: 'New message from Alice Smith', message: 'Alice Smith sent you a message: "Can you help me with the setup?"', time: 'Yesterday' },
  { id: 7, type: 'grades', read: true, title: 'Final grade posted', message: 'Your final grade for Semester 1 CS103 has been posted by the instructor.', time: '2 days ago' },
];

const typeConfig: Record<string, { icon: string; color: string; bg: string }> = {
  grades:        { icon: '📊', color: '#059669', bg: '#d1fae5' },
  messages:      { icon: '💬', color: '#2563eb', bg: '#dbeafe' },
  announcements: { icon: '📢', color: '#d97706', bg: '#fef3c7' },
};

const FILTERS: { id: FilterType; label: string }[] = [
  { id: 'all',           label: 'All' },
  { id: 'unread',        label: 'Unread' },
  { id: 'grades',        label: 'Grades' },
  { id: 'messages',      label: 'Messages' },
  { id: 'announcements', label: 'Announcements' },
];

const S: Record<string, React.CSSProperties> = {
  wrap:       { display:'flex', minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:"'Sora','Inter',sans-serif" },
  sidebar:    { width:240, backgroundColor:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', flexShrink:0, position:'sticky' as const, top:0, height:'100vh' },
  logoBox:    { padding:'20px 16px 16px', borderBottom:'1px solid #f1f5f9' },
  logoInner:  { display:'flex', alignItems:'center', gap:10 },
  logoIcon:   { width:34, height:34, borderRadius:10, backgroundColor:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  nav:        { flex:1, padding:'10px', display:'flex', flexDirection:'column', gap:2, overflowY:'auto' },
  link:       { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#475569', textDecoration:'none', border:'none', background:'transparent', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  linkActive: { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#4338ca', textDecoration:'none', background:'#eef2ff', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  main:       { flex:1, overflowY:'auto', padding:'40px' },
};

export default function NotificationsPage() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<FilterType>('all');

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
  };

  const markRead = (id: number) => {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const filtered = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'all') return true;
    return n.type === filter;
  });

  const navItems = user?.role === 'admin' ? [
    { href:'/dashboard/admin', label:'Dashboard',    icon:'📊' },
    { href:'/admin/users',     label:'Users',         icon:'👥' },
    { href:'/admin/courses',   label:'Courses',       icon:'📚' },
    { href:'/admin/analytics', label:'Analytics',     icon:'📈' },
    { href:'/admin/logs',      label:'Activity Logs', icon:'📋' },
    { href:'/profile',         label:'Profile',       icon:'👤' },
  ] : user?.role === 'teacher' ? [
    { href:'/dashboard/teacher', label:'Dashboard',     icon:'📊' },
    { href:'/courses',           label:'My Courses',    icon:'📚' },
    { href:'/messages',          label:'Messages',      icon:'💬' },
    { href:'/notifications',     label:'Notifications', icon:'🔔', active:true },
    { href:'/profile',           label:'Profile',       icon:'👤' },
  ] : [
    { href:'/dashboard/student', label:'Dashboard',     icon:'📊' },
    { href:'/courses',           label:'My Courses',    icon:'📚' },
    { href:'/messages',          label:'Messages',      icon:'💬' },
    { href:'/notifications',     label:'Notifications', icon:'🔔', active:true },
    { href:'/profile',           label:'Profile',       icon:'👤' },
  ];

  const avatarBg = user?.role === 'teacher' ? '#faf5ff' : user?.role === 'admin' ? '#e0e7ff' : '#d1fae5';
  const avatarColor = user?.role === 'teacher' ? '#7c3aed' : user?.role === 'admin' ? '#4338ca' : '#065f46';
  const roleBadgeBg = user?.role === 'teacher' ? '#faf5ff' : user?.role === 'admin' ? '#e0e7ff' : '#d1fae5';

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
          <div style={{ width:36, height:36, borderRadius:10, backgroundColor: avatarBg, display:'flex', alignItems:'center', justifyContent:'center', color: avatarColor, fontWeight:700, fontSize:14, flexShrink:0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || '?'}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</p>
            <span style={{ fontSize:11, fontWeight:500, backgroundColor: roleBadgeBg, color: avatarColor, padding:'1px 8px', borderRadius:9999 }}>{user?.role}</span>
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
            <span>🚪</span><span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={S.main}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          {/* Header */}
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:32 }}>
            <div>
              <h1 style={{ fontSize:28, fontWeight:700, color:'#0f172a', letterSpacing:'-0.025em', margin:0 }}>Notifications</h1>
              <p style={{ fontSize:14, color:'#64748b', marginTop:4 }}>
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ display:'flex', alignItems:'center', gap:8, padding:'8px 16px', backgroundColor:'#f1f5f9', color:'#334155', borderRadius:10, fontSize:13, fontWeight:600, border:'none', cursor:'pointer' }}>
                <span>✔️</span> Mark all as read
              </button>
            )}
          </div>

          {/* Filters */}
          <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:24 }}>
            {FILTERS.map(f => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  padding:'8px 16px', borderRadius:12, fontSize:13, fontWeight:600, border:'none', cursor:'pointer', transition:'all 0.2s',
                  backgroundColor: filter === f.id ? '#4f46e5' : '#f1f5f9',
                  color: filter === f.id ? '#fff' : '#475569',
                  display:'flex', alignItems:'center', gap:6
                }}
              >
                {f.label}
                {f.id === 'unread' && unreadCount > 0 && (
                  <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:18, height:18, borderRadius:'50%', backgroundColor:'rgba(255,255,255,0.2)', fontSize:10, fontWeight:700 }}>
                    {unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* List */}
          {filtered.length === 0 ? (
            <div style={{ padding:'64px 24px', textAlign:'center', backgroundColor:'#fff', borderRadius:20, border:'1px solid #e2e8f0' }}>
              <div style={{ fontSize:40, marginBottom:16 }}>🔔</div>
              <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 8px' }}>All clear!</h3>
              <p style={{ fontSize:14, color:'#64748b', margin:0 }}>No notifications in this category.</p>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              {filtered.map(n => {
                const cfg = typeConfig[n.type] || typeConfig.announcements;
                return (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    style={{
                      padding:20, borderRadius:16, border: !n.read ? '1px solid #c7d2fe' : '1px solid #e2e8f0',
                      backgroundColor: !n.read ? '#f5f7ff' : '#fff',
                      display:'flex', alignItems:'flex-start', gap:16, cursor:'pointer', transition:'all 0.2s'
                    }}
                  >
                    <div style={{ width:44, height:44, borderRadius:14, backgroundColor: cfg.bg, color: cfg.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>
                      {cfg.icon}
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:16 }}>
                        <div>
                          <p style={{ fontSize:14, fontWeight:700, color: !n.read ? '#0f172a' : '#334155', margin:'0 0 4px' }}>{n.title}</p>
                          <p style={{ fontSize:13, color:'#64748b', margin:0, lineHeight:1.5 }}>{n.message}</p>
                        </div>
                        <div style={{ display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
                          <span style={{ fontSize:11, color:'#94a3b8', whiteSpace:'nowrap' }}>{n.time}</span>
                          {!n.read ? (
                            <span style={{ width:8, height:8, borderRadius:'50%', backgroundColor:'#4f46e5' }} />
                          ) : (
                            <span style={{ fontSize:12, color:'#cbd5e1' }}>✔️</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
