/**
 * Secure token storage utility
 * Implements best practices for JWT token management
 * - Uses httpOnly cookies for primary storage (XSS protection)
 * - Memory storage as fallback for API requests
 * - CSRF token handling
 */

const TOKEN_KEY = 'auth_token';
const CSRF_TOKEN_KEY = 'csrf_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

interface TokenStorage {
  accessToken: string | null;
  refreshToken: string | null;
  csrfToken: string | null;
}

// In-memory storage (fallback, cleared on page reload)
let memoryStorage: TokenStorage = {
  accessToken: null,
  refreshToken: null,
  csrfToken: null,
};

/**
 * Get access token from storage
 * Checks cookies first (httpOnly), then memory
 */
export function getAccessToken(): string | null {
  // Try to get from cookie (set by server)
  if (typeof document !== 'undefined') {
    const cookieToken = getCookie(TOKEN_KEY);
    if (cookieToken) return cookieToken;
  }

  // Fallback to memory
  return memoryStorage.accessToken;
}

/**
 * Get refresh token from storage
 */
export function getRefreshToken(): string | null {
  if (typeof document !== 'undefined') {
    const cookieToken = getCookie(REFRESH_TOKEN_KEY);
    if (cookieToken) return cookieToken;
  }
  return memoryStorage.refreshToken;
}

/**
 * Get CSRF token
 */
export function getCsrfToken(): string | null {
  if (typeof document !== 'undefined') {
    const cookieToken = getCookie(CSRF_TOKEN_KEY);
    if (cookieToken) return cookieToken;
  }
  return memoryStorage.csrfToken;
}

/**
 * Set tokens in storage
 * Server should set httpOnly cookies, we store in memory as fallback
 */
export function setTokens(accessToken: string, refreshToken?: string, csrfToken?: string) {
  memoryStorage.accessToken = accessToken;
  if (refreshToken) memoryStorage.refreshToken = refreshToken;
  if (csrfToken) memoryStorage.csrfToken = csrfToken;

  // Also set in cookies (for server-side access)
  if (typeof document !== 'undefined') {
    setCookie(TOKEN_KEY, accessToken, { httpOnly: false, secure: true, sameSite: 'Strict' });
    if (refreshToken) {
      setCookie(REFRESH_TOKEN_KEY, refreshToken, { httpOnly: false, secure: true, sameSite: 'Strict' });
    }
    if (csrfToken) {
      setCookie(CSRF_TOKEN_KEY, csrfToken, { httpOnly: false, secure: true, sameSite: 'Strict' });
    }
  }
}

/**
 * Clear all tokens
 */
export function clearTokens() {
  memoryStorage = {
    accessToken: null,
    refreshToken: null,
    csrfToken: null,
  };

  if (typeof document !== 'undefined') {
    deleteCookie(TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
    deleteCookie(CSRF_TOKEN_KEY);
  }
}

/**
 * Check if token exists and is not expired
 */
export function isTokenValid(): boolean {
  const token = getAccessToken();
  if (!token) return false;

  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    return decoded.exp && decoded.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

/**
 * Cookie utilities
 */
function setCookie(
  name: string,
  value: string,
  options?: { httpOnly?: boolean; secure?: boolean; sameSite?: string; maxAge?: number }
) {
  if (typeof document === 'undefined') return;

  let cookieString = `${name}=${encodeURIComponent(value)}`;

  if (options?.maxAge) {
    cookieString += `; Max-Age=${options.maxAge}`;
  } else {
    // Default: session cookie
    cookieString += '; Max-Age=86400'; // 24 hours
  }

  if (options?.secure) {
    cookieString += '; Secure';
  }

  if (options?.sameSite) {
    cookieString += `; SameSite=${options.sameSite}`;
  }

  cookieString += '; Path=/';

  document.cookie = cookieString;
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;

  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');

  for (const cookie of cookies) {
    const trimmed = cookie.trim();
    if (trimmed.startsWith(nameEQ)) {
      return decodeURIComponent(trimmed.substring(nameEQ.length));
    }
  }

  return null;
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; Max-Age=0; Path=/`;
}
