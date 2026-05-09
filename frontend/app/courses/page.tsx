'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import { Course } from '@/types';
import { AxiosError } from 'axios';
import styles from './courses.module.css';

const statusColor: Record<string, { bg: string, color: string }> = {
  active:   { bg:'#d1fae5', color:'#065f46' },
  draft:    { bg:'#fef3c7', color:'#92400e' },
  archived: { bg:'#f1f5f9', color:'#475569' },
};

const cardAccent = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6','#3b82f6','#14b8a6','#f97316'];

export default function CoursesPage() {
  const { user, logout }        = useAuth();
  const [courses, setCourses]   = useState<Course[]>([]);
  const [enrolled, setEnrolled] = useState<Set<string>>(new Set());
  const [loading, setLoading]   = useState(true);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [hovered, setHovered]   = useState<string | null>(null);
  const [toast, setToast]       = useState<{ msg: string, type: string } | null>(null);

  const showToast = (msg: string, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  const navItems = user?.role === 'admin' ? [
    { href:'/dashboard/admin', label:'Dashboard',    icon:'📊' },
    { href:'/admin/users',     label:'Users',         icon:'👥' },
    { href:'/admin/courses',   label:'Courses',       icon:'📚', active:true },
    { href:'/admin/analytics', label:'Analytics',     icon:'📈' },
    { href:'/admin/logs',      label:'Activity Logs', icon:'📋' },
    { href:'/profile',         label:'Profile',       icon:'👤' },
  ] : user?.role === 'teacher' ? [
    { href:'/dashboard/teacher', label:'Dashboard',     icon:'📊' },
    { href:'/courses',           label:'My Courses',    icon:'📚', active:true },
    { href:'/messages',          label:'Messages',      icon:'💬' },
    { href:'/notifications',     label:'Notifications', icon:'🔔' },
    { href:'/profile',           label:'Profile',       icon:'👤' },
  ] : [
    { href:'/dashboard/student', label:'Dashboard',     icon:'📊' },
    { href:'/courses',           label:'My Courses',    icon:'📚', active:true },
    { href:'/messages',          label:'Messages',      icon:'💬' },
    { href:'/notifications',     label:'Notifications', icon:'🔔' },
    { href:'/profile',           label:'Profile',       icon:'👤' },
  ];

  const avatarBg = user?.role === 'teacher' ? '#faf5ff' : user?.role === 'admin' ? '#e0e7ff' : '#d1fae5';
  const avatarColor = user?.role === 'teacher' ? '#7c3aed' : user?.role === 'admin' ? '#4338ca' : '#065f46';
  const roleBadgeBg = user?.role === 'teacher' ? '#faf5ff' : user?.role === 'admin' ? '#e0e7ff' : '#d1fae5';

  useEffect(() => {
    if (isStudent) {
      courseApi.getMyCourses()
        .then(res => {
          const ids = new Set<string>((res.data.data || []).map((c: Course) => c._id));
          setEnrolled(ids);
        })
        .catch(() => {});
    }
  }, [isStudent]);

  const fetchCourses = useCallback(() => {
    const params: { search?: string; status?: string } = {};
    if (search)               params.search = search;
    if (statusFilter !== 'all') params.status = statusFilter;
    
    courseApi.getAll(params)
      .then(res => {
        let all: Course[] = res.data.data || [];
        if (isTeacher) {
          all = all.filter((c: Course) => {
            const tId = typeof c.teacher === 'object' ? c.teacher?._id : c.teacher;
            return tId === user?._id;
          });
        }
        setCourses(all);
      })
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, [search, statusFilter, isTeacher, user]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleSearch = (val: string) => {
    setSearch(val);
    setLoading(true);
  };

  const handleStatusFilter = (val: string) => {
    setStatusFilter(val);
    setLoading(true);
  };

  const handleEnroll = async (courseId: string) => {
    setEnrolling(courseId);
    try {
      await courseApi.enroll(courseId);
      setEnrolled(prev => new Set([...prev, courseId]));
      showToast('Successfully enrolled in course!');
    } catch (err: unknown) {
      let msg = 'Failed to enroll';
      if (err instanceof AxiosError) msg = err.response?.data?.message || msg;
      showToast(msg, 'error');
    } finally {
      setEnrolling(null);
    }
  };

  return (
    <div className={styles.wrap}>
      {toast && (
        <div className={styles.toast} style={{ backgroundColor: toast.type==='error'?'#fee2e2':'#d1fae5', color: toast.type==='error'?'#991b1b':'#065f46' }}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logoBox}>
          <div className={styles.logoInner}>
            <div className={styles.logoIcon}>
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
        <nav className={styles.nav}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} className={item.active ? styles.linkActive : styles.link}>
              <span style={{ fontSize:16 }}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
        <div style={{ padding:'10px', borderTop:'1px solid #f1f5f9' }}>
          <button onClick={logout} className={styles.link} style={{ color: '#ef4444' }}>
            <span>🚪</span><span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:28, fontWeight:700, color:'#0f172a', margin:0 }}>{isTeacher ? 'My Teaching Courses' : 'Browse Courses'}</h1>
            <p style={{ fontSize:14, color:'#64748b', marginTop:4 }}>{isTeacher ? 'Manage your active courses and modules.' : 'Enroll in new subjects to start learning.'}</p>
          </div>
          <div style={{ display:'flex', gap:12 }}>
            <input 
              className={styles.input}
              style={{ width:260 }}
              placeholder="🔍 Search courses..."
              value={search}
              onChange={e => handleSearch(e.target.value)}
            />
            {user?.role === 'admin' && (
              <Link href="/admin/courses/new" style={{ padding:'10px 20px', borderRadius:12, backgroundColor:'#4f46e5', color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none' }}>
                + Create Course
              </Link>
            )}
          </div>
        </div>

        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:300, color:'#64748b' }}>
            Loading courses...
          </div>
        ) : courses.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', backgroundColor:'#fff', borderRadius:24, border:'1px solid #e2e8f0' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>📚</div>
            <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a' }}>No courses found</h3>
            <p style={{ fontSize:14, color:'#64748b' }}>Try adjusting your search or filters.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:24 }}>
            {courses.map((course, idx) => {
              const accent = cardAccent[idx % cardAccent.length];
              const isEnrolled = enrolled.has(course._id);
              const status = statusColor[course.status] || statusColor.active;
              const teacherName = typeof course.teacher === 'object' ? course.teacher?.name : 'TBA';

              return (
                <div 
                  key={course._id} 
                  className={styles.card}
                  onMouseEnter={() => setHovered(course._id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div style={{ height:8, backgroundColor: accent }} />
                  <div style={{ padding:24, flex:1 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
                      <span style={{ fontSize:12, fontWeight:700, color: accent, textTransform:'uppercase', letterSpacing:'0.05em' }}>{course.code}</span>
                      <span className={styles.badge} style={{ backgroundColor: status.bg, color: status.color }}>{course.status}</span>
                    </div>
                    <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 8px', lineHeight:1.4 }}>{course.title}</h3>
                    <p style={{ fontSize:14, color:'#64748b', margin:'0 0 20px', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden', minHeight:40 }}>
                      {course.description || 'No description provided.'}
                    </p>
                    
                    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 0', borderTop:'1px solid #f1f5f9' }}>
                      <div style={{ width:32, height:32, borderRadius:8, backgroundColor:'#f8fafc', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>👤</div>
                      <div>
                        <p style={{ fontSize:11, color:'#94a3b8', margin:0, textTransform:'uppercase', fontWeight:700 }}>Instructor</p>
                        <p style={{ fontSize:13, fontWeight:600, color:'#475569', margin:0 }}>{teacherName}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ padding:'16px 24px', backgroundColor:'#f8fafc', borderTop:'1px solid #f1f5f9', display:'flex', gap:12 }}>
                    {isStudent ? (
                      isEnrolled ? (
                        <Link href={`/courses/${course._id}`} style={{ flex:1, textAlign:'center', padding:'10px', borderRadius:10, backgroundColor: accent, color:'#fff', fontSize:14, fontWeight:600, textDecoration:'none' }}>
                          Continue Learning
                        </Link>
                      ) : (
                        <button 
                          onClick={() => handleEnroll(course._id)}
                          disabled={enrolling === course._id}
                          style={{ flex:1, padding:'10px', borderRadius:10, border:`1px solid ${accent}`, color: accent, fontSize:14, fontWeight:600, background:'transparent', cursor:'pointer' }}
                        >
                          {enrolling === course._id ? 'Enrolling...' : 'Enroll Now'}
                        </button>
                      )
                    ) : (
                      <Link href={`/courses/${course._id}`} style={{ flex:1, textAlign:'center', padding:'10px', borderRadius:10, backgroundColor:'#f1f5f9', color:'#475569', fontSize:14, fontWeight:600, textDecoration:'none' }}>
                        View Details
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
