'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Loader2, TrendingUp, Clock, Filter, X, BookOpen,
  MessageSquare, FileText, Zap, ChevronRight
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SearchResult {
  id: string;
  title: string;
  type: 'course' | 'material' | 'discussion' | 'assignment';
  description: string;
  relevanceScore: number;
  matchedKeywords: string[];
  preview: string;
  url: string;
  metadata: {
    author: string;
    date: string;
    tags: string[];
  };
}

interface SearchSuggestion {
  suggestion: string;
  type: 'popular' | 'related' | 'trending' | 'personalized';
  description: string;
  searchCount: number;
  relevance: number;
}

interface AISearchProps {
  courseId?: string;
  onResultSelect?: (result: SearchResult) => void;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'course':
      return <BookOpen size={16} />;
    case 'discussion':
      return <MessageSquare size={16} />;
    case 'assignment':
      return <FileText size={16} />;
    default:
      return <BookOpen size={16} />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'course':
      return 'bg-blue-100 text-blue-700';
    case 'discussion':
      return 'bg-purple-100 text-purple-700';
    case 'assignment':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export default function AISearch({ courseId, onResultSelect }: AISearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all',
    dateRange: 'all',
  });
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load search history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('searchHistory');
    if (history) {
      setSearchHistory(JSON.parse(history));
    }
  }, []);

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          courseId,
          filters,
        }),
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data = await response.json();
      setResults(data.results || []);

      // Save to search history
      const newHistory = [searchQuery, ...searchHistory.filter((h) => h !== searchQuery)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));

      toast.success(`Found ${data.results?.length || 0} results`);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setQuery(suggestion);
    await handleSearch(suggestion);
  };

  const handleInputChange = async (value: string) => {
    setQuery(value);

    if (value.length > 2) {
      try {
        const response = await fetch('/api/ai/search/suggestions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: value,
            courseId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.suggestions || []);
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="relative flex items-center">
          <Search size={20} className="absolute left-4 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
            placeholder="Search courses, materials, discussions..."
            className="w-full pl-12 pr-12 py-3 rounded-xl border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 outline-none transition-all"
          />
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="absolute right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg z-10"
            >
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(suggestion.suggestion)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0 flex items-center justify-between group"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{suggestion.suggestion}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{suggestion.description}</p>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-slate-400" />
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-lg p-4 z-10"
            >
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">Type</label>
                  <select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="all">All Types</option>
                    <option value="course">Courses</option>
                    <option value="material">Materials</option>
                    <option value="discussion">Discussions</option>
                    <option value="assignment">Assignments</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="all">All Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-2">Date Range</label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
                    className="w-full text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="all">All Time</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => handleSearch(query)}
                className="w-full mt-4 px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-all"
              >
                Apply Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Search Results */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="text-primary-600 animate-spin" />
        </div>
      ) : results.length > 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-3"
        >
          {results.map((result, idx) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onResultSelect?.(result)}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-4 cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${getTypeColor(result.type)} flex items-center justify-center shrink-0`}>
                  {getTypeIcon(result.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">
                      {result.title}
                    </h3>
                    <span className="text-xs font-bold text-slate-500 shrink-0">
                      {result.relevanceScore}%
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 mb-2 line-clamp-2">{result.description}</p>

                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <span className={`text-xs px-2 py-1 rounded-lg ${getTypeColor(result.type)}`}>
                      {result.type}
                    </span>
                    {result.matchedKeywords.slice(0, 2).map((keyword, i) => (
                      <span key={i} className="text-xs px-2 py-1 rounded-lg bg-slate-100 text-slate-700">
                        {keyword}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    {result.metadata.author && (
                      <span>By {result.metadata.author}</span>
                    )}
                    {result.metadata.date && (
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {result.metadata.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      ) : query ? (
        <div className="text-center py-12">
          <Search size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No results found</p>
          <p className="text-slate-500 text-sm mt-1">Try different keywords or adjust filters</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <Zap size={32} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Start searching</p>
          <p className="text-slate-500 text-sm mt-1">Enter keywords to find courses, materials, and more</p>
        </div>
      )}

      {/* Search History */}
      {!query && searchHistory.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <Clock size={16} className="text-slate-400" />
            Recent Searches
          </h4>
          <div className="flex flex-wrap gap-2">
            {searchHistory.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleSuggestionClick(item)}
                className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
