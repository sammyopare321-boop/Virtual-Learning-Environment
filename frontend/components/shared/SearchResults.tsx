'use client';

import { useRouter } from 'next/navigation';
import { SearchResult } from '@/utils/api/searchApi';
import { BookOpen, FileText, Users, Bell, MessageSquare, Loader } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const typeIcons: Record<SearchResult['type'], React.ReactNode> = {
  course: <BookOpen className="w-5 h-5" />,
  material: <FileText className="w-5 h-5" />,
  assignment: <FileText className="w-5 h-5" />,
  user: <Users className="w-5 h-5" />,
  announcement: <Bell className="w-5 h-5" />,
  discussion: <MessageSquare className="w-5 h-5" />,
};

const typeColors: Record<SearchResult['type'], string> = {
  course: 'bg-blue-900 text-blue-200',
  material: 'bg-indigo-900 text-indigo-200',
  assignment: 'bg-purple-900 text-purple-200',
  user: 'bg-green-900 text-green-200',
  announcement: 'bg-yellow-900 text-yellow-200',
  discussion: 'bg-pink-900 text-pink-200',
};

const typeLabels: Record<SearchResult['type'], string> = {
  course: 'Course',
  material: 'Material',
  assignment: 'Assignment',
  user: 'User',
  announcement: 'Announcement',
  discussion: 'Discussion',
};

function ResultCard({ result }: { result: SearchResult }) {
  const router = useRouter();

  const handleClick = () => {
    switch (result.type) {
      case 'course':
        router.push(`/courses/${result.id}`);
        break;
      case 'assignment':
        router.push(`/courses/${result.metadata?.courseId}/assignments/${result.id}`);
        break;
      case 'user':
        router.push(`/admin/users/${result.id}`);
        break;
      case 'announcement':
        router.push(`/courses/${result.metadata?.courseId}/announcements`);
        break;
      case 'discussion':
        router.push(`/courses/${result.metadata?.courseId}/discussions/${result.id}`);
        break;
    }
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left p-4 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-all group"
    >
      <div className="flex items-start gap-3">
        <div className="text-gray-400 group-hover:text-gray-300 mt-1">{typeIcons[result.type]}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white truncate group-hover:text-blue-400">
              {result.title}
            </h3>
            <span className={`px-2 py-1 rounded text-xs font-medium whitespace-nowrap ${typeColors[result.type]}`}>
              {typeLabels[result.type]}
            </span>
          </div>
          {result.description && (
            <p className="text-sm text-gray-400 line-clamp-2">{result.description}</p>
          )}
          {result.metadata && (
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-500">
              {result.metadata.instructor && (
                <span>Instructor: {result.metadata.instructor}</span>
              )}
              {result.metadata.dueDate && (
                <span>Due: {new Date(result.metadata.dueDate).toLocaleDateString()}</span>
              )}
              {result.metadata.status && (
                <span>Status: {result.metadata.status}</span>
              )}
            </div>
          )}
        </div>
        {result.relevanceScore && (
          <div className="text-right">
            <div className="text-xs text-gray-500">
              {Math.round(result.relevanceScore)}% match
            </div>
          </div>
        )}
      </div>
    </button>
  );
}

export default function SearchResults({
  results,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}: SearchResultsProps) {
  if (isLoading && results.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No results found. Try a different search.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((result) => (
        <ResultCard key={`${result.type}-${result.id}`} result={result} />
      ))}

      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full py-3 text-center text-blue-400 hover:text-blue-300 disabled:text-gray-500 font-medium transition-colors"
        >
          {isLoading ? 'Loading...' : 'Load More Results'}
        </button>
      )}
    </div>
  );
}
