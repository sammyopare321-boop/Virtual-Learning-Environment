# API Specification - Assignment & Quiz Endpoints

## Assignments

### 1. Get Course Assignments
**GET** `/courses/:id/assignments`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "assignment_id",
      "title": "Build a Todo App",
      "description": "Create a todo application",
      "dueDate": "2025-06-15T23:59:59Z",
      "points": 100,
      "submissions": 42,
      "status": "open"
    }
  ]
}
```

---

### 2. Create Assignment
**POST** `/courses/:id/assignments`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "Build a Todo App",
  "description": "Create a todo application",
  "dueDate": "2025-06-15T23:59:59Z",
  "points": 100,
  "rubric": {
    "functionality": 40,
    "design": 30,
    "documentation": 30
  }
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* assignment */ }
}
```

---

### 3. Get Assignment Details
**GET** `/assignments/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "assignment_id",
    "title": "Build a Todo App",
    "description": "Create a todo application",
    "dueDate": "2025-06-15T23:59:59Z",
    "points": 100,
    "rubric": { /* rubric */ },
    "submissions": 42,
    "status": "open"
  }
}
```

---

### 4. Get My Submission
**GET** `/assignments/:id/my-submission`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "submission_id",
    "studentId": "student_id",
    "assignmentId": "assignment_id",
    "submittedAt": "2025-06-10T10:30:00Z",
    "files": ["url1", "url2"],
    "grade": 95,
    "feedback": "Excellent work!",
    "status": "graded"
  }
}
```

---

### 5. Get All Submissions
**GET** `/assignments/:id/submissions`

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
      "status": "graded"
    }
  ]
}
```

---

### 6. Submit Assignment
**POST** `/assignments/:id/submit`

**Headers:**
```
Authorization: Bearer jwt_token_here
Content-Type: multipart/form-data
```

**Request (FormData):**
- `files`: (files) - Assignment files
- `notes`: (optional) - Submission notes

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "submission_id",
    "submittedAt": "2025-06-10T10:30:00Z",
    "files": ["url1", "url2"]
  }
}
```

---

### 7. Grade Submission
**PATCH** `/submissions/:id/grade`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "grade": 95,
  "feedback": "Excellent work! Great implementation."
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Submission graded"
}
```

---

## Quizzes

### 8. Get Course Quizzes
**GET** `/courses/:id/quizzes`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "quiz_id",
      "title": "Chapter 1 Quiz",
      "description": "Test your knowledge",
      "questions": 10,
      "points": 50,
      "timeLimit": 30,
      "status": "published"
    }
  ]
}
```

---

### 9. Create Quiz
**POST** `/courses/:id/quizzes`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "Chapter 1 Quiz",
  "description": "Test your knowledge",
  "points": 50,
  "timeLimit": 30,
  "shuffleQuestions": true,
  "showAnswers": false
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* quiz */ }
}
```

---

### 10. Get Quiz Details
**GET** `/quizzes/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "quiz_id",
    "title": "Chapter 1 Quiz",
    "description": "Test your knowledge",
    "points": 50,
    "timeLimit": 30,
    "questions": [
      {
        "_id": "question_id",
        "type": "multiple_choice",
        "text": "What is 2+2?",
        "options": ["3", "4", "5", "6"],
        "correctAnswer": "4",
        "points": 5
      }
    ]
  }
}
```

---

### 11. Update Quiz
**PUT** `/quizzes/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "Updated Quiz Title",
  "timeLimit": 45
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated quiz */ }
}
```

---

### 12. Delete Quiz
**DELETE** `/quizzes/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Quiz deleted"
}
```

---

### 13. Publish Quiz
**PATCH** `/quizzes/:id/publish`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Quiz published"
}
```

---

## Quiz Questions

### 14. Get Questions
**GET** `/quizzes/:id/questions`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "question_id",
      "type": "multiple_choice",
      "text": "What is 2+2?",
      "options": ["3", "4", "5", "6"],
      "points": 5
    }
  ]
}
```

---

### 15. Add Question
**POST** `/quizzes/:id/questions`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "type": "multiple_choice",
  "text": "What is 2+2?",
  "options": ["3", "4", "5", "6"],
  "correctAnswer": "4",
  "points": 5
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* question */ }
}
```

---

### 16. Update Question
**PUT** `/questions/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "text": "Updated question text",
  "points": 10
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated question */ }
}
```

---

### 17. Delete Question
**DELETE** `/questions/:id`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Question deleted"
}
```

---

## Quiz Attempts

### 18. Start Quiz Attempt
**POST** `/quizzes/:id/start`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "attempt_id",
    "quizId": "quiz_id",
    "studentId": "student_id",
    "startedAt": "2025-06-10T10:00:00Z",
    "timeLimit": 30,
    "questions": [
      {
        "_id": "question_id",
        "type": "multiple_choice",
        "text": "What is 2+2?",
        "options": ["3", "4", "5", "6"]
      }
    ]
  }
}
```

---

### 19. Submit Quiz Attempt
**POST** `/quizzes/:id/submit`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "answers": [
    {
      "questionId": "question_id_1",
      "answer": "4"
    },
    {
      "questionId": "question_id_2",
      "answer": "true"
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "attempt_id",
    "score": 95,
    "totalPoints": 100,
    "percentage": 95,
    "submittedAt": "2025-06-10T10:30:00Z",
    "feedback": "Great job!"
  }
}
```

---

### 20. Get My Attempt
**GET** `/quizzes/:id/my-attempt`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "attempt_id",
    "score": 95,
    "totalPoints": 100,
    "percentage": 95,
    "submittedAt": "2025-06-10T10:30:00Z"
  }
}
```

---

### 21. Get All Attempts
**GET** `/quizzes/:id/attempts`

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
      "score": 95,
      "totalPoints": 100,
      "percentage": 95,
      "submittedAt": "2025-06-10T10:30:00Z"
    }
  ]
}
```

---

### 22. Grade Attempt
**PATCH** `/attempts/:id/grade`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "score": 95,
  "feedback": "Excellent performance!"
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Attempt graded"
}
```
