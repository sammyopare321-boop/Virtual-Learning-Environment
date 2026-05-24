# Email Notifications Quick Reference

## Setup

```bash
npm install @sendgrid/mail
```

Add to `.env.local`:
```env
SENDGRID_API_KEY=your_key_here
SENDGRID_FROM_EMAIL=noreply@unilearn.edu
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Common Usage

### Send Password Reset

```typescript
import { sendPasswordResetEmail } from '@/lib/email/emailService';

await sendPasswordResetEmail('user@example.com', 'token-123', 'John');
```

### Send Welcome Email

```typescript
import { sendWelcomeEmail } from '@/lib/email/emailService';

await sendWelcomeEmail('user@example.com', 'John', 'student');
```

### Send Course Announcement

```typescript
import { sendCourseAnnouncementEmail } from '@/lib/email/emailService';

await sendCourseAnnouncementEmail(
  'user@example.com',
  'John',
  'React 101',
  'New Module',
  'Module 5 is now available'
);
```

### Send Assignment Reminder

```typescript
import { sendAssignmentReminderEmail } from '@/lib/email/emailService';

await sendAssignmentReminderEmail(
  'user@example.com',
  'John',
  'React 101',
  'Build Todo App',
  'May 30, 2025'
);
```

### Send Grade Notification

```typescript
import { sendGradeNotificationEmail } from '@/lib/email/emailService';

await sendGradeNotificationEmail(
  'user@example.com',
  'John',
  'React 101',
  'Build Todo App',
  95,
  'Great work!'
);
```

### Send Email Verification

```typescript
import { sendEmailVerificationEmail } from '@/lib/email/emailService';

await sendEmailVerificationEmail('user@example.com', 'token-123', 'John');
```

## In Components

```typescript
'use client';

import { useEmail } from '@/hooks/useEmail';

export function MyComponent() {
  const { sendWelcome, loading, error } = useEmail();

  return (
    <button onClick={() => sendWelcome('user@example.com', 'John', 'student')}>
      Send Welcome
    </button>
  );
}
```

## Queue Emails

```typescript
import { emailQueue } from '@/lib/email/emailQueue';

// Add to queue
const id = emailQueue.addToQueue({
  to: 'user@example.com',
  subject: 'Hello',
  html: '<p>Content</p>',
});

// Check status
const status = emailQueue.getStatus(id);

// Get stats
const stats = emailQueue.getStats();
```

## Custom Templates

```typescript
import { baseTemplate, alertTemplate } from '@/lib/email/emailTemplates';
import { sendEmail } from '@/lib/email/emailService';

const html = baseTemplate(
  'Title',
  '<p>Content</p>',
  'Button Text',
  'https://url.com'
);

await sendEmail({
  to: 'user@example.com',
  subject: 'Subject',
  html,
});
```

## Email Types

| Type | Function | Use Case |
|------|----------|----------|
| Password Reset | `sendPasswordResetEmail()` | Account recovery |
| Welcome | `sendWelcomeEmail()` | New user onboarding |
| Announcement | `sendCourseAnnouncementEmail()` | Course updates |
| Reminder | `sendAssignmentReminderEmail()` | Deadline alerts |
| Grade | `sendGradeNotificationEmail()` | Grade posting |
| Verification | `sendEmailVerificationEmail()` | Email confirmation |

## Response Format

```typescript
{
  success: boolean;
  messageId?: string;  // If successful
  error?: string;      // If failed
}
```

## Tips

- ✅ Always verify sender email
- ✅ Test templates before sending
- ✅ Use queue for bulk emails
- ✅ Check SendGrid dashboard
- ✅ Monitor delivery rates
- ✅ Handle failures gracefully

## Troubleshooting

**Emails not sending?**
- Check API key is set
- Verify sender email
- Check email address is valid

**Going to spam?**
- Verify sender domain
- Add SPF/DKIM records
- Avoid spam words

**Rate limiting?**
- Reduce batch size
- Increase delay between batches
- Spread sends over time

---

For full documentation, see `EMAIL_SETUP.md`
