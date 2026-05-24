# UniLearn Quick Reference Guide

## Project Structure

```
unilearn/
├── app/                          # Next.js app directory
│   ├── (dashboard)/             # Protected routes
│   │   ├── dashboard/           # Role-based dashboards
│   │   ├── courses/             # Course pages
│   │   └── admin/               # Admin pages
│   ├── auth/                    # Authentication pages
│   └── page.tsx                 # Landing page
├── components/                   # React components
│   ├── shared/                  # Shared components
│   ├── builder/                 # Course/quiz builders
│   ├── learning/                # Learning components
│   └── dashboard/               # Dashboard components
├── context/                      # React Context
├── hooks/                        # Custom hooks
├── utils/                        # Utilities
│   ├── api/                     # API clients
│   ├── auth/                    # Auth utilities
│   ├── security/                # Security utilities
│   └── validation/              # Validation utilities
├── lib/                          # Library functions
├── types/                        # TypeScript types
└── middleware.ts                # Next.js middleware
```

## Key Files & Their Purpose

| File | Purpose |
|------|---------|
| `middleware.ts` | Route protection & role-based access |
| `context/AuthContext.tsx` | Authentication state management |
| `lib/errorHandler.ts` | Centralized error handling |
| `utils/auth/secureTokenStorage.ts` | Secure token management |
| `utils/security/csrfProtection.ts` | CSRF protection |
| `utils/security/rateLimiter.ts` | Rate limiting |
| `utils/validation/fileValidator.ts` | File validation |
| `components/shared/ErrorBoundary.tsx` | Error boundary |
| `components/shared/Pagination.tsx` | Pagination UI |
| `hooks/usePagination.ts` | Pagination logic |

## Common Tasks

### Add a New Page
1. Create file in `app/(dashboard)/[feature]/page.tsx`
2. Add route to middleware if protected
3. Wrap with ErrorBoundary
4. Use useAuth() for user data

### Create a New Component
1. Create in `components/[category]/ComponentName.tsx`
2. Use TypeScript interfaces
3. Add proper error handling
4. Export from index if shared

### Add API Integration
1. Create client in `utils/api/[feature]Api.ts`
2. Use axios with auth headers
3. Handle errors with parseError()
4. Add to React Query hooks

### Implement Error Handling
```typescript
import { parseError, getUserFriendlyMessage } from '@/lib/errorHandler';

try {
  // API call
} catch (error) {
  const appError = parseError(error);
  toast.error(getUserFriendlyMessage(error));
}
```

### Use Pagination
```typescript
import { usePagination } from '@/hooks/usePagination';

const { items, currentPage, totalPages, nextPage, prevPage } = 
  usePagination(allItems, 10);

// In JSX
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onNextPage={nextPage}
  onPrevPage={prevPage}
/>
```

### Validate Files
```typescript
import { validateAssignmentFile } from '@/utils/validation/fileValidator';

const result = validateAssignmentFile(file);
if (!result.valid) {
  toast.error(result.error);
}
```

### Rate Limit Actions
```typescript
import { rateLimiter, RATE_LIMITS } from '@/utils/security/rateLimiter';

if (!rateLimiter.isAllowed('login', RATE_LIMITS.LOGIN.maxAttempts, RATE_LIMITS.LOGIN.windowMs)) {
  toast.error('Too many attempts. Please try again later.');
}
```

## Environment Variables

```env
# Required
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_GOOGLE_CLIENT_ID=
JWT_SECRET=

# Optional but Recommended
AWS_S3_BUCKET=
SENDGRID_API_KEY=
NEXT_PUBLIC_SENTRY_DSN=
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login
- `POST /api/auth/google` - Google OAuth
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Courses
- `GET /api/courses` - List courses
- `POST /api/courses` - Create course
- `GET /api/courses/:id` - Get course
- `PUT /api/courses/:id` - Update course
- `DELETE /api/courses/:id` - Delete course

### Admin
- `GET /api/admin/users` - List users
- `POST /api/admin/users/:id/impersonate` - Impersonate user
- `GET /api/admin/stats` - Get platform stats
- `GET /api/admin/logs` - Get audit logs

## Debugging Tips

### Check Authentication
```typescript
const { user, loading } = useAuth();
console.log('User:', user);
console.log('Loading:', loading);
```

### Check API Errors
```typescript
// Enable axios logging
import { axiosInstance } from '@/utils/api/axiosInstance';
axiosInstance.interceptors.response.use(
  res => res,
  err => {
    console.error('API Error:', err.response?.data);
    throw err;
  }
);
```

### Check Rate Limiting
```typescript
import { rateLimiter } from '@/utils/security/rateLimiter';
console.log('Remaining:', rateLimiter.getRemaining('key'));
console.log('Reset in:', rateLimiter.getResetTime('key'), 'seconds');
```

## Performance Tips

1. **Use React Query** for data fetching
2. **Lazy load** heavy components
3. **Memoize** expensive computations
4. **Paginate** large lists
5. **Optimize** images with Next.js Image
6. **Code split** routes automatically

## Security Checklist

- [ ] HTTPS enabled
- [ ] CSRF tokens in forms
- [ ] File validation on upload
- [ ] Rate limiting on sensitive endpoints
- [ ] Error messages don't leak info
- [ ] Secrets in environment variables
- [ ] CORS properly configured
- [ ] httpOnly cookies for tokens
- [ ] Input validation on all forms
- [ ] SQL injection prevention (ORM)

## Testing Commands

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run specific test file
npm run test -- fileName.test.ts

# Watch mode
npm run test -- --watch

# E2E tests
npm run test:e2e
```

## Build & Deploy

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint

# Type check
npm run type-check
```

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [React Query Docs](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Jest Testing](https://jestjs.io)

## Common Error Messages

| Error | Solution |
|-------|----------|
| "Token expired" | User needs to login again |
| "CSRF token invalid" | Refresh page and retry |
| "File too large" | Check file size limits |
| "Rate limit exceeded" | Wait before retrying |
| "Unauthorized" | Check user permissions |
| "Not found" | Verify resource exists |

## Getting Help

1. Check error logs in browser console
2. Check server logs
3. Review SETUP.md for common issues
4. Check FIXES_IMPLEMENTED.md for recent changes
5. Contact development team

---

**Last Updated:** 2025-05-24
**Version:** 1.0
