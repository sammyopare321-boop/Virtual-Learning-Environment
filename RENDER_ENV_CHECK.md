# Render Environment Variables Check

## Immediate Action Required

The login 401 errors are likely caused by missing or incorrect environment variables on Render.

## Steps to Fix on Render Dashboard

### 1. Go to Your Render Service
1. Log in to [Render Dashboard](https://dashboard.render.com/)
2. Select your backend service (virtual-learning-environment-th7m)
3. Click on "Environment" in the left sidebar

### 2. Verify These Critical Variables

#### Required for Login to Work:
```
JWT_SECRET=<your-secure-random-string>
JWT_EXPIRE=7d
MONGO_URI=<your-mongodb-atlas-connection-string>
```

#### How to Generate JWT_SECRET (if missing):
Run this in your terminal:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`

### 3. Check Current Variables

Look for these variables and their values:

| Variable | Expected Value | Status |
|----------|---------------|--------|
| `JWT_SECRET` | Long random string (64+ chars) | ⚠️ CHECK |
| `JWT_EXPIRE` | `7d` | ⚠️ CHECK |
| `MONGO_URI` | `mongodb+srv://...` | ⚠️ CHECK |
| `NODE_ENV` | `production` | ⚠️ CHECK |
| `CLIENT_URL` | Your Vercel frontend URL | ⚠️ CHECK |

### 4. Common Issues

#### Issue: JWT_SECRET is missing or too short
**Symptom**: Login returns 401 or JWT errors in logs
**Fix**: Generate a new secure secret (see above) and add it

#### Issue: JWT_EXPIRE is missing
**Symptom**: Login might work but tokens expire immediately
**Fix**: Add `JWT_EXPIRE=7d` (the code now has a fallback, but explicit is better)

#### Issue: MONGO_URI is wrong or missing
**Symptom**: "MongoDB connection failed" in logs
**Fix**: 
1. Go to MongoDB Atlas
2. Get connection string from "Connect" → "Connect your application"
3. Replace `<password>` with your actual database password
4. Add to Render environment variables

### 5. After Adding/Updating Variables

1. Click "Save Changes" in Render
2. Render will automatically redeploy (takes 2-3 minutes)
3. Monitor the deployment logs for:
   - ✅ "MongoDB Connected: cluster0.xxxxx.mongodb.net"
   - ✅ "Server running in production mode on port 10000"

### 6. Test Login After Deployment

#### Option A: Use Frontend
1. Go to your frontend URL
2. Try logging in with valid credentials
3. Should work without 401 errors

#### Option B: Use curl
```bash
curl -X POST https://virtual-learning-environment-th7m.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@example.com","password":"your-password"}'
```

**Expected Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "_id": "...",
    "name": "...",
    "email": "...",
    "role": "student"
  }
}
```

### 7. Check Logs

In Render dashboard:
1. Click "Logs" tab
2. Look for:
   - `[AUTH] Login successful: user@example.com (student)` ✅
   - `[AUTH] Login failed: Invalid password` ⚠️
   - `MongoDB Connected: ...` ✅

## Quick Reference: All Required Environment Variables

```bash
# Authentication
JWT_SECRET=<64-char-random-string>
JWT_EXPIRE=7d

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/virtual-learning-environment

# Server
PORT=10000
NODE_ENV=production

# CORS
CLIENT_URL=https://your-frontend.vercel.app

# File Uploads (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Features (Optional but recommended)
OPENAI_API_KEY=sk-...
# OR
OPENROUTER_API_KEY=sk-or-...

# Admin
ADMIN_PASSWORD=your-secure-admin-password
```

## Troubleshooting

### Still Getting 401 After Setting Variables?

1. **Check Render Logs**:
   - Look for JWT errors
   - Look for MongoDB connection errors
   - Look for `[AUTH]` prefixed messages

2. **Verify MongoDB Connection**:
   - Can you connect to MongoDB Atlas from your local machine?
   - Is your IP whitelisted in MongoDB Atlas? (Use 0.0.0.0/0 for Render)
   - Is the database user password correct?

3. **Test Specific User**:
   - Try with a different user account
   - Check if user exists in database
   - Verify user's `authProvider` field (should be 'local', not 'google')

4. **Check Frontend**:
   - Is frontend sending correct credentials?
   - Check browser console for errors
   - Verify API URL is correct

### Need to Create a Test User?

Use the register endpoint:
```bash
curl -X POST https://virtual-learning-environment-th7m.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "student"
  }'
```

## Success Criteria

- [ ] All required environment variables are set on Render
- [ ] Render deployment completed successfully
- [ ] MongoDB connection successful (check logs)
- [ ] Login with valid credentials returns 200 OK
- [ ] Login with invalid credentials returns 401 with clear message
- [ ] JWT token is included in response
- [ ] Frontend login works without errors

## Support

If issues persist after following this guide:
1. Check `LOGIN_FIX.md` for detailed technical information
2. Review Render logs for specific error messages
3. Test with curl to isolate frontend vs backend issues
4. Verify all environment variables are exactly as shown above
