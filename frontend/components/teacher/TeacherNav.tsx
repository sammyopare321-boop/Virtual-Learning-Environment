'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, BookOpen, FileText, BarChart3,
  Users, Settings, HelpCircle
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', href: '/teacher', icon: LayoutDashboard },
  { label: 'Courses', href: '/teacher/courses', icon: BookOpen },
  { label: 'Submissions', href: '/teacher/submissions', icon: FileText },
  { label: 'Analytics', href: '/teacher/analytics', icon: BarChart3 },
];

export function TeacherNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1 border-b border-slate-100 overflow-x-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors whitespace-nowrap flex items-center gap-2"
          >
            <Icon size={16} />
            {item.label}
            {isActive && (
              <motion.div
                layoutId="teacher-nav-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600"
              />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
