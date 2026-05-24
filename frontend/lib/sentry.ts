/**
 * Sentry error tracking initialization
 * Captures and reports errors to Sentry for monitoring
 */

export function initSentry() {
  // Only initialize in browser environment
  if (typeof window === 'undefined') return;

  // Check if Sentry is available (installed via npm)
  try {
    const Sentry = require('@sentry/nextjs');

    Sentry.init({
      dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
      debug: process.env.NODE_ENV === 'development',
      integrations: [
        new Sentry.Replay({
          maskAllText: true,
          blockAllMedia: true,
        }),
      ],
      replaySessionSampleRate: 0.1,
      replayOnErrorSampleRate: 1.0,
    });
  } catch (error) {
    // Sentry not installed, skip initialization
    if (process.env.NODE_ENV === 'development') {
      console.warn('Sentry not installed. Install with: npm install @sentry/nextjs');
    }
  }
}

/**
 * Capture exception with Sentry
 */
export function captureException(error: Error, context?: Record<string, any>) {
  try {
    const Sentry = require('@sentry/nextjs');
    Sentry.captureException(error, {
      extra: context,
    });
  } catch {
    // Sentry not available
  }
}

/**
 * Capture message with Sentry
 */
export function captureMessage(message: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info') {
  try {
    const Sentry = require('@sentry/nextjs');
    Sentry.captureMessage(message, level);
  } catch {
    // Sentry not available
  }
}

/**
 * Set user context for Sentry
 */
export function setSentryUser(userId: string, email?: string, name?: string) {
  try {
    const Sentry = require('@sentry/nextjs');
    Sentry.setUser({
      id: userId,
      email,
      username: name,
    });
  } catch {
    // Sentry not available
  }
}

/**
 * Clear user context
 */
export function clearSentryUser() {
  try {
    const Sentry = require('@sentry/nextjs');
    Sentry.setUser(null);
  } catch {
    // Sentry not available
  }
}

/**
 * Add breadcrumb for debugging
 */
export function addSentryBreadcrumb(message: string, category: string, level: 'fatal' | 'error' | 'warning' | 'info' | 'debug' = 'info') {
  try {
    const Sentry = require('@sentry/nextjs');
    Sentry.addBreadcrumb({
      message,
      category,
      level,
      timestamp: Date.now() / 1000,
    });
  } catch {
    // Sentry not available
  }
}
