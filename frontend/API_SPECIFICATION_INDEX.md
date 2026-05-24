# API Specification Index

## Overview

This document provides a complete specification of all backend API endpoints required for the UniLearn platform. The frontend is already configured to call these endpoints through the API utilities in `utils/api/`.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All protected endpoints require the `Authorization` header:

```
Authorization: Bearer jwt_token_here
```

## Response Format

All responses follow this format:

**Success (2xx):**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional message"
}
```

**Error (4xx, 5xx):**
```json
{
  "success": false,
  "message": "Error message",
  "details": ["Optional", "error", "details"]
}
```

## API Endpoints by Category

### 1. Authentication (`API_SPEC_AUTH.md`)
- POST `/auth/register` - Register new user
- POST `/auth/login` - Login user
- POST `/auth/google` - Google OAuth login
- GET `/auth/me` - Get current user
- PUT `/auth/me` - Update current user
- POST `/auth/logout` - Logout user

### 2. Courses (`API_SPEC_COURSES.md`)
- GET `/courses` - Get all courses
- GET `/courses/:id` - Get single course
- POST `/courses` - Create course
- PUT `/courses/:id` - Update course
- DELETE `/courses/:id` - Delete course
- GET `/courses/:id/students` - Get course students
- POST `/courses/:id/students` - Enroll students (bulk)
- POST `/courses/:id/enroll` - Enroll in course (self)
- DELETE `/courses/:id/enroll` - Drop course
- GET `/students/me/courses` - Get my courses
- GET `/courses/:id/modules` - Get modules
- POST `/courses/:id/modules` - Create module
- POST `/courses/:id/modules/:modId/lessons` - Create lesson
- GET `/courses/:id/gradebook` - Get gradebook
- GET `/courses/:id/analytics` - Get analytics
- GET `/courses/:id/analytics/at-risk` - Get at-risk students
- GET `/courses/:id/grade-weights` - Get grade weights
- POST `/courses/:id/grade-weights` - Set grade weights

### 3. Assignments (`API_SPEC_ASSIGNMENTS.md`)
- GET `/courses/:id/assignments` - Get assignments
- POST `/courses/:id/assignments` - Create assignment
- GET `/assignments/:id` - Get assignment details
- GET `/assignments/:id/my-submission` - Get my submission
- GET `/assignments/:id/submissions` - Get all submissions
- POST `/assignments/:id/submit` - Submit assignment
- PATCH `/submissions/:id/grade` - Grade submission

### 4. Quizzes (`API_SPEC_ASSIGNMENTS.md`)
- GET `/courses/:id/quizzes` - Get quizzes
- POST `/courses/:id/quizzes` - Create quiz
- GET `/quizzes/:id` - Get quiz details
- PUT `/quizzes/:id` - Update quiz
- DELETE `/quizzes/:id` - Delete quiz
- PATCH `/quizzes/:id/publish` - Publish quiz
- GET `/quizzes/:id/questions` - Get questions
- POST `/quizzes/:id/questions` - Add question
- PUT `/questions/:id` - Update question
- DELETE `/questions/:id` - Delete question
- POST `/quizzes/:id/start` - Start attempt
- POST `/quizzes/:id/submit` - Submit attempt
- GET `/quizzes/:id/my-attempt` - Get my attempt
- GET `/quizzes/:id/attempts` - Get all attempts
- PATCH `/attempts/:id/grade` - Grade attempt

### 5. Admin (`API_SPEC_ADMIN.md`)
- GET `/admin/users` - Get all users
- PUT `/admin/users/:id` - Update user
- DELETE `/admin/users/:id` - Delete user
- PATCH `/admin/users/:id/status` - Change user status
- PATCH `/admin/users/:id/role` - Change user role
- POST `/admin/users/:id/impersonate` - Impersonate user
- POST `/admin/impersonate/exit` - Exit impersonation
- GET `/admin/stats` - Get stats
- GET `/admin/analytics/overview` - Get overview
- GET `/admin/analytics/grades` - Get grade analytics
- GET `/admin/analytics/users` - Get user analytics
- GET `/admin/analytics/attendance` - Get attendance analytics
- GET `/admin/analytics/enrollment-trends` - Get enrollment trends
- GET `/admin/logs` - Get logs
- GET `/admin/courses` - Get all courses (admin)
- PATCH `/admin/courses/:id/approve` - Approve course
- PATCH `/admin/courses/:id/status` - Change course status
- DELETE `/admin/courses/:id` - Delete course (admin)
- PATCH `/admin/courses/:id/teacher` - Reassign teacher

### 6. Communication (`API_SPEC_COMMUNICATION.md`)
- GET `/communication/conversations` - Get conversations
- GET `/communication/messages/:userId` - Get messages
- GET `/communication/notifications/me` - Get notifications
- PATCH `/communication/notifications/:id/read` - Mark as read
- GET `/courses/:id/announcements` - Get announcements
- POST `/courses/:id/announcements` - Create announcement
- GET `/courses/:id/discussions` - Get discussions
- POST `/courses/:id/discussions` - Create discussion
- GET `/communication/discussions/:id` - Get discussion details
- POST `/communication/discussions/:id/reply` - Reply to discussion
- GET `/courses/:id/live-sessions` - Get live sessions
- POST `/courses/:id/live-sessions` - Create live session
- PATCH `/live-sessions/:id/start` - Start session
- PATCH `/live-sessions/:id/end` - End session
- GET `/live-sessions/:id/join` - Join session

### 7. Attendance (`API_SPEC_ATTENDANCE.md`)
- GET `/courses/:id/attendance` - Get attendance
- POST `/courses/:id/attendance` - Create session
- POST `/attendance/:sessionId/mark` - Mark attendance
- GET `/attendance/:sessionId` - Get session records
- GET `/students/me/attendance/:courseId` - Get my attendance

### 8. Student (`API_SPEC_STUDENT.md`)
- GET `/students/me/courses` - Get my courses
- GET `/students/me/grades` - Get my grades
- GET `/students/me/grades/:courseId` - Get course grades
- GET `/students/me/attendance/:courseId` - Get my attendance
- GET `/students/me/stats` - Get my stats
- GET `/students/me/milestones` - Get my milestones
- GET `/courses/:courseId/my-submissions` - Get my submissions
- GET `/students/me/grades/:courseId/final` - Get final grade

### 9. Teacher (`API_SPEC_TEACHER.md`)
- GET `/teachers/me/stats` - Get teacher stats
- GET `/teachers/me/courses` - Get my courses
- GET `/teachers/me/pending-submissions` - Get pending submissions
- GET `/teachers/me/courses/:courseId/gradebook` - Get gradebook
- GET `/teachers/me/courses/:courseId/analytics` - Get analytics
- GET `/teachers/me/courses/:courseId/at-risk` - Get at-risk students
- POST `/teachers/me/courses/:courseId/announcements` - Create announcement
- GET `/teachers/me/courses/:courseId/assignments` - Get assignments
- GET `/teachers/me/assignments/:assignmentId/submissions` - Get submissions
- GET `/teachers/me/courses/:courseId/quizzes` - Get quizzes
- GET `/teachers/me/quizzes/:quizId/attempts` - Get attempts

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing/invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error |

## Error Codes

Common error codes returned in responses:

| Code | Meaning |
|------|---------|
| INVALID_CREDENTIALS | Login failed |
| TOKEN_EXPIRED | JWT token expired |
| UNAUTHORIZED | Not authenticated |
| FORBIDDEN | Insufficient permissions |
| VALIDATION_ERROR | Input validation failed |
| NOT_FOUND | Resource not found |
| CONFLICT | Resource already exists |
| INTERNAL_ERROR | Server error |

## Query Parameters

### Pagination
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 10)

### Filtering
- `search` (string): Search query
- `status` (string): Filter by status
- `role` (string): Filter by role
- `type` (string): Filter by type

### Date Range
- `startDate` (ISO string): Start date
- `endDate` (ISO string): End date

## Request Headers

### Required
```
Authorization: Bearer jwt_token_here
```

### Optional
```
Content-Type: application/json
Accept: application/json
```

### For File Uploads
```
Content-Type: multipart/form-data
```

## Response Headers

```
Content-Type: application/json
X-Total-Count: 100
X-Page-Count: 10
X-Current-Page: 1
```

## Rate Limiting

Recommended rate limits:

| Endpoint | Limit |
|----------|-------|
| Login | 5 requests per 15 minutes |
| API calls | 100 requests per minute |
| File upload | 5 uploads per minute |
| Password reset | 3 requests per hour |

## Pagination Response Format

```json
{
  "success": true,
  "data": [ /* array of items */ ],
  "totalPages": 10,
  "currentPage": 1,
  "totalItems": 100,
  "itemsPerPage": 10
}
```

## File Upload

### Supported File Types
- Images: jpg, jpeg, png, gif, webp
- Documents: pdf, doc, docx, txt
- Videos: mp4, avi, mov, mkv
- Archives: zip, rar, 7z

### Size Limits
- Profile picture: 5MB
- Assignment files: 50MB
- Course materials: 100MB
- Video: 500MB

### Upload Response
```json
{
  "success": true,
  "data": {
    "fileId": "file_id",
    "fileName": "document.pdf",
    "fileSize": 1024000,
    "fileUrl": "https://storage.example.com/file_id",
    "uploadedAt": "2025-06-10T10:00:00Z"
  }
}
```

## Timestamps

All timestamps are in ISO 8601 format:
```
2025-06-10T10:30:00Z
```

## Data Types

| Type | Format | Example |
|------|--------|---------|
| String | text | "John Doe" |
| Number | integer/float | 42, 3.14 |
| Boolean | true/false | true |
| Date | ISO 8601 | "2025-06-10T10:00:00Z" |
| Array | [ ] | [1, 2, 3] |
| Object | { } | { "key": "value" } |

## Common Objects

### User Object
```json
{
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "student",
  "department": "Computer Science",
  "status": "active",
  "createdAt": "2025-05-24T00:00:00Z"
}
```

### Course Object
```json
{
  "_id": "course_id",
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Learn the basics",
  "teacher": { "_id": "teacher_id", "name": "Dr. Smith" },
  "status": "active",
  "semester": "Spring",
  "academicYear": "2024-2025",
  "students": 45,
  "createdAt": "2025-05-24T00:00:00Z"
}
```

### Assignment Object
```json
{
  "_id": "assignment_id",
  "title": "Build a Todo App",
  "description": "Create a todo application",
  "dueDate": "2025-06-15T23:59:59Z",
  "points": 100,
  "submissions": 42,
  "status": "open",
  "createdAt": "2025-05-24T00:00:00Z"
}
```

### Quiz Object
```json
{
  "_id": "quiz_id",
  "title": "Chapter 1 Quiz",
  "description": "Test your knowledge",
  "questions": 10,
  "points": 50,
  "timeLimit": 30,
  "status": "published",
  "createdAt": "2025-05-24T00:00:00Z"
}
```

## Implementation Checklist

### Phase 1: Core (Priority)
- [ ] Authentication endpoints
- [ ] Course management
- [ ] Enrollment system
- [ ] Assignment submission
- [ ] Quiz system

### Phase 2: Features (High)
- [ ] Grading system
- [ ] Analytics
- [ ] Attendance tracking
- [ ] Announcements
- [ ] Discussions

### Phase 3: Advanced (Medium)
- [ ] Live sessions
- [ ] Admin management
- [ ] User impersonation
- [ ] Bulk operations
- [ ] Reporting

### Phase 4: Polish (Low)
- [ ] Rate limiting
- [ ] Caching
- [ ] Webhooks
- [ ] API versioning
- [ ] Documentation

## Testing

### Test Credentials
```
Email: test@example.com
Password: TestPassword123!
```

### Test Endpoints
- Health check: GET `/health`
- API version: GET `/version`
- API docs: GET `/docs`

## Support

For API issues:
1. Check the relevant specification file
2. Verify request format and headers
3. Check response status code
4. Review error message and details
5. Check server logs

---

**Last Updated:** 2025-05-24
**Status:** Complete API Specification
**Frontend Ready:** Yes - All API calls configured in `utils/api/`
