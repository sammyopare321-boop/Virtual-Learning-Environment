module.exports = {
  RATE_LIMITS: {
    GLOBAL: {
      WINDOW_MS: 15 * 60 * 1000,
      MAX: 300
    },
    AUTH: {
      WINDOW_MS: 15 * 60 * 1000,
      MAX: 50
    },
    UNAUTHORIZED: {
      WINDOW_MS: 15 * 60 * 1000,
      MAX: 10
    },
    LOGIN: {
      WINDOW_MS: 15 * 60 * 1000,
      MAX: 10
    }
  },
  TIMEOUTS: {
    GLOBAL_MS: 30000,
    AI_MS: 120000  // 2 minutes for AI provider fallback chain
  }
};
