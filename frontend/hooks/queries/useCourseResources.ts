'use client';

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/utils/api/courseApi';
import { queryKeys } from '@/lib/queryKeys';

export function useCourseQuizzes(courseId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.quizzes.list(courseId ?? ''),
    queryFn: async () => {
      const res = await courseApi.getQuizzes(courseId!);
      return res.data.data || [];
    },
    enabled: Boolean(courseId) && enabled,
  });
}

export interface AssignmentSubmission {
  assignment: string;
  [key: string]: unknown;
}

export function useCourseAssignments(
  courseId: string | undefined,
  options: { isStudent?: boolean; enabled?: boolean } = {}
) {
  const { isStudent, enabled = true } = options;

  return useQuery({
    queryKey: [...queryKeys.courses.assignments(courseId ?? ''), isStudent],
    queryFn: async () => {
      const aRes = await courseApi.getAssignments(courseId!);
      const assignments = aRes.data.data || [];

      const submissions: Record<string, AssignmentSubmission> = {};
      if (isStudent) {
        try {
          const sRes = await courseApi.getMySubmissions(courseId!);
          (sRes.data.data || []).forEach((sub: AssignmentSubmission) => {
            submissions[sub.assignment] = sub;
          });
        } catch {
          // no submissions yet
        }
      }

      return { assignments, submissions };
    },
    enabled: Boolean(courseId) && enabled,
  });
}

export function useCourseGrades(
  courseId: string | undefined,
  role: 'student' | 'teacher' | 'admin',
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.courses.grades(courseId ?? '', role),
    queryFn: async () => {
      let weights = null;
      try {
        const wRes = await courseApi.getGradeWeights(courseId!);
        weights = wRes.data.data;
      } catch {
        weights = null;
      }

      if (role === 'student') {
        const [gRes, fRes] = await Promise.all([
          courseApi.getStudentGrades(courseId!),
          courseApi.getStudentFinalGrade(courseId!),
        ]);
        return {
          weights,
          myGrades: gRes.data.data || [],
          finalGrade: fRes.data.data,
          gradebook: [],
          atRisk: [],
        };
      }

      const [gbRes, arRes] = await Promise.all([
        courseApi.getGradebook(courseId!),
        courseApi.getAtRisk(courseId!),
      ]);

      return {
        weights,
        myGrades: [],
        finalGrade: null,
        gradebook: gbRes.data.data || [],
        atRisk: arRes.data.data || [],
      };
    },
    enabled: Boolean(courseId) && enabled,
  });
}

export function useCourseAnnouncements(courseId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.courses.announcements(courseId ?? ''),
    queryFn: async () => {
      const res = await courseApi.getAnnouncements(courseId!);
      return res.data.data || [];
    },
    enabled: Boolean(courseId) && enabled,
  });
}

export function useCourseDiscussions(courseId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.courses.discussions(courseId ?? ''),
    queryFn: async () => {
      const res = await courseApi.getDiscussions(courseId!);
      return res.data.data || [];
    },
    enabled: Boolean(courseId) && enabled,
  });
}

export function useCourseLiveSessions(
  courseId: string | undefined,
  enabled = true,
  options?: { refetchInterval?: number }
) {
  return useQuery({
    queryKey: queryKeys.courses.liveSessions(courseId ?? ''),
    queryFn: async () => {
      const res = await courseApi.getLiveSessions(courseId!);
      return res.data.data || [];
    },
    enabled: Boolean(courseId) && enabled,
    refetchInterval: options?.refetchInterval,
  });
}

export function useCourseAttendance(
  courseId: string | undefined,
  role: 'student' | 'teacher' | 'admin',
  enabled = true
) {
  return useQuery({
    queryKey: queryKeys.courses.attendance(courseId ?? '', role),
    queryFn: async () => {
      if (role === 'student') {
        const res = await courseApi.getStudentAttendance(courseId!);
        return { sessions: [], students: [], studentRecords: res.data.data || [] };
      }
      const [sessionsRes, studentsRes] = await Promise.all([
        courseApi.getAttendance(courseId!),
        courseApi.getStudents(courseId!),
      ]);
      return {
        sessions: sessionsRes.data.data || [],
        students: studentsRes.data.data || [],
        studentRecords: [],
      };
    },
    enabled: Boolean(courseId) && enabled,
  });
}
