'use client';
import { useEffect, useState } from 'react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import Sidebar from '@/components/shared/Sidebar';
import { Course } from '@/types';
import styles from './course_layout.module.css';

const statusColor: Record<string, { bg: string, color: string }> = {
  active:   { bg: '#d1fae5', color: '#065f46' },
  draft:    { bg: '#fef3c7', color: '#92400e' },
  archived: { bg: '#f1f5f9', color: '#475569' },
};

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const courseId = params.courseId as string;
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [toast, setToast] = useState<{ msg: string, type: string } | null>(null);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';
  const isOwner = isTeacher && (
    (typeof course?.teacher === 'object' && course.teacher?._id === user?._id) ||
    (course?.teacher === user?._id)
  );

  const showToast = (msg: string, type: string = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      if (!courseId) return;
      try {
        const res = await courseApi.getOne(courseId);
        if (!ignore) setCourse(res.data.data);
      } catch {
        if (!ignore) setCourse(null);
      } finally {
        if (!ignore) setLoading(false);
      }

      if (isStudent && !ignore) {
        try {
          const res = await courseApi.getMyCourses();
          const ids = (res.data.data || []).map((c: { _id: string }) => c._id);
          if (!ignore) setEnrolled(ids.includes(courseId));
        } catch {}
      }
    }
    startFetching();
    return () => { ignore = true; };
  }, [courseId, isStudent]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await courseApi.enroll(courseId);
      setEnrolled(true);
      showToast('Enrolled successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Enrollment failed.', 'error');
    } finally { setEnrolling(false); }
  };

  const handleDrop = async () => {
    setEnrolling(true);
    try {
      await courseApi.drop(courseId);
      setEnrolled(false);
      showToast('Course dropped.');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to drop course.', 'error');
    } finally { setEnrolling(false); }
  };

  const tabs = [
    { label: 'Overview',     href: `/courses/${courseId}`,               icon: '🏠' },
    { label: 'Modules',      href: `/courses/${courseId}/modules`,       icon: '📖' },
    { label: 'Assignments',  href: `/courses/${courseId}/assignments`,    icon: '📝' },
    { label: 'Quizzes',      href: `/courses/${courseId}/quizzes`,        icon: '🧪' },
    { label: 'Grades',       href: `/courses/${courseId}/grades`,         icon: '📊' },
    { label: 'Attendance',   href: `/courses/${courseId}/attendance`,     icon: '✅' },
    { label: 'Discussions',  href: `/courses/${courseId}/discussions`,    icon: '💬' },
    { label: 'Announcements',href: `/courses/${courseId}/announcements`,  icon: '📢' },
    { label: 'Live',         href: `/courses/${courseId}/live`,           icon: '🎥' },
  ];

  if (loading) return (
    <div className={styles.layoutWrap}>
      <Sidebar />
      <main className={styles.mainArea} style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center' }}>
          <div className={styles.spinner} />
          <p style={{ color:'#64748b', fontSize:14 }}>Loading course details...</p>
        </div>
      </main>
    </div>
  );

  if (!course) return (
    <div className={styles.layoutWrap}>
      <Sidebar />
      <main className={styles.mainArea} style={{ display:'flex', alignItems:'center', justifyContent:'center' }}>
        <div style={{ textAlign:'center' }}>
          <p style={{ fontSize:48, marginBottom:16 }}>😕</p>
          <h2 style={{ fontSize:18, fontWeight:700, color:'#0f172a', marginBottom:8 }}>Course not found</h2>
          <Link href="/courses" style={{ color:'#4f46e5', fontSize:14, fontWeight:500 }}>← Back to courses</Link>
        </div>
      </main>
    </div>
  );

  const sc = statusColor[course.status] || statusColor.archived;

  return (
    <div className={styles.layoutWrap}>
      {toast && (
        <div className={styles.toast} style={{ backgroundColor: toast.type==='error'?'#fee2e2':'#d1fae5', color: toast.type==='error'?'#991b1b':'#065f46' }}>
          {toast.msg}
        </div>
      )}

      <Sidebar />

      <main className={styles.mainArea}>
        {/* Course header */}
        <div className={styles.courseHeader}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <Link href="/courses">Courses</Link>
            <span>›</span>
            <span>{course.title}</span>
          </div>

          {/* Header content */}
          <div className={styles.headerContent}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                <span className={styles.badge} style={{ backgroundColor:'#e0e7ff', color:'#4338ca' }}>{course.code}</span>
                <span className={styles.badge} style={{ backgroundColor: sc.bg, color: sc.color }}>{course.status}</span>
                <span style={{ fontSize:12, color:'#94a3b8' }}>{course.semester} · {course.academicYear}</span>
              </div>
              <h1 className={styles.courseTitle}>{course.title}</h1>
              {course.description && <p className={styles.courseDesc}>{course.description}</p>}
              
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <div className={styles.instructorIcon}>
                  {typeof course.teacher === 'object' ? course.teacher?.name?.charAt(0)?.toUpperCase() : '?'}
                </div>
                <span style={{ fontSize:13, color:'#475569' }}>
                  <strong style={{ color:'#0f172a' }}>{typeof course.teacher === 'object' ? course.teacher?.name : 'Unknown'}</strong> · {typeof course.teacher === 'object' ? (course.teacher as { department?: string })?.department || 'Faculty' : 'Faculty'}
                </span>
              </div>
            </div>

            <div style={{ marginLeft:24, flexShrink:0 }}>
              {isStudent && course.status === 'active' && (
                enrolled ? (
                  <button onClick={handleDrop} disabled={enrolling} className={styles.btnDrop}>
                    {enrolling ? 'Processing...' : 'Drop Course'}
                  </button>
                ) : (
                  <button onClick={handleEnroll} disabled={enrolling} className={styles.btnEnroll}>
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                )
              )}
              {isOwner && (
                <Link href={`/courses/${courseId}/settings`} className={styles.btnEnroll}>
                  Manage Course
                </Link>
              )}
            </div>
          </div>

          {/* Tab navigation */}
          <div className={styles.tabNav}>
            {tabs.map(tab => {
              const isActive = pathname === tab.href;
              return (
                <Link key={tab.href} href={tab.href} className={isActive ? styles.tabLinkActive : styles.tabLink}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.contentArea}>
          {children}
        </div>
      </main>
    </div>
  );
}
