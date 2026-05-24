import { useState, useCallback, useMemo } from 'react';

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface UsePaginationReturn<T> {
  items: T[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
}

/**
 * Hook for client-side pagination
 * Use for small datasets that fit in memory
 */
export function usePagination<T>(
  allItems: T[],
  initialPageSize: number = 10
): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalItems = allItems.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const items = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return allItems.slice(startIndex, endIndex);
  }, [allItems, currentPage, pageSize]);

  const goToPage = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(Math.max(1, size));
    setCurrentPage(1); // Reset to first page
  }, []);

  return {
    items,
    currentPage,
    pageSize,
    totalItems,
    totalPages,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
  };
}

/**
 * Hook for server-side pagination
 * Use for large datasets with API pagination
 */
export interface UseServerPaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
}

export interface UseServerPaginationReturn {
  page: number;
  pageSize: number;
  totalPages: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setPageSize: (size: number) => void;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export function useServerPagination(
  totalItems: number,
  options: UseServerPaginationOptions = {}
): UseServerPaginationReturn {
  const initialPage = options.initialPage || 1;
  const initialPageSize = options.initialPageSize || 10;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSizeState] = useState(initialPageSize);

  const totalPages = Math.ceil(totalItems / pageSize);

  const goToPage = useCallback((newPage: number) => {
    const validPage = Math.max(1, Math.min(newPage, totalPages));
    setPage(validPage);
  }, [totalPages]);

  const nextPage = useCallback(() => {
    goToPage(page + 1);
  }, [page, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(page - 1);
  }, [page, goToPage]);

  const setPageSize = useCallback((size: number) => {
    setPageSizeState(Math.max(1, size));
    setPage(1); // Reset to first page
  }, []);

  return {
    page,
    pageSize,
    totalPages,
    goToPage,
    nextPage,
    prevPage,
    setPageSize,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
}
