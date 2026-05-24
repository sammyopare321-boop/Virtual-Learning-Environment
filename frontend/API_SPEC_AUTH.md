# API Specification - Authentication Endpoints

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### 1. Register
**POST** `/auth/register`

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "department": "Computer Science",
  "role": "student"
}
```

**Response (201):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "department": "Computer Science",
    "status": "active",
    "createdAt": "2025-05-24T00:00:00Z"
  }
}
```

---

### 2. Login
**POST** `/auth/login`

**Request:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "department": "Computer Science",
    "status": "active"
  }
}
```

---

### 3. Google Login
**POST** `/auth/google`

**Request:**
```json
{
  "token": "google_id_token",
  "role": "student",
  "department": "Computer Science"
}
```

**Response (200):**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student"
  }
}
```

---

### 4. Get Current User
**GET** `/auth/me`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "department": "Computer Science",
    "status": "active"
  }
}
```

---

### 5. Update Current User
**PUT** `/auth/me`

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
  "data": {
    "_id": "user_id",
    "name": "Jane Doe",
    "email": "jane@example.com",
    "role": "student",
    "department": "Engineering"
  }
}
```

---

### 6. Logout
**POST** `/auth/logout`

**Headers:**
```
Authorization: Bearer jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Validation error",
  "details": ["Email is required", "Password must be at least 8 characters"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

### 409 Conflict
```json
{
  "success": false,
  "message": "Email already registered"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error"
}
```
