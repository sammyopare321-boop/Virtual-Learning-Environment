# API Specification - Student Endpoints

## Student Dashboard

### 1. Get My Courses
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
      "teacher": {
        "_id": "teacher_id",
        "name": "Dr. Smith"
      },
      "progress": 65,
      "grade": "A",
      "status": "active",
      "enrolledAt": "2025-05-24T00:00:00Z"
    }
  ]
}
```

---

### 2. Get My Grades
**GET** `/students/me/grades`

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
      "courseId": "course_id",
      "courseName": "CS101",
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

### 3. Get My Course Grades
**GET** `/students/me/grades/:courseId`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courseId": "course_id",
    "courseName": "CS101",
    "assignments": [
      {
        "_id": "assignment_id",
        "title": "Build a Todo App",
        "grade": 95,
        "points": 100,
        "submittedAt": "2025-06-10T10:30:00Z"
      }
    ],
    "quizzes": [
      {
        "_id": "quiz_id",
        "title": "Chapter 1 Quiz",
        "score": 90,
        "totalPoints": 100
      }
    ],
    "participation": 80,
    "final": 88,
    "letterGrade": "A"
  }
}
```

---

### 4. Get My Attendance
**GET** `/students/me/attendance/:courseId`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courseId": "course_id",
    "courseName": "CS101",
    "totalSessions": 20,
    "presentCount": 18,
    "absentCount": 2,
    "lateCount": 0,
    "attendanceRate": 90,
    "records": [
      {
        "date": "2025-06-10",
        "status": "present"
      }
    ]
  }
}
```

---

### 5. Get My Stats
**GET** `/students/me/stats`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "overallCompletion": 75,
    "assignmentsSubmitted": 8,
    "studyHours": 120,
    "gpa": 3.8,
    "onTimeRate": 95,
    "totalCourses": 5,
    "attendance": 92
  }
}
```

---

### 6. Get My Milestones
**GET** `/students/me/milestones`

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
      "_id": "milestone_id",
      "title": "Build a Todo App",
      "type": "assignment",
      "deadline": "2025-06-15T23:59:59Z",
      "course": {
        "_id": "course_id",
        "title": "CS101"
      },
      "status": "pending",
      "daysRemaining": 5
    }
  ]
}
```

---

## Student Submissions

### 7. Get My Submissions (Course)
**GET** `/courses/:courseId/my-submissions`

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
      "assignmentId": "assignment_id",
      "assignmentTitle": "Build a Todo App",
      "submittedAt": "2025-06-10T10:30:00Z",
      "grade": 95,
      "feedback": "Excellent work!",
      "status": "graded"
    }
  ]
}
```

---

### 8. Get My Final Grade (Course)
**GET** `/students/me/grades/:courseId/final`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "courseId": "course_id",
    "courseName": "CS101",
    "finalGrade": 88,
    "letterGrade": "A",
    "breakdown": {
      "assignments": 85,
      "quizzes": 90,
      "participation": 80,
      "final": 88
    }
  }
}
```
