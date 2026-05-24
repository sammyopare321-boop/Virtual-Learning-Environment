/**
 * File validation utility
 * Validates file type, size, and other constraints
 */

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
  allowedExtensions?: string[]; // file extensions
}

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10MB

const ALLOWED_TYPES = {
  document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime'],
  audio: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  spreadsheet: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
};

/**
 * Validate file
 */
export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): FileValidationResult {
  const maxSize = options.maxSize || DEFAULT_MAX_SIZE;
  const allowedTypes = options.allowedTypes || [];
  const allowedExtensions = options.allowedExtensions || [];

  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size exceeds maximum limit of ${formatBytes(maxSize)}`,
    };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type "${file.type}" is not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = getFileExtension(file.name);
    if (!allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: `File extension ".${extension}" is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`,
      };
    }
  }

  return { valid: true };
}

/**
 * Validate multiple files
 */
export function validateFiles(
  files: File[],
  options: FileValidationOptions = {}
): FileValidationResult[] {
  return files.map(file => validateFile(file, options));
}

/**
 * Get allowed types for a category
 */
export function getAllowedTypesForCategory(category: keyof typeof ALLOWED_TYPES): string[] {
  return ALLOWED_TYPES[category] || [];
}

/**
 * Get file extension
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Format bytes to human-readable format
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Validate assignment submission file
 */
export function validateAssignmentFile(file: File): FileValidationResult {
  return validateFile(file, {
    maxSize: 50 * 1024 * 1024, // 50MB for assignments
    allowedTypes: [
      ...ALLOWED_TYPES.document,
      ...ALLOWED_TYPES.image,
      ...ALLOWED_TYPES.video,
      ...ALLOWED_TYPES.spreadsheet,
      'text/plain',
      'application/zip',
    ],
  });
}

/**
 * Validate profile picture
 */
export function validateProfilePicture(file: File): FileValidationResult {
  return validateFile(file, {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ALLOWED_TYPES.image,
  });
}

/**
 * Validate course material
 */
export function validateCourseMaterial(file: File): FileValidationResult {
  return validateFile(file, {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedTypes: [
      ...ALLOWED_TYPES.document,
      ...ALLOWED_TYPES.image,
      ...ALLOWED_TYPES.video,
      ...ALLOWED_TYPES.spreadsheet,
      'text/plain',
      'application/zip',
    ],
  });
}
