'use client';

import { useQuery } from '@tanstack/react-query';
import { adminApi, type UserQueryParams, type LogQueryParams } from '@/utils/api/adminApi';
import { queryKeys } from '@/lib/queryKeys';

export function useAdminOverview(enabled = true) {
  return useQuery({
    queryKey: [...queryKeys.admin.analytics, 'overview'] as const,
    queryFn: async () => {
      const res = await adminApi.getOverview();
      return res.data.data;
    },
    enabled,
  });
}

export function useAdminStats(enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.stats,
    queryFn: async () => {
      const res = await adminApi.getStats();
      return res.data.data;
    },
    enabled,
  });
}

export function useAdminAnalytics(enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.analytics,
    queryFn: async () => {
      const [overview, grades, users, attendance, enrollment] = await Promise.allSettled([
        adminApi.getOverview(),
        adminApi.getGradeAnalytics(),
        adminApi.getUserAnalytics(),
        adminApi.getAttendanceAnalytics(),
        adminApi.getEnrollmentTrends(),
      ]);

      return {
        overview: overview.status === 'fulfilled' ? overview.value.data.data : null,
        grades: grades.status === 'fulfilled' ? grades.value.data.data : null,
        userGrowth: users.status === 'fulfilled' ? users.value.data.data || [] : [],
        attendance: attendance.status === 'fulfilled' ? attendance.value.data.data : null,
        enrollment: enrollment.status === 'fulfilled' ? enrollment.value.data.data || [] : [],
      };
    },
    enabled,
  });
}

export function useAdminUsers(params: UserQueryParams, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.users(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await adminApi.getAllUsers(params);
      return {
        users: res.data.data || [],
        totalPages: res.data.totalPages || 1,
      };
    },
    enabled,
  });
}

export function useAdminCourses(
  params: Record<string, string | number>,
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.admin.courses(params),
    queryFn: async () => {
      const res = await adminApi.getAllCourses(params);
      return {
        courses: res.data.data || [],
        totalPages: res.data.totalPages || 1,
      };
    },
    enabled,
  });
}

export function useAdminTeachers(enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.teachers,
    queryFn: async () => {
      const res = await adminApi.getAllUsers({ role: 'teacher', limit: 100 });
      return res.data.data || [];
    },
    enabled,
  });
}

export function useAdminLogs(params: LogQueryParams = {}, enabled = true) {
  return useQuery({
    queryKey: queryKeys.admin.logs(params as Record<string, unknown>),
    queryFn: async () => {
      const res = await adminApi.getLogs(params);
      return res.data.data || [];
    },
    enabled,
  });
}
