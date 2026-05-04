# University LMS — Postman Testing Guide
## All Phases (Phase 1, Phase 2 & Admin)

---

## Setup

### Base URL
Create a Postman environment and set this variable:
```
Variable:  BASE_URL
Value:     http://localhost:5000
```
Use `{{BASE_URL}}` in all requests.

### Auth Token Variables
Add these to your environment — they get populated automatically via test scripts:
```
Variable:  STUDENT_TOKEN
Variable:  TEACHER_TOKEN
Variable:  ADMIN_TOKEN
Variable:  IMPERSONATION_TOKEN
Variable:  COURSE_ID
Variable:  MODULE_ID
Variable:  CONTENT_ID
Variable:  ASSIGNMENT_ID
Variable:  SUBMISSION_ID
Variable:  QUIZ_ID
Variable:  QUESTION_ID
Variable:  ATTEMPT_ID
Variable:  ATTENDANCE_SESSION_ID
Variable:  DISCUSSION_ID
Variable:  LIVE_SESSION_ID
Variable:  TARGET_USER_ID
```

### Auto-save token script
On any login request, add this to the **Tests** tab to auto-save the token:
```javascript
const res = pm.response.json();
if (res.token) {
  pm.environment.set("TEACHER_TOKEN", res.token);
  // Change to STUDENT_TOKEN or ADMIN_TOKEN depending on the request
}
```

---

## PHASE 1 TESTS

---

### 1. AUTH

---

#### 1.1 Register — Teacher ✅ Happy Path
```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "name": "Dr. Kwame Mensah",
  "email": "teacher@uni.edu",
  "password": "Password123!",
  "role": "teacher",
  "department": "Computer Science"
}
```
**Expected:** `201` — user object returned, no password field in response.

**Tests tab:**
```javascript
pm.test("Status 201", () => pm.response.to.have.status(201));
pm.test("No password in response", () => {
  const res = pm.response.json();
  pm.expect(res.data).to.not.have.property('password');
});
```

---

#### 1.2 Register — Student ✅ Happy Path
```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "name": "Ama Owusu",
  "email": "student@uni.edu",
  "password": "Password123!",
  "role": "student",
  "department": "Computer Science"
}
```
**Expected:** `201`

---

#### 1.3 Register — Admin ✅ Happy Path
```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "name": "Super Admin",
  "email": "admin@uni.edu",
  "password": "Admin123!",
  "role": "admin"
}
```
**Expected:** `201`

---

#### 1.4 Register — Duplicate Email ❌ Error Case
```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "name": "Another Person",
  "email": "teacher@uni.edu",
  "password": "Password123!",
  "role": "teacher"
}
```
**Expected:** `400` — duplicate email error message.

---

#### 1.5 Register — Missing Fields ❌ Error Case
```
POST {{BASE_URL}}/api/auth/register
Content-Type: application/json

{
  "email": "incomplete@uni.edu"
}
```
**Expected:** `400` — validation error.

---

#### 1.6 Login — Teacher ✅ Happy Path
```
POST {{BASE_URL}}/api/auth/login
Content-Type: application/json

{
  "email": "teacher@uni.edu",
  "password": "Password123!"
}
```
**Expected:** `200` — JWT token returned.

**Tests tab:**
```javascript
pm.test("Status 200", () => pm.response.to.have.status(200));
const res = pm.response.json();
pm.environment.set("TEACHER_TOKEN", res.token);
pm.test("Token exists", () => pm.expect(res.token).to.be.a('string'));
```

---

#### 1.7 Login — Student ✅ Happy Path
Same as above but with student credentials.
Save token as `STUDENT_TOKEN`.

---

#### 1.8 Login — Admin ✅ Happy Path
Same as above but with admin credentials.
Save token as `ADMIN_TOKEN`.

---

#### 1.9 Login — Wrong Password ❌ Error Case
```
POST {{BASE_URL}}/api/auth/login
Content-Type: application/json

{
  "email": "teacher@uni.edu",
  "password": "WrongPassword!"
}
```
**Expected:** `401` — invalid credentials message.

---

#### 1.10 Login — Non-existent Email ❌ Error Case
```
POST {{BASE_URL}}/api/auth/login

{
  "email": "ghost@uni.edu",
  "password": "Password123!"
}
```
**Expected:** `401`

---

#### 1.11 Get Current User ✅ Happy Path
```
GET {{BASE_URL}}/api/auth/me
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200` — user profile without password.

---

#### 1.12 Get Current User — No Token ❌ Error Case
```
GET {{BASE_URL}}/api/auth/me
```
**Expected:** `401` — no token provided.

---

#### 1.13 Get Current User — Invalid Token ❌ Error Case
```
GET {{BASE_URL}}/api/auth/me
Authorization: Bearer invalidtoken123
```
**Expected:** `401`

---

### 2. COURSES

---

#### 2.1 Create Course — Teacher ✅ Happy Path
```
POST {{BASE_URL}}/api/courses
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "title": "Introduction to Computer Science",
  "code": "CS101",
  "description": "Fundamentals of computing",
  "semester": "Semester 1",
  "academicYear": "2025/2026"
}
```
**Expected:** `201` — course object with teacher ID populated.

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("COURSE_ID", res.data._id);
```

---

#### 2.2 Create Course — Student Blocked ❌ Error Case
```
POST {{BASE_URL}}/api/courses
Authorization: Bearer {{STUDENT_TOKEN}}
Content-Type: application/json

{
  "title": "Unauthorized Course",
  "code": "XXX000"
}
```
**Expected:** `403` — forbidden.

---

#### 2.3 Get All Courses ✅ Happy Path
```
GET {{BASE_URL}}/api/courses
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — array of courses.

---

#### 2.4 Get Single Course ✅ Happy Path
```
GET {{BASE_URL}}/api/courses/{{COURSE_ID}}
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — course object.

---

#### 2.5 Get Course — Invalid ID ❌ Error Case
```
GET {{BASE_URL}}/api/courses/invalidid123
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `400` — invalid ObjectId.

---

#### 2.6 Update Course — Owner Teacher ✅ Happy Path
```
PUT {{BASE_URL}}/api/courses/{{COURSE_ID}}
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "description": "Updated course description"
}
```
**Expected:** `200`

---

#### 2.7 Update Course — Wrong Teacher ❌ Error Case
Register a second teacher, login, try to update COURSE_ID owned by the first teacher.
**Expected:** `403` — not the course owner.

---

#### 2.8 Delete Course ✅ Happy Path
Create a throwaway course first, then delete it.
```
DELETE {{BASE_URL}}/api/courses/{{THROWAWAY_COURSE_ID}}
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200`

---

### 3. ENROLLMENTS

---

#### 3.1 Enroll in Course — Student ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/enroll
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `201` — enrollment object.

---

#### 3.2 Enroll Twice — Same Course ❌ Error Case
Repeat the above request.
**Expected:** `400` — already enrolled.

---

#### 3.3 Enroll — Teacher Blocked ❌ Error Case
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/enroll
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `403`

---

#### 3.4 Get My Courses — Student ✅ Happy Path
```
GET {{BASE_URL}}/api/students/me/courses
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — array including the enrolled course.

---

#### 3.5 Drop Course ✅ Happy Path
```
DELETE {{BASE_URL}}/api/courses/{{COURSE_ID}}/enroll
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200`
Re-enroll after this test to keep the student enrolled for later tests.

---

### 4. MODULES & CONTENT

---

#### 4.1 Create Module ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/modules
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "title": "Week 1 — Introduction",
  "weekNumber": 1,
  "order": 1
}
```
**Expected:** `201`

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("MODULE_ID", res.data._id);
```

---

#### 4.2 Create Module — Student Blocked ❌ Error Case
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/modules
Authorization: Bearer {{STUDENT_TOKEN}}
Content-Type: application/json

{ "title": "Unauthorized Module", "weekNumber": 2, "order": 2 }
```
**Expected:** `403`

---

#### 4.3 Upload Content Item ✅ Happy Path
```
POST {{BASE_URL}}/api/modules/{{MODULE_ID}}/content
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: multipart/form-data

file: [attach a PDF file]
title: "Lecture 1 Slides"
type: "pdf"
order: 1
```
**Expected:** `201` — content item with Cloudinary `fileUrl`.

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("CONTENT_ID", res.data._id);
pm.test("fileUrl exists", () => pm.expect(res.data.fileUrl).to.include('cloudinary'));
```

---

#### 4.4 Upload Unsupported File Type ❌ Error Case
Attach a `.exe` or `.zip` file.
**Expected:** `400` — unsupported file type.

---

#### 4.5 Get Module Content ✅ Happy Path
```
GET {{BASE_URL}}/api/modules/{{MODULE_ID}}/content
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — array of content items.

---

### 5. ASSIGNMENTS & SUBMISSIONS

---

#### 5.1 Create Assignment ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/assignments
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "title": "Assignment 1 — Algorithms",
  "description": "Implement a binary search algorithm",
  "dueDate": "2026-06-01T23:59:00Z",
  "totalMarks": 100
}
```
**Expected:** `201`

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("ASSIGNMENT_ID", res.data._id);
```

---

#### 5.2 Submit Assignment — Text + File ✅ Happy Path
```
POST {{BASE_URL}}/api/assignments/{{ASSIGNMENT_ID}}/submit
Authorization: Bearer {{STUDENT_TOKEN}}
Content-Type: multipart/form-data

textContent: "Here is my solution explanation..."
files: [attach a PDF or DOCX]
```
**Expected:** `201` — submission with status `submitted`.

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("SUBMISSION_ID", res.data._id);
pm.test("Status is submitted", () => pm.expect(res.data.status).to.equal('submitted'));
```

---

#### 5.3 Submit Twice ❌ Error Case
Repeat the above request.
**Expected:** `400` — already submitted.

---

#### 5.4 View All Submissions — Teacher ✅ Happy Path
```
GET {{BASE_URL}}/api/assignments/{{ASSIGNMENT_ID}}/submissions
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200` — array of submissions.

---

#### 5.5 View All Submissions — Student Blocked ❌ Error Case
```
GET {{BASE_URL}}/api/assignments/{{ASSIGNMENT_ID}}/submissions
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `403`

---

#### 5.6 View Own Submission — Student ✅ Happy Path
```
GET {{BASE_URL}}/api/assignments/{{ASSIGNMENT_ID}}/my-submission
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200`

---

#### 5.7 Grade Submission ✅ Happy Path
```
PATCH {{BASE_URL}}/api/submissions/{{SUBMISSION_ID}}/grade
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "grade": 85,
  "feedback": "Good work, but improve your time complexity analysis."
}
```
**Expected:** `200` — submission status changes to `graded`.

---

#### 5.8 Grade Out of Range ❌ Error Case
```json
{ "grade": 150, "feedback": "Too high" }
```
**Expected:** `400` — grade exceeds totalMarks.

---

#### 5.9 Late Submission Detection ✅ Happy Path
Create an assignment with a `dueDate` in the past, then submit.
**Expected:** `201` — submission status should be `late`.

---

## PHASE 2 TESTS

---

### 6. GRADES & ANALYTICS

---

#### 6.1 Set Grade Weights ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/grade-weights
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "assignmentWeight": 60,
  "quizWeight": 40
}
```
**Expected:** `201`

---

#### 6.2 Set Invalid Weights — Dont Add to 100 ❌ Error Case
```json
{ "assignmentWeight": 70, "quizWeight": 40 }
```
**Expected:** `400` — weights must sum to 100.

---

#### 6.3 Get Student Final Grade ✅ Happy Path
```
GET {{BASE_URL}}/api/students/me/grades/{{COURSE_ID}}/final
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — `finalPercentage`, `assignmentAverage`, `quizAverage`, `weights`.

---

#### 6.4 Get Gradebook — Teacher ✅ Happy Path
```
GET {{BASE_URL}}/api/courses/{{COURSE_ID}}/gradebook
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200` — all students with their grade breakdowns.

---

#### 6.5 Get At-Risk Students ✅ Happy Path
```
GET {{BASE_URL}}/api/courses/{{COURSE_ID}}/analytics/at-risk
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200` — students with finalPercentage below 50%.

---

#### 6.6 Student Cannot Access Gradebook ❌ Error Case
```
GET {{BASE_URL}}/api/courses/{{COURSE_ID}}/gradebook
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `403`

---

### 7. QUIZ SYSTEM

---

#### 7.1 Create Quiz ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/quizzes
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "title": "Week 1 Quiz",
  "description": "Covers lecture 1 and 2",
  "duration": 30,
  "startTime": "2026-05-05T09:00:00Z",
  "endTime": "2026-05-05T10:00:00Z",
  "totalMarks": 20
}
```
**Expected:** `201`

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("QUIZ_ID", res.data._id);
```

---

#### 7.2 Add Multiple Choice Question ✅ Happy Path
```
POST {{BASE_URL}}/api/quizzes/{{QUIZ_ID}}/questions
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "text": "What does CPU stand for?",
  "type": "multiple_choice",
  "options": ["Central Processing Unit", "Computer Personal Unit", "Central Process Utility", "Core Processing Unit"],
  "correctAnswer": "0",
  "marks": 5,
  "order": 1
}
```
**Expected:** `201`

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("QUESTION_ID", res.data._id);
```

---

#### 7.3 Add True/False Question ✅ Happy Path
```json
{
  "text": "RAM is a type of permanent storage.",
  "type": "true_false",
  "correctAnswer": "false",
  "marks": 5,
  "order": 2
}
```
**Expected:** `201`

---

#### 7.4 Add Short Answer Question ✅ Happy Path
```json
{
  "text": "Explain the difference between RAM and ROM.",
  "type": "short_answer",
  "marks": 10,
  "order": 3
}
```
**Expected:** `201`

---

#### 7.5 Publish Quiz ✅ Happy Path
```
PATCH {{BASE_URL}}/api/quizzes/{{QUIZ_ID}}/publish
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200` — `isPublished: true`

---

#### 7.6 Get Quiz — correctAnswer Hidden from Student ✅ Critical Test
```
GET {{BASE_URL}}/api/quizzes/{{QUIZ_ID}}
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — questions returned BUT no `correctAnswer` field in any question.

**Tests tab:**
```javascript
const res = pm.response.json();
const questions = res.data.questions || [];
questions.forEach(q => {
  pm.test(`No correctAnswer on question ${q._id}`, () => {
    pm.expect(q).to.not.have.property('correctAnswer');
  });
});
```

---

#### 7.7 Start Quiz Attempt ✅ Happy Path
```
POST {{BASE_URL}}/api/quizzes/{{QUIZ_ID}}/start
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `201` — attempt created with status `in_progress`.

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("ATTEMPT_ID", res.data._id);
```

---

#### 7.8 Start Quiz Twice ❌ Error Case
Repeat the start request.
**Expected:** `400` — already attempted.

---

#### 7.9 Submit Quiz Answers ✅ Happy Path
```
POST {{BASE_URL}}/api/quizzes/{{QUIZ_ID}}/submit
Authorization: Bearer {{STUDENT_TOKEN}}
Content-Type: application/json

{
  "answers": [
    { "questionId": "{{QUESTION_ID}}", "answer": "0" },
    { "questionId": "TRUFALSE_Q_ID", "answer": "false" },
    { "questionId": "SHORT_Q_ID", "answer": "RAM is volatile memory, ROM is non-volatile." }
  ]
}
```
**Expected:** `200` — MCQ and T/F auto-graded, short answer pending.

**Tests tab:**
```javascript
const res = pm.response.json();
pm.test("MCQ and T/F graded", () => pm.expect(res.data.score).to.be.a('number'));
pm.test("Status is submitted", () => pm.expect(res.data.status).to.equal('submitted'));
```

---

#### 7.10 Grade Short Answer — Teacher ✅ Happy Path
```
PATCH {{BASE_URL}}/api/attempts/{{ATTEMPT_ID}}/grade
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "grades": [
    { "questionId": "SHORT_Q_ID", "score": 8 }
  ]
}
```
**Expected:** `200` — attempt status changes to `graded`.

---

### 8. ATTENDANCE

---

#### 8.1 Create Attendance Session ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/attendance
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "date": "2026-05-05T08:00:00Z",
  "topic": "Introduction to Algorithms"
}
```
**Expected:** `201`

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("ATTENDANCE_SESSION_ID", res.data._id);
```

---

#### 8.2 Bulk Mark Attendance ✅ Happy Path
```
POST {{BASE_URL}}/api/attendance/{{ATTENDANCE_SESSION_ID}}/mark
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "records": [
    { "studentId": "STUDENT_ID_HERE", "status": "present" }
  ]
}
```
**Expected:** `200` — all records created.

---

#### 8.3 Mark Attendance — Student Blocked ❌ Error Case
```
POST {{BASE_URL}}/api/attendance/{{ATTENDANCE_SESSION_ID}}/mark
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `403`

---

#### 8.4 Get Own Attendance — Student ✅ Happy Path
```
GET {{BASE_URL}}/api/students/me/attendance/{{COURSE_ID}}
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — attendance records with percentage.

---

#### 8.5 Get Attendance Summary — Teacher ✅ Happy Path
```
GET {{BASE_URL}}/api/courses/{{COURSE_ID}}/attendance/summary
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200` — each student's attendance percentage.

---

### 9. COMMUNICATION

---

#### 9.1 Create Announcement ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/announcements
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "title": "Exam Date Change",
  "body": "The Week 3 quiz has been moved to Friday."
}
```
**Expected:** `201`

---

#### 9.2 Create Announcement — Student Blocked ❌ Error Case
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/announcements
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `403`

---

#### 9.3 Start Discussion Thread ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/discussions
Authorization: Bearer {{STUDENT_TOKEN}}
Content-Type: application/json

{
  "title": "Question about Assignment 1",
  "body": "Can we use recursion for the binary search?"
}
```
**Expected:** `201`

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("DISCUSSION_ID", res.data._id);
```

---

#### 9.4 Reply to Discussion ✅ Happy Path
```
POST {{BASE_URL}}/api/discussions/{{DISCUSSION_ID}}/reply
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "body": "Yes, recursive approach is acceptable."
}
```
**Expected:** `200` — reply added to thread.

---

#### 9.5 Get My Notifications ✅ Happy Path
```
GET {{BASE_URL}}/api/notifications/me
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — array of notifications.

---

#### 9.6 Mark Notification as Read ✅ Happy Path
```
PATCH {{BASE_URL}}/api/notifications/NOTIFICATION_ID/read
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — `isRead: true`

---

### 10. LIVE CLASSROOM

---

#### 10.1 Create Live Session ✅ Happy Path
```
POST {{BASE_URL}}/api/courses/{{COURSE_ID}}/live-sessions
Authorization: Bearer {{TEACHER_TOKEN}}
Content-Type: application/json

{
  "title": "Week 1 Live Lecture",
  "scheduledAt": "2026-05-05T10:00:00Z",
  "duration": 60
}
```
**Expected:** `201` — session with `status: scheduled`.

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("LIVE_SESSION_ID", res.data._id);
```

---

#### 10.2 Student Join Before Session Starts ❌ Error Case
```
GET {{BASE_URL}}/api/live-sessions/{{LIVE_SESSION_ID}}/join
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `403` — session has not started yet.

---

#### 10.3 Start Session ✅ Happy Path
```
PATCH {{BASE_URL}}/api/live-sessions/{{LIVE_SESSION_ID}}/start
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200` — `status: live`

---

#### 10.4 Student Join While Live ✅ Happy Path
```
GET {{BASE_URL}}/api/live-sessions/{{LIVE_SESSION_ID}}/join
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `200` — `joinUrl` returned.

---

#### 10.5 End Session ✅ Happy Path
```
PATCH {{BASE_URL}}/api/live-sessions/{{LIVE_SESSION_ID}}/end
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `200` — `status: ended`

---

## ADMIN MODULE TESTS

---

### 11. USER MANAGEMENT

---

#### 11.1 List All Users ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/users
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — paginated list of all users.

---

#### 11.2 Filter Users by Role ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/users?role=student
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — only students returned.

---

#### 11.3 Search Users ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/users?search=ama
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — users matching name or email.

---

#### 11.4 List Users — Non-Admin Blocked ❌ Error Case
```
GET {{BASE_URL}}/api/admin/users
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `403`

---

#### 11.5 Change User Role ✅ Happy Path
```
PATCH {{BASE_URL}}/api/admin/users/{{TARGET_USER_ID}}/role
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{ "role": "teacher" }
```
**Expected:** `200`

---

#### 11.6 Admin Changes Own Role ❌ Error Case
Use the admin's own ID as the target.
**Expected:** `403` — cannot change own role.

---

#### 11.7 Suspend User ✅ Happy Path
```
PATCH {{BASE_URL}}/api/admin/users/{{TARGET_USER_ID}}/status
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{ "status": "suspended" }
```
**Expected:** `200`

---

#### 11.8 Suspended User Cannot Login ❌ Critical Test
Try to login with the suspended user's credentials.
**Expected:** `401` — account suspended.

---

#### 11.9 Reactivate User ✅ Happy Path
```json
{ "status": "active" }
```
**Expected:** `200` — user can login again.

---

#### 11.10 Admin Suspends Another Admin ❌ Error Case
Use another admin's ID.
**Expected:** `403`

---

### 12. IMPERSONATION

---

#### 12.1 Start Impersonation ✅ Happy Path
```
POST {{BASE_URL}}/api/admin/users/{{TARGET_USER_ID}}/impersonate
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — short-lived `impersonationToken` returned.

**Tests tab:**
```javascript
const res = pm.response.json();
pm.environment.set("IMPERSONATION_TOKEN", res.impersonationToken);
```

---

#### 12.2 Impersonation Token Has isImpersonation Flag ✅ Critical Test
Decode the JWT payload (base64 decode the middle section):

**Tests tab:**
```javascript
const token = pm.environment.get("IMPERSONATION_TOKEN");
const payload = JSON.parse(atob(token.split('.')[1]));
pm.test("isImpersonation is true", () => pm.expect(payload.isImpersonation).to.be.true);
pm.test("impersonatedBy exists", () => pm.expect(payload.impersonatedBy).to.be.a('string'));
```

---

#### 12.3 Use Impersonation Token to Access Platform ✅ Happy Path
```
GET {{BASE_URL}}/api/auth/me
Authorization: Bearer {{IMPERSONATION_TOKEN}}
```
**Expected:** `200` — returns the impersonated user's profile.

---

#### 12.4 Impersonation Cannot Chain ❌ Critical Security Test
```
POST {{BASE_URL}}/api/admin/users/ANOTHER_USER_ID/impersonate
Authorization: Bearer {{IMPERSONATION_TOKEN}}
```
**Expected:** `403` — cannot impersonate while in impersonation session.

---

#### 12.5 Impersonation Cannot Delete Users ❌ Critical Security Test
```
DELETE {{BASE_URL}}/api/admin/users/SOME_USER_ID
Authorization: Bearer {{IMPERSONATION_TOKEN}}
```
**Expected:** `403`

---

#### 12.6 Exit Impersonation ✅ Happy Path
```
POST {{BASE_URL}}/api/admin/impersonate/exit
Authorization: Bearer {{IMPERSONATION_TOKEN}}
```
**Expected:** `200` — original admin token returned.

---

### 13. COURSE MANAGEMENT (ADMIN)

---

#### 13.1 List All Courses with Enrollment Count ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/courses
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — each course includes `enrollmentCount`.

**Tests tab:**
```javascript
const res = pm.response.json();
pm.test("enrollmentCount present", () => {
  res.data.forEach(c => pm.expect(c).to.have.property('enrollmentCount'));
});
```

---

#### 13.2 Reassign Teacher ✅ Happy Path
```
PATCH {{BASE_URL}}/api/admin/courses/{{COURSE_ID}}/teacher
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{ "teacherId": "NEW_TEACHER_ID" }
```
**Expected:** `200` — course now has new teacher.

---

#### 13.3 Reassign to Non-Teacher ❌ Error Case
Use a student's ID as the new teacher.
**Expected:** `400` — user is not a teacher.

---

#### 13.4 Archive Course ✅ Happy Path
```
PATCH {{BASE_URL}}/api/admin/courses/{{COURSE_ID}}/status
Authorization: Bearer {{ADMIN_TOKEN}}
Content-Type: application/json

{ "status": "archived" }
```
**Expected:** `200`

---

#### 13.5 Delete Course + Cascade ✅ Critical Test
Create a throwaway course with modules, content, and enrollments, then delete it.
```
DELETE {{BASE_URL}}/api/admin/courses/THROWAWAY_COURSE_ID
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200`

Then verify cascade by trying to fetch the modules:
```
GET {{BASE_URL}}/api/courses/THROWAWAY_COURSE_ID/modules
Authorization: Bearer {{TEACHER_TOKEN}}
```
**Expected:** `404` or empty array — no orphaned documents.

---

### 14. ANALYTICS

---

#### 14.1 Platform Overview ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/analytics/overview
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — totalUsers, totalCourses, totalEnrollments, etc.

**Tests tab:**
```javascript
const res = pm.response.json();
const fields = ['totalUsers','totalStudents','totalTeachers','totalCourses','totalEnrollments'];
fields.forEach(f => pm.test(`${f} present`, () => pm.expect(res.data).to.have.property(f)));
```

---

#### 14.2 User Growth Analytics ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/analytics/users
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — monthly breakdown with student and teacher counts.

---

#### 14.3 Grade Analytics ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/analytics/grades
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — platformAverage, distribution, passRate, failRate.

---

#### 14.4 Attendance Analytics ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/analytics/attendance
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — platformAttendanceRate and courseBreakdown.

---

#### 14.5 Analytics — Non-Admin Blocked ❌ Error Case
```
GET {{BASE_URL}}/api/admin/analytics/overview
Authorization: Bearer {{STUDENT_TOKEN}}
```
**Expected:** `403`

---

### 15. ACTIVITY LOGS

---

#### 15.1 Get All Admin Logs ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/logs
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — paginated logs with adminId populated.

---

#### 15.2 Filter Logs by Action ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/logs?action=SUSPEND_USER
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — only SUSPEND_USER logs.

---

#### 15.3 Get Logs for Specific User ✅ Happy Path
```
GET {{BASE_URL}}/api/admin/logs/{{TARGET_USER_ID}}
Authorization: Bearer {{ADMIN_TOKEN}}
```
**Expected:** `200` — logs related to that user.

---

#### 15.4 Verify Actions Are Logged ✅ Critical Test
After running tests 11.7 (suspend), 12.1 (impersonate), and 13.4 (archive course),
fetch the logs and confirm those actions appear:

```
GET {{BASE_URL}}/api/admin/logs
Authorization: Bearer {{ADMIN_TOKEN}}
```

**Tests tab:**
```javascript
const res = pm.response.json();
const actions = res.data.map(l => l.action);
pm.test("SUSPEND_USER logged", () => pm.expect(actions).to.include('SUSPEND_USER'));
pm.test("IMPERSONATE_START logged", () => pm.expect(actions).to.include('IMPERSONATE_START'));
pm.test("ARCHIVE_COURSE logged", () => pm.expect(actions).to.include('ARCHIVE_COURSE'));
```

---

## Testing Order (Run in This Sequence)

```
1.  Register Teacher, Student, Admin         (1.1 → 1.3)
2.  Login all three, save tokens             (1.6 → 1.8)
3.  Create Course                            (2.1)
4.  Enroll Student                           (3.1)
5.  Create Module                            (4.1)
6.  Upload Content                           (4.3)
7.  Create Assignment                        (5.1)
8.  Submit Assignment                        (5.2)
9.  Grade Submission                         (5.7)
10. Set Grade Weights                        (6.1)
11. Create & Publish Quiz                    (7.1 → 7.5)
12. Add Questions                            (7.2 → 7.4)
13. Start & Submit Quiz Attempt              (7.7 → 7.9)
14. Grade Short Answer                       (7.10)
15. Check Final Grade                        (6.3)
16. Create Attendance Session + Mark         (8.1 → 8.2)
17. Create Announcement + Discussion         (9.1 → 9.4)
18. Create & Run Live Session                (10.1 → 10.5)
19. Admin User Tests                         (11.1 → 11.9)
20. Impersonation Tests                      (12.1 → 12.6)
21. Admin Course Tests                       (13.1 → 13.5)
22. Analytics Tests                          (14.1 → 14.5)
23. Verify Activity Logs                     (15.4)
24. Run all error cases                      (all ❌ tests)
```

---

## Quick Reference — Expected Status Codes

| Scenario | Code |
|----------|------|
| Created successfully | 201 |
| Fetched / Updated successfully | 200 |
| Not authenticated (no/bad token) | 401 |
| Authenticated but wrong role | 403 |
| Resource not found | 404 |
| Bad request / validation error | 400 |
| Server error | 500 |
