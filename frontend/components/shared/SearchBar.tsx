'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchSuggestions, useTrendingSearches } from '@/hooks/queries/useSearch';
import { Search, X, TrendingUp } from 'lucide-react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  showSuggestions?: boolean;
  showTrending?: boolean;
  className?: string;
}

export default function SearchBar({
  placeholder = 'Search courses, assignments, users...',
  onSearch,
  showSuggestions = true,
  showTrending = true,
  className = '',
}: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: suggestions = [] } = useSearchSuggestions(query, 10, showSuggestions);
  const { data: trending = [] } = useTrendingSearches(5, showTrending && !query);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (searchQuery.trim()) {
      setQuery(searchQuery);
      setIsOpen(false);
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    }
  };

  const displayItems = query ? suggestions : trending;
  const showDropdown = isOpen && displayItems.length > 0;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="max-h-96 overflow-y-auto">
            {query ? (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase">
                  Suggestions
                </div>
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(suggestion)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200 text-sm transition-colors"
                  >
                    <Search className="inline w-4 h-4 mr-2 text-gray-400" />
                    {suggestion}
                  </button>
                ))}
              </>
            ) : (
              <>
                <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </div>
                {trending.map((trend, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSearch(trend)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-700 text-gray-200 text-sm transition-colors"
                  >
                    <TrendingUp className="inline w-4 h-4 mr-2 text-gray-400" />
                    {trend}
                  </button>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
