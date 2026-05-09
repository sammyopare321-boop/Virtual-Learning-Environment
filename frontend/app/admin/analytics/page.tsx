'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/utils/api/adminApi';
import styles from './admin_analytics.module.css';

interface OverviewData {
  totalUsers?: number;
  totalCourses?: number;
  totalEnrollments?: number;
}

interface GradesData {
  passRate?: number;
  failRate?: number;
  platformAverage?: number;
  distribution?: Record<string, number>;
}

interface UserGrowthData {
  _id?: { month: number; year: number };
  count?: number;
}

interface AttendanceData {
  platformAttendanceRate?: number;
  courseBreakdown?: { courseId: string; courseTitle: string; attendanceRate: number }[];
}

interface EnrollmentData {
  _id?: string;
  semester?: string;
  count?: number;
}

interface ChartDataItem {
  label: string;
  value: number;
}

function BarChart({ data, color='#6366f1', height=160 }: { data: ChartDataItem[], color?: string, height?: number }) {
  if (!data || data.length === 0) return <p style={{ color:'#94a3b8', fontSize:13, textAlign:'center', padding:'32px 0' }}>No data available</p>;
  const max = Math.max(...data.map(d => d.value || 0), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:8, height, paddingTop:8 }}>
      {data.map((d, i) => {
        const pct = Math.round(((d.value || 0) / max) * 100);
        return (
          <div key={i} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4, height:'100%', justifyContent:'flex-end' }}>
            <span style={{ fontSize:11, color:'#64748b', fontWeight:500 }}>{d.value || 0}</span>
            <div 
              className={styles.bar}
              style={{ width:'100%', backgroundColor: color, borderRadius:'6px 6px 0 0', height:`${Math.max(pct, 2)}%`, opacity:0.85 }} 
            />
            <span style={{ fontSize:10, color:'#94a3b8', textAlign:'center', lineHeight:1.2 }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({ passRate=0, failRate=0 }: { passRate?: number, failRate?: number }) {
  const r = 60, cx = 80, cy = 80, circ = 2 * Math.PI * r;
  const passDash = (passRate / 100) * circ;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:32 }}>
      <svg width="160" height="160" viewBox="0 0 160 160">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f1f5f9" strokeWidth="20" />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#6366f1" strokeWidth="20"
          strokeDasharray={`${passDash} ${circ}`} strokeLinecap="round"
          transform={`rotate(-90 ${cx} ${cy})`} />
        <text x={cx} y={cy-6} textAnchor="middle" fontSize="22" fontWeight="700" fill="#0f172a" fontFamily="Sora,sans-serif">{passRate}%</text>
        <text x={cx} y={cy+14} textAnchor="middle" fontSize="11" fill="#64748b" fontFamily="Sora,sans-serif">Pass Rate</text>
      </svg>
      <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:12, height:12, borderRadius:3, backgroundColor:'#6366f1' }} />
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0 }}>Pass ({passRate}%)</p>
            <p style={{ fontSize:12, color:'#64748b', margin:0 }}>Score ≥ 50%</p>
          </div>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:12, height:12, borderRadius:3, backgroundColor:'#f1f5f9' }} />
          <div>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0 }}>Fail ({failRate}%)</p>
            <p style={{ fontSize:12, color:'#64748b', margin:0 }}>Score &lt; 50%</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { user, logout }        = useAuth();
  const [overview, setOverview] = useState<OverviewData | null>(null);
  const [grades, setGrades]     = useState<GradesData | null>(null);
  const [userGrowth, setUserGrowth] = useState<UserGrowthData[]>([]);
  const [attendance, setAttendance] = useState<AttendanceData | null>(null);
  const [enrollment, setEnrollment] = useState<EnrollmentData[]>([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminApi.getOverview(),
      adminApi.getGradeAnalytics(),
      adminApi.getUserAnalytics(),
      adminApi.getAttendanceAnalytics(),
      adminApi.getEnrollmentTrends(),
    ]).then(([ov, gr, ug, at, en]) => {
      if (ov.status === 'fulfilled') setOverview(ov.value.data.data);
      if (gr.status === 'fulfilled') setGrades(gr.value.data.data);
      if (ug.status === 'fulfilled') setUserGrowth(ug.value.data.data || []);
      if (at.status === 'fulfilled') setAttendance(at.value.data.data);
      if (en.status === 'fulfilled') setEnrollment(en.value.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const gradeDistData: ChartDataItem[] = grades?.distribution ? [
    { label:'90-100', value: grades.distribution['90-100'] || 0 },
    { label:'70-89',  value: grades.distribution['70-89']  || 0 },
    { label:'50-69',  value: grades.distribution['50-69']  || 0 },
    { label:'<50',    value: grades.distribution['below50'] || 0 },
  ] : [];

  const growthData: ChartDataItem[] = userGrowth.slice(-6).map(d => ({
    label: `${d._id?.month||''}/${String(d._id?.year||'').slice(-2)}`,
    value: d.count || 0,
  }));

  const enrollmentData: ChartDataItem[] = enrollment.map(d => ({
    label: d.semester || d._id || 'Unknown',
    value: d.count || 0,
  }));

  const navItems = [
    { href:'/dashboard/admin', label:'Dashboard',    icon:'📊' },
    { href:'/admin/users',     icon:'👥', label:'Users' },
    { href:'/admin/courses',   icon:'📚', label:'Courses' },
    { href:'/admin/analytics', icon:'📈', label:'Analytics', active:true },
    { href:'/admin/logs',      icon:'📋', label:'Activity Logs' },
    { href:'/profile',         icon:'👤', label:'Profile' },
  ];

  return (
    <div className={styles.wrap}>
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

      <main className={styles.main}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:28, fontWeight:700, color:'#0f172a', margin:0 }}>Platform Analytics</h1>
          <p style={{ fontSize:14, color:'#64748b', marginTop:4 }}>Comprehensive data overview of system performance and user engagement.</p>
        </div>

        {loading ? (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:400, color:'#64748b' }}>
            Crunching numbers...
          </div>
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:32 }}>
            {/* Stats Overview */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:24 }}>
              {[
                { label:'Total Students', value: overview?.totalUsers || 0, icon:'👥', color:'#4f46e5' },
                { label:'Active Courses', value: overview?.totalCourses || 0, icon:'📚', color:'#10b981' },
                { label:'Enrollments',    value: overview?.totalEnrollments || 0, icon:'📝', color:'#f59e0b' },
                { label:'Avg Attendance', value: `${attendance?.platformAttendanceRate || 0}%`, icon:'📅', color:'#ef4444' },
              ].map((s, i) => (
                <div key={i} className={styles.statCard}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                    <span style={{ fontSize:24 }}>{s.icon}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'#94a3b8', textTransform:'uppercase' }}>Live</span>
                  </div>
                  <div>
                    <h3 style={{ fontSize:28, fontWeight:800, color:'#0f172a', margin:'0 0 4px' }}>{s.value}</h3>
                    <p style={{ fontSize:14, fontWeight:500, color:'#64748b', margin:0 }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:32 }}>
              {/* Grades Distribution */}
              <div className={styles.chartContainer}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', marginBottom:24, display:'flex', alignItems:'center', gap:8 }}>
                  <span>📊</span> Grade Distribution
                </h3>
                <BarChart data={gradeDistData} color="#6366f1" />
              </div>

              {/* Pass/Fail Rate */}
              <div className={styles.chartContainer}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', marginBottom:24, display:'flex', alignItems:'center', gap:8 }}>
                  <span>🎯</span> Platform Success Rate
                </h3>
                <DonutChart passRate={grades?.passRate} failRate={grades?.failRate} />
              </div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:32 }}>
              {/* Enrollment Trends */}
              <div className={styles.chartContainer}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', marginBottom:24, display:'flex', alignItems:'center', gap:8 }}>
                  <span>📈</span> Enrollment Trends
                </h3>
                <BarChart data={enrollmentData} color="#10b981" height={200} />
              </div>

              {/* User Growth */}
              <div className={styles.chartContainer}>
                <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', marginBottom:24, display:'flex', alignItems:'center', gap:8 }}>
                  <span>🚀</span> New User Growth
                </h3>
                <BarChart data={growthData} color="#f59e0b" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
