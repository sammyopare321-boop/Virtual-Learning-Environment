'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGlobalSearchInfinite } from '@/hooks/queries/useSearch';
import SearchBar from '@/components/shared/SearchBar';
import SearchResults from '@/components/shared/SearchResults';
import { Filter } from 'lucide-react';

type SearchType = 'all' | 'course' | 'assignment' | 'user' | 'announcement' | 'discussion';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [searchType, setSearchType] = useState<SearchType>('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGlobalSearchInfinite(
    {
      query,
      type: searchType,
      limit: 20,
    },
    query.length > 0
  );

  const results = data?.pages.flatMap((page: any) => page.results) || [];
  const total = (data?.pages[0] as any)?.total || 0;

  useEffect(() => {
    if (initialQuery && !query) {
      setQuery(initialQuery);
    }
  }, [initialQuery, query]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white mb-4">Search</h1>
          <SearchBar
            placeholder="Search courses, assignments, users, announcements, discussions..."
            onSearch={setQuery}
            showSuggestions
            showTrending
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {query && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {isLoading && results.length === 0 ? 'Searching...' : `Found ${total} results`}
                </h2>
                <p className="text-gray-400 text-sm">for "{query}"</p>
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-gray-200 hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                  {(['all', 'course', 'assignment', 'user', 'announcement', 'discussion'] as SearchType[]).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => setSearchType(type)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                          searchType === type
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>
            )}

            {/* Results */}
            <SearchResults
              results={results}
              isLoading={isLoading && results.length === 0}
              hasMore={hasNextPage}
              onLoadMore={() => fetchNextPage()}
            />

            {isFetchingNextPage && (
              <div className="text-center py-4">
                <div className="inline-block">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              </div>
            )}
          </div>
        )}

        {!query && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">Enter a search query to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
