# API Specification - Admin Endpoints

## User Management

### 1. Get All Users
**GET** `/admin/users?search=&role=&status=&page=1&limit=10`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `search` (optional): Search by name or email
- `role` (optional): Filter by role (student, teacher, admin)
- `status` (optional): Filter by status (active, inactive, suspended)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "user_id",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "student",
      "department": "Computer Science",
      "status": "active",
      "createdAt": "2025-05-24T00:00:00Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

### 2. Update User
**PUT** `/admin/users/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "department": "Engineering"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated user */ }
}
```

---

### 3. Delete User
**DELETE** `/admin/users/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "User deleted"
}
```

---

### 4. Change User Status
**PATCH** `/admin/users/:id/status`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "status": "suspended"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User status updated"
}
```

---

### 5. Change User Role
**PATCH** `/admin/users/:id/role`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "role": "teacher"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "User role updated"
}
```

---

### 6. Impersonate User
**POST** `/admin/users/:id/impersonate`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "impersonationToken": "jwt_token_here"
}
```

---

### 7. Exit Impersonation
**POST** `/admin/impersonate/exit`

**Headers:**
```
Authorization: Bearer impersonation_token_here
```

**Response (200):**
```json
{
  "success": true,
  "token": "original_jwt_token"
}
```

---

## Platform Analytics

### 8. Get Stats
**GET** `/admin/stats`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 1250,
    "totalTeachers": 45,
    "totalCourses": 120,
    "platformHealth": 98.5
  }
}
```

---

### 9. Get Overview
**GET** `/admin/analytics/overview`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "activeUsers": 850,
    "newUsersThisMonth": 120,
    "courseEnrollments": 3500,
    "completionRate": 78,
    "averageGrade": 82
  }
}
```

---

### 10. Get Grade Analytics
**GET** `/admin/analytics/grades`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "averageGrade": 82,
    "gradeDistribution": {
      "A": 25,
      "B": 35,
      "C": 25,
      "D": 10,
      "F": 5
    },
    "topPerformers": 150,
    "atRiskStudents": 45
  }
}
```

---

### 11. Get User Analytics
**GET** `/admin/analytics/users`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "month": "January",
      "newUsers": 120,
      "activeUsers": 800,
      "retentionRate": 92
    },
    {
      "month": "February",
      "newUsers": 150,
      "activeUsers": 850,
      "retentionRate": 94
    }
  ]
}
```

---

### 12. Get Attendance Analytics
**GET** `/admin/analytics/attendance`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "averageAttendance": 92,
    "attendanceByRole": {
      "student": 90,
      "teacher": 95
    },
    "attendanceTrend": [90, 91, 92, 93, 92]
  }
}
```

---

### 13. Get Enrollment Trends
**GET** `/admin/analytics/enrollment-trends`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "month": "January",
      "enrollments": 500,
      "dropouts": 20
    },
    {
      "month": "February",
      "enrollments": 550,
      "dropouts": 15
    }
  ]
}
```

---

## System Logs

### 14. Get Logs
**GET** `/admin/logs?search=&type=&startDate=&endDate=&page=1&limit=10`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Query Parameters:**
- `search` (optional): Search in logs
- `type` (optional): Filter by type (login, logout, create, update, delete)
- `startDate` (optional): Start date (ISO format)
- `endDate` (optional): End date (ISO format)
- `page` (optional): Page number
- `limit` (optional): Items per page

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "log_id",
      "userId": "user_id",
      "userName": "John Doe",
      "action": "login",
      "resource": "auth",
      "details": "User logged in",
      "ipAddress": "192.168.1.1",
      "timestamp": "2025-06-10T10:30:00Z"
    }
  ],
  "totalPages": 10,
  "currentPage": 1
}
```

---

## Course Management (Admin)

### 15. Get All Courses (Admin)
**GET** `/admin/courses?search=&status=&page=1&limit=10`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "course_id",
      "code": "CS101",
      "title": "Introduction to Computer Science",
      "teacher": { "_id": "teacher_id", "name": "Dr. Smith" },
      "status": "active",
      "students": 45,
      "createdAt": "2025-05-24T00:00:00Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

### 16. Approve Course
**PATCH** `/admin/courses/:id/approve`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course approved"
}
```

---

### 17. Change Course Status
**PATCH** `/admin/courses/:id/status`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "status": "archived"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course status updated"
}
```

---

### 18. Delete Course (Admin)
**DELETE** `/admin/courses/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course deleted"
}
```

---

### 19. Reassign Teacher
**PATCH** `/admin/courses/:id/teacher`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "teacherId": "new_teacher_id"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Teacher reassigned"
}
```
