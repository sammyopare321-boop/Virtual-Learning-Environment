'use client';

import { useQuery } from '@tanstack/react-query';
import { courseApi } from '@/utils/api/courseApi';
import { queryKeys } from '@/lib/queryKeys';

export interface Milestone {
  id?: string;
  _id?: string;
  type: 'assignment' | 'quiz' | 'live_session';
  title: string;
  deadline: string;
  priority?: 'high' | 'normal' | 'low';
  course?: { _id: string; title: string };
}

export function useMilestones(enabled = true) {
  return useQuery({
    queryKey: queryKeys.student.milestones,
    queryFn: async () => {
      const res = await courseApi.getGlobalMilestones();
      return (res.data.data || []) as Milestone[];
    },
    enabled,
  });
}
