/**
 * Email service using SendGrid
 * Handles all email notifications for the platform
 */

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface SendGridResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send email via SendGrid
 */
export async function sendEmail(options: EmailOptions): Promise<SendGridResponse> {
  try {
    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.warn('SendGrid API key not configured. Email not sent.');
      return {
        success: false,
        error: 'SendGrid not configured',
      };
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: options.to }],
            subject: options.subject,
          },
        ],
        from: {
          email: options.from || process.env.SENDGRID_FROM_EMAIL || 'noreply@unilearn.edu',
          name: 'UniLearn',
        },
        replyTo: options.replyTo ? { email: options.replyTo } : undefined,
        content: [
          {
            type: 'text/html',
            value: options.html,
          },
          ...(options.text ? [{ type: 'text/plain', value: options.text }] : []),
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('SendGrid error:', error);
      return {
        success: false,
        error: `SendGrid error: ${response.status}`,
      };
    }

    const messageId = response.headers.get('x-message-id');
    return {
      success: true,
      messageId: messageId || undefined,
    };
  } catch (error) {
    console.error('Email send error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  resetToken: string,
  userName: string
): Promise<SendGridResponse> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">UniLearn</h1>
      </div>
      <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${userName},</p>
        <p style="color: #666; line-height: 1.6;">We received a request to reset your password. Click the button below to create a new password.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
        </div>
        <p style="color: #999; font-size: 12px; line-height: 1.6;">Or copy this link: <a href="${resetUrl}" style="color: #667eea;">${resetUrl}</a></p>
        <p style="color: #999; font-size: 12px; line-height: 1.6;">This link expires in 24 hours.</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your UniLearn Password',
    html,
    text: `Password Reset Request\n\nHi ${userName},\n\nClick here to reset your password: ${resetUrl}\n\nThis link expires in 24 hours.`,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(
  email: string,
  userName: string,
  role: 'student' | 'teacher' | 'admin'
): Promise<SendGridResponse> {
  const roleMessages = {
    student: 'Start learning with access to courses, assignments, and AI tutoring.',
    teacher: 'Create courses, manage assignments, and track student progress.',
    admin: 'Manage users, courses, and monitor platform analytics.',
  };

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">Welcome to UniLearn</h1>
      </div>
      <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-top: 0;">Welcome, ${userName}!</h2>
        <p style="color: #666; line-height: 1.6;">Your account has been created successfully.</p>
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea;">
          <p style="color: #333; margin: 0; font-weight: bold;">As a ${role}:</p>
          <p style="color: #666; margin: 10px 0 0 0;">${roleMessages[role]}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Go to Dashboard</a>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #999; font-size: 12px;">Questions? Contact support at support@unilearn.edu</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to UniLearn!',
    html,
    text: `Welcome to UniLearn!\n\nYour account has been created. ${roleMessages[role]}\n\nGo to your dashboard: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
  });
}

/**
 * Send course announcement email
 */
export async function sendCourseAnnouncementEmail(
  email: string,
  userName: string,
  courseName: string,
  announcementTitle: string,
  announcementContent: string
): Promise<SendGridResponse> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">UniLearn</h1>
      </div>
      <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-top: 0;">New Announcement in ${courseName}</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${userName},</p>
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #667eea;">
          <h3 style="color: #333; margin-top: 0;">${announcementTitle}</h3>
          <p style="color: #666; line-height: 1.6;">${announcementContent}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Course</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `New Announcement: ${announcementTitle}`,
    html,
    text: `New Announcement in ${courseName}\n\n${announcementTitle}\n\n${announcementContent}`,
  });
}

/**
 * Send assignment reminder email
 */
export async function sendAssignmentReminderEmail(
  email: string,
  userName: string,
  courseName: string,
  assignmentName: string,
  dueDate: string
): Promise<SendGridResponse> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">UniLearn</h1>
      </div>
      <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-top: 0;">Assignment Reminder</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${userName},</p>
        <p style="color: #666; line-height: 1.6;">You have an upcoming assignment in <strong>${courseName}</strong>.</p>
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b;">
          <p style="color: #333; margin: 0;"><strong>${assignmentName}</strong></p>
          <p style="color: #666; margin: 10px 0 0 0;">Due: ${dueDate}</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Submit Assignment</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Reminder: ${assignmentName} due ${dueDate}`,
    html,
    text: `Assignment Reminder\n\n${assignmentName} in ${courseName}\n\nDue: ${dueDate}`,
  });
}

/**
 * Send grade notification email
 */
export async function sendGradeNotificationEmail(
  email: string,
  userName: string,
  courseName: string,
  assignmentName: string,
  grade: number,
  feedback?: string
): Promise<SendGridResponse> {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">UniLearn</h1>
      </div>
      <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-top: 0;">Grade Posted</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${userName},</p>
        <p style="color: #666; line-height: 1.6;">Your grade for <strong>${assignmentName}</strong> in <strong>${courseName}</strong> has been posted.</p>
        <div style="background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #10b981;">
          <p style="color: #333; margin: 0;"><strong>Grade: ${grade}%</strong></p>
          ${feedback ? `<p style="color: #666; margin: 10px 0 0 0;"><strong>Feedback:</strong></p><p style="color: #666; margin: 5px 0 0 0;">${feedback}</p>` : ''}
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.NEXT_PUBLIC_APP_URL}/courses" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">View Grades</a>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: `Grade Posted: ${assignmentName}`,
    html,
    text: `Grade Posted\n\n${assignmentName} in ${courseName}\n\nGrade: ${grade}%\n\n${feedback ? `Feedback: ${feedback}` : ''}`,
  });
}

/**
 * Send email verification email
 */
export async function sendEmailVerificationEmail(
  email: string,
  verificationToken: string,
  userName: string
): Promise<SendGridResponse> {
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${verificationToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0;">UniLearn</h1>
      </div>
      <div style="background: #f8f9fa; padding: 40px 20px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #333; margin-top: 0;">Verify Your Email</h2>
        <p style="color: #666; line-height: 1.6;">Hi ${userName},</p>
        <p style="color: #666; line-height: 1.6;">Please verify your email address to complete your registration.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Verify Email</a>
        </div>
        <p style="color: #999; font-size: 12px; line-height: 1.6;">Or copy this link: <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a></p>
        <p style="color: #999; font-size: 12px; line-height: 1.6;">This link expires in 24 hours.</p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your UniLearn Email',
    html,
    text: `Verify Your Email\n\nClick here to verify: ${verificationUrl}\n\nThis link expires in 24 hours.`,
  });
}
