'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { courseApi } from '@/utils/api/courseApi';
import { Course } from '@/types';

export default function CourseOverviewPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (courseId) {
      courseApi.getOne(courseId).then(res => setCourse(res.data.data));
    }
  }, [courseId]);

  const tabs = [
    { label:'Modules',       href:`/courses/${courseId}/modules`,       icon:'📖' },
    { label:'Assignments',   href:`/courses/${courseId}/assignments`,    icon:'📝' },
    { label:'Quizzes',       href:`/courses/${courseId}/quizzes`,        icon:'🧪' },
    { label:'Grades',        href:`/courses/${courseId}/grades`,         icon:'📊' },
    { label:'Attendance',    href:`/courses/${courseId}/attendance`,     icon:'✅' },
    { label:'Discussions',   href:`/courses/${courseId}/discussions`,    icon:'💬' },
    { label:'Announcements', href:`/courses/${courseId}/announcements`,  icon:'📢' },
    { label:'Live',          href:`/courses/${courseId}/live`,           icon:'🎥' },
  ];

  return (
    <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:32 }}>
      {/* Left — quick links */}
      <div>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 20px' }}>Course Sections</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(200px, 1fr))', gap:16 }}>
          {tabs.map(tab => (
            <Link key={tab.href} href={tab.href}
              style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'24px', textDecoration:'none', transition:'all 0.2s', display:'block', boxShadow:'0 1px 2px rgba(0,0,0,0.05)' }}>
              <span style={{ fontSize:28, display:'block', marginBottom:12 }}>{tab.icon}</span>
              <p style={{ fontSize:15, fontWeight:700, color:'#0f172a', margin:'0 0 4px' }}>{tab.label}</p>
              <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>Access section →</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Right — course info card */}
      <div>
        <h2 style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 20px' }}>Course Details</h2>
        <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:24 }}>
          {course && [
            { label:'Course Code',    value: course.code },
            { label:'Semester',       value: course.semester },
            { label:'Academic Year',  value: course.academicYear },
            { label:'Status',         value: course.status },
            { label:'Department',     value: (course.teacher as any)?.department || 'N/A' },
            { label:'Instructor',     value: (course.teacher as any)?.name || 'TBA' },
          ].map(row => (
            <div key={row.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'12px 0', borderBottom:'1px solid #f8fafc' }}>
              <span style={{ fontSize:13, color:'#64748b' }}>{row.label}</span>
              <span style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
