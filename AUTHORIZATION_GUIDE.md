# Authorization & Access Control Guide

## Overview

This application uses role-based access control (RBAC) with three user roles:
- **Student**: Basic access to courses, assignments, and learning materials
- **Teacher**: Can create courses, grade assignments, and use AI tools
- **Admin**: Full system access including user management

## How Authorization Works

### 1. Authentication (Who are you?)
- Users log in with email/password or Google OAuth
- JWT token is issued and stored in:
  - HttpOnly cookie (primary, secure)
  - Authorization header (fallback for cross-origin)
- Token contains: `{ id, role, exp }`

### 2. Authorization (What can you do?)
- Every protected route checks the user's role
- Middleware: `protect` (authentication) + `authorize(roles)` (authorization)
- Example: `router.post('/quiz-questions', protect, authorize('teacher', 'admin'), handler)`

## Role Permissions

### Student Role
**Can Access:**
- `/dashboard` - Student dashboard
- `/student/*` - Student-specific routes
- `/courses/:id` - View enrolled courses
- `/assignments/:id` - Submit assignments
- `/quizzes/:id` - Take quizzes
- AI tutoring endpoints (learning assistance)

**Cannot Access:**
- `/teacher/*` - Teacher dashboard and tools
- `/admin/*` - Admin panel
- AI content generation endpoints
- Grading and plagiarism tools

### Teacher Role
**Can Access:**
- Everything students can access
- `/teacher/*` - Teacher dashboard
- `/teacher/ai` - AI content generation tools
- Course creation and management
- Assignment and quiz creation
- Grading and feedback tools
- Student analytics and reports

**Cannot Access:**
- `/admin/*` - Admin panel
- User role management
- System-wide analytics

### Admin Role
**Can Access:**
- Everything (full system access)
- `/admin/*` - Admin panel
- User management (create, update, delete, change roles)
- Course management (reassign teachers, approve courses)
- System analytics and logs
- Impersonation (view system as another user)

## Frontend Protection

### Route Guards
Each role-specific section has a layout component that checks user role:

```typescript
// frontend/app/(dashboard)/teacher/layout.tsx
useEffect(() => {
  if (!loading && user && user.role !== 'teacher' && user.role !== 'admin') {
    router.push('/dashboard');
  }
}, [user, loading, router]);
```

### API Error Handling
Axios interceptor handles authorization errors:

```typescript
// 403 Forbidden - Wrong role
if (error.response?.status === 403) {
  // Redirect to dashboard
  window.location.href = '/dashboard';
}

// 401 Unauthorized - Not logged in
if (error.response?.status === 401) {
  // Redirect to login
  window.location.href = '/auth/login';
}
```

## Backend Protection

### Middleware Chain
```javascript
// Example protected route
router.post(
  '/quiz-questions',
  protect,                    // 1. Verify JWT token
  authorize('teacher', 'admin'), // 2. Check role
  asyncHandler(handler)       // 3. Execute handler
);
```

### Authorization Middleware
```javascript
// backend/src/middleware/auth.js
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. This resource requires ${roles.join(' or ')} role.`
      });
    }
    next();
  };
};
```

## Security Features

### 1. Rate Limiting
- **Global**: 300 requests per 15 minutes per IP
- **Auth**: 50 login attempts per 15 minutes per IP
- **Unauthorized**: 10 failed authorization attempts per 15 minutes per IP

### 2. Security Logging
All unauthorized access attempts are logged:
```javascript
{
  ip: "10.24.133.4",
  userId: "507f1f77bcf86cd799439011",
  userRole: "student",
  method: "POST",
  path: "/api/ai/quiz-questions",
  timestamp: "2026-05-25T18:06:08.629Z"
}
```

### 3. Token Security
- HttpOnly cookies (XSS protection)
- Secure flag (HTTPS only)
- SameSite: 'none' (cross-origin support)
- 7-day expiration

## Common Scenarios

### Scenario 1: Student Tries to Access Teacher Page
1. Student navigates to `/teacher/ai`
2. Frontend layout checks role
3. User is redirected to `/dashboard`
4. No API calls are made

### Scenario 2: Student Calls Teacher API Directly
1. Student makes API call to `/api/ai/quiz-questions`
2. Backend `protect` middleware verifies JWT
3. Backend `authorize` middleware checks role
4. Returns 403 with clear error message
5. Security logger records the attempt
6. Rate limiter tracks the attempt

### Scenario 3: Teacher Uses AI Tools
1. Teacher navigates to `/teacher/ai`
2. Frontend layout allows access
3. Teacher submits form
4. API call includes JWT token
5. Backend verifies token and role
6. Request succeeds, AI generates content

## Error Messages

### User-Friendly Messages
- ❌ "User role student is not authorized" (old)
- ✅ "Access denied. This resource requires teacher or admin role." (new)

### Error Response Format
```json
{
  "success": false,
  "message": "Access denied. This resource requires teacher or admin role.",
  "requiredRoles": ["teacher", "admin"],
  "userRole": "student"
}
```

## Testing Authorization

### Manual Testing
```bash
# 1. Get auth token
curl -X POST https://api.example.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@example.com","password":"password"}'

# 2. Try accessing teacher endpoint
curl -X POST https://api.example.com/api/ai/quiz-questions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"topic":"Math","difficulty":"medium","count":5}'

# Expected: 403 Forbidden
```

### Automated Testing
```javascript
// Test unauthorized access
describe('Authorization', () => {
  it('should deny student access to teacher endpoints', async () => {
    const studentToken = await loginAsStudent();
    const response = await request(app)
      .post('/api/ai/quiz-questions')
      .set('Authorization', `Bearer ${studentToken}`)
      .send({ topic: 'Math', difficulty: 'medium', count: 5 });
    
    expect(response.status).toBe(403);
    expect(response.body.message).toContain('Access denied');
  });
});
```

## Troubleshooting

### Issue: "Access denied" for legitimate user
**Check:**
1. User's role in database: `db.users.findOne({email: "user@example.com"})`
2. JWT token payload: Decode at jwt.io
3. Token expiration: Check `exp` claim
4. Case sensitivity: Role should be lowercase ('teacher', not 'Teacher')

**Solution:**
```javascript
// Update user role
await User.findByIdAndUpdate(userId, { role: 'teacher' });

// User must log out and log back in to get new token
```

### Issue: Rate limit triggered for legitimate user
**Check:**
1. Number of requests in logs
2. IP address (shared NAT?)
3. Rate limit configuration

**Solution:**
```javascript
// Increase rate limit in backend/src/server.js
const unauthorizedLimiter = rateLimit({
  max: 20, // Increase from 10 to 20
});
```

### Issue: Frontend redirect not working
**Check:**
1. Browser console for errors
2. User object in AuthContext
3. Layout component mounting

**Solution:**
```bash
# Clear browser cache and cookies
# Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
```

## Best Practices

### For Developers
1. **Always use middleware**: Never check roles manually in handlers
2. **Fail securely**: Default to denying access
3. **Log security events**: Track unauthorized attempts
4. **Clear error messages**: Help users understand why access was denied
5. **Test all roles**: Verify each role can/cannot access appropriate routes

### For Admins
1. **Monitor logs**: Check for suspicious patterns
2. **Review roles**: Ensure users have correct roles
3. **Update regularly**: Keep dependencies and security patches current
4. **Backup data**: Regular backups before role changes
5. **Document changes**: Track who changed what and when

## API Endpoints by Role

### Public (No Auth Required)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/google`

### Student + Teacher + Admin
- `GET /api/auth/me`
- `GET /api/courses`
- `GET /api/courses/:id`
- `POST /api/enrollments`
- AI tutoring endpoints

### Teacher + Admin Only
- `POST /api/courses`
- `POST /api/assignments`
- `POST /api/quizzes`
- `POST /api/ai/quiz-questions`
- `POST /api/ai/grade-submission`
- All AI content generation endpoints

### Admin Only
- `GET /api/admin/users`
- `PATCH /api/admin/users/:id/role`
- `DELETE /api/admin/users/:id`
- `POST /api/admin/impersonate`
- All admin analytics endpoints

## Additional Resources

- [JWT.io](https://jwt.io) - Decode and verify JWT tokens
- [OWASP RBAC](https://owasp.org/www-community/Access_Control) - Security best practices
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit) - Rate limiting docs

## Support

For authorization issues:
1. Check this guide first
2. Review logs: `backend/logs/error-*.log`
3. Test with different roles
4. Contact system administrator
