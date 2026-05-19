'use client';

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/utils/api/courseApi';
import { queryKeys } from '@/lib/queryKeys';
import { Course } from '@/types';

async function fetchCourse(courseId: string): Promise<Course> {
  const res = await courseApi.getOne(courseId);
  return res.data.data;
}

export function useCourse(courseId: string | undefined, enabled = true) {
  return useQuery({
    queryKey: queryKeys.courses.detail(courseId ?? ''),
    queryFn: () => fetchCourse(courseId!),
    enabled: Boolean(courseId) && enabled,
  });
}
