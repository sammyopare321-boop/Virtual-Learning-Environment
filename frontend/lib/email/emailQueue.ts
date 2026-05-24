/**
 * Email queue for handling bulk emails
 * Prevents rate limiting and ensures reliable delivery
 */

import { sendEmail, EmailOptions, SendGridResponse } from './emailService';

export interface QueuedEmail {
  id: string;
  options: EmailOptions;
  status: 'pending' | 'sent' | 'failed';
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  sentAt?: Date;
  error?: string;
}

class EmailQueue {
  private queue: Map<string, QueuedEmail> = new Map();
  private processing = false;
  private batchSize = 10;
  private delayMs = 1000; // 1 second between batches

  /**
   * Add email to queue
   */
  addToQueue(options: EmailOptions, maxAttempts = 3): string {
    const id = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const queuedEmail: QueuedEmail = {
      id,
      options,
      status: 'pending',
      attempts: 0,
      maxAttempts,
      createdAt: new Date(),
    };
    this.queue.set(id, queuedEmail);
    this.processQueue();
    return id;
  }

  /**
   * Get queue status
   */
  getStatus(id: string): QueuedEmail | undefined {
    return this.queue.get(id);
  }

  /**
   * Get queue stats
   */
  getStats() {
    const emails = Array.from(this.queue.values());
    return {
      total: emails.length,
      pending: emails.filter(e => e.status === 'pending').length,
      sent: emails.filter(e => e.status === 'sent').length,
      failed: emails.filter(e => e.status === 'failed').length,
    };
  }

  /**
   * Process queue
   */
  private async processQueue() {
    if (this.processing) return;
    this.processing = true;

    try {
      while (true) {
        const pending = Array.from(this.queue.values()).filter(e => e.status === 'pending');
        if (pending.length === 0) break;

        const batch = pending.slice(0, this.batchSize);
        await Promise.all(batch.map(email => this.sendEmail(email)));
        await this.delay(this.delayMs);
      }
    } finally {
      this.processing = false;
    }
  }

  /**
   * Send individual email
   */
  private async sendEmail(queuedEmail: QueuedEmail) {
    try {
      queuedEmail.attempts++;
      const result = await sendEmail(queuedEmail.options);

      if (result.success) {
        queuedEmail.status = 'sent';
        queuedEmail.sentAt = new Date();
      } else {
        if (queuedEmail.attempts < queuedEmail.maxAttempts) {
          queuedEmail.status = 'pending';
        } else {
          queuedEmail.status = 'failed';
          queuedEmail.error = result.error;
        }
      }
    } catch (error) {
      if (queuedEmail.attempts < queuedEmail.maxAttempts) {
        queuedEmail.status = 'pending';
      } else {
        queuedEmail.status = 'failed';
        queuedEmail.error = error instanceof Error ? error.message : 'Unknown error';
      }
    }
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Clear old emails from queue
   */
  clearOldEmails(olderThanHours = 24) {
    const cutoff = new Date(Date.now() - olderThanHours * 60 * 60 * 1000);
    for (const [id, email] of this.queue.entries()) {
      if (email.createdAt < cutoff && (email.status === 'sent' || email.status === 'failed')) {
        this.queue.delete(id);
      }
    }
  }
}

// Singleton instance
export const emailQueue = new EmailQueue();
