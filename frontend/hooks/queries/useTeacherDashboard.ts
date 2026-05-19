'use client';

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/utils/api/courseApi';
import { teacherApi } from '@/utils/api/teacherApi';
import { queryKeys } from '@/lib/queryKeys';
import { Course } from '@/types';

export interface TeacherStats {
  students: number;
  attendance: number;
  engagementData: number[];
  upcomingClasses: Array<{
    title: string;
    type: string;
    time: string;
    courseId: string;
    color: string;
  }>;
}

const defaultStats: TeacherStats = {
  students: 0,
  attendance: 0,
  engagementData: [0, 0, 0, 0, 0, 0, 0],
  upcomingClasses: [],
};

async function fetchTeacherCourses(teacherId: string): Promise<Course[]> {
  const res = await courseApi.getAll();
  const all: Course[] = res.data.data || [];
  return all.filter((c) => {
    if (!c.teacher) return false;
    if (typeof c.teacher === 'object') return c.teacher._id === teacherId;
    return c.teacher === teacherId;
  });
}

export function useTeacherStats(enabled = true) {
  return useQuery({
    queryKey: queryKeys.teacher.dashboard,
    queryFn: async () => {
      const res = await teacherApi.getStats();
      return { ...defaultStats, ...(res.data.data || {}) } as TeacherStats;
    },
    enabled,
  });
}

export function useTeacherCourses(teacherId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.teacher.courses(teacherId ?? ''),
    queryFn: () => fetchTeacherCourses(teacherId!),
    enabled: Boolean(teacherId) && enabled,
  });
}
