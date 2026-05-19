'use client';

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/utils/api/courseApi';
import { studentApi } from '@/utils/api/studentApi';
import { queryKeys } from '@/lib/queryKeys';

export interface DashboardCourse {
  _id: string;
  code: string;
  title: string;
  status: string;
  semester: string;
  academicYear: string;
  coverImage?: string;
  progress?: number;
}

export interface DashboardMilestone {
  _id?: string;
  title: string;
  type: string;
  deadline: string;
  course?: { _id: string };
}

export interface DashboardStats {
  overallCompletion: number;
  assignmentsSubmitted: number;
  studyHours: number;
  gpa: number;
  onTimeRate: number;
  totalCourses: number;
}

export interface StudentDashboardData {
  courses: DashboardCourse[];
  milestones: DashboardMilestone[];
  stats: DashboardStats;
}

const defaultStats: DashboardStats = {
  overallCompletion: 0,
  assignmentsSubmitted: 0,
  studyHours: 0,
  gpa: 0,
  onTimeRate: 100,
  totalCourses: 0,
};

async function fetchStudentDashboard(): Promise<StudentDashboardData> {
  const [coursesRes, milestonesRes, statsRes] = await Promise.all([
    courseApi.getMyCourses(),
    studentApi.getMyMilestones(),
    studentApi.getMyStats(),
  ]);

  return {
    courses: coursesRes.data.data || [],
    milestones: milestonesRes.data.data || [],
    stats: { ...defaultStats, ...(statsRes.data.data || {}) },
  };
}

export function useStudentDashboard(enabled = true) {
  return useQuery({
    queryKey: queryKeys.student.dashboard,
    queryFn: fetchStudentDashboard,
    enabled,
  });
}
