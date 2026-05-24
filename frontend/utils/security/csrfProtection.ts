/**
 * CSRF Protection Utility
 * Implements CSRF token generation, validation, and middleware
 */

const CSRF_TOKEN_KEY = 'X-CSRF-Token';
const CSRF_COOKIE_NAME = 'csrf_token';

/**
 * Generate a CSRF token
 * Should be called on the server and sent to client
 */
export function generateCsrfToken(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback for older environments
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

/**
 * Get CSRF token from cookie
 */
export function getCsrfTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;

  const name = `${CSRF_COOKIE_NAME}=`;
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(name)) {
      return decodeURIComponent(trimmed.substring(name.length));
    }
  }

  return null;
}

/**
 * Get CSRF token from meta tag
 * Server should render: <meta name="csrf-token" content="token-value" />
 */
export function getCsrfTokenFromMeta(): string | null {
  if (typeof document === 'undefined') return null;

  const meta = document.querySelector('meta[name="csrf-token"]');
  return meta?.getAttribute('content') || null;
}

/**
 * Get CSRF token (tries multiple sources)
 */
export function getCsrfToken(): string | null {
  return getCsrfTokenFromMeta() || getCsrfTokenFromCookie();
}

/**
 * Add CSRF token to request headers
 */
export function addCsrfTokenToHeaders(headers: Record<string, string>): Record<string, string> {
  const token = getCsrfToken();
  if (token) {
    headers[CSRF_TOKEN_KEY] = token;
  }
  return headers;
}

/**
 * Validate CSRF token
 * Server-side validation
 */
export function validateCsrfToken(token: string, sessionToken: string): boolean {
  if (!token || !sessionToken) return false;
  return token === sessionToken;
}

/**
 * Middleware for CSRF protection
 * Add to API routes that modify data (POST, PUT, DELETE, PATCH)
 */
export function csrfProtectionMiddleware(
  method: string,
  csrfToken: string | null,
  sessionCsrfToken: string | null
): { valid: boolean; error?: string } {
  // Only validate for state-changing methods
  const stateChangingMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];

  if (!stateChangingMethods.includes(method.toUpperCase())) {
    return { valid: true };
  }

  if (!csrfToken) {
    return { valid: false, error: 'CSRF token missing' };
  }

  if (!sessionCsrfToken) {
    return { valid: false, error: 'Session CSRF token not found' };
  }

  if (!validateCsrfToken(csrfToken, sessionCsrfToken)) {
    return { valid: false, error: 'CSRF token invalid' };
  }

  return { valid: true };
}
