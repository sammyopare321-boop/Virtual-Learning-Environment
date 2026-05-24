import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import {
  globalSearch,
  searchCourses,
  searchAssignments,
  searchUsers,
  searchAnnouncements,
  searchDiscussions,
  getSearchSuggestions,
  getTrendingSearches,
  SearchParams,
  SearchResponse,
} from '@/utils/api/searchApi';

// Global search hook
export function useGlobalSearch(params: SearchParams, enabled = true) {
  return useQuery({
    queryKey: ['search', 'global', params.query, params.type, params.page, params.filters],
    queryFn: () => globalSearch(params),
    enabled: enabled && params.query.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Infinite global search hook (for pagination)
export function useGlobalSearchInfinite(params: Omit<SearchParams, 'page'>, enabled = true) {
  return useInfiniteQuery({
    queryKey: ['search', 'global', 'infinite', params.query, params.type, params.filters],
    queryFn: ({ pageParam = 1 }) =>
      globalSearch({
        ...params,
        page: pageParam,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    initialPageParam: 1,
    enabled: enabled && params.query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Search courses hook
export function useCourseSearch(query: string, page = 1, limit = 20, enabled = true) {
  return useQuery({
    queryKey: ['search', 'courses', query, page, limit],
    queryFn: () => searchCourses(query, page, limit),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Search assignments hook
export function useAssignmentSearch(query: string, page = 1, limit = 20, enabled = true) {
  return useQuery({
    queryKey: ['search', 'assignments', query, page, limit],
    queryFn: () => searchAssignments(query, page, limit),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Search users hook (admin only)
export function useUserSearch(query: string, page = 1, limit = 20, enabled = true) {
  return useQuery({
    queryKey: ['search', 'users', query, page, limit],
    queryFn: () => searchUsers(query, page, limit),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Search announcements hook
export function useAnnouncementSearch(query: string, page = 1, limit = 20, enabled = true) {
  return useQuery({
    queryKey: ['search', 'announcements', query, page, limit],
    queryFn: () => searchAnnouncements(query, page, limit),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Search discussions hook
export function useDiscussionSearch(query: string, page = 1, limit = 20, enabled = true) {
  return useQuery({
    queryKey: ['search', 'discussions', query, page, limit],
    queryFn: () => searchDiscussions(query, page, limit),
    enabled: enabled && query.length > 0,
    staleTime: 5 * 60 * 1000,
  });
}

// Search suggestions hook (for autocomplete)
export function useSearchSuggestions(query: string, limit = 10, enabled = true) {
  return useQuery({
    queryKey: ['search', 'suggestions', query, limit],
    queryFn: () => getSearchSuggestions(query, limit),
    enabled: enabled && query.length > 2,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Trending searches hook
export function useTrendingSearches(limit = 10, enabled = true) {
  return useQuery({
    queryKey: ['search', 'trending', limit],
    queryFn: () => getTrendingSearches(limit),
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}
