# API Specification - Course Endpoints

## Course Management

### 1. Get All Courses
**GET** `/courses?search=&status=&page=1&limit=10`

**Query Parameters:**
- `search` (optional): Search by title or code
- `status` (optional): Filter by status (active, archived, draft)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "course_id",
      "code": "CS101",
      "title": "Introduction to Computer Science",
      "description": "Learn the basics of CS",
      "teacher": {
        "_id": "teacher_id",
        "name": "Dr. Smith"
      },
      "status": "active",
      "semester": "Spring",
      "academicYear": "2024-2025",
      "students": 45,
      "coverImage": "url",
      "createdAt": "2025-05-24T00:00:00Z"
    }
  ],
  "totalPages": 5,
  "currentPage": 1
}
```

---

### 2. Get Single Course
**GET** `/courses/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "course_id",
    "code": "CS101",
    "title": "Introduction to Computer Science",
    "description": "Learn the basics of CS",
    "teacher": {
      "_id": "teacher_id",
      "name": "Dr. Smith",
      "email": "smith@example.com"
    },
    "status": "active",
    "semester": "Spring",
    "academicYear": "2024-2025",
    "students": 45,
    "modules": 5,
    "assignments": 10,
    "quizzes": 3,
    "coverImage": "url",
    "createdAt": "2025-05-24T00:00:00Z"
  }
}
```

---

### 3. Create Course
**POST** `/courses`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "code": "CS101",
  "title": "Introduction to Computer Science",
  "description": "Learn the basics of CS",
  "semester": "Spring",
  "academicYear": "2024-2025",
  "credits": 3,
  "capacity": 50
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "course_id",
    "code": "CS101",
    "title": "Introduction to Computer Science",
    "teacher": "current_user_id",
    "status": "draft"
  }
}
```

---

### 4. Update Course
**PUT** `/courses/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "Advanced Computer Science",
  "description": "Updated description",
  "capacity": 60
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated course */ }
}
```

---

### 5. Delete Course
**DELETE** `/courses/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Course deleted successfully"
}
```

---

## Course Enrollment

### 6. Get Course Students
**GET** `/courses/:id/students`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "student_id",
      "name": "John Doe",
      "email": "john@example.com",
      "enrolledAt": "2025-05-24T00:00:00Z",
      "status": "active"
    }
  ]
}
```

---

### 7. Enroll Students (Bulk)
**POST** `/courses/:id/students`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "studentIds": ["student_id_1", "student_id_2", "student_id_3"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "3 students enrolled successfully"
}
```

---

### 8. Enroll in Course (Self)
**POST** `/courses/:id/enroll`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Enrolled successfully"
}
```

---

### 9. Drop Course
**DELETE** `/courses/:id/enroll`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Dropped successfully"
}
```

---

## Student Course Access

### 10. Get My Courses
**GET** `/students/me/courses`

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
      "progress": 65,
      "grade": "A",
      "status": "active"
    }
  ]
}
```

---

## Course Content

### 11. Get Modules
**GET** `/courses/:id/modules`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "module_id",
      "title": "Module 1: Basics",
      "description": "Introduction to basics",
      "order": 1,
      "lessons": 5,
      "completed": 2
    }
  ]
}
```

---

### 12. Create Module
**POST** `/courses/:id/modules`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "Module 1: Basics",
  "description": "Introduction to basics",
  "order": 1
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* module */ }
}
```

---

### 13. Create Lesson
**POST** `/courses/:id/modules/:modId/lessons`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request (FormData):**
- `title`: "Lesson 1: Introduction"
- `description`: "Learn the basics"
- `content`: "Lesson content here"
- `video`: (file) - optional video file
- `materials`: (files) - optional material files

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "lesson_id",
    "title": "Lesson 1: Introduction",
    "videoUrl": "url",
    "materials": ["url1", "url2"]
  }
}
```

---

## Course Analytics

### 14. Get Gradebook
**GET** `/courses/:id/gradebook`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "studentId": "student_id",
      "studentName": "John Doe",
      "assignments": 85,
      "quizzes": 90,
      "participation": 80,
      "final": 88
    }
  ]
}
```

---

### 15. Get Course Analytics
**GET** `/courses/:id/analytics`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "averageGrade": 82,
    "completionRate": 75,
    "engagementScore": 80,
    "attendanceRate": 92,
    "topPerformers": 5,
    "atRiskStudents": 3
  }
}
```

---

### 16. Get At-Risk Students
**GET** `/courses/:id/analytics/at-risk`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "student_id",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "currentGrade": 45,
      "attendanceRate": 60,
      "reason": "Low grades and attendance"
    }
  ]
}
```

---

## Grade Weights

### 17. Get Grade Weights
**GET** `/courses/:id/grade-weights`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "assignments": 30,
    "quizzes": 20,
    "participation": 10,
    "final": 40
  }
}
```

---

### 18. Set Grade Weights
**POST** `/courses/:id/grade-weights`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "assignments": 30,
  "quizzes": 20,
  "participation": 10,
  "final": 40
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Grade weights updated"
}
```
