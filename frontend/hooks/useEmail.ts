/**
 * Hook for sending emails from components
 * Provides convenient methods for common email scenarios
 */

import { useState } from 'react';
import { emailQueue } from '@/lib/email/emailQueue';
import {
  sendPasswordResetEmail,
  sendWelcomeEmail,
  sendCourseAnnouncementEmail,
  sendAssignmentReminderEmail,
  sendGradeNotificationEmail,
  sendEmailVerificationEmail,
  SendGridResponse,
} from '@/lib/email/emailService';

export interface UseEmailOptions {
  onSuccess?: (messageId?: string) => void;
  onError?: (error: string) => void;
}

export function useEmail(options?: UseEmailOptions) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleResponse = (response: SendGridResponse) => {
    if (response.success) {
      options?.onSuccess?.(response.messageId);
      setError(null);
    } else {
      const errorMsg = response.error || 'Failed to send email';
      setError(errorMsg);
      options?.onError?.(errorMsg);
    }
  };

  return {
    loading,
    error,
    sendPasswordReset: async (email: string, resetToken: string, userName: string) => {
      setLoading(true);
      try {
        const response = await sendPasswordResetEmail(email, resetToken, userName);
        handleResponse(response);
        return response;
      } finally {
        setLoading(false);
      }
    },
    sendWelcome: async (email: string, userName: string, role: 'student' | 'teacher' | 'admin') => {
      setLoading(true);
      try {
        const response = await sendWelcomeEmail(email, userName, role);
        handleResponse(response);
        return response;
      } finally {
        setLoading(false);
      }
    },
    sendCourseAnnouncement: async (
      email: string,
      userName: string,
      courseName: string,
      announcementTitle: string,
      announcementContent: string
    ) => {
      setLoading(true);
      try {
        const response = await sendCourseAnnouncementEmail(
          email,
          userName,
          courseName,
          announcementTitle,
          announcementContent
        );
        handleResponse(response);
        return response;
      } finally {
        setLoading(false);
      }
    },
    sendAssignmentReminder: async (
      email: string,
      userName: string,
      courseName: string,
      assignmentName: string,
      dueDate: string
    ) => {
      setLoading(true);
      try {
        const response = await sendAssignmentReminderEmail(
          email,
          userName,
          courseName,
          assignmentName,
          dueDate
        );
        handleResponse(response);
        return response;
      } finally {
        setLoading(false);
      }
    },
    sendGradeNotification: async (
      email: string,
      userName: string,
      courseName: string,
      assignmentName: string,
      grade: number,
      feedback?: string
    ) => {
      setLoading(true);
      try {
        const response = await sendGradeNotificationEmail(
          email,
          userName,
          courseName,
          assignmentName,
          grade,
          feedback
        );
        handleResponse(response);
        return response;
      } finally {
        setLoading(false);
      }
    },
    sendEmailVerification: async (email: string, verificationToken: string, userName: string) => {
      setLoading(true);
      try {
        const response = await sendEmailVerificationEmail(email, verificationToken, userName);
        handleResponse(response);
        return response;
      } finally {
        setLoading(false);
      }
    },
    queueEmail: (options: any, maxAttempts?: number) => {
      return emailQueue.addToQueue(options, maxAttempts);
    },
    getQueueStatus: (id: string) => {
      return emailQueue.getStatus(id);
    },
    getQueueStats: () => {
      return emailQueue.getStats();
    },
  };
}
