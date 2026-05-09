'use client';
import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import { Course } from '@/types';
import styles from './assignments.module.css';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  totalMarks: number;
}

interface Submission {
  _id: string;
  status: 'submitted' | 'graded' | 'late' | 'pending';
  grade?: number;
}

const statusBadge: Record<string, { bg: string, color: string, label: string }> = {
  submitted: { bg:'#dbeafe', color:'#1e40af', label:'Submitted' },
  graded:    { bg:'#d1fae5', color:'#065f46', label:'Graded'    },
  late:      { bg:'#fee2e2', color:'#991b1b', label:'Late'      },
  pending:   { bg:'#f1f5f9', color:'#475569', label:'Not Submitted' },
};

function daysLeft(dueDate: string) {
  const diff = new Date(dueDate).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0)  return { text:'Overdue', color:'#ef4444' };
  if (days === 0)return { text:'Due today', color:'#f59e0b' };
  if (days === 1)return { text:'Due tomorrow', color:'#f59e0b' };
  return { text:`${days} days left`, color:'#64748b' };
}

export default function AssignmentsPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const { user }               = useAuth();
  
  const [course, setCourse]        = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Record<string, Submission>>({});
  const [loading, setLoading]      = useState(true);
  
  const [showForm, setShowForm]    = useState(false);
  const [form, setForm]            = useState({ title:'', description:'', dueDate:'', totalMarks:'' });
  const [creating, setCreating]    = useState(false);
  const [toast, setToast]          = useState<{ msg: string, type: string } | null>(null);

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
        const [c, a] = await Promise.all([
          courseApi.getOne(courseId),
          courseApi.getAssignments(courseId),
        ]);
        if (!ignore) {
          setCourse(c.data.data);
          setAssignments(a.data.data || []);
        }
      } catch (err) {
        if (!ignore) showToast('Failed to load data', 'error');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    startFetching();
    return () => { ignore = true; };
  }, [courseId]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.dueDate || !form.totalMarks) return;
    setCreating(true);
    try {
      const res = await courseApi.createAssignment(courseId, {
        ...form,
        totalMarks: parseInt(form.totalMarks),
      });
      setAssignments(p => [...p, res.data.data]);
      setForm({ title:'', description:'', dueDate:'', totalMarks:'' });
      setShowForm(false);
      showToast('Assignment created!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Failed to create assignment.', 'error');
    } finally { setCreating(false); }
  };

  return (
    <div style={{ maxWidth: 900 }}>
      {toast && (
        <div className={styles.toast} style={{ backgroundColor: toast.type==='error'?'#fee2e2':'#d1fae5', color: toast.type==='error'?'#991b1b':'#065f46' }}>
          {toast.msg}
        </div>
      )}

      {/* Header Info */}
      <div className={styles.actionsBar}>
        <div>
          <h2 style={{ fontSize:20, fontWeight:700, color:'#0f172a', margin:0 }}>Course Assignments</h2>
          <p style={{ fontSize:14, color:'#64748b', margin:0 }}>{assignments.length} tasks assigned</p>
        </div>
        {isOwner && (
          <button onClick={() => setShowForm(p => !p)} className={`${styles.btnAdd} ${showForm ? styles.btnAddActive : ''}`}>
            {showForm ? '✕ Cancel' : '+ New Assignment'}
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div className={styles.formCard}>
          <h3 style={{ fontSize:15, fontWeight:600, color:'#0f172a', margin:'0 0 16px' }}>New Assignment</h3>
          <form onSubmit={handleCreate}>
            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:14, marginBottom:14 }}>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:6 }}>Title *</label>
                <input className={styles.input} 
                  placeholder="Assignment 1 — Algorithms" 
                  aria-label="Assignment Title"
                  value={form.title} 
                  onChange={e => setForm(p=>({...p,title:e.target.value}))} required />
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:6 }}>Total Marks *</label>
                <input type="number" min="1" className={styles.input} 
                  placeholder="100" 
                  aria-label="Total Marks"
                  value={form.totalMarks} 
                  onChange={e => setForm(p=>({...p,totalMarks:e.target.value}))} required />
              </div>
              <div>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:6 }}>Due Date *</label>
                <input type="datetime-local" className={styles.input} 
                  aria-label="Assignment Due Date"
                  value={form.dueDate} 
                  onChange={e => setForm(p=>({...p,dueDate:e.target.value}))} required />
              </div>
              <div style={{ gridColumn:'1/-1' }}>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:6 }}>Description</label>
                <textarea rows={3} className={styles.textarea} 
                  placeholder="Describe the assignment requirements..." 
                  aria-label="Assignment Description"
                  value={form.description} 
                  onChange={e => setForm(p=>({...p,description:e.target.value}))} />
              </div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button type="submit" disabled={creating} className={styles.btnAdd} style={{ opacity:creating?0.6:1 }}>
                {creating ? 'Creating...' : 'Create Assignment'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className={styles.btnAdd} style={{ backgroundColor:'#f1f5f9', color:'#334155' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Assignment list */}
      {loading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {[1,2,3].map(i => <div key={i} className={styles.skeleton} />)}
        </div>
      ) : assignments.length === 0 ? (
        <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'56px 24px', textAlign:'center' }}>
          <p style={{ fontSize:40, margin:'0 0 12px' }}>📝</p>
          <h3 style={{ fontSize:15, fontWeight:600, color:'#334155', margin:'0 0 6px' }}>No assignments yet</h3>
          <p style={{ fontSize:13, color:'#94a3b8' }}>{isOwner ? 'Create the first assignment for this course.' : 'No assignments have been posted yet.'}</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {assignments.map(a => {
            const dl = daysLeft(a.dueDate);
            const sub = submissions[a._id];
            const sb = statusBadge[sub?.status || 'pending'];
            return (
              <div key={a._id} className={styles.assignmentItem}>
                <div className={styles.iconBox}>📝</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
                    <h3 style={{ fontSize:15, fontWeight:600, color:'#0f172a', margin:0 }}>{a.title}</h3>
                    {isStudent && <span className={styles.badge} style={{ backgroundColor: sb.bg, color: sb.color }}>{sb.label}</span>}
                  </div>
                  {a.description && <p style={{ fontSize:13, color:'#64748b', margin:'0 0 6px', lineHeight:1.5 }}>{a.description}</p>}
                  <div style={{ display:'flex', alignItems:'center', gap:16, fontSize:12 }}>
                    <span style={{ color: dl.color, fontWeight:500 }}>📅 {new Date(a.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'})}</span>
                    <span style={{ color: dl.color, fontWeight:600 }}>{dl.text}</span>
                    <span style={{ color:'#94a3b8' }}>🏆 {a.totalMarks} marks</span>
                    {sub?.grade !== undefined && <span style={{ color:'#059669', fontWeight:600 }}>✅ {sub.grade}/{a.totalMarks}</span>}
                  </div>
                </div>
                <Link href={`/courses/${courseId}/assignments/${a._id}`} 
                  className={`${styles.btnAction} ${isStudent && !sub ? styles.btnPrimary : ''}`}>
                  {isOwner ? 'View Submissions' : isStudent && !sub ? 'Submit' : 'View'}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
