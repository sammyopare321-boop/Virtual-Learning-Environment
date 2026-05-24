# Search Implementation Guide

## Overview

The UniLearn platform now includes a comprehensive search system with:
- Global search across all resources (courses, assignments, users, announcements, discussions)
- Real-time search suggestions and autocomplete
- Trending searches
- Advanced filtering
- Command palette (Cmd+K / Ctrl+K)
- Dedicated search page

## Architecture

### API Layer (`utils/api/searchApi.ts`)

Provides search API functions:

```typescript
// Global search
globalSearch(params: SearchParams): Promise<SearchResponse>

// Specific searches
searchCourses(query, page, limit, filters)
searchAssignments(query, page, limit, filters)
searchUsers(query, page, limit, filters)
searchAnnouncements(query, page, limit, filters)
searchDiscussions(query, page, limit, filters)

// Suggestions & trending
getSearchSuggestions(query, limit)
getTrendingSearches(limit)
```

### React Hooks (`hooks/queries/useSearch.ts`)

Custom hooks for search functionality:

```typescript
// Main search hooks
useGlobalSearch(params, enabled)
useGlobalSearchInfinite(params, enabled)
useCourseSearch(query, page, limit, enabled)
useAssignmentSearch(query, page, limit, enabled)
useUserSearch(query, page, limit, enabled)
useAnnouncementSearch(query, page, limit, enabled)
useDiscussionSearch(query, page, limit, enabled)

// Suggestions & trending
useSearchSuggestions(query, limit, enabled)
useTrendingSearches(limit, enabled)
```

### Components

#### SearchBar (`components/shared/SearchBar.tsx`)
Reusable search input component with:
- Real-time suggestions
- Trending searches
- Keyboard navigation
- Click-outside detection

**Usage:**
```tsx
<SearchBar
  placeholder="Search..."
  onSearch={(query) => handleSearch(query)}
  showSuggestions={true}
  showTrending={true}
/>
```

#### SearchResults (`components/shared/SearchResults.tsx`)
Displays search results with:
- Result cards with icons and metadata
- Type badges (Course, Assignment, User, etc.)
- Relevance scores
- Load more functionality
- Empty state handling

**Usage:**
```tsx
<SearchResults
  results={results}
  isLoading={isLoading}
  hasMore={hasNextPage}
  onLoadMore={() => fetchNextPage()}
/>
```

#### CommandPalette (`components/shared/CommandPalette.tsx`)
Global command palette with:
- Keyboard shortcut (Cmd+K / Ctrl+K)
- Quick search
- Result preview
- ESC to close

**Features:**
- Automatically opens on Cmd+K or Ctrl+K
- Shows top 8 results
- Click result to navigate
- Press Enter to go to full search page

### Pages

#### Search Page (`app/(dashboard)/search/page.tsx`)
Full-featured search page with:
- Search bar at top
- Filter by type (All, Course, Assignment, User, Announcement, Discussion)
- Infinite scroll pagination
- Result count display
- Empty state messaging

**URL:** `/search?q=query`

## Usage Examples

### Basic Search
```tsx
import { useGlobalSearch } from '@/hooks/queries/useSearch';

export function MyComponent() {
  const [query, setQuery] = useState('');
  const { data, isLoading } = useGlobalSearch(
    { query, type: 'all', limit: 20 },
    query.length > 0
  );

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      {data?.results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  );
}
```

### Search with Filters
```tsx
const { data } = useGlobalSearch({
  query: 'math',
  type: 'course',
  filters: {
    status: 'active',
    instructor: 'Dr. Smith'
  }
});
```

### Infinite Scroll
```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useGlobalSearchInfinite({
  query: 'assignment',
  type: 'assignment'
});

const results = data?.pages.flatMap(page => page.results) || [];
```

### Search Suggestions
```tsx
const { data: suggestions } = useSearchSuggestions('math', 10);

// suggestions = ['math 101', 'mathematics basics', ...]
```

## API Endpoints Required

The following backend endpoints need to be implemented:

### Global Search
- `GET /search?q=query&type=all&page=1&limit=20`
- Returns: `{ results: SearchResult[], total: number, page: number, limit: number, hasMore: boolean }`

### Specific Searches
- `GET /courses/search?q=query&page=1&limit=20`
- `GET /assignments/search?q=query&page=1&limit=20`
- `GET /admin/users/search?q=query&page=1&limit=20`
- `GET /announcements/search?q=query&page=1&limit=20`
- `GET /discussions/search?q=query&page=1&limit=20`

### Suggestions & Trending
- `GET /search/suggestions?q=query&limit=10`
- Returns: `{ suggestions: string[] }`
- `GET /search/trending?limit=10`
- Returns: `{ trending: string[] }`

## Search Result Types

```typescript
interface SearchResult {
  id: string;
  type: 'course' | 'assignment' | 'user' | 'announcement' | 'discussion';
  title: string;
  description?: string;
  metadata?: {
    instructor?: string;
    dueDate?: string;
    status?: string;
    courseId?: string;
    [key: string]: any;
  };
  relevance?: number; // 0-1 score
}
```

## Integration Points

### In Sidebar
The search button in the sidebar triggers the command palette:
```tsx
<button onClick={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }))}>
  Search...
</button>
```

### In Dashboard
Add SearchBar to any page:
```tsx
import SearchBar from '@/components/shared/SearchBar';

<SearchBar onSearch={(query) => router.push(`/search?q=${query}`)} />
```

### In Components
Use search hooks directly:
```tsx
import { useCourseSearch } from '@/hooks/queries/useSearch';

const { data } = useCourseSearch('calculus', 1, 20);
```

## Performance Considerations

### Caching
- Global search: 5 minute cache
- Suggestions: 10 minute cache
- Trending: 30 minute cache

### Pagination
- Default limit: 20 results per page
- Infinite scroll loads next page on demand
- Prevents loading all results at once

### Debouncing
- Suggestions only trigger after 2+ characters
- Prevents excessive API calls
- Automatic cleanup on unmount

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+K / Ctrl+K | Open command palette |
| Enter | Search or navigate to result |
| ESC | Close command palette |
| Arrow Up/Down | Navigate results (in command palette) |

## Styling

All search components use the dark theme aesthetic:
- Background: `bg-gray-800` / `bg-gray-900`
- Borders: `border-gray-700`
- Text: `text-white` / `text-gray-400`
- Hover: `hover:bg-gray-700`
- Active: `bg-blue-600`

## Accessibility

- Keyboard navigation support
- ARIA labels on buttons
- Semantic HTML structure
- Focus management
- Screen reader friendly

## Future Enhancements

1. **Advanced Filters**
   - Date range filtering
   - Status filtering
   - Role-based filtering
   - Custom filters

2. **Search Analytics**
   - Track popular searches
   - Search performance metrics
   - User search patterns

3. **Saved Searches**
   - Save frequent searches
   - Quick access to saved searches
   - Search history

4. **Full-Text Search**
   - Index course content
   - Search within documents
   - OCR for images

5. **AI-Powered Search**
   - Natural language queries
   - Semantic search
   - Smart suggestions

## Troubleshooting

### Search not working
- Check backend endpoints are implemented
- Verify API keys in environment
- Check browser console for errors
- Ensure query length > 0

### Suggestions not showing
- Verify `/search/suggestions` endpoint
- Check query length >= 2 characters
- Verify response format

### Command palette not opening
- Check keyboard event listeners
- Verify Cmd+K / Ctrl+K not conflicting
- Check browser console for errors

### Results not loading
- Check network tab for API calls
- Verify response format matches SearchResponse
- Check error handling in hooks

## Files Created

- `utils/api/searchApi.ts` - API functions
- `hooks/queries/useSearch.ts` - React hooks
- `components/shared/SearchBar.tsx` - Search input component
- `components/shared/SearchResults.tsx` - Results display component
- `components/shared/CommandPalette.tsx` - Command palette
- `app/(dashboard)/search/page.tsx` - Search page
- `SEARCH_IMPLEMENTATION.md` - This file

## Next Steps

1. Implement backend search endpoints
2. Test search functionality
3. Optimize search performance
4. Add search analytics
5. Implement saved searches
6. Add advanced filters

---

**Status:** ✅ Frontend Implementation Complete
**Backend Status:** ⏳ Awaiting Implementation
**Last Updated:** 2025-05-24
