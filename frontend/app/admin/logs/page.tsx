'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/utils/api/adminApi';
import { AxiosError } from 'axios';
import styles from './admin_logs.module.css';

type LogType = 'all' | 'security' | 'auth' | 'system' | 'user';

const actionToType: Record<string, LogType> = {
  DELETE_USER: 'security',
  SUSPEND_USER: 'security',
  IMPERSONATE_START: 'auth',
  IMPERSONATE_EXIT: 'auth',
  CHANGE_ROLE: 'user',
  DELETE_COURSE: 'system',
  REASSIGN_TEACHER: 'system',
  ARCHIVE_COURSE: 'system',
  ACTIVATE_USER: 'user',
};

interface LogEntry {
  _id: string;
  action: string;
  adminId?: { email?: string; name?: string; };
  metadata?: Record<string, unknown>;
  ip?: string;
  createdAt: string;
}

interface DisplayLog {
  _id: string;
  type: LogType;
  user: string;
  action: string;
  meta: string;
  ip?: string;
  createdAt: string;
}

interface ToastState {
  msg: string;
  type: string;
}

function logToDisplay(log: LogEntry): DisplayLog {
  return {
    _id: log._id,
    type: actionToType[log.action] || 'system',
    user: log.adminId?.email || log.adminId?.name || 'Unknown Admin',
    action: log.action.replace(/_/g, ' '),
    meta: log.metadata ? Object.entries(log.metadata).map(([k, v]) => `${k}: ${v}`).join(', ') : '',
    ip: log.ip,
    createdAt: log.createdAt,
  };
}

export default function AdminLogsPage() {
  const { user, logout }      = useAuth();
  const [logs, setLogs]       = useState<DisplayLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<LogType>('all');
  const [toast, setToast]     = useState<ToastState | null>(null);

  const navItems = [
    { href:'/dashboard/admin', label:'Dashboard',    icon:'📊' },
    { href:'/admin/users',     label:'Users',         icon:'👥' },
    { href:'/admin/courses',   label:'Courses',       icon:'📚' },
    { href:'/admin/analytics', label:'Analytics',     icon:'📈' },
    { href:'/admin/logs',      label:'Activity Logs', icon:'📋', active:true },
    { href:'/profile',         label:'Profile',       icon:'👤' },
  ];

  const showToast = (msg: string, type: string = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchLogs = useCallback(() => {
    // loading is already true on initial mount
    adminApi.getLogs()
      .then(res => {
        const raw = (res.data.data || []) as LogEntry[];
        setLogs(raw.map(logToDisplay));
      })
      .catch((err: unknown) => {
        let msg = 'Failed to fetch audit logs';
        if (err instanceof AxiosError) msg = err.response?.data?.message || msg;
        showToast(msg, 'error');
        setLogs([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const filteredLogs = logs.filter(l => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = l.action.toLowerCase().includes(q) || l.user.toLowerCase().includes(q);
    const matchesType = typeFilter === 'all' || l.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeStyle = (type: LogType) => {
    switch(type) {
      case 'security': return { icon: '🛡️', color: '#dc2626', bg: '#fef2f2', border: '1px solid #fee2e2', label: 'Security' };
      case 'auth': return { icon: '🔑', color: '#059669', bg: '#ecfdf5', border: '1px solid #d1fae5', label: 'Auth' };
      case 'system': return { icon: '💻', color: '#2563eb', bg: '#eff6ff', border: '1px solid #dbeafe', label: 'System' };
      default: return { icon: '⚡', color: '#4f46e5', bg: '#eef2ff', border: '1px solid #e0e7ff', label: 'Activity' };
    }
  };

  return (
    <div className={styles.wrap}>
      {/* Toast */}
      {toast && (
        <div className={styles.toast} style={{ backgroundColor: toast.type==='error' ? '#fee2e2' : '#d1fae5', color: toast.type==='error' ? '#991b1b' : '#065f46' }}>
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

      {/* Main */}
      <main className={styles.main}>
        <div style={{ marginBottom:32 }}>
          <h1 style={{ fontSize:28, fontWeight:700, color:'#0f172a', margin:0 }}>Audit & Activity Logs</h1>
          <p style={{ fontSize:14, color:'#64748b', marginTop:4 }}>Monitor administrative actions and security events across the system.</p>
        </div>

        <div className={styles.card}>
          <div style={{ display:'flex', gap:16, marginBottom:24 }}>
            <div style={{ flex:1, position:'relative' }}>
              <input 
                className={styles.input}
                style={{ width:'100%', paddingLeft:40 }}
                placeholder="Search by action or admin..."
                aria-label="Search logs"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
              <span style={{ position:'absolute', left:14, top:10, opacity:0.4 }}>🔍</span>
            </div>
            <select 
              className={styles.input}
              value={typeFilter}
              aria-label="Filter logs by type"
              onChange={e => setTypeFilter(e.target.value as LogType)}
            >
              <option value="all">All Types</option>
              <option value="security">Security</option>
              <option value="auth">Authentication</option>
              <option value="system">System</option>
              <option value="user">User Management</option>
            </select>
            <button 
              onClick={() => { setLoading(true); fetchLogs(); }} 
              className={styles.input}
              style={{ backgroundColor:'#f8fafc', fontWeight:600, cursor:'pointer' }}
            >
              Refresh 🔄
            </button>
          </div>

          <div style={{ overflowX:'auto' }}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.th}>Type</th>
                  <th className={styles.th}>Administrator</th>
                  <th className={styles.th}>Action</th>
                  <th className={styles.th}>IP Address</th>
                  <th className={styles.th}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign:'center', padding:40, color:'#64748b' }}>
                      Fetching logs...
                    </td>
                  </tr>
                ) : filteredLogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign:'center', padding:40, color:'#64748b' }}>
                      No activity logs found.
                    </td>
                  </tr>
                ) : (
                  filteredLogs.map(log => {
                    const style = getTypeStyle(log.type);
                    return (
                      <tr key={log._id}>
                        <td className={styles.td}>
                          <span className={styles.badge} style={{ backgroundColor: style.bg, color: style.color, border: style.border }}>
                            <span>{style.icon}</span> {style.label}
                          </span>
                        </td>
                        <td className={styles.td} style={{ fontWeight:600, color:'#0f172a' }}>{log.user}</td>
                        <td className={styles.td}>
                          <div style={{ fontWeight:500, color:'#334155' }}>{log.action}</div>
                          <div style={{ fontSize:11, color:'#94a3b8', marginTop:2 }}>{log.meta}</div>
                        </td>
                        <td className={styles.td}>
                          <code style={{ fontSize:12, backgroundColor:'#f1f5f9', padding:'2px 6px', borderRadius:4 }}>{log.ip || 'Local'}</code>
                        </td>
                        <td className={styles.td} style={{ fontSize:13 }}>
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
