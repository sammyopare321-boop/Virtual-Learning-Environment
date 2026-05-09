'use client';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { courseApi } from '@/utils/api/courseApi';
import styles from './assignment_detail.module.css';

interface Assignment {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  totalMarks: number;
}

interface Submission {
  _id: string;
  student: { _id: string, name: string };
  submittedAt: string;
  textContent?: string;
  files?: string[];
  status: 'submitted' | 'graded' | 'late';
  grade?: number;
  feedback?: string;
}

function daysLeft(dueDate: string) {
  const diff = new Date(dueDate).getTime() - new Date().getTime();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 0)  return { text:'Overdue', color:'#ef4444' };
  if (days === 0)return { text:'Due today', color:'#f59e0b' };
  return { text:`${days} day${days>1?'s':''} left`, color:'#10b981' };
}

export default function AssignmentDetailPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const assignmentId = params.assignmentId as string;
  const { user } = useAuth();
  
  const [assignment, setAssignment]= useState<Assignment | null>(null);
  const [submission, setSubmission]= useState<Submission | null>(null);
  const [allSubmissions, setAllSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading]      = useState(true);
  
  const [textContent, setTextContent] = useState('');
  const [files, setFiles]          = useState<File[]>([]);
  const [submitting, setSubmitting]= useState(false);
  const [gradeForm, setGradeForm]  = useState<Record<string, { grade: string, feedback: string }>>({});
  const [grading, setGrading]      = useState<string | null>(null);
  const [toast, setToast]          = useState<{ msg: string, type: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const isStudent = user?.role === 'student';
  const isTeacher = user?.role === 'teacher';

  const showToast = (msg: string, type: string = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    let ignore = false;
    async function startFetching() {
      try {
        const aRes = await courseApi.getAssignment(assignmentId);
        if (!ignore) setAssignment(aRes.data.data);
        
        if (isStudent && !ignore) {
          try {
            const sRes = await courseApi.getMySubmission(assignmentId);
            if (!ignore) setSubmission(sRes.data.data);
          } catch (err) {}
        }
        
        if (isTeacher && !ignore) {
          try {
            const sRes = await courseApi.getSubmissions(assignmentId);
            if (!ignore) setAllSubmissions(sRes.data.data || []);
          } catch (err) {}
        }
      } catch (err) {
        if (!ignore) showToast('Failed to load assignment', 'error');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    startFetching();
    return () => { ignore = true; };
  }, [assignmentId, isStudent, isTeacher]);

  const handleSubmit = async () => {
    if (!textContent && files.length === 0) {
      showToast('Please add text or attach a file.', 'error'); return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('textContent', textContent);
      files.forEach(f => fd.append('files', f));
      const res = await courseApi.submitAssignment(assignmentId, fd);
      setSubmission(res.data.data);
      showToast('Assignment submitted successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Submission failed.', 'error');
    } finally { setSubmitting(false); }
  };

  const handleGrade = async (submissionId: string) => {
    const gf = gradeForm[submissionId];
    if (!gf?.grade) { showToast('Enter a grade.', 'error'); return; }
    setGrading(submissionId);
    try {
      await courseApi.gradeSubmission(submissionId, { 
        grade: parseInt(gf.grade), 
        feedback: gf.feedback || '' 
      });
      setAllSubmissions(p => p.map(s => s._id === submissionId ? { ...s, grade: parseInt(gf.grade), feedback: gf.feedback, status:'graded' } : s));
      showToast('Graded successfully!');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error.response?.data?.message || 'Grading failed.', 'error');
    } finally { setGrading(null); }
  };

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'60vh' }}>
      <p style={{ color:'#64748b' }}>Loading assignment details...</p>
    </div>
  );

  const dl = assignment ? daysLeft(assignment.dueDate) : null;

  return (
    <div style={{ padding: 0 }}>
      {toast && (
        <div className={styles.toast} style={{ backgroundColor: toast.type==='error'?'#fee2e2':'#d1fae5', color: toast.type==='error'?'#991b1b':'#065f46' }}>
          {toast.msg}
        </div>
      )}

      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        <Link href="/courses">Courses</Link>
        <span>›</span>
        <Link href={`/courses/${courseId}/assignments`}>Assignments</Link>
        <span>›</span>
        <span style={{ color:'#0f172a', fontWeight:500 }}>{assignment?.title}</span>
      </div>

      <div className={styles.grid}>
        {/* Left column */}
        <div>
          {/* Assignment card */}
          <div className={styles.card}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:16 }}>
              <h1 className={styles.title}>{assignment?.title}</h1>
              <span className={styles.marksBadge}>
                {assignment?.totalMarks} marks
              </span>
            </div>
            {assignment?.description && (
              <p className={styles.description}>{assignment.description}</p>
            )}
            <div style={{ display:'flex', gap:20, fontSize:13 }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span>📅</span>
                <span style={{ color:'#64748b' }}>Due: <strong style={{ color:'#0f172a' }}>{assignment ? new Date(assignment.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric',hour:'2-digit',minute:'2-digit'}) : ''}</strong></span>
              </div>
              {dl && <span style={{ fontWeight:600, color: dl.color }}>{dl.text}</span>}
            </div>
          </div>

          {/* Student submission form */}
          {isStudent && !submission && (
            <div className={styles.card}>
              <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 20px' }}>Your Submission</h2>
              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:8 }}>Written answer</label>
                <textarea rows={6} className={styles.textarea} placeholder="Write your answer here..." value={textContent} onChange={e => setTextContent(e.target.value)} />
              </div>
              <div style={{ marginBottom:20 }}>
                <label style={{ display:'block', fontSize:13, fontWeight:500, color:'#334155', marginBottom:8 }}>Attachments</label>
                <div className={styles.dropzone} onClick={() => fileRef.current?.click()}>
                  <p style={{ fontSize:24, margin:'0 0 8px' }}>📎</p>
                  <p style={{ fontSize:13, color:'#64748b', margin:'0 0 4px' }}>Click to attach files</p>
                  <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>PDF, DOCX, images — max 5 files</p>
                  <input ref={fileRef} type="file" multiple style={{ display:'none' }} accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    aria-label="Upload assignment files"
                    onChange={e => setFiles(Array.from(e.target.files || []))} />
                </div>
                {files.length > 0 && (
                  <div style={{ marginTop:10, display:'flex', flexDirection:'column', gap:6 }}>
                    {files.map((f,i) => (
                      <div key={i} className={styles.fileItem}>
                        <span style={{ fontSize:13, color:'#065f46', fontWeight:500 }}>📄 {f.name}</span>
                        <button onClick={() => setFiles(p => p.filter((_,j)=>j!==i))}
                          style={{ background:'none', border:'none', color:'#94a3b8', cursor:'pointer', fontSize:16 }}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={handleSubmit} disabled={submitting} className={styles.btnSubmit} style={{ opacity: submitting?0.6:1 }}>
                {submitting ? 'Submitting...' : 'Submit Assignment'}
              </button>
            </div>
          )}

          {/* Student — already submitted */}
          {isStudent && submission && (
            <div className={styles.card}>
              <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
                <span style={{ fontSize:24 }}>{submission.status==='graded'?'✅':'⏳'}</span>
                <div>
                  <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:0 }}>
                    {submission.status==='graded' ? 'Assignment Graded' : 'Submission Received'}
                  </h2>
                  <p style={{ fontSize:13, color:'#64748b', margin:0 }}>
                    Submitted {new Date(submission.submittedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
                  </p>
                </div>
                {submission.grade !== undefined && (
                  <div style={{ marginLeft:'auto', textAlign:'right' }}>
                    <p style={{ fontSize:28, fontWeight:700, color:'#4f46e5', margin:0 }}>{submission.grade}<span style={{ fontSize:16, color:'#94a3b8' }}>/{assignment?.totalMarks}</span></p>
                    <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{assignment ? Math.round((submission.grade/assignment.totalMarks)*100) : 0}%</p>
                  </div>
                )}
              </div>
              {submission.textContent && (
                <div className={styles.submissionCard}>
                  <p style={{ fontSize:12, fontWeight:600, color:'#64748b', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Your answer</p>
                  <p style={{ fontSize:14, color:'#334155', margin:0, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{submission.textContent}</p>
                </div>
              )}
              {submission.feedback && (
                <div className={styles.feedbackCard}>
                  <p style={{ fontSize:12, fontWeight:600, color:'#065f46', margin:'0 0 8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>Teacher feedback</p>
                  <p style={{ fontSize:14, color:'#065f46', margin:0, lineHeight:1.7 }}>{submission.feedback}</p>
                </div>
              )}
            </div>
          )}

          {/* Teacher — all submissions */}
          {isTeacher && (
            <div className={styles.card}>
              <h2 style={{ fontSize:16, fontWeight:600, color:'#0f172a', margin:'0 0 20px' }}>
                Submissions ({allSubmissions.length})
              </h2>
              {allSubmissions.length === 0 ? (
                <p style={{ color:'#94a3b8', fontSize:14 }}>No submissions yet.</p>
              ) : allSubmissions.map(sub => (
                <div key={sub._id} className={styles.teacherSubItem}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:34, height:34, borderRadius:9, backgroundColor:'#eef2ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#4338ca', fontWeight:700, fontSize:13 }}>
                        {sub.student?.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:0 }}>{sub.student?.name || 'Unknown'}</p>
                        <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{new Date(sub.submittedAt).toLocaleDateString('en-GB',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}</p>
                      </div>
                    </div>
                    <span className={styles.marksBadge} style={{ backgroundColor: sub.status==='graded'?'#d1fae5':sub.status==='late'?'#fee2e2':'#dbeafe', color: sub.status==='graded'?'#065f46':sub.status==='late'?'#991b1b':'#1e40af' }}>
                      {sub.status}
                    </span>
                  </div>
                  {sub.textContent && (
                    <p style={{ fontSize:13, color:'#475569', margin:'0 0 12px', lineHeight:1.6, backgroundColor:'#f8fafc', padding:'10px 12px', borderRadius:9, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical' }}>
                      {sub.textContent}
                    </p>
                  )}
                  {/* Grade form */}
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <input type="number" min="0" max={assignment?.totalMarks} placeholder={`Grade (/${assignment?.totalMarks})`}
                      aria-label="Student grade"
                      defaultValue={sub.grade}
                      onChange={e => setGradeForm(p => ({ ...p, [sub._id]: { ...p[sub._id], grade: e.target.value } }))}
                      className={styles.gradeInput} />
                    <input placeholder="Feedback (optional)"
                      aria-label="Feedback for student"
                      defaultValue={sub.feedback}
                      onChange={e => setGradeForm(p => ({ ...p, [sub._id]: { ...p[sub._id], feedback: e.target.value } }))}
                      className={styles.feedbackInput} />
                    <button onClick={() => handleGrade(sub._id)} disabled={grading===sub._id} className={styles.btnGrade} style={{ opacity: grading===sub._id?0.6:1 }}>
                      {grading===sub._id ? '...' : sub.status==='graded' ? 'Re-grade' : 'Grade'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right column — info */}
        <div>
          <div className={styles.card} style={{ padding:24 }}>
            <h3 style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:'0 0 16px' }}>Assignment Details</h3>
            {[
              { label:'Total Marks',  value: `${assignment?.totalMarks} marks` },
              { label:'Due Date',     value: assignment ? new Date(assignment.dueDate).toLocaleDateString('en-GB',{day:'numeric',month:'long',year:'numeric'}) : '' },
              { label:'Due Time',     value: assignment ? new Date(assignment.dueDate).toLocaleTimeString('en-GB',{hour:'2-digit',minute:'2-digit'}) : '' },
              isTeacher ? { label:'Submissions', value: `${allSubmissions.length}` } : null,
              isTeacher ? { label:'Graded',       value: `${allSubmissions.filter(s=>s.status==='graded').length}` } : null,
            ].filter(Boolean).map(row => (
              <div key={row!.label} style={{ display:'flex', justifyContent:'space-between', padding:'9px 0', borderBottom:'1px solid #f8fafc' }}>
                <span style={{ fontSize:13, color:'#64748b' }}>{row!.label}</span>
                <span style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>{row!.value}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop:14, padding:'14px 18px', backgroundColor:'#fffbeb', borderRadius:12, border:'1px solid #fde68a', display:'flex', gap:10, alignItems:'flex-start' }}>
            <span style={{ fontSize:18 }}>💡</span>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:'#92400e', margin:'0 0 2px' }}>Submission tip</p>
              <p style={{ fontSize:12, color:'#a16207', margin:0, lineHeight:1.5 }}>You can submit both written text and file attachments. Make sure to review before submitting.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
