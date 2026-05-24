'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalSearch } from '@/hooks/queries/useSearch';
import { Search, X, ArrowRight } from 'lucide-react';

export default function CommandPalette() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');

  const { data: searchResults } = useGlobalSearch(
    {
      query,
      type: 'all',
      limit: 8,
    },
    isOpen && query.length > 0
  );

  // Handle keyboard shortcut (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
      }

      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setIsOpen(false);
      setQuery('');
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleResultClick = (resultId: string, resultType: string) => {
    setIsOpen(false);
    setQuery('');

    switch (resultType) {
      case 'course':
        router.push(`/courses/${resultId}`);
        break;
      case 'assignment':
        router.push(`/courses/${resultId}/assignments`);
        break;
      case 'user':
        router.push(`/admin/users/${resultId}`);
        break;
      default:
        router.push(`/search?q=${encodeURIComponent(resultId)}`);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={() => setIsOpen(false)}
      />

      {/* Command Palette */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl z-50">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-700">
            <Search className="w-5 h-5 text-gray-400 shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSearch(query);
                }
              }}
              placeholder="Search courses, assignments, users..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-lg"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results */}
          {query && (
            <div className="max-h-96 overflow-y-auto">
              {searchResults?.results && searchResults.results.length > 0 ? (
                <div className="divide-y divide-gray-700">
                  {searchResults.results.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result.id, result.type)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-700 transition-colors flex items-center justify-between group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{result.title}</p>
                        {result.description && (
                          <p className="text-gray-400 text-sm truncate">{result.description}</p>
                        )}
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-200 ml-2 shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-8 text-center text-gray-400">
                  No results found
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="px-4 py-2 bg-gray-900 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
            <span>Press Enter to search all results</span>
            <span>ESC to close</span>
          </div>
        </div>
      </div>
    </>
  );
}
