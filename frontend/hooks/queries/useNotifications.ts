'use client';

import { useQuery } from '@tanstack/react-query';
import { communicationApi } from '@/utils/api/communicationApi';
import { queryKeys } from '@/lib/queryKeys';

export function useNotifications(enabled = true) {
  return useQuery({
    queryKey: queryKeys.communication.notifications,
    queryFn: async () => {
      const res = await communicationApi.getMyNotifications();
      return res.data.data || [];
    },
    enabled,
  });
}

export function useConversations(enabled = true) {
  return useQuery({
    queryKey: queryKeys.communication.conversations,
    queryFn: async () => {
      const res = await communicationApi.getConversations();
      return res.data.data || [];
    },
    enabled,
  });
}
