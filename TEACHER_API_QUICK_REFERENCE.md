# Teacher API - Quick Reference

## All Endpoints

### Stats & Overview
```
GET /api/teachers/me/stats
GET /api/teachers/me/courses
GET /api/teachers/me/pending-submissions
```

### Course Management
```
GET /api/teachers/me/courses/:courseId/gradebook
GET /api/teachers/me/courses/:courseId/analytics
GET /api/teachers/me/courses/:courseId/at-risk
GET /api/teachers/me/courses/:courseId/assignments
GET /api/teachers/me/courses/:courseId/quizzes
```

### Submissions & Attempts
```
GET /api/teachers/me/assignments/:assignmentId/submissions
GET /api/teachers/me/quizzes/:quizId/attempts
```

---

## Frontend API Methods

```typescript
// Import
import { teacherApi } from '@/utils/api/teacherApi';

// Stats & Overview
teacherApi.getStats()
teacherApi.getMyCourses()
teacherApi.getPendingSubmissions()

// Course Management
teacherApi.getCourseGradebook(courseId)
teacherApi.getCourseAnalytics(courseId)
teacherApi.getAtRiskStudents(courseId)
teacherApi.getCourseAssignments(courseId)
teacherApi.getCourseQuizzes(courseId)

// Submissions & Attempts
teacherApi.getAssignmentSubmissions(assignmentId)
teacherApi.getQuizAttempts(quizId)
```

---

## Response Examples

### Get Teacher's Courses
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "course_id",
      "title": "CS101",
      "code": "CS101",
      "status": "active"
    }
  ]
}
```

### Get Pending Submissions
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "submission_id",
      "student": { "_id": "id", "name": "John", "email": "john@example.com" },
      "assignment": { "_id": "id", "title": "Assignment 1", "dueDate": "2025-06-15T23:59:59Z" },
      "status": "submitted"
    }
  ]
}
```

### Get Course Analytics
```json
{
  "success": true,
  "data": {
    "classAverage": 78.5,
    "highestScore": 98,
    "lowestScore": 45,
    "distribution": {
      "below50": 2,
      "50-69": 5,
      "70-89": 12,
      "90-100": 6
    },
    "completionRate": 87.5
  }
}
```

### Get At-Risk Students
```json
{
  "success": true,
  "data": [
    {
      "_id": "grade_item_id",
      "student": { "_id": "id", "name": "Jane", "email": "jane@example.com" },
      "percentage": 42,
      "grade": "F"
    }
  ]
}
```

### Get Course Assignments
```json
{
  "success": true,
  "count": 4,
  "data": [
    {
      "_id": "assignment_id",
      "title": "Build a Todo App",
      "dueDate": "2025-06-15T23:59:59Z",
      "points": 100,
      "status": "open"
    }
  ]
}
```

### Get Assignment Submissions
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "submission_id",
      "student": { "_id": "id", "name": "John", "email": "john@example.com" },
      "status": "submitted",
      "submittedAt": "2025-06-10T10:30:00Z",
      "grade": null,
      "feedback": null
    }
  ]
}
```

### Get Course Quizzes
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "quiz_id",
      "title": "Chapter 1 Quiz",
      "questions": 10,
      "points": 50,
      "timeLimit": 30,
      "status": "published"
    }
  ]
}
```

### Get Quiz Attempts
```json
{
  "success": true,
  "count": 25,
  "data": [
    {
      "_id": "attempt_id",
      "student": { "_id": "id", "name": "John", "email": "john@example.com" },
      "score": 42,
      "totalPoints": 50,
      "percentage": 84,
      "status": "submitted",
      "submittedAt": "2025-06-10T10:30:00Z"
    }
  ]
}
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Course not found"
}
```

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid course ID"
}
```

---

## Implementation Details

**Authorization:** All endpoints require JWT token + teacher role  
**Performance:** Uses `.lean()` for read-only queries  
**Caching:** Consider caching analytics endpoints  
**Pagination:** Can be added to list endpoints  

---

## Files

- Backend Controller: `backend/src/controllers/teacherController.js`
- Backend Routes: `backend/src/routes/teachers.js`
- Frontend API: `frontend/utils/api/teacherApi.ts`

---

## Status

✅ All 10 endpoints implemented  
✅ All endpoints tested  
✅ 100% API connectivity  
✅ Production ready

