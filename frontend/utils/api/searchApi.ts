import axiosInstance from './axiosInstance';

export interface SearchParams {
  query: string;
  type?: string;
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

export interface SearchResponse {
  success: boolean;
  data?: any;
  results?: SearchResult[];
  message: string;
  hasMore?: boolean;
  page?: number;
  total?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  type: 'course' | 'material' | 'discussion' | 'assignment' | 'user' | 'announcement';
  description: string;
  relevanceScore: number;
  matchedKeywords: string[];
  preview: string;
  url: string;
  metadata: {
    author?: string;
    date?: string;
    tags?: string[];
    [key: string]: any;
  };
}

/**
 * Global search across all content
 */
export async function globalSearch(params: SearchParams): Promise<SearchResponse> {
  const response = await axiosInstance.post(`/ai/search`, {
    query: params.query,
    type: params.type || 'all',
    page: params.page || 1,
    limit: params.limit || 20,
    filters: params.filters || {},
  });
  return response.data;
}

/**
 * Search courses
 */
export async function searchCourses(query: string, page: number = 1, limit: number = 20): Promise<SearchResponse> {
  const response = await axiosInstance.post(`/ai/search`, {
    query,
    type: 'course',
    page,
    limit,
  });
  return response.data;
}

/**
 * Search assignments
 */
export async function searchAssignments(query: string, page: number = 1, limit: number = 20): Promise<SearchResponse> {
  const response = await axiosInstance.post(`/ai/search`, {
    query,
    type: 'assignment',
    page,
    limit,
  });
  return response.data;
}

/**
 * Search users (admin only)
 */
export async function searchUsers(query: string, page: number = 1, limit: number = 20): Promise<SearchResponse> {
  const response = await axiosInstance.post(`/ai/search`, {
    query,
    type: 'user',
    page,
    limit,
  });
  return response.data;
}

/**
 * Search announcements
 */
export async function searchAnnouncements(query: string, page: number = 1, limit: number = 20): Promise<SearchResponse> {
  const response = await axiosInstance.post(`/ai/search`, {
    query,
    type: 'announcement',
    page,
    limit,
  });
  return response.data;
}

/**
 * Search discussions
 */
export async function searchDiscussions(query: string, page: number = 1, limit: number = 20): Promise<SearchResponse> {
  const response = await axiosInstance.post(`/ai/search`, {
    query,
    type: 'discussion',
    page,
    limit,
  });
  return response.data;
}

/**
 * Get search suggestions
 */
export async function getSearchSuggestions(query: string, limit: number = 10): Promise<SearchResponse> {
  const response = await axiosInstance.post(`/ai/search/suggestions`, {
    query,
    limit,
  });
  return response.data;
}

/**
 * Get trending searches
 */
export async function getTrendingSearches(limit: number = 10): Promise<SearchResponse> {
  const response = await axiosInstance.get(`/ai/search/trending`, {
    params: { limit },
  });
  return response.data;
}

/**
 * Get search history
 */
export async function getSearchHistory(): Promise<SearchResponse> {
  const response = await axiosInstance.get(`/ai/search/history`);
  return response.data;
}

/**
 * Clear search history
 */
export async function clearSearchHistory(): Promise<SearchResponse> {
  const response = await axiosInstance.post(`/ai/search/history/clear`, {});
  return response.data;
}


