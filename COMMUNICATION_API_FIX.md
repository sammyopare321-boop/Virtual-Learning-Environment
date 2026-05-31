# Communication API Fix Summary

## Issue
The `getCourseMessages` endpoint needed better error handling and validation.

## Changes Made

### 1. Enhanced Controller Function
**File**: `backend/src/controllers/communicationController.js`

**Improvements**:
- Added courseId validation (MongoDB ObjectId format check)
- Added better error messages
- Added message count in response
- Improved response structure

**Before**:
```javascript
exports.getCourseMessages = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({ course: req.params.courseId })
    .populate('sender', 'name avatar role')
    .sort('createdAt');

  res.status(200).json({ success: true, data: messages });
});
```

**After**:
```javascript
exports.getCourseMessages = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  
  // Validate courseId format
  if (!courseId || !courseId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid course ID format' 
    });
  }

  const messages = await Message.find({ course: courseId })
    .populate('sender', 'name avatar role')
    .sort('createdAt');

  res.status(200).json({ 
    success: true, 
    count: messages.length,
    data: messages 
  });
});
```

### 2. Created Test Script
**File**: `backend/test_communication_api.js`

A comprehensive test script to verify all communication endpoints:
- Login authentication
- Get course messages
- Get conversations
- Get notifications

## API Endpoints

### Get Course Messages
```
GET /api/communication/courses/:courseId/messages
GET /api/v1/communication/courses/:courseId/messages
```

**Authentication**: Required (Bearer token)

**Parameters**:
- `courseId` (path): MongoDB ObjectId of the course

**Response**:
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "sender": {
        "_id": "...",
        "name": "John Doe",
        "avatar": "avatar.jpg",
        "role": "student"
      },
      "body": "Hello everyone!",
      "course": "507f1f77bcf86cd799439011",
      "isRead": false,
      "createdAt": "2026-05-27T10:00:00.000Z"
    }
  ]
}
```

**Error Responses**:
- `400 Bad Request`: Invalid course ID format
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

## Testing

### Option 1: Using the Test Script
```bash
# Update TEST_USER credentials in test_communication_api.js
# Update sampleCourseId with actual course ID

node backend/test_communication_api.js
```

### Option 2: Using curl
```bash
# 1. Login to get token
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 2. Use token to get course messages
curl http://localhost:5000/api/communication/courses/507f1f77bcf86cd799439011/messages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Option 3: Using Postman
1. **Login**:
   - Method: POST
   - URL: `http://localhost:5000/api/auth/login`
   - Body: `{"email":"test@example.com","password":"password123"}`
   - Copy the token from response

2. **Get Course Messages**:
   - Method: GET
   - URL: `http://localhost:5000/api/communication/courses/COURSE_ID/messages`
   - Headers: `Authorization: Bearer YOUR_TOKEN`

## Validation

### Valid Course ID Format
- Must be 24 hexadecimal characters
- Example: `507f1f77bcf86cd799439011`

### Invalid Course ID Examples
- `123` - Too short
- `invalid-id` - Not hexadecimal
- `507f1f77bcf86cd799439011x` - Too long

## Related Files

- `backend/src/controllers/communicationController.js` - Controller functions
- `backend/src/routes/communication.js` - Route definitions
- `backend/src/models/Message.js` - Message model
- `backend/src/server.js` - Route mounting
- `backend/test_communication_api.js` - Test script

## Database Schema

### Message Model
```javascript
{
  sender: ObjectId (ref: User) - required
  receiver: ObjectId (ref: User) - optional
  course: ObjectId (ref: Course) - optional
  body: String - required
  isRead: Boolean - default: false
  createdAt: Date - default: Date.now
}
```

**Indexes**:
- `{ sender: 1, receiver: 1 }` - For user-to-user messages
- `{ course: 1 }` - For course messages
- `{ createdAt: 1 }` - For sorting

## Common Issues & Solutions

### Issue 1: 401 Unauthorized
**Cause**: Missing or invalid authentication token

**Solution**:
- Ensure you're logged in
- Include `Authorization: Bearer TOKEN` header
- Check token hasn't expired

### Issue 2: 400 Invalid course ID format
**Cause**: Course ID is not a valid MongoDB ObjectId

**Solution**:
- Use a valid 24-character hexadecimal string
- Get actual course IDs from database or `/api/courses` endpoint

### Issue 3: Empty data array
**Cause**: No messages exist for that course

**Solution**:
- This is normal if no messages have been sent
- Create test messages using Socket.io or direct database insert

### Issue 4: 404 Not Found
**Cause**: Wrong URL or server not running

**Solution**:
- Verify server is running on port 5000
- Check URL is correct: `/api/communication/courses/:courseId/messages`
- Ensure communication routes are mounted in server.js

## Next Steps

1. **Start the server**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Run the test script**:
   ```bash
   node test_communication_api.js
   ```

3. **Verify the endpoint works**:
   - Check console output for success messages
   - Verify response data structure

4. **Test with real data**:
   - Create a course
   - Send messages to the course
   - Retrieve messages using the endpoint

## Status

✅ Controller function enhanced with validation  
✅ Error handling improved  
✅ Test script created  
✅ Documentation complete  
✅ No syntax errors  
✅ Ready for testing

---

**Last Updated**: May 27, 2026  
**Status**: Fixed and Ready for Testing
