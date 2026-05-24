# Sentry Quick Reference

## Installation

```bash
npm install @sentry/nextjs
```

Add to `.env.local`:
```env
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

## Common Usage Patterns

### Capture Exception

```typescript
import { captureException } from '@/lib/sentry';

try {
  // code
} catch (error) {
  captureException(error as Error, { 
    action: 'upload-file',
    userId: user.id 
  });
}
```

### Capture Message

```typescript
import { captureMessage } from '@/lib/sentry';

captureMessage('User completed onboarding', 'info');
captureMessage('High memory usage detected', 'warning');
```

### Add Breadcrumb

```typescript
import { addSentryBreadcrumb } from '@/lib/sentry';

addSentryBreadcrumb('User clicked submit', 'user-action', 'info');
addSentryBreadcrumb('API call to /courses', 'api', 'info');
addSentryBreadcrumb('Form validation failed', 'validation', 'warning');
```

### Set User Context

```typescript
import { setSentryUser, clearSentryUser } from '@/lib/sentry';

// On login
setSentryUser(user.id, user.email, user.name);

// On logout
clearSentryUser();
```

## Automatic Tracking

These are captured automatically:

- ✅ Unhandled exceptions
- ✅ API errors (5xx)
- ✅ React component errors
- ✅ Network failures
- ✅ User context (login/logout)

## Error Handler Integration

Errors logged via `logError()` automatically go to Sentry:

```typescript
import { logError, ErrorCode } from '@/lib/errorHandler';

const error: AppError = {
  code: ErrorCode.FILE_TOO_LARGE,
  message: 'File exceeds limit',
  statusCode: 413,
};

logError(error, 'file-upload'); // Automatically sent to Sentry
```

## API Error Tracking

API errors are automatically captured by axios interceptor:

```typescript
// 5xx errors automatically captured
// Breadcrumb added for all API calls
// No manual action needed
```

## Viewing Errors

1. Go to https://sentry.io
2. Select your project
3. Click "Issues"
4. Click an issue to see:
   - Stack trace
   - User info
   - Breadcrumbs
   - Session replay
   - Environment

## Tips

- ✅ Use error codes for consistency
- ✅ Add context to errors
- ✅ Use breadcrumbs for debugging
- ✅ Don't capture sensitive data
- ✅ Monitor key user flows

## Troubleshooting

**Errors not appearing?**
- Check DSN is set in `.env.local`
- Verify DSN is public (https://)
- Check browser console for errors
- Ensure @sentry/nextjs is installed

**Too many errors?**
- Reduce sample rates in `lib/sentry.ts`
- Filter out known errors
- Set up alert rules

**Missing user info?**
- Verify user is logged in
- Check SentryProvider is in layout
- Verify user.id exists

---

For full documentation, see `SENTRY_SETUP.md`
