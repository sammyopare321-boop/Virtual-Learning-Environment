const logger = require('../utils/logger');

/**
 * Middleware to log security-related events (403, 401, suspicious activity)
 */
const securityLogger = (req, res, next) => {
  // Store original res.json to intercept responses
  const originalJson = res.json.bind(res);

  res.json = function (data) {
    // Log 403 (Forbidden) responses - unauthorized access attempts
    if (res.statusCode === 403) {
      logger.warn('Unauthorized access attempt', {
        ip: req.ip || req.connection.remoteAddress,
        userId: req.user?._id,
        userRole: req.user?.role,
        method: req.method,
        path: req.originalUrl,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
      });
    }

    // Log 401 (Unauthorized) responses - authentication failures
    if (res.statusCode === 401) {
      logger.warn('Authentication failure', {
        ip: req.ip || req.connection.remoteAddress,
        method: req.method,
        path: req.originalUrl,
        userAgent: req.get('user-agent'),
        timestamp: new Date().toISOString()
      });
    }

    return originalJson(data);
  };

  next();
};

module.exports = securityLogger;
