'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNextPage: () => void;
  onPrevPage: () => void;
  onGoToPage: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  onGoToPage,
  pageSize = 10,
  onPageSizeChange,
}: PaginationProps) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-slate-200 rounded-xl">
      {/* Page Size Selector */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
          <label htmlFor="page-size" className="text-sm font-medium text-slate-600">
            Items per page:
          </label>
          <select
            id="page-size"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            className="px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:border-primary-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}

      {/* Page Info */}
      <div className="text-sm text-slate-600 font-medium">
        Page <span className="font-bold text-slate-900">{currentPage}</span> of{' '}
        <span className="font-bold text-slate-900">{totalPages}</span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onPrevPage}
          disabled={!hasPrevPage}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} className="text-slate-600" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, idx) => (
            <button
              key={idx}
              onClick={() => typeof page === 'number' && onGoToPage(page)}
              disabled={page === '...'}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                page === currentPage
                  ? 'bg-primary-600 text-white'
                  : page === '...'
                  ? 'cursor-default text-slate-400'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <button
          onClick={onNextPage}
          disabled={!hasNextPage}
          className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={18} className="text-slate-600" />
        </button>
      </div>
    </div>
  );
}
