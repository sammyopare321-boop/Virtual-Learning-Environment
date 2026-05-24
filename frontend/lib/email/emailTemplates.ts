/**
 * Email template utilities
 * Provides reusable email templates and styling
 */

export const emailStyles = {
  container: 'font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;',
  header: 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;',
  headerTitle: 'color: white; margin: 0;',
  body: 'background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;',
  title: 'color: #333; margin-top: 0;',
  text: 'color: #666; line-height: 1.6;',
  button: 'background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;',
  card: 'background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea;',
  cardTitle: 'color: #333; margin: 0; font-weight: bold;',
  cardText: 'color: #666; margin: 10px 0 0 0;',
  divider: 'border: none; border-top: 1px solid #ddd; margin: 30px 0;',
  footer: 'color: #999; font-size: 12px;',
};

/**
 * Base email template
 */
export function baseTemplate(
  title: string,
  content: string,
  buttonText?: string,
  buttonUrl?: string
): string {
  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">UniLearn</h1>
      </div>
      <div style="${emailStyles.body}">
        <h2 style="${emailStyles.title}">${title}</h2>
        ${content}
        ${buttonText && buttonUrl ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${buttonUrl}" style="${emailStyles.button}">${buttonText}</a>
          </div>
        ` : ''}
        <hr style="${emailStyles.divider}">
        <p style="${emailStyles.footer}">Questions? Contact support at support@unilearn.edu</p>
      </div>
    </div>
  `;
}

/**
 * Alert template
 */
export function alertTemplate(
  title: string,
  message: string,
  alertType: 'info' | 'warning' | 'error' | 'success' = 'info'
): string {
  const colors = {
    info: '#3b82f6',
    warning: '#f59e0b',
    error: '#ef4444',
    success: '#10b981',
  };

  const cardStyle = `background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${colors[alertType]};`;

  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">UniLearn</h1>
      </div>
      <div style="${emailStyles.body}">
        <h2 style="${emailStyles.title}">${title}</h2>
        <div style="${cardStyle}">
          <p style="color: #333; margin: 0;">${message}</p>
        </div>
        <hr style="${emailStyles.divider}">
        <p style="${emailStyles.footer}">Questions? Contact support at support@unilearn.edu</p>
      </div>
    </div>
  `;
}

/**
 * Course update template
 */
export function courseUpdateTemplate(
  courseName: string,
  updateTitle: string,
  updateContent: string,
  courseUrl: string
): string {
  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">UniLearn</h1>
      </div>
      <div style="${emailStyles.body}">
        <h2 style="${emailStyles.title}">Update in ${courseName}</h2>
        <p style="${emailStyles.text}">Hi there,</p>
        <div style="${emailStyles.card}">
          <h3 style="${emailStyles.cardTitle}">${updateTitle}</h3>
          <p style="${emailStyles.cardText}">${updateContent}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${courseUrl}" style="${emailStyles.button}">View Course</a>
        </div>
        <hr style="${emailStyles.divider}">
        <p style="${emailStyles.footer}">Questions? Contact support at support@unilearn.edu</p>
      </div>
    </div>
  `;
}

/**
 * Deadline reminder template
 */
export function deadlineReminderTemplate(
  itemName: string,
  courseName: string,
  dueDate: string,
  daysRemaining: number,
  actionUrl: string
): string {
  const urgency = daysRemaining <= 1 ? 'urgent' : daysRemaining <= 3 ? 'warning' : 'info';
  const colors = {
    urgent: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
  };

  const cardStyle = `background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${colors[urgency]};`;

  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">UniLearn</h1>
      </div>
      <div style="${emailStyles.body}">
        <h2 style="${emailStyles.title}">Deadline Reminder</h2>
        <p style="${emailStyles.text}">Hi there,</p>
        <p style="${emailStyles.text}">You have an upcoming deadline in <strong>${courseName}</strong>.</p>
        <div style="${cardStyle}">
          <p style="color: #333; margin: 0;"><strong>${itemName}</strong></p>
          <p style="color: #666; margin: 10px 0 0 0;">Due: ${dueDate}</p>
          <p style="color: #666; margin: 5px 0 0 0;">${daysRemaining} day${daysRemaining !== 1 ? 's' : ''} remaining</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${actionUrl}" style="${emailStyles.button}">Take Action</a>
        </div>
        <hr style="${emailStyles.divider}">
        <p style="${emailStyles.footer}">Questions? Contact support at support@unilearn.edu</p>
      </div>
    </div>
  `;
}

/**
 * Notification digest template
 */
export function notificationDigestTemplate(
  userName: string,
  notifications: Array<{ title: string; description: string; url: string }>
): string {
  const notificationsList = notifications
    .map(
      n => `
        <div style="padding: 15px; background: #f3f4f6; border-radius: 6px; margin-bottom: 10px;">
          <p style="color: #333; margin: 0; font-weight: bold;">${n.title}</p>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">${n.description}</p>
          <a href="${n.url}" style="color: #667eea; text-decoration: none; font-size: 12px; margin-top: 5px; display: inline-block;">View →</a>
        </div>
      `
    )
    .join('');

  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">UniLearn</h1>
      </div>
      <div style="${emailStyles.body}">
        <h2 style="${emailStyles.title}">Your Notifications</h2>
        <p style="${emailStyles.text}">Hi ${userName},</p>
        <p style="${emailStyles.text}">Here's a summary of your recent activity:</p>
        <div style="margin: 20px 0;">
          ${notificationsList}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/notifications" style="${emailStyles.button}">View All Notifications</a>
        </div>
        <hr style="${emailStyles.divider}">
        <p style="${emailStyles.footer}">Questions? Contact support at support@unilearn.edu</p>
      </div>
    </div>
  `;
}

/**
 * System notification template
 */
export function systemNotificationTemplate(
  title: string,
  message: string,
  severity: 'info' | 'warning' | 'error' = 'info'
): string {
  const colors = {
    info: '#3b82f6',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  const cardStyle = `background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid ${colors[severity]};`;

  return `
    <div style="${emailStyles.container}">
      <div style="${emailStyles.header}">
        <h1 style="${emailStyles.headerTitle}">UniLearn</h1>
      </div>
      <div style="${emailStyles.body}">
        <h2 style="${emailStyles.title}">${title}</h2>
        <div style="${cardStyle}">
          <p style="color: #333; margin: 0;">${message}</p>
        </div>
        <hr style="${emailStyles.divider}">
        <p style="${emailStyles.footer}">Questions? Contact support at support@unilearn.edu</p>
      </div>
    </div>
  `;
}
