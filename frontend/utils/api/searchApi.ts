import axiosInstance from './axiosInstance';

export interface SearchResult {
  id: string;
  type: 'course' | 'assignment' | 'user' | 'announcement' | 'discussion';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  relevance?: number;
}

export interface SearchParams {
  query: string;
  type?: 'course' | 'assignment' | 'user' | 'announcement' | 'discussion' | 'all';
  page?: number;
  limit?: number;
  filters?: Record<string, any>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Global search across all resources
export async function globalSearch(params: SearchParams): Promise<SearchResponse> {
  const { query, type = 'all', page = 1, limit = 20, filters = {} } = params;

  const response = await axiosInstance.get<SearchResponse>('/search', {
    params: {
      q: query,
      type,
      page,
      limit,
      ...filters,
    },
  });

  return response.data;
}

// Search courses
export async function searchCourses(
  query: string,
  page = 1,
  limit = 20,
  filters?: Record<string, any>
): Promise<SearchResponse> {
  const response = await axiosInstance.get<SearchResponse>('/courses/search', {
    params: {
      q: query,
      page,
      limit,
      ...filters,
    },
  });

  return response.data;
}

// Search assignments
export async function searchAssignments(
  query: string,
  page = 1,
  limit = 20,
  filters?: Record<string, any>
): Promise<SearchResponse> {
  const response = await axiosInstance.get<SearchResponse>('/assignments/search', {
    params: {
      q: query,
      page,
      limit,
      ...filters,
    },
  });

  return response.data;
}

// Search users (admin only)
export async function searchUsers(
  query: string,
  page = 1,
  limit = 20,
  filters?: Record<string, any>
): Promise<SearchResponse> {
  const response = await axiosInstance.get<SearchResponse>('/admin/users/search', {
    params: {
      q: query,
      page,
      limit,
      ...filters,
    },
  });

  return response.data;
}

// Search announcements
export async function searchAnnouncements(
  query: string,
  page = 1,
  limit = 20,
  filters?: Record<string, any>
): Promise<SearchResponse> {
  const response = await axiosInstance.get<SearchResponse>('/announcements/search', {
    params: {
      q: query,
      page,
      limit,
      ...filters,
    },
  });

  return response.data;
}

// Search discussions
export async function searchDiscussions(
  query: string,
  page = 1,
  limit = 20,
  filters?: Record<string, any>
): Promise<SearchResponse> {
  const response = await axiosInstance.get<SearchResponse>('/discussions/search', {
    params: {
      q: query,
      page,
      limit,
      ...filters,
    },
  });

  return response.data;
}

// Get search suggestions (for autocomplete)
export async function getSearchSuggestions(query: string, limit = 10): Promise<string[]> {
  const response = await axiosInstance.get<{ suggestions: string[] }>('/search/suggestions', {
    params: {
      q: query,
      limit,
    },
  });

  return response.data.suggestions;
}

// Get trending searches
export async function getTrendingSearches(limit = 10): Promise<string[]> {
  const response = await axiosInstance.get<{ trending: string[] }>('/search/trending', {
    params: { limit },
  });

  return response.data.trending;
}
