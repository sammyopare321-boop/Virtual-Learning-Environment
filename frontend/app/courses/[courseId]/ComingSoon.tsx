'use client';
import { useParams } from 'next/navigation';

export default function ComingSoonPage() {
  const params = useParams();
  const courseId = params.courseId;

  return (
    <div style={{ padding:60, textAlign:'center', backgroundColor:'#fff', borderRadius:20, border:'1px solid #e2e8f0', color:'#64748b' }}>
      <div style={{ fontSize:56, marginBottom:20 }}>🏗️</div>
      <h2 style={{ fontSize:22, fontWeight:700, color:'#0f172a', marginBottom:8 }}>Section Under Construction</h2>
      <p style={{ fontSize:15, maxWidth:400, margin:'0 auto' }}>We are currently synchronizing the content for this section. Please check back shortly!</p>
    </div>
  );
}
