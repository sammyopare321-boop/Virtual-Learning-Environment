'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/utils/api/authApi';
import { AxiosError } from 'axios';
import styles from './profile.module.css';
import { User } from '@/types';

interface UserForm {
  name: string;
  email: string;
  department: string;
}

interface PersonalInfoProps {
  user: User;
  updateUser: (data: Partial<User>) => void;
  showToast: (msg: string, type?: string) => void;
}

function PersonalInfoTab({ user, updateUser, showToast }: PersonalInfoProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UserForm>({
    name: user.name || '',
    email: user.email || '',
    department: user.department || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.updateMe(form);
      updateUser(res.data.data);
      showToast('Profile updated successfully!');
    } catch (err: unknown) {
      let errorMsg = 'Failed to update profile';
      if (err instanceof AxiosError) {
        errorMsg = err.response?.data?.message || errorMsg;
      } else if (err instanceof Error) {
        errorMsg = err.message;
      }
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom:32 }}>
        <h3 style={{ fontSize:20, fontWeight:700, color:'#0f172a', margin:'0 0 4px' }}>Personal Information</h3>
        <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Update your details and how others see you on the platform.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:24 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          <div>
            <label htmlFor="p-name" className={styles.label}>Full Name</label>
            <input 
              id="p-name"
              className={styles.input}
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required
            />
          </div>
          <div>
            <label htmlFor="p-email" className={styles.label}>Email Address</label>
            <input 
              id="p-email"
              className={styles.input}
              style={{ backgroundColor:'#f8fafc', color:'#94a3b8', cursor:'not-allowed' }}
              value={form.email}
              disabled
              readOnly
            />
          </div>
          <div>
            <label htmlFor="p-dept" className={styles.label}>Department / School</label>
            <input 
              id="p-dept"
              className={styles.input}
              placeholder="e.g. Computer Science"
              value={form.department}
              onChange={e => setForm({...form, department: e.target.value})}
            />
          </div>
          <div>
            <label htmlFor="p-lang" className={styles.label}>Preferred Language</label>
            <select id="p-lang" className={styles.input}>
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>
        </div>

        <div style={{ marginTop:16, paddingTop:24, borderTop:'1px solid #e2e8f0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button type="button" style={{ color:'#ef4444', fontSize:13, fontWeight:700, background:'none', border:'none', cursor:'pointer' }}>
            🗑️ Delete Account
          </button>
          <button type="submit" disabled={loading} style={{ padding:'10px 24px', borderRadius:12, backgroundColor:'#4f46e5', color:'#fff', fontSize:14, fontWeight:600, border:'none', cursor:'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const { user, updateUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [toast, setToast] = useState<{msg: string, type: string} | null>(null);
  
  const showToast = (msg: string, type='success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const navItems = user?.role === 'admin' ? [
    { href:'/dashboard/admin', label:'Dashboard',    icon:'📊' },
    { href:'/admin/users',     label:'Users',         icon:'👥' },
    { href:'/admin/courses',   label:'Courses',       icon:'📚' },
    { href:'/admin/analytics', label:'Analytics',     icon:'📈' },
    { href:'/admin/logs',      label:'Activity Logs', icon:'📋' },
    { href:'/profile',         label:'Profile',       icon:'👤', active:true },
  ] : user?.role === 'teacher' ? [
    { href:'/dashboard/teacher', label:'Dashboard',     icon:'📊' },
    { href:'/courses',           label:'My Courses',    icon:'📚' },
    { href:'/messages',          label:'Messages',      icon:'💬' },
    { href:'/notifications',     label:'Notifications', icon:'🔔' },
    { href:'/profile',           label:'Profile',       icon:'👤', active:true },
  ] : [
    { href:'/dashboard/student', label:'Dashboard',     icon:'📊' },
    { href:'/courses',           label:'My Courses',    icon:'📚' },
    { href:'/messages',          label:'Messages',      icon:'💬' },
    { href:'/notifications',     label:'Notifications', icon:'🔔' },
    { href:'/profile',           label:'Profile',       icon:'👤', active:true },
  ];

  const avatarBg = user?.role === 'teacher' ? '#faf5ff' : user?.role === 'admin' ? '#e0e7ff' : '#d1fae5';
  const avatarColor = user?.role === 'teacher' ? '#7c3aed' : user?.role === 'admin' ? '#4338ca' : '#065f46';
  const roleBadgeBg = user?.role === 'teacher' ? '#faf5ff' : user?.role === 'admin' ? '#e0e7ff' : '#d1fae5';

  return (
    <div className={styles.wrap}>
      {/* Toast */}
      {toast && (
        <div 
          className={styles.toast}
          style={{ 
            backgroundColor: toast.type==='error'?'#fee2e2':'#d1fae5', 
            color: toast.type==='error'?'#991b1b':'#065f46' 
          }}
        >
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
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          {/* Header Cover */}
          <div style={{ height:160, borderRadius:24, background:'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)', position:'relative', marginBottom:24 }}>
            <div style={{ position:'absolute', top:-50, right:-50, width:250, height:250, background:'rgba(255,255,255,0.05)', borderRadius:'50%' }} />
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:32, marginTop:-60, position:'relative', zIndex:10 }}>
            {/* Left Column */}
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {/* Profile Card */}
              <div className={styles.profileCard}>
                <div style={{ width:120, height:120, borderRadius:'50%', backgroundColor:'#e0e7ff', color:'#4338ca', display:'flex', alignItems:'center', justifyContent:'center', fontSize:48, fontWeight:700, margin:'0 auto 20px', border:'4px solid #fff', boxShadow:'0 0 0 2px #e2e8f0' }}>
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h2 style={{ fontSize:22, fontWeight:700, color:'#0f172a', margin:'0 0 4px' }}>{user?.name}</h2>
                <p style={{ fontSize:14, color:'#64748b', margin:'0 0 20px' }}>{user?.email}</p>
                <div style={{ display:'flex', justifyContent:'center', gap:8 }}>
                  <span style={{ fontSize:11, fontWeight:700, backgroundColor: avatarBg, color: avatarColor, padding:'4px 12px', borderRadius:9999, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    {user?.role}
                  </span>
                  <span style={{ fontSize:11, fontWeight:700, backgroundColor:'#f1f5f9', color:'#475569', padding:'4px 12px', borderRadius:9999, textTransform:'uppercase', letterSpacing:'0.05em' }}>
                    Active
                  </span>
                </div>
              </div>

              {/* Security Status */}
              <div className={styles.securityCard}>
                <h3 style={{ fontSize:14, fontWeight:700, color:'#0f172a', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 16px', display:'flex', alignItems:'center', gap:8 }}>
                  <span>🛡️</span> Security Status
                </h3>
                <div style={{ display:'flex', alignItems:'center', gap:12, padding:12, backgroundColor:'#f0fdf4', border:'1px solid #bbf7d0', borderRadius:16 }}>
                  <div style={{ width:32, height:32, borderRadius:10, backgroundColor:'#fff', color:'#16a34a', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16 }}>
                    ✉️
                  </div>
                  <div>
                    <p style={{ fontSize:13, fontWeight:700, color:'#14532d', margin:0 }}>Email Verified</p>
                    <p style={{ fontSize:11, color:'#16a34a', margin:0 }}>Your account is secured.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div style={{ display:'flex', flexDirection:'column', gap:24 }}>
              {/* Tabs */}
              <div style={{ display:'flex', gap:8, borderBottom:'1px solid #e2e8f0' }}>
                {(['profile', 'security', 'notifications'] as const).map(id => {
                  const labels = { profile: 'Personal Info', security: 'Security', notifications: 'Notifications' };
                  const icons = { profile: '👤', security: '🔒', notifications: '🔔' };
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveTab(id)}
                      className={activeTab === id ? styles.tabButtonActive : styles.tabButton}
                    >
                      <span>{icons[id]}</span> {labels[id]}
                    </button>
                  );
                })}
              </div>

              {/* Content */}
              <div className={styles.contentCard}>
                {activeTab === 'profile' && user && (
                  <PersonalInfoTab 
                    user={user} 
                    updateUser={updateUser} 
                    showToast={showToast} 
                    key={user._id} 
                  />
                )}

                {activeTab === 'security' && (
                  <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center', opacity:0.6 }}>
                    <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
                    <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 8px' }}>Security Settings Coming Soon</h3>
                    <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Password change and 2FA features are in development.</p>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div style={{ height:'100%', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:40, textAlign:'center', opacity:0.6 }}>
                    <div style={{ fontSize:48, marginBottom:16 }}>🔔</div>
                    <h3 style={{ fontSize:18, fontWeight:700, color:'#0f172a', margin:'0 0 8px' }}>Notification Preferences Coming Soon</h3>
                    <p style={{ fontSize:14, color:'#64748b', margin:0 }}>Fine-tune how you receive course updates and messages.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
