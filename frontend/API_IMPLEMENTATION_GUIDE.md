# Backend API Implementation Guide

## Overview

This guide helps backend developers implement the UniLearn API endpoints. All specifications are documented in the `API_SPEC_*.md` files.

## Quick Start

### 1. Review API Specification
Start with `API_SPECIFICATION_INDEX.md` for a complete overview of all endpoints.

### 2. Choose Implementation Order

**Phase 1: Core (Week 1)**
- Authentication endpoints
- Course management
- Enrollment system

**Phase 2: Features (Week 2)**
- Assignments
- Quizzes
- Grading

**Phase 3: Advanced (Week 3)**
- Admin management
- Analytics
- Communication

**Phase 4: Polish (Week 4)**
- Attendance
- Live sessions
- Reporting

### 3. Implementation Steps

For each endpoint:
1. Read the specification in the relevant `API_SPEC_*.md` file
2. Implement the endpoint with exact request/response format
3. Add error handling
4. Test with frontend
5. Document any deviations

## API Specification Files

### Authentication (`API_SPEC_AUTH.md`)
- User registration
- Login/logout
- Google OAuth
- Profile management

**Key Points:**
- Use JWT tokens
- Implement token expiry
- Hash passwords securely
- Validate email format

### Courses (`API_SPEC_COURSES.md`)
- Course CRUD operations
- Enrollment management
- Module/lesson management
- Grade weights

**Key Points:**
- Implement role-based access
- Track enrollment dates
- Support bulk enrollment
- Calculate grade weights

### Assignments (`API_SPEC_ASSIGNMENTS.md`)
- Assignment CRUD
- Submission handling
- Grading system
- File uploads

**Key Points:**
- Support file uploads
- Track submission dates
- Implement late submission handling
- Store feedback

### Quizzes (`API_SPEC_ASSIGNMENTS.md`)
- Quiz CRUD
- Question management
- Quiz attempts
- Auto-grading

**Key Points:**
- Support multiple question types
- Implement time limits
- Track attempt history
- Calculate scores

### Admin (`API_SPEC_ADMIN.md`)
- User management
- Course approval
- Analytics
- System logs

**Key Points:**
- Implement role-based access
- Log all admin actions
- Support user impersonation
- Track system health

### Communication (`API_SPEC_COMMUNICATION.md`)
- Announcements
- Discussions
- Messages
- Live sessions

**Key Points:**
- Support rich text
- Implement notifications
- Track read status
- Support file attachments

### Attendance (`API_SPEC_ATTENDANCE.md`)
- Attendance tracking
- Session management
- Attendance reports

**Key Points:**
- Track attendance per session
- Calculate attendance rates
- Support multiple statuses (present, absent, late)

### Student (`API_SPEC_STUDENT.md`)
- Student dashboard
- Grade tracking
- Milestone tracking

**Key Points:**
- Aggregate student data
- Calculate GPA
- Track progress

### Teacher (`API_SPEC_TEACHER.md`)
- Teacher dashboard
- Grading interface
- Analytics

**Key Points:**
- Aggregate class data
- Support bulk grading
- Track pending work

## Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String (student|teacher|admin),
  department: String,
  status: String (active|inactive|suspended),
  createdAt: Date,
  updatedAt: Date
}
```

### Course Collection
```javascript
{
  _id: ObjectId,
  code: String (unique),
  title: String,
  description: String,
  teacher: ObjectId (ref: User),
  status: String (draft|active|archived),
  semester: String,
  academicYear: String,
  capacity: Number,
  students: [ObjectId] (ref: User),
  modules: [ObjectId] (ref: Module),
  createdAt: Date,
  updatedAt: Date
}
```

### Assignment Collection
```javascript
{
  _id: ObjectId,
  course: ObjectId (ref: Course),
  title: String,
  description: String,
  dueDate: Date,
  points: Number,
  rubric: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Quiz Collection
```javascript
{
  _id: ObjectId,
  course: ObjectId (ref: Course),
  title: String,
  description: String,
  questions: [ObjectId] (ref: Question),
  points: Number,
  timeLimit: Number,
  status: String (draft|published),
  createdAt: Date,
  updatedAt: Date
}
```

## Authentication

### JWT Implementation
```javascript
// Generate token
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

// Verify token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Middleware
```javascript
// Protect routes
app.use('/api/protected', authenticateToken);

// Role-based access
app.use('/api/admin', requireRole('admin'));
```

## Error Handling

### Standard Error Response
```javascript
{
  success: false,
  message: "Error message",
  details: ["Optional", "error", "details"]
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Validation Error
- 500: Server Error

## Validation

### Input Validation
```javascript
// Email validation
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Password validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Date validation
const isValidDate = (date) => date instanceof Date && !isNaN(date);
```

### File Validation
```javascript
// Check file type
const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

// Check file size
const maxSize = 50 * 1024 * 1024; // 50MB

// Check file extension
const allowedExtensions = ['.jpg', '.png', '.pdf'];
```

## Rate Limiting

### Recommended Limits
```javascript
// Login: 5 requests per 15 minutes
app.post('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5
}));

// API: 100 requests per minute
app.use('/api/', rateLimit({
  windowMs: 60 * 1000,
  max: 100
}));
```

## Pagination

### Implementation
```javascript
// Query parameters
const page = req.query.page || 1;
const limit = req.query.limit || 10;
const skip = (page - 1) * limit;

// Database query
const items = await Collection.find()
  .skip(skip)
  .limit(limit);

const totalItems = await Collection.countDocuments();
const totalPages = Math.ceil(totalItems / limit);

// Response
res.json({
  success: true,
  data: items,
  totalPages,
  currentPage: page,
  totalItems
});
```

## Logging

### Log Important Events
```javascript
// User login
logger.info(`User ${userId} logged in`);

// Course created
logger.info(`Course ${courseId} created by ${teacherId}`);

// Assignment submitted
logger.info(`Assignment ${assignmentId} submitted by ${studentId}`);

// Error
logger.error(`Error in endpoint: ${error.message}`);
```

## Testing

### Test Each Endpoint
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Test course creation
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer token" \
  -H "Content-Type: application/json" \
  -d '{"code":"CS101","title":"Intro to CS"}'
```

### Test Cases
- Valid requests
- Invalid input
- Missing authentication
- Insufficient permissions
- Resource not found
- Duplicate resources
- File uploads
- Pagination
- Filtering
- Sorting

## Deployment

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://...
JWT_SECRET=your_secret_key
SENDGRID_API_KEY=your_api_key
SENTRY_DSN=your_sentry_dsn
```

### Database Migrations
```bash
# Run migrations
npm run migrate

# Seed test data
npm run seed
```

### Health Check
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});
```

## Performance Optimization

### Database Indexing
```javascript
// Create indexes for frequently queried fields
db.users.createIndex({ email: 1 });
db.courses.createIndex({ teacher: 1 });
db.assignments.createIndex({ course: 1, dueDate: 1 });
```

### Caching
```javascript
// Cache frequently accessed data
const cache = new Map();

app.get('/api/courses/:id', (req, res) => {
  const cached = cache.get(req.params.id);
  if (cached) return res.json(cached);
  
  // Fetch from DB
  const course = getCourse(req.params.id);
  cache.set(req.params.id, course);
  res.json(course);
});
```

### Query Optimization
```javascript
// Use projection to limit fields
const course = await Course.findById(id).select('title teacher students');

// Use lean() for read-only queries
const courses = await Course.find().lean();

// Use populate() for relationships
const course = await Course.findById(id).populate('teacher');
```

## Security

### Input Sanitization
```javascript
const sanitize = (input) => {
  return input.trim().replace(/[<>]/g, '');
};
```

### SQL Injection Prevention
```javascript
// Use parameterized queries
const user = await User.findOne({ email: email });
```

### CORS Configuration
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### HTTPS
```javascript
// Enforce HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

## Monitoring

### Error Tracking
```javascript
// Sentry integration
Sentry.captureException(error);
```

### Performance Monitoring
```javascript
// Track response times
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

## Support

For implementation questions:
1. Check the relevant `API_SPEC_*.md` file
2. Review the example request/response
3. Check error handling section
4. Review database schema
5. Test with provided test credentials

---

**Last Updated:** 2025-05-24
**Status:** Ready for Backend Implementation
**Frontend Status:** Ready - All API calls configured
