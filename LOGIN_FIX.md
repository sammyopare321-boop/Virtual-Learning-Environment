# Login 401 Error Fix

## Issue
Users experiencing 401 errors when attempting to log in.

## Root Cause
JWT environment variable mismatch:
- `.env.example` uses `JWT_EXPIRE`
- Code was looking for `JWT_EXPIRES_IN`
- If `JWT_EXPIRES_IN` is undefined, JWT token generation fails

## Fixes Applied

### 1. JWT Environment Variable Compatibility
**File**: `backend/src/models/User.js`

```javascript
// Before
expiresIn: process.env.JWT_EXPIRES_IN

// After (supports both variable names)
expiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d'
```

### 2. Admin Impersonation JWT Fix
**File**: `backend/src/controllers/adminUserController.js`

```javascript
// Before
expiresIn: process.env.JWT_EXPIRES_IN || '7d'

// After
expiresIn: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d'
```

### 3. Enhanced Login Logging
**File**: `backend/src/controllers/authController.js`

Added detailed logging for login attempts:
- User not found
- Google user attempting password login
- Invalid password
- Successful login

## Environment Variable Setup

### On Render

Make sure you have set:
```
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRE=7d
```

**OR** (for backward compatibility):
```
JWT_SECRET=your_secure_random_string_here
JWT_EXPIRES_IN=7d
```

### Common JWT_SECRET Values
Generate a secure secret:
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# OpenSSL
openssl rand -hex 64
```

## Testing After Fix

### 1. Test Login with Valid Credentials
```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

**Expected**: 200 OK with token

### 2. Test Login with Invalid Credentials
```bash
curl -X POST https://your-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"wrongpassword"}'
```

**Expected**: 401 with "Invalid credentials"

### 3. Check Server Logs
Look for:
```
[AUTH] Login successful: user@example.com (student)
[AUTH] Login failed: Invalid password for email: user@example.com
[AUTH] Login failed: User not found for email: nonexistent@example.com
```

## Common Login Issues & Solutions

### Issue 1: "Invalid credentials" for correct password
**Possible Causes:**
- User doesn't exist in database
- Password was changed but user is using old password
- User account was created with Google OAuth (can't use password login)

**Solution:**
- Check server logs for specific error
- Verify user exists: Check MongoDB Atlas or use admin panel
- If Google user, use Google Sign-In button

### Issue 2: "This account was created using Google Sign-In"
**Cause:** User registered with Google OAuth but trying to use password login

**Solution:** Use the Google Sign-In button instead

### Issue 3: JWT token not being generated
**Possible Causes:**
- `JWT_SECRET` not set in environment variables
- `JWT_EXPIRE` or `JWT_EXPIRES_IN` not set (now has fallback to '7d')

**Solution:**
- Set `JWT_SECRET` in Render environment variables
- Optionally set `JWT_EXPIRE=7d`

### Issue 4: CORS errors on login
**Cause:** Frontend and backend on different domains

**Solution:** Already configured in `backend/src/server.js`:
```javascript
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || 
        origin.endsWith('.vercel.app') || 
        origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(null, false);
  },
  credentials: true
}));
```

## Deployment Checklist

- [ ] Verify `JWT_SECRET` is set on Render
- [ ] Verify `JWT_EXPIRE` or `JWT_EXPIRES_IN` is set (or rely on '7d' default)
- [ ] Deploy backend changes
- [ ] Test login with valid credentials
- [ ] Test login with invalid credentials
- [ ] Check server logs for login attempts
- [ ] Verify JWT tokens are being generated correctly

## Monitoring

After deployment, monitor:
1. **Login success rate**: Should increase to near 100% for valid credentials
2. **Server logs**: Check for `[AUTH]` prefixed messages
3. **Error logs**: Look for JWT-related errors
4. **User reports**: Fewer "can't log in" complaints

## Rollback Plan

If issues persist:
```bash
git revert HEAD
git push origin main
```

Then investigate:
1. Check Render environment variables
2. Verify MongoDB connection
3. Test with Postman/curl directly
4. Check if specific to certain users or all users

## Additional Notes

- The fix is backward compatible (supports both `JWT_EXPIRE` and `JWT_EXPIRES_IN`)
- Default fallback is '7d' if neither variable is set
- Enhanced logging helps diagnose future login issues
- No database changes required
- No frontend changes required
