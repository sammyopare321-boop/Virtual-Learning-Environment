'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { TeacherNav } from '@/components/teacher/TeacherNav';

export default function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.role !== 'teacher' && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    return null;
  }

  return (
    <div className="flex flex-col h-full">
      <TeacherNav />
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}
