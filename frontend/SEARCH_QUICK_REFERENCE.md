# Search Quick Reference

## For Users

### How to Search

1. **Command Palette** (Fastest)
   - Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
   - Type your search query
   - Press Enter or click a result

2. **Search Bar**
   - Click the search button in the sidebar
   - Type your query
   - Press Enter to see all results

3. **Search Page**
   - Navigate to `/search`
   - Enter your query
   - Use filters to narrow results

### Search Types

- **Courses** - Search by title, code, description
- **Assignments** - Search by title, description
- **Users** - Search by name, email (admin only)
- **Announcements** - Search by title, content
- **Discussions** - Search by title, posts

### Tips

- Use specific keywords for better results
- Filter by type to narrow results
- Check trending searches for popular topics
- Use suggestions for autocomplete

## For Developers

### Import Search Hooks

```typescript
import {
  useGlobalSearch,
  useGlobalSearchInfinite,
  useCourseSearch,
  useAssignmentSearch,
  useUserSearch,
  useAnnouncementSearch,
  useDiscussionSearch,
  useSearchSuggestions,
  useTrendingSearches,
} from '@/hooks/queries/useSearch';
```

### Import Search Components

```typescript
import SearchBar from '@/components/shared/SearchBar';
import SearchResults from '@/components/shared/SearchResults';
import CommandPalette from '@/components/shared/CommandPalette';
```

### Import Search API

```typescript
import {
  globalSearch,
  searchCourses,
  searchAssignments,
  searchUsers,
  searchAnnouncements,
  searchDiscussions,
  getSearchSuggestions,
  getTrendingSearches,
} from '@/utils/api/searchApi';
```

### Basic Usage

```tsx
// In a component
const [query, setQuery] = useState('');
const { data, isLoading } = useGlobalSearch(
  { query, type: 'all', limit: 20 },
  query.length > 0
);

return (
  <>
    <SearchBar onSearch={setQuery} />
    <SearchResults results={data?.results || []} isLoading={isLoading} />
  </>
);
```

### Infinite Scroll

```tsx
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
} = useGlobalSearchInfinite({ query, type: 'all' });

const results = data?.pages.flatMap(p => p.results) || [];
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

## API Endpoints

### Global Search
```
GET /search?q=query&type=all&page=1&limit=20
```

### Specific Searches
```
GET /courses/search?q=query&page=1&limit=20
GET /assignments/search?q=query&page=1&limit=20
GET /admin/users/search?q=query&page=1&limit=20
GET /announcements/search?q=query&page=1&limit=20
GET /discussions/search?q=query&page=1&limit=20
```

### Suggestions & Trending
```
GET /search/suggestions?q=query&limit=10
GET /search/trending?limit=10
```

## Response Format

```typescript
interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

interface SearchResult {
  id: string;
  type: 'course' | 'assignment' | 'user' | 'announcement' | 'discussion';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  relevance?: number;
}
```

## Files

| File | Purpose |
|------|---------|
| `utils/api/searchApi.ts` | API functions |
| `hooks/queries/useSearch.ts` | React hooks |
| `components/shared/SearchBar.tsx` | Search input |
| `components/shared/SearchResults.tsx` | Results display |
| `components/shared/CommandPalette.tsx` | Command palette |
| `app/(dashboard)/search/page.tsx` | Search page |
| `SEARCH_IMPLEMENTATION.md` | Full documentation |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Cmd+K / Ctrl+K | Open command palette |
| Enter | Search or navigate |
| ESC | Close palette |

## Common Tasks

### Add search to a page
```tsx
import SearchBar from '@/components/shared/SearchBar';

<SearchBar onSearch={(q) => router.push(`/search?q=${q}`)} />
```

### Search specific type
```tsx
const { data } = useCourseSearch('calculus', 1, 20);
```

### Get suggestions
```tsx
const { data: suggestions } = useSearchSuggestions('math', 10);
```

### Get trending
```tsx
const { data: trending } = useTrendingSearches(5);
```

## Performance

- **Cache Duration**
  - Global search: 5 minutes
  - Suggestions: 10 minutes
  - Trending: 30 minutes

- **Limits**
  - Default results per page: 20
  - Max suggestions: 10
  - Max trending: 10

- **Debouncing**
  - Suggestions: 2+ characters
  - Prevents excessive API calls

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Search not working | Check backend endpoints |
| No suggestions | Verify `/search/suggestions` endpoint |
| Command palette not opening | Check Cmd+K / Ctrl+K not conflicting |
| Results not loading | Check network tab, verify response format |

---

**Last Updated:** 2025-05-24
