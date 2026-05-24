# Email Notifications Setup Guide

## Overview

UniLearn uses SendGrid for reliable email delivery. The system supports password resets, welcome emails, course announcements, assignment reminders, grade notifications, and more.

## Installation

### 1. Install SendGrid Package

```bash
npm install @sendgrid/mail
```

### 2. Set Environment Variables

Add to `.env.local`:

```env
# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=noreply@unilearn.edu

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Get SendGrid API Key

1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account or sign in
3. Go to Settings → API Keys
4. Create new API key (Full Access)
5. Copy key to `.env.local`

### 4. Verify Sender Email

1. Go to Settings → Sender Authentication
2. Verify your domain or single sender email
3. Use verified email in `SENDGRID_FROM_EMAIL`

## Features

### Email Types

1. **Password Reset** - Secure password recovery
2. **Welcome Email** - New user onboarding
3. **Course Announcements** - Course updates
4. **Assignment Reminders** - Deadline notifications
5. **Grade Notifications** - Grade posting alerts
6. **Email Verification** - Account verification

### Email Queue

- Handles bulk emails without rate limiting
- Automatic retry on failure (up to 3 attempts)
- Batch processing with delays
- Queue status tracking

### Templates

- Professional HTML templates
- Responsive design
- Consistent branding
- Customizable content

## Usage

### Send Password Reset Email

```typescript
import { sendPasswordResetEmail } from '@/lib/email/emailService';

const result = await sendPasswordResetEmail(
  'user@example.com',
  'reset-token-123',
  'John Doe'
);

if (result.success) {
  console.log('Email sent:', result.messageId);
} else {
  console.error('Email failed:', result.error);
}
```

### Send Welcome Email

```typescript
import { sendWelcomeEmail } from '@/lib/email/emailService';

const result = await sendWelcomeEmail(
  'user@example.com',
  'John Doe',
  'student' // or 'teacher', 'admin'
);
```

### Send Course Announcement

```typescript
import { sendCourseAnnouncementEmail } from '@/lib/email/emailService';

const result = await sendCourseAnnouncementEmail(
  'user@example.com',
  'John Doe',
  'Introduction to React',
  'New Module Released',
  'Module 5: Advanced Hooks is now available'
);
```

### Send Assignment Reminder

```typescript
import { sendAssignmentReminderEmail } from '@/lib/email/emailService';

const result = await sendAssignmentReminderEmail(
  'user@example.com',
  'John Doe',
  'Introduction to React',
  'Build a Todo App',
  'May 30, 2025'
);
```

### Send Grade Notification

```typescript
import { sendGradeNotificationEmail } from '@/lib/email/emailService';

const result = await sendGradeNotificationEmail(
  'user@example.com',
  'John Doe',
  'Introduction to React',
  'Build a Todo App',
  95,
  'Excellent work! Great implementation.'
);
```

### Send Email Verification

```typescript
import { sendEmailVerificationEmail } from '@/lib/email/emailService';

const result = await sendEmailVerificationEmail(
  'user@example.com',
  'verification-token-123',
  'John Doe'
);
```

### Use Email Hook in Components

```typescript
'use client';

import { useEmail } from '@/hooks/useEmail';

export function MyComponent() {
  const { sendWelcome, loading, error } = useEmail({
    onSuccess: (messageId) => console.log('Email sent:', messageId),
    onError: (error) => console.error('Email failed:', error),
  });

  const handleSendWelcome = async () => {
    await sendWelcome('user@example.com', 'John Doe', 'student');
  };

  return (
    <div>
      <button onClick={handleSendWelcome} disabled={loading}>
        {loading ? 'Sending...' : 'Send Welcome Email'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

### Queue Emails for Bulk Sending

```typescript
import { emailQueue } from '@/lib/email/emailQueue';
import { sendEmail } from '@/lib/email/emailService';

// Add multiple emails to queue
const ids = [];
for (const user of users) {
  const id = emailQueue.addToQueue({
    to: user.email,
    subject: 'Course Announcement',
    html: '<p>New announcement</p>',
  });
  ids.push(id);
}

// Check queue status
const stats = emailQueue.getStats();
console.log('Queue stats:', stats);

// Check individual email status
const status = emailQueue.getStatus(ids[0]);
console.log('Email status:', status);
```

### Use Custom Templates

```typescript
import { baseTemplate, alertTemplate, courseUpdateTemplate } from '@/lib/email/emailTemplates';
import { sendEmail } from '@/lib/email/emailService';

// Base template
const html = baseTemplate(
  'Welcome to UniLearn',
  '<p>Your account is ready to use.</p>',
  'Get Started',
  'https://unilearn.edu/dashboard'
);

await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to UniLearn',
  html,
});

// Alert template
const alertHtml = alertTemplate(
  'System Maintenance',
  'We will be performing maintenance on May 30 from 2-4 AM UTC.',
  'warning'
);

// Course update template
const courseHtml = courseUpdateTemplate(
  'Introduction to React',
  'New Module Released',
  'Module 5: Advanced Hooks is now available',
  'https://unilearn.edu/courses/react'
);
```

## Integration Points

### Authentication Flow

1. **Registration** - Send welcome email
2. **Email Verification** - Send verification link
3. **Password Reset** - Send reset link

### Course Management

1. **Course Announcement** - Notify enrolled students
2. **Assignment Created** - Send reminder
3. **Assignment Due Soon** - Send reminder
4. **Grade Posted** - Send notification

### Admin Features

1. **Bulk User Import** - Send welcome emails
2. **Course Announcement** - Send to all students
3. **System Alerts** - Send to admins

## Configuration

### Email Frequency

Control how often users receive emails:

```typescript
// In user preferences
const emailPreferences = {
  announcements: true,
  reminders: true,
  grades: true,
  digest: 'daily', // 'immediate', 'daily', 'weekly', 'never'
};
```

### Batch Settings

Edit `lib/email/emailQueue.ts`:

```typescript
private batchSize = 10;      // Emails per batch
private delayMs = 1000;      // Delay between batches (ms)
```

### Retry Settings

```typescript
// In useEmail hook
emailQueue.addToQueue(options, 3); // Max 3 attempts
```

## Monitoring

### SendGrid Dashboard

1. Log in to [sendgrid.com](https://sendgrid.com)
2. Go to Mail Send → Overview
3. Monitor:
   - Delivery rate
   - Bounce rate
   - Spam reports
   - Unsubscribe rate

### Email Logs

Track sent emails:

```typescript
// Check queue stats
const stats = emailQueue.getStats();
console.log('Pending:', stats.pending);
console.log('Sent:', stats.sent);
console.log('Failed:', stats.failed);

// Check individual email
const email = emailQueue.getStatus(emailId);
console.log('Status:', email?.status);
console.log('Attempts:', email?.attempts);
```

## Best Practices

### 1. Use Verified Sender Email

- Always use verified email in `SENDGRID_FROM_EMAIL`
- Improves deliverability
- Prevents emails going to spam

### 2. Personalize Emails

- Include user name
- Reference specific courses/assignments
- Use user's preferred language

### 3. Provide Unsubscribe Option

- Include unsubscribe link in footer
- Respect user preferences
- Comply with regulations (CAN-SPAM, GDPR)

### 4. Test Before Sending

- Test templates in development
- Check rendering in different email clients
- Verify links work correctly

### 5. Monitor Deliverability

- Check bounce rates
- Monitor spam reports
- Review unsubscribe rates
- Adjust sending patterns if needed

### 6. Handle Failures Gracefully

- Retry failed emails
- Log errors for debugging
- Alert admins on critical failures
- Provide user feedback

## Troubleshooting

### Emails Not Sending

1. Check `SENDGRID_API_KEY` is set
2. Verify API key is valid
3. Check `SENDGRID_FROM_EMAIL` is verified
4. Check email address is valid
5. Review SendGrid dashboard for errors

### Emails Going to Spam

1. Verify sender email domain
2. Add SPF/DKIM records
3. Use consistent sender name
4. Avoid spam trigger words
5. Monitor spam reports

### Rate Limiting

1. Reduce `batchSize` in emailQueue
2. Increase `delayMs` between batches
3. Use SendGrid's rate limiting settings
4. Spread sends over time

### Template Issues

1. Check HTML is valid
2. Test in email client
3. Verify links are correct
4. Check images load properly
5. Test on mobile devices

## Security

### API Key Protection

- Never commit API key to git
- Use `.env.local` for local development
- Use environment variables in production
- Rotate keys regularly

### Email Content

- Don't include sensitive data
- Use secure links for sensitive actions
- Verify user email before sending
- Log email sends for audit trail

### Compliance

- Include unsubscribe option
- Respect user preferences
- Comply with CAN-SPAM
- Comply with GDPR
- Comply with local regulations

## Next Steps

1. Install @sendgrid/mail package
2. Create SendGrid account
3. Get API key and verify sender
4. Add environment variables
5. Test email sending
6. Integrate with auth flow
7. Set up course notifications
8. Monitor deliverability

## Support

For issues:
1. Check SendGrid documentation: https://docs.sendgrid.com/
2. Review SendGrid dashboard for errors
3. Check email logs in queue
4. Verify environment variables
5. Test with simple email first

---

**Last Updated:** 2025-05-24
**Status:** Ready for Production
