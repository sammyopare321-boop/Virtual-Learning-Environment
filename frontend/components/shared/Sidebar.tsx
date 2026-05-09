'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const studentLinks = [
  { href: '/dashboard/student',    label: 'Dashboard',      icon: '📊' },
  { href: '/courses',              label: 'My Courses',     icon: '📚' },
  { href: '/messages',             label: 'Messages',       icon: '💬' },
  { href: '/notifications',        label: 'Notifications',  icon: '🔔' },
  { href: '/profile',              label: 'Profile',        icon: '👤' },
];

const teacherLinks = [
  { href: '/dashboard/teacher',    label: 'Dashboard',      icon: '📊' },
  { href: '/courses',              label: 'My Courses',     icon: '📚' },
  { href: '/messages',             label: 'Messages',       icon: '💬' },
  { href: '/notifications',        label: 'Notifications',  icon: '🔔' },
  { href: '/profile',              label: 'Profile',        icon: '👤' },
];

const adminLinks = [
  { href: '/dashboard/admin',      label: 'Dashboard',      icon: '📊' },
  { href: '/admin/users',          label: 'Users',          icon: '👥' },
  { href: '/admin/courses',        label: 'Courses',        icon: '📚' },
  { href: '/admin/analytics',      label: 'Analytics',      icon: '📈' },
  { href: '/admin/logs',           label: 'Activity Logs',  icon: '📋' },
  { href: '/profile',              label: 'Profile',        icon: '👤' },
];

const linksByRole: Record<string, any> = { student: studentLinks, teacher: teacherLinks, admin: adminLinks };

export default function Sidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const links = linksByRole[user?.role] || studentLinks;

  return (
    <aside className="w-60 bg-white border-r border-surface-200 flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-surface-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary-600 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <span className="font-display font-bold text-surface-900">UniLearn</span>
        </div>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-surface-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
            <span className="text-primary-700 font-semibold text-sm">
              {user?.name?.charAt(0)?.toUpperCase() || '?'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-surface-900 truncate">{user?.name}</p>
            <span className="badge-primary text-xs capitalize">{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {links.map(({ href, label, icon }: { href: string, label: string, icon: string }) => (
          <Link key={href} href={href}
            className={`sidebar-link ${pathname === href || pathname.startsWith(href + '/') ? 'active' : ''}`}>
            <span className="text-base">{icon}</span>
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-surface-100">
        <button onClick={logout}
          className="sidebar-link w-full text-left text-danger hover:bg-red-50 hover:text-danger">
          <span className="text-base">🚪</span>
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
