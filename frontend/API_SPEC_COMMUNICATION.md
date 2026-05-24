# API Specification - Communication Endpoints

## Messages

### 1. Get Conversations
**GET** `/communication/conversations`

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
      "_id": "conversation_id",
      "participantId": "user_id",
      "participantName": "John Doe",
      "lastMessage": "See you tomorrow",
      "lastMessageTime": "2025-06-10T15:30:00Z",
      "unreadCount": 2
    }
  ]
}
```

---

### 2. Get Messages
**GET** `/communication/messages/:userId`

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
      "_id": "message_id",
      "senderId": "sender_id",
      "senderName": "John Doe",
      "content": "Hello, how are you?",
      "timestamp": "2025-06-10T15:30:00Z",
      "read": true
    }
  ]
}
```

---

## Notifications

### 3. Get My Notifications
**GET** `/communication/notifications/me`

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
      "_id": "notification_id",
      "type": "assignment_due",
      "title": "Assignment Due Soon",
      "message": "Build a Todo App is due in 2 days",
      "courseId": "course_id",
      "courseName": "CS101",
      "read": false,
      "createdAt": "2025-06-10T10:00:00Z"
    }
  ]
}
```

---

### 4. Mark Notification as Read
**PATCH** `/communication/notifications/:id/read`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## Announcements

### 5. Get Course Announcements
**GET** `/courses/:id/announcements`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "announcement_id",
      "title": "Welcome to CS101",
      "content": "Welcome to Introduction to Computer Science",
      "author": {
        "_id": "teacher_id",
        "name": "Dr. Smith"
      },
      "createdAt": "2025-06-10T10:00:00Z",
      "updatedAt": "2025-06-10T10:00:00Z"
    }
  ]
}
```

---

### 6. Create Announcement
**POST** `/courses/:id/announcements`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "Welcome to CS101",
  "body": "Welcome to Introduction to Computer Science"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* announcement */ }
}
```

---

## Discussions

### 7. Get Course Discussions
**GET** `/courses/:id/discussions`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "discussion_id",
      "title": "How to approach the assignment?",
      "author": {
        "_id": "user_id",
        "name": "John Doe"
      },
      "replies": 5,
      "lastReply": "2025-06-10T15:30:00Z",
      "createdAt": "2025-06-10T10:00:00Z"
    }
  ]
}
```

---

### 8. Create Discussion
**POST** `/courses/:id/discussions`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "How to approach the assignment?",
  "body": "I'm not sure how to start with this assignment. Any tips?"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* discussion */ }
}
```

---

### 9. Get Discussion Details
**GET** `/communication/discussions/:id`

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "discussion_id",
    "title": "How to approach the assignment?",
    "body": "I'm not sure how to start with this assignment. Any tips?",
    "author": {
      "_id": "user_id",
      "name": "John Doe"
    },
    "replies": [
      {
        "_id": "reply_id",
        "author": {
          "_id": "user_id",
          "name": "Jane Doe"
        },
        "content": "Start with the basic structure",
        "createdAt": "2025-06-10T11:00:00Z"
      }
    ],
    "createdAt": "2025-06-10T10:00:00Z"
  }
}
```

---

### 10. Reply to Discussion
**POST** `/communication/discussions/:id/reply`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "content": "Start with the basic structure"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "_id": "reply_id",
    "author": {
      "_id": "user_id",
      "name": "Jane Doe"
    },
    "content": "Start with the basic structure",
    "createdAt": "2025-06-10T11:00:00Z"
  }
}
```

---

## Live Sessions

### 11. Get Live Sessions
**GET** `/courses/:id/live-sessions`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "session_id",
      "title": "Live Class - Module 1",
      "scheduledAt": "2025-06-15T10:00:00Z",
      "duration": 60,
      "status": "scheduled",
      "meetingUrl": "https://meet.example.com/session123"
    }
  ]
}
```

---

### 12. Create Live Session
**POST** `/courses/:id/live-sessions`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Request:**
```json
{
  "title": "Live Class - Module 1",
  "scheduledAt": "2025-06-15T10:00:00Z",
  "duration": 60
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* session */ }
}
```

---

### 13. Start Live Session
**PATCH** `/live-sessions/:id/start`

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
    "status": "active",
    "meetingUrl": "https://meet.example.com/session123"
  }
}
```

---

### 14. End Live Session
**PATCH** `/live-sessions/:id/end`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Session ended"
}
```

---

### 15. Join Live Session
**GET** `/live-sessions/:id/join`

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
    "meetingUrl": "https://meet.example.com/session123",
    "status": "active"
  }
}
```
