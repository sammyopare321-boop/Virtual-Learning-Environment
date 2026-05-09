'use client';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { adminApi } from '@/utils/api/adminApi';
import { AxiosError } from 'axios';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface StatsData {
  totalUsers?: number;
  totalStudents?: number;
  totalTeachers?: number;
  totalAdmins?: number;
}

interface ConfirmState {
  type: 'delete' | 'suspend' | 'reactivate';
  user: User;
  userName: string;
}

interface ToastState {
  msg: string;
  type: string;
}

const S: Record<string, React.CSSProperties> = {
  wrap:       { display:'flex', minHeight:'100vh', backgroundColor:'#f8fafc', fontFamily:"'Sora','Inter',sans-serif" },
  sidebar:    { width:240, backgroundColor:'#fff', borderRight:'1px solid #e2e8f0', display:'flex', flexDirection:'column', flexShrink:0 },
  logoBox:    { padding:'20px 16px 16px', borderBottom:'1px solid #f1f5f9' },
  logoInner:  { display:'flex', alignItems:'center', gap:10 },
  logoIcon:   { width:34, height:34, borderRadius:10, backgroundColor:'#4f46e5', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 },
  nav:        { flex:1, padding:'10px', display:'flex', flexDirection:'column', gap:2 },
  link:       { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#475569', textDecoration:'none', border:'none', background:'transparent', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  linkActive: { display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:10, fontSize:14, fontWeight:500, color:'#4338ca', textDecoration:'none', background:'#eef2ff', border:'none', cursor:'pointer', width:'100%', fontFamily:"'Sora','Inter',sans-serif" },
  main:       { flex:1, overflowY:'auto', padding:'40px' },
  card:       { backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', boxShadow:'0 1px 3px rgb(0 0 0/0.07)', padding:24 },
  input:      { padding:'9px 14px', borderRadius:10, border:'1px solid #e2e8f0', backgroundColor:'#fff', color:'#0f172a', fontSize:14, fontFamily:"'Sora','Inter',sans-serif", outline:'none' },
  btn:        { display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:10, fontSize:13, fontWeight:500, border:'none', cursor:'pointer', fontFamily:"'Sora','Inter',sans-serif", transition:'all 0.15s' },
};

const navItems = [
  { href:'/dashboard/admin', label:'Dashboard',    icon:'📊' },
  { href:'/admin/users',     label:'Users',         icon:'👥', active:true },
  { href:'/admin/courses',   label:'Courses',       icon:'📚' },
  { href:'/admin/analytics', label:'Analytics',     icon:'📈' },
  { href:'/admin/logs',      label:'Activity Logs', icon:'📋' },
  { href:'/profile',         label:'Profile',       icon:'👤' },
];

const ROLES   = ['all','student','teacher','admin'];
const STATUSES = ['all','active','suspended'];

const roleBadge: Record<string, {bg: string, color: string}> = {
  student: { bg:'#d1fae5', color:'#065f46' },
  teacher: { bg:'#faf5ff', color:'#7c3aed' },
  admin:   { bg:'#e0e7ff', color:'#4338ca' },
};
const statusBadge: Record<string, {bg: string, color: string}> = {
  active:    { bg:'#d1fae5', color:'#065f46' },
  suspended: { bg:'#fee2e2', color:'#991b1b' },
};

export default function AdminUsersPage() {
  const { user, logout }      = useAuth();
  const [users, setUsers]     = useState<User[]>([]);
  const [stats, setStats]     = useState<StatsData>({ totalUsers:0, totalStudents:0, totalTeachers:0, totalAdmins:0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [roleFilter, setRoleFilter]     = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast]     = useState<ToastState | null>(null);

  const showToast = (msg: string, type: string = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchUsers = useCallback(() => {
    setLoading(true);
    const params: any = { page, limit:10 };
    if (search)                   params.search = search;
    if (roleFilter !== 'all')     params.role   = roleFilter;
    if (statusFilter !== 'all')   params.status = statusFilter;
    adminApi.getAllUsers(params)
      .then(res => {
        setUsers(res.data.data || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [search, roleFilter, statusFilter, page]);

  useEffect(() => {
    adminApi.getOverview()
      .then(res => setStats(res.data.data || {}))
      .catch(() => {});
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchUsers(); }, 400);
    return () => clearTimeout(t);
  }, [search]); // eslint-disable-line

  const handleStatusToggle = async (u: User) => {
    const newStatus = u.status === 'suspended' ? 'active' : 'suspended';
    setActionLoading(u._id + '_status');
    try {
      await adminApi.changeStatus(u._id, newStatus);
      setUsers(p => p.map(x => x._id === u._id ? { ...x, status: newStatus } : x));
      showToast(`${u.name} ${newStatus === 'suspended' ? 'suspended' : 'reactivated'} successfully.`);
    } catch (e: unknown) {
      const err = e as AxiosError<{message: string}>;
      showToast(err.response?.data?.message || 'Action failed.', 'error');
    } finally { setActionLoading(null); setConfirm(null); }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    setActionLoading(userId + '_role');
    try {
      await adminApi.changeRole(userId, newRole);
      setUsers(p => p.map(x => x._id === userId ? { ...x, role: newRole } : x));
      showToast('Role updated successfully.');
    } catch (e: unknown) {
      const err = e as AxiosError<{message: string}>;
      showToast(err.response?.data?.message || 'Role change failed.', 'error');
    } finally { setActionLoading(null); }
  };

  const handleDelete = async (u: User) => {
    setActionLoading(u._id + '_delete');
    try {
      await adminApi.deleteUser(u._id);
      setUsers(p => p.filter(x => x._id !== u._id));
      showToast(`${u.name} deleted successfully.`);
    } catch (e: unknown) {
      const err = e as AxiosError<{message: string}>;
      showToast(err.response?.data?.message || 'Delete failed.', 'error');
    } finally { setActionLoading(null); setConfirm(null); }
  };

  const handleImpersonate = async (u: User) => {
    setActionLoading(u._id + '_imp');
    try {
      const res = await adminApi.impersonate(u._id);
      document.cookie = `token=${res.data.impersonationToken}; path=/; max-age=900`;
      window.location.href = `/dashboard/${u.role}`;
    } catch (e: unknown) {
      const err = e as AxiosError<{message: string}>;
      showToast(err.response?.data?.message || 'Impersonation failed.', 'error');
      setActionLoading(null);
    }
  };

  return (
    <div style={S.wrap}>
      {/* Toast */}
      {toast && (
        <div style={{ position:'fixed', top:24, right:24, zIndex:9999, padding:'12px 20px', borderRadius:12, backgroundColor: toast.type==='error' ? '#fee2e2' : '#d1fae5', color: toast.type==='error' ? '#991b1b' : '#065f46', fontSize:14, fontWeight:500, boxShadow:'0 4px 12px rgb(0 0 0/0.15)', maxWidth:320 }}>
          {toast.msg}
        </div>
      )}

      {/* Confirm dialog */}
      {confirm && (
        <div style={{ position:'fixed', inset:0, backgroundColor:'rgb(0 0 0/0.4)', zIndex:9998, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <div style={{ backgroundColor:'#fff', borderRadius:20, padding:32, maxWidth:420, width:'90%', boxShadow:'0 25px 50px rgb(0 0 0/0.25)' }}>
            <div style={{ width:48, height:48, borderRadius:14, backgroundColor:'#fee2e2', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, marginBottom:16 }}>⚠️</div>
            <h3 style={{ fontSize:16, fontWeight:700, color:'#0f172a', margin:'0 0 8px' }}>
              {confirm.type === 'delete' ? 'Delete User' : confirm.type === 'suspend' ? 'Suspend User' : 'Reactivate User'}
            </h3>
            <p style={{ fontSize:14, color:'#64748b', margin:'0 0 24px', lineHeight:1.6 }}>
              {confirm.type === 'delete'
                ? `This will permanently delete ${confirm.userName} and all their data. This cannot be undone.`
                : confirm.type === 'suspend'
                ? `${confirm.userName} will be locked out immediately. You can reactivate them at any time.`
                : `${confirm.userName} will regain access to their account.`}
            </p>
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={() => setConfirm(null)}
                style={{ ...S.btn, flex:1, backgroundColor:'#f1f5f9', color:'#334155', justifyContent:'center' }}>
                Cancel
              </button>
              <button
                onClick={() => confirm.type === 'delete' ? handleDelete(confirm.user) : handleStatusToggle(confirm.user)}
                style={{ ...S.btn, flex:1, backgroundColor: confirm.type === 'reactivate' ? '#4f46e5' : '#ef4444', color:'#fff', justifyContent:'center' }}>
                {confirm.type === 'delete' ? 'Delete' : confirm.type === 'suspend' ? 'Suspend' : 'Reactivate'}
              </button>
            </div>
          </div>
        </div>
      )}

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
          <div style={{ width:36, height:36, borderRadius:10, backgroundColor:'#e0e7ff', display:'flex', alignItems:'center', justifyContent:'center', color:'#4338ca', fontWeight:700, fontSize:14, flexShrink:0 }}>
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div style={{ minWidth:0 }}>
            <p style={{ fontSize:13, fontWeight:600, color:'#0f172a', margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name || 'Admin'}</p>
            <span style={{ fontSize:11, fontWeight:500, backgroundColor:'#e0e7ff', color:'#4338ca', padding:'1px 8px', borderRadius:9999 }}>admin</span>
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
            <span style={{ fontSize:16 }}>🚪</span><span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={S.main}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:32 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:700, color:'#0f172a', letterSpacing:'-0.025em', margin:0 }}>User Management</h1>
            <p style={{ fontSize:14, color:'#64748b', marginTop:4 }}>Manage all platform users — students, teachers, and admins.</p>
          </div>
          <Link href="/auth/register" style={{ ...S.btn, backgroundColor:'#4f46e5', color:'#fff', padding:'10px 20px', borderRadius:12, textDecoration:'none', fontSize:14 }}>
            + Register User
          </Link>
        </div>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:28 }}>
          {[
            { label:'Total Users', value: stats.totalUsers,    icon:'👥', bg:'#eef2ff' },
            { label:'Students',    value: stats.totalStudents, icon:'🎓', bg:'#f0fdf4' },
            { label:'Teachers',    value: stats.totalTeachers, icon:'🏫', bg:'#faf5ff' },
            { label:'Admins',      value: stats.totalAdmins,   icon:'🛡️', bg:'#fff7ed' },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor:'#fff', borderRadius:14, border:'1px solid #e2e8f0', padding:'18px 20px', display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:42, height:42, borderRadius:12, backgroundColor:s.bg, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>{s.icon}</div>
              <div>
                <p style={{ fontSize:22, fontWeight:700, color:'#0f172a', margin:0, letterSpacing:'-0.02em' }}>{s.value ?? '—'}</p>
                <p style={{ fontSize:12, color:'#64748b', margin:0 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', padding:'16px 20px', marginBottom:16, display:'flex', alignItems:'center', gap:12, flexWrap:'wrap' }}>
          <label htmlFor="search-input" className="sr-only" style={{ display:'none' }}>Search</label>
          <input
            id="search-input"
            style={{ ...S.input, flex:1, minWidth:200 }}
            placeholder="🔍  Search by name or email..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
          />
          <label htmlFor="role-filter" className="sr-only" style={{ display:'none' }}>Role Filter</label>
          <select id="role-filter" style={{ ...S.input, minWidth:130 }} value={roleFilter}
            onChange={e => { setRoleFilter(e.target.value); setPage(1); }}>
            {ROLES.map(r => <option key={r} value={r}>{r === 'all' ? 'All Roles' : r.charAt(0).toUpperCase()+r.slice(1)}</option>)}
          </select>
          <label htmlFor="status-filter" className="sr-only" style={{ display:'none' }}>Status Filter</label>
          <select id="status-filter" style={{ ...S.input, minWidth:150 }} value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); setPage(1); }}>
            {STATUSES.map(s => <option key={s} value={s}>{s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
          {(search || roleFilter !== 'all' || statusFilter !== 'all') && (
            <button onClick={() => { setSearch(''); setRoleFilter('all'); setStatusFilter('all'); setPage(1); }}
              style={{ ...S.btn, backgroundColor:'#fee2e2', color:'#991b1b' }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* Table */}
        <div style={{ backgroundColor:'#fff', borderRadius:16, border:'1px solid #e2e8f0', overflow:'hidden' }}>
          {/* Table header */}
          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'10px 20px', backgroundColor:'#f8fafc', borderBottom:'1px solid #e2e8f0' }}>
            {['User','Role','Status','Joined','Actions'].map(h => (
              <span key={h} style={{ fontSize:11, fontWeight:600, color:'#64748b', textTransform:'uppercase', letterSpacing:'0.05em' }}>{h}</span>
            ))}
          </div>

          {loading ? (
            <div style={{ padding:40, textAlign:'center', color:'#94a3b8', fontSize:14 }}>Loading users...</div>
          ) : users.length === 0 ? (
            <div style={{ padding:'48px 24px', textAlign:'center' }}>
              <p style={{ fontSize:32, margin:'0 0 12px' }}>👥</p>
              <p style={{ fontSize:15, fontWeight:600, color:'#334155', margin:'0 0 4px' }}>No users found</p>
              <p style={{ fontSize:13, color:'#94a3b8' }}>Try adjusting your search or filters.</p>
            </div>
          ) : (
            users.map((u, idx) => {
              const rb = roleBadge[u.role] || { bg:'#f1f5f9', color:'#475569' };
              const sb = statusBadge[u.status] || statusBadge.active;
              const isLast = idx === users.length - 1;
              return (
                <div key={u._id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', padding:'14px 20px', alignItems:'center', borderBottom: isLast ? 'none' : '1px solid #f1f5f9' }}>
                  {/* User */}
                  <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                    <div style={{ width:36, height:36, borderRadius:10, backgroundColor: rb.bg, display:'flex', alignItems:'center', justifyContent:'center', color: rb.color, fontWeight:700, fontSize:14, flexShrink:0 }}>
                      {u.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:600, color:'#0f172a', margin:0 }}>{u.name}</p>
                      <p style={{ fontSize:12, color:'#94a3b8', margin:0 }}>{u.email}</p>
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label htmlFor={`role-select-${u._id}`} className="sr-only" style={{ display:'none' }}>Role for {u.name}</label>
                    <select
                      id={`role-select-${u._id}`}
                      value={u.role}
                      disabled={u._id === user?._id || actionLoading === u._id+'_role'}
                      onChange={e => handleRoleChange(u._id, e.target.value)}
                      style={{ padding:'4px 10px', borderRadius:8, border:'1px solid #e2e8f0', backgroundColor: rb.bg, color: rb.color, fontSize:12, fontWeight:600, cursor: u._id === user?._id ? 'not-allowed' : 'pointer', outline:'none', fontFamily:"'Sora','Inter',sans-serif" }}>
                      <option value="student">student</option>
                      <option value="teacher">teacher</option>
                      <option value="admin">admin</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{ fontSize:12, fontWeight:500, backgroundColor: sb.bg, color: sb.color, padding:'3px 10px', borderRadius:9999 }}>
                      {u.status || 'active'}
                    </span>
                  </div>

                  {/* Joined */}
                  <div style={{ fontSize:13, color:'#64748b' }}>
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB',{ day:'numeric', month:'short', year:'numeric' }) : '—'}
                  </div>

                  {/* Actions */}
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    {/* Impersonate */}
                    {u._id !== user?._id && (
                      <button
                        onClick={() => handleImpersonate(u)}
                        disabled={!!actionLoading}
                        title="Impersonate user"
                        aria-label="Impersonate user"
                        style={{ padding:'5px 10px', borderRadius:8, backgroundColor:'#eef2ff', color:'#4338ca', border:'none', cursor:'pointer', fontSize:12, fontWeight:500, fontFamily:"'Sora','Inter',sans-serif" }}>
                        👁️
                      </button>
                    )}
                    {/* Suspend / Activate */}
                    {u._id !== user?._id && u.role !== 'admin' && (
                      <button
                        onClick={() => setConfirm({ type: u.status==='suspended' ? 'reactivate' : 'suspend', user: u, userName: u.name })}
                        disabled={!!actionLoading}
                        title={u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                        aria-label={u.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                        style={{ padding:'5px 10px', borderRadius:8, backgroundColor: u.status==='suspended' ? '#d1fae5' : '#fef3c7', color: u.status==='suspended' ? '#065f46' : '#92400e', border:'none', cursor:'pointer', fontSize:12, fontWeight:500, fontFamily:"'Sora','Inter',sans-serif" }}>
                        {u.status === 'suspended' ? '✅' : '⏸️'}
                      </button>
                    )}
                    {/* Delete */}
                    {u._id !== user?._id && (
                      <button
                        onClick={() => setConfirm({ type:'delete', user: u, userName: u.name })}
                        disabled={!!actionLoading}
                        title="Delete user"
                        aria-label="Delete user"
                        style={{ padding:'5px 10px', borderRadius:8, backgroundColor:'#fee2e2', color:'#991b1b', border:'none', cursor:'pointer', fontSize:12, fontWeight:500, fontFamily:"'Sora','Inter',sans-serif" }}>
                        🗑️
                      </button>
                    )}
                    {u._id === user?._id && (
                      <span style={{ fontSize:12, color:'#94a3b8' }}>You</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginTop:16 }}>
            <p style={{ fontSize:13, color:'#64748b' }}>Page {page} of {totalPages}</p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => setPage(p => Math.max(1,p-1))} disabled={page===1}
                style={{ ...S.btn, backgroundColor:'#fff', border:'1px solid #e2e8f0', color:'#334155', opacity: page===1 ? 0.4 : 1 }}>
                ← Previous
              </button>
              <button onClick={() => setPage(p => Math.min(totalPages,p+1))} disabled={page===totalPages}
                style={{ ...S.btn, backgroundColor:'#4f46e5', color:'#fff', opacity: page===totalPages ? 0.4 : 1 }}>
                Next →
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
