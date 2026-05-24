# Sentry Error Tracking Setup Guide

## Overview

Sentry is integrated into UniLearn for production error tracking and monitoring. It captures exceptions, API errors, and provides session replay for debugging.

## Installation

### 1. Install Sentry Package

```bash
npm install @sentry/nextjs
```

### 2. Set Environment Variables

Add to `.env.local`:

```env
# Sentry Configuration
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id
```

### 3. Get Your Sentry DSN

1. Go to [sentry.io](https://sentry.io)
2. Create a new account or sign in
3. Create a new project (select "Next.js")
4. Copy your DSN from the project settings
5. Add it to `.env.local`

## Features

### Error Tracking
- Automatic exception capture
- API error monitoring (5xx errors)
- User-friendly error messages in UI
- Detailed error context and breadcrumbs

### Session Replay
- Records user sessions when errors occur
- Helps debug issues in production
- Masked for privacy (no text/media recorded)

### User Context
- Tracks which user encountered the error
- Helps identify user-specific issues
- Automatically set on login/logout

### Breadcrumbs
- Tracks user actions leading to errors
- API calls and their results
- Navigation events
- Custom events

## Usage

### Automatic Tracking

Errors are automatically captured in these scenarios:

1. **Unhandled Exceptions** - Any uncaught error
2. **API Errors** - 5xx server errors from API calls
3. **React Errors** - Caught by Error Boundary component
4. **Network Errors** - Connection failures

### Manual Error Capture

```typescript
import { captureException, captureMessage } from '@/lib/sentry';

// Capture an exception
try {
  // some code
} catch (error) {
  captureException(error as Error, { context: 'user action' });
}

// Capture a message
captureMessage('User completed important action', 'info');
```

### Add Breadcrumbs

```typescript
import { addSentryBreadcrumb } from '@/lib/sentry';

addSentryBreadcrumb('User clicked submit', 'user-action', 'info');
```

### Set User Context

Automatically set when user logs in via `SentryProvider`:

```typescript
// Manual override if needed
import { setSentryUser, clearSentryUser } from '@/lib/sentry';

setSentryUser('user-123', 'user@example.com', 'John Doe');
clearSentryUser(); // On logout
```

## Configuration

### Environment-Specific Settings

**Development:**
- `tracesSampleRate: 1.0` - Capture all traces
- `debug: true` - Show debug messages
- Console logging enabled

**Production:**
- `tracesSampleRate: 0.1` - Capture 10% of traces (reduce noise)
- `debug: false` - No debug messages
- Session replay on errors

### Adjusting Sample Rates

Edit `lib/sentry.ts`:

```typescript
tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
replaySessionSampleRate: 0.1,        // 10% of sessions
replayOnErrorSampleRate: 1.0,        // 100% of error sessions
```

## Monitoring Dashboard

### View Errors

1. Log in to [sentry.io](https://sentry.io)
2. Go to your project
3. Click "Issues" to see all errors
4. Click an issue to see details:
   - Stack trace
   - User information
   - Breadcrumbs
   - Session replay
   - Environment details

### Set Up Alerts

1. Go to "Alerts" in project settings
2. Create alert rules for:
   - New issues
   - Error spike (e.g., 10+ errors in 5 minutes)
   - Specific error types
3. Configure notifications (email, Slack, etc.)

### Performance Monitoring

1. Go to "Performance" tab
2. Monitor:
   - Page load times
   - API response times
   - Transaction duration
   - Slow transactions

## Best Practices

### 1. Use Error Codes

Always use structured error codes from `ErrorCode` enum:

```typescript
import { ErrorCode, logError } from '@/lib/errorHandler';

const error: AppError = {
  code: ErrorCode.FILE_TOO_LARGE,
  message: 'File exceeds 10MB limit',
  statusCode: 413,
};

logError(error, 'file-upload');
```

### 2. Add Context to Errors

Include relevant context when capturing errors:

```typescript
captureException(error, {
  userId: user.id,
  courseId: course.id,
  action: 'submit-assignment',
  timestamp: new Date().toISOString(),
});
```

### 3. Use Breadcrumbs for Debugging

Add breadcrumbs for important user actions:

```typescript
addSentryBreadcrumb('Navigated to course', 'navigation', 'info');
addSentryBreadcrumb('Submitted form', 'user-action', 'info');
addSentryBreadcrumb('API call failed', 'api', 'error');
```

### 4. Don't Capture Sensitive Data

Sentry automatically masks:
- Passwords
- Credit card numbers
- API keys
- Personal information

But avoid manually capturing:
- User passwords
- Authentication tokens
- Private keys
- Sensitive user data

### 5. Monitor Key Flows

Track important user journeys:

```typescript
// Course enrollment
addSentryBreadcrumb('User enrolled in course', 'enrollment', 'info');

// Assignment submission
addSentryBreadcrumb('Assignment submitted', 'submission', 'info');

// Quiz completion
addSentryBreadcrumb('Quiz completed', 'quiz', 'info');
```

## Troubleshooting

### Sentry Not Capturing Errors

1. Check `NEXT_PUBLIC_SENTRY_DSN` is set correctly
2. Verify DSN is public (starts with `https://`)
3. Check browser console for errors
4. Ensure `@sentry/nextjs` is installed

### Too Many Errors Being Captured

Reduce sample rates in `lib/sentry.ts`:

```typescript
tracesSampleRate: 0.05,  // 5% instead of 10%
replaySessionSampleRate: 0.05,
```

### Session Replay Not Working

1. Check `replaySessionSampleRate` is > 0
2. Verify user has JavaScript enabled
3. Check browser console for errors
4. Ensure session is long enough (>5 seconds)

### Missing User Context

1. Verify user is logged in
2. Check `SentryProvider` is in layout
3. Verify `user.id` exists in AuthContext
4. Check browser console for errors

## Integration Points

### Error Handler (`lib/errorHandler.ts`)
- Logs errors to Sentry in production
- Adds breadcrumbs for error tracking
- Captures exceptions with context

### Axios Instance (`utils/api/axiosInstance.ts`)
- Captures 5xx API errors
- Adds breadcrumbs for API calls
- Tracks request/response details

### Sentry Provider (`components/providers/SentryProvider.tsx`)
- Initializes Sentry on app startup
- Sets user context on login/logout
- Manages user identification

### Error Boundary (`components/shared/ErrorBoundary.tsx`)
- Catches React component errors
- Displays user-friendly error UI
- Logs errors to Sentry

## Next Steps

1. Install `@sentry/nextjs` package
2. Create Sentry account at sentry.io
3. Add `NEXT_PUBLIC_SENTRY_DSN` to `.env.local`
4. Test error capture in development
5. Deploy to production
6. Monitor dashboard for errors

## Support

For issues:
1. Check Sentry documentation: https://docs.sentry.io/platforms/javascript/guides/nextjs/
2. Review error details in Sentry dashboard
3. Check browser console for initialization errors
4. Verify environment variables are set

---

**Last Updated:** 2025-05-24
**Status:** Ready for Production
