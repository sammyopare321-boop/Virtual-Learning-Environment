# API Specification - Attendance Endpoints

## Attendance Management

### 1. Get Course Attendance
**GET** `/courses/:id/attendance`

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
      "_id": "session_id",
      "date": "2025-06-10",
      "time": "10:00 AM",
      "totalStudents": 45,
      "presentStudents": 42,
      "absentStudents": 3,
      "attendanceRate": 93.3
    }
  ]
}
```

---

### 2. Create Attendance Session
**POST** `/courses/:id/attendance`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "date": "2025-06-10",
  "time": "10:00 AM",
  "topic": "Module 1: Basics"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "session_id",
    "date": "2025-06-10",
    "time": "10:00 AM",
    "topic": "Module 1: Basics"
  }
}
```

---

### 3. Mark Attendance
**POST** `/attendance/:sessionId/mark`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "records": [
    {
      "studentId": "student_id_1",
      "status": "present"
    },
    {
      "studentId": "student_id_2",
      "status": "absent"
    },
    {
      "studentId": "student_id_3",
      "status": "late"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attendance marked for 3 students"
}
```

---

### 4. Get Session Records
**GET** `/attendance/:sessionId`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "session_id",
    "date": "2025-06-10",
    "time": "10:00 AM",
    "records": [
      {
        "studentId": "student_id",
        "studentName": "John Doe",
        "status": "present",
        "markedAt": "2025-06-10T10:05:00Z"
      }
    ]
  }
}
```

---

### 5. Get Student Attendance (Course)
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
      },
      {
        "date": "2025-06-09",
        "status": "absent"
      }
    ]
  }
}
```
