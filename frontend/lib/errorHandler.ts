/**
 * Centralized error handling utility
 * Provides structured error codes, logging, and user-friendly messages
 */

export enum ErrorCode {
  // Auth errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // File errors
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE = 'INVALID_FILE_TYPE',
  FILE_UPLOAD_FAILED = 'FILE_UPLOAD_FAILED',

  // Server errors
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  NOT_FOUND = 'NOT_FOUND',

  // Network errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT = 'TIMEOUT',

  // Generic
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: string[];
  statusCode?: number;
  originalError?: Error;
}

/**
 * User-friendly error messages
 */
const ERROR_MESSAGES: Record<ErrorCode, string> = {
  [ErrorCode.INVALID_CREDENTIALS]: 'Invalid email or password. Please try again.',
  [ErrorCode.TOKEN_EXPIRED]: 'Your session has expired. Please log in again.',
  [ErrorCode.UNAUTHORIZED]: 'You are not authenticated. Please log in.',
  [ErrorCode.FORBIDDEN]: 'You do not have permission to access this resource.',
  [ErrorCode.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorCode.INVALID_INPUT]: 'Invalid input provided.',
  [ErrorCode.MISSING_REQUIRED_FIELD]: 'Please fill in all required fields.',
  [ErrorCode.FILE_TOO_LARGE]: 'File size exceeds the maximum limit (10MB).',
  [ErrorCode.INVALID_FILE_TYPE]: 'File type is not supported.',
  [ErrorCode.FILE_UPLOAD_FAILED]: 'Failed to upload file. Please try again.',
  [ErrorCode.INTERNAL_SERVER_ERROR]: 'An error occurred on the server. Please try again later.',
  [ErrorCode.SERVICE_UNAVAILABLE]: 'Service is temporarily unavailable. Please try again later.',
  [ErrorCode.NOT_FOUND]: 'The requested resource was not found.',
  [ErrorCode.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ErrorCode.TIMEOUT]: 'Request timed out. Please try again.',
  [ErrorCode.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
};

/**
 * Parse error from various sources and return structured AppError
 */
export function parseError(error: unknown): AppError {
  // Axios error
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as any;
    const status = axiosError.response?.status;
    const data = axiosError.response?.data;

    let code = ErrorCode.UNKNOWN_ERROR;
    if (status === 401) code = ErrorCode.UNAUTHORIZED;
    else if (status === 403) code = ErrorCode.FORBIDDEN;
    else if (status === 404) code = ErrorCode.NOT_FOUND;
    else if (status === 422) code = ErrorCode.VALIDATION_ERROR;
    else if (status >= 500) code = ErrorCode.INTERNAL_SERVER_ERROR;

    return {
      code,
      message: data?.message || ERROR_MESSAGES[code],
      details: data?.details,
      statusCode: status,
      originalError: error as unknown as Error,
    };
  }

  // Standard Error
  if (error instanceof Error) {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message || ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
      originalError: error,
    };
  }

  // String error
  if (typeof error === 'string') {
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error,
    };
  }

  return {
    code: ErrorCode.UNKNOWN_ERROR,
    message: ERROR_MESSAGES[ErrorCode.UNKNOWN_ERROR],
  };
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  const appError = parseError(error);
  return appError.message;
}

/**
 * Log error to console in development, to Sentry in production
 */
export function logError(error: AppError, context?: string) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    code: error.code,
    message: error.message,
    details: error.details,
    context,
    originalError: error.originalError?.message,
  };

  if (process.env.NODE_ENV === 'development') {
    console.error('[AppError]', logEntry);
  } else {
    // Send to Sentry in production
    try {
      const { captureException, addSentryBreadcrumb } = require('@/lib/sentry');
      if (error.originalError) {
        captureException(error.originalError, logEntry);
      }
      addSentryBreadcrumb(error.message, error.code, 'error');
    } catch {
      // Fallback if Sentry not available
      console.error('[AppError]', logEntry);
    }
  }
}
