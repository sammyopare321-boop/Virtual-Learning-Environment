'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, BookOpen, MessageSquare, Bell, User as UserIcon, 
  LogOut, GraduationCap, Users, BarChart3, Activity, Radar, 
  Settings, HelpCircle, ChevronRight, Search, X, LucideIcon, Plus
} from 'lucide-react';
import useNotificationSentinel from '@/hooks/useNotificationSentinel';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

const studentLinks = [
  { group: 'Overview', items: [
    { href: '/dashboard/student',    label: 'Dashboard',      icon: LayoutDashboard },
    { href: '/messages',             label: 'Inbox',          icon: MessageSquare },
    { href: '/courses',              label: 'Lesson',         icon: BookOpen },
    { href: '/tasks',                label: 'Task',           icon: Activity },
    { href: '/groups',               label: 'Group',          icon: Users },
  ]}
];

const friends = [
  { name: 'Bagas Mahpie', role: 'Friend', avatar: null },
  { name: 'Sir Dandy', role: 'Old Friend', avatar: null },
  { name: 'Jhon Tosan', role: 'Friend', avatar: null },
];

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const sections = studentLinks; // Simplified for this design phase

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-gray-100 flex flex-col z-30 sticky top-0 shrink-0 overflow-hidden">
      {/* Logo Section */}
      <div className="h-20 flex items-center px-6 mb-2">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
            <GraduationCap size={22} />
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-gray-900">Coursue</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto px-4 scrollbar-premium py-4">
        {sections.map((section, idx) => (
          <div key={idx} className="mb-10">
            <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              {section.group}
            </h3>
            <div className="space-y-1.5">
              {section.items.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link 
                    key={item.href} 
                    href={item.href}
                    className={`sidebar-item group ${isActive ? 'active' : ''}`}
                  >
                    <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-900'} />
                    <span className="text-[14px] font-medium tracking-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        {/* Friends Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between px-4 mb-4">
            <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Friends
            </h3>
          </div>
          <div className="space-y-4 px-2">
            {friends.map((friend, i) => (
              <div key={i} className="flex items-center gap-3 px-2 group cursor-pointer">
                <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-500 font-bold text-xs">
                  {friend.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-semibold text-gray-900 truncate">{friend.name}</h4>
                  <p className="text-[10px] text-gray-400 font-medium">{friend.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / Settings */}
      <div className="p-4 border-t border-gray-50 space-y-2">
        <h3 className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          Settings
        </h3>
        <Link href="/settings" className="sidebar-item group">
          <Settings size={20} className="text-gray-400 group-hover:text-gray-900" />
          <span className="text-[14px] font-medium">Setting</span>
        </Link>
        <button onClick={logout} className="sidebar-item w-full group text-red-500 hover:bg-red-50">
          <LogOut size={20} className="text-red-400 group-hover:text-red-600" />
          <span className="text-[14px] font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
