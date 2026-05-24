/**
 * Client-side Rate Limiter
 * Prevents excessive API calls and user actions
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry> = new Map();

  /**
   * Check if action is allowed
   * @param key Unique identifier for the action (e.g., 'login', 'submit-form')
   * @param maxAttempts Maximum attempts allowed
   * @param windowMs Time window in milliseconds
   */
  isAllowed(key: string, maxAttempts: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const entry = this.limits.get(key);

    // First attempt or window expired
    if (!entry || now > entry.resetTime) {
      this.limits.set(key, { count: 1, resetTime: now + windowMs });
      return true;
    }

    // Within window
    if (entry.count < maxAttempts) {
      entry.count++;
      return true;
    }

    return false;
  }

  /**
   * Get remaining attempts
   */
  getRemaining(key: string, maxAttempts: number = 5): number {
    const entry = this.limits.get(key);
    if (!entry || Date.now() > entry.resetTime) {
      return maxAttempts;
    }
    return Math.max(0, maxAttempts - entry.count);
  }

  /**
   * Get time until reset (in seconds)
   */
  getResetTime(key: string): number {
    const entry = this.limits.get(key);
    if (!entry) return 0;

    const remaining = entry.resetTime - Date.now();
    return Math.max(0, Math.ceil(remaining / 1000));
  }

  /**
   * Reset a specific key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Reset all limits
   */
  resetAll(): void {
    this.limits.clear();
  }

  /**
   * Clean up expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter();

/**
 * Common rate limit presets
 */
export const RATE_LIMITS = {
  LOGIN: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  FORM_SUBMIT: { maxAttempts: 3, windowMs: 60 * 1000 }, // 3 attempts per minute
  API_CALL: { maxAttempts: 10, windowMs: 60 * 1000 }, // 10 calls per minute
  FILE_UPLOAD: { maxAttempts: 5, windowMs: 60 * 1000 }, // 5 uploads per minute
  PASSWORD_RESET: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
};

/**
 * Hook for rate limiting
 */
export function useRateLimit(key: string, maxAttempts: number = 5, windowMs: number = 60000) {
  return {
    isAllowed: () => rateLimiter.isAllowed(key, maxAttempts, windowMs),
    getRemaining: () => rateLimiter.getRemaining(key, maxAttempts),
    getResetTime: () => rateLimiter.getResetTime(key),
    reset: () => rateLimiter.reset(key),
  };
}
