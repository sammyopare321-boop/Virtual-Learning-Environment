# API Specification - Teacher Endpoints

## Teacher Dashboard

### 1. Get Teacher Stats
**GET** `/teachers/me/stats`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "totalStudents": 150,
    "activeCourses": 4,
    "averageAttendance": 92,
    "averageGrade": 82,
    "pendingGrading": 15,
    "upcomingClasses": [
      {
        "courseId": "course_id",
        "courseName": "CS101",
        "time": "10:00 AM",
        "date": "2025-06-15"
      }
    ]
  }
}
```

---

## Teacher Course Management

### 2. Get My Courses (Teacher)
**GET** `/teachers/me/courses`

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
      "students": 45,
      "status": "active",
      "semester": "Spring",
      "academicYear": "2024-2025"
    }
  ]
}
```

---

## Teacher Grading

### 3. Get Pending Submissions
**GET** `/teachers/me/pending-submissions`

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
      "_id": "submission_id",
      "studentId": "student_id",
      "studentName": "John Doe",
      "assignmentId": "assignment_id",
      "assignmentTitle": "Build a Todo App",
      "courseId": "course_id",
      "courseName": "CS101",
      "submittedAt": "2025-06-10T10:30:00Z",
      "files": ["url1", "url2"]
    }
  ]
}
```

---

### 4. Get Course Gradebook
**GET** `/teachers/me/courses/:courseId/gradebook`

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
      "studentId": "student_id",
      "studentName": "John Doe",
      "email": "john@example.com",
      "assignments": 85,
      "quizzes": 90,
      "participation": 80,
      "final": 88,
      "letterGrade": "A"
    }
  ]
}
```

---

## Teacher Analytics

### 5. Get Course Analytics (Teacher)
**GET** `/teachers/me/courses/:courseId/analytics`

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
    "completionRate": 75,
    "engagementScore": 80,
    "attendanceRate": 92,
    "topPerformers": 5,
    "atRiskStudents": 3,
    "gradeDistribution": {
      "A": 15,
      "B": 20,
      "C": 8,
      "D": 2,
      "F": 0
    }
  }
}
```

---

### 6. Get At-Risk Students (Course)
**GET** `/teachers/me/courses/:courseId/at-risk`

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
      "studentId": "student_id",
      "studentName": "Jane Doe",
      "email": "jane@example.com",
      "currentGrade": 45,
      "attendanceRate": 60,
      "submissionRate": 50,
      "reason": "Low grades and attendance"
    }
  ]
}
```

---

## Teacher Announcements

### 7. Create Course Announcement (Teacher)
**POST** `/teachers/me/courses/:courseId/announcements`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "Important Update",
  "content": "Please read the updated syllabus"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "announcement_id",
    "title": "Important Update",
    "content": "Please read the updated syllabus",
    "createdAt": "2025-06-10T10:00:00Z"
  }
}
```

---

## Teacher Assignments

### 8. Get Course Assignments (Teacher)
**GET** `/teachers/me/courses/:courseId/assignments`

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
      "_id": "assignment_id",
      "title": "Build a Todo App",
      "dueDate": "2025-06-15T23:59:59Z",
      "points": 100,
      "submissions": 42,
      "graded": 35,
      "pending": 7
    }
  ]
}
```

---

### 9. Get Assignment Submissions (Teacher)
**GET** `/teachers/me/assignments/:assignmentId/submissions`

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
      "_id": "submission_id",
      "studentId": "student_id",
      "studentName": "John Doe",
      "submittedAt": "2025-06-10T10:30:00Z",
      "grade": 95,
      "status": "graded",
      "files": ["url1", "url2"]
    }
  ]
}
```

---

## Teacher Quizzes

### 10. Get Course Quizzes (Teacher)
**GET** `/teachers/me/courses/:courseId/quizzes`

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
      "_id": "quiz_id",
      "title": "Chapter 1 Quiz",
      "questions": 10,
      "points": 50,
      "attempts": 45,
      "averageScore": 82
    }
  ]
}
```

---

### 11. Get Quiz Attempts (Teacher)
**GET** `/teachers/me/quizzes/:quizId/attempts`

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
      "_id": "attempt_id",
      "studentId": "student_id",
      "studentName": "John Doe",
      "score": 90,
      "totalPoints": 100,
      "percentage": 90,
      "submittedAt": "2025-06-10T10:30:00Z"
    }
  ]
}
```
