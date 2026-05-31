import { getAuthToken, setAuthToken } from '@/utils/api/axiosInstance';

/** Cookie on the frontend domain so Edge middleware can read the JWT. */
export const RELAY_COOKIE = 'token';

export function getRelayToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${RELAY_COOKIE}=([^;]*)`));
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

export function setRelayCookie(token: string, maxAgeSeconds?: number) {
  if (typeof document === 'undefined') return;
  const value = encodeURIComponent(token);
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  if (maxAgeSeconds != null) {
    document.cookie = `${RELAY_COOKIE}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secureFlag}`;
  } else {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${RELAY_COOKIE}=${value}; path=/; expires=${expires}; SameSite=Lax${secureFlag}`;
  }
}

export function clearRelayCookie() {
  if (typeof document === 'undefined') return;
  const isSecure = window.location.protocol === 'https:';
  const secureFlag = isSecure ? '; Secure' : '';
  document.cookie = `${RELAY_COOKIE}=; path=/; max-age=0; SameSite=Lax${secureFlag}`;
}

/** Bearer in memory, or relay cookie after refresh / impersonation redirect. */
export function getSessionToken(): string | null {
  return getAuthToken() || getRelayToken();
}

export function applySessionToken(token: string, maxAgeSeconds?: number) {
  setAuthToken(token);
  setRelayCookie(token, maxAgeSeconds);
}

export function clearSession() {
  setAuthToken(null);
  clearRelayCookie();
}
