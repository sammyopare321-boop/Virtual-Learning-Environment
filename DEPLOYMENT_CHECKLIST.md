# Deployment Checklist - Security & Authorization Fixes

## Pre-Deployment

- [x] All code changes reviewed
- [x] No syntax errors detected
- [x] No breaking changes introduced
- [x] Backward compatible with existing code

## Backend Deployment Steps

1. **Commit Changes**
   ```bash
   git add backend/src/middleware/auth.js
   git add backend/src/middleware/securityLogger.js
   git add backend/src/server.js
   git add backend/src/routes/aiRoutes.js
   git add backend/src/controllers/authController.js
   git commit -m "fix: enhance authorization and add security monitoring"
   ```

2. **Push to Repository**
   ```bash
   git push origin main
   ```

3. **Render Auto-Deploy**
   - Render will automatically detect the push
   - Monitor build logs for any errors
   - Deployment typically takes 2-3 minutes

4. **Verify Backend**
   - Check health endpoint: `GET https://your-backend.onrender.com/health`
   - Should return 200 OK
   - Check logs for any startup errors

## Frontend Deployment Steps

1. **Commit Changes**
   ```bash
   git add frontend/utils/api/axiosInstance.ts
   git add frontend/app/(dashboard)/teacher/ai/page.tsx
   git commit -m "fix: improve error handling for unauthorized access"
   ```

2. **Push to Repository**
   ```bash
   git push origin main
   ```

3. **Vercel Auto-Deploy**
   - Vercel will automatically detect the push
   - Monitor build logs
   - Deployment typically takes 1-2 minutes

## Post-Deployment Testing

### Test 1: Student Access Control
- [ ] Log in as a student
- [ ] Try accessing `/teacher/ai` directly
- [ ] Should redirect to `/dashboard`
- [ ] Try calling AI API endpoint via browser console
- [ ] Should receive 403 with clear error message

### Test 2: Teacher Functionality
- [ ] Log in as a teacher
- [ ] Access `/teacher/ai`
- [ ] Should load successfully
- [ ] Try generating quiz questions
- [ ] Should work without errors

### Test 3: Rate Limiting
- [ ] Make 10+ unauthorized API requests rapidly
- [ ] Should receive rate limit error after 10 attempts
- [ ] Wait 15 minutes and try again
- [ ] Should work again

### Test 4: Error Messages
- [ ] As student, try accessing teacher endpoint
- [ ] Error message should be clear and user-friendly
- [ ] Should not expose internal system details

### Test 5: Security Logging
- [ ] Check backend logs: `backend/logs/error-*.log`
- [ ] Should see 403 attempts logged with IP and user info
- [ ] Verify log format is correct

## Monitoring (First 24 Hours)

### Backend Logs
```bash
# On Render dashboard, check logs for:
- [WARN] Unauthorized access attempt
- [WARN] Authentication failure
- Rate limit triggers
```

### Frontend Errors
- Monitor Sentry (if configured) for client-side errors
- Check browser console for any unexpected errors
- Verify redirects work correctly

### Performance
- [ ] Response times remain normal
- [ ] No increase in server errors
- [ ] Rate limiting doesn't affect legitimate users

## Rollback Plan (If Needed)

If issues occur:

1. **Quick Rollback**
   ```bash
   git revert HEAD
   git push origin main
   ```

2. **Specific File Rollback**
   ```bash
   git checkout HEAD~1 -- path/to/file
   git commit -m "rollback: revert security changes"
   git push origin main
   ```

3. **Render Manual Rollback**
   - Go to Render dashboard
   - Select your service
   - Click "Rollback" to previous deployment

## Success Criteria

- [ ] No increase in error rates
- [ ] 403 errors properly logged
- [ ] Students cannot access teacher routes
- [ ] Teachers can use all features normally
- [ ] Rate limiting works as expected
- [ ] Error messages are user-friendly

## Known Issues & Limitations

1. **Rate Limiting**: Based on IP address
   - Users behind same NAT may share limits
   - Consider increasing limits if needed

2. **Logging**: Stored locally on server
   - Logs rotate daily
   - Consider external logging service for production

3. **Frontend Redirects**: Client-side only
   - Users with JavaScript disabled won't be redirected
   - Backend authorization still protects endpoints

## Support & Troubleshooting

### Common Issues

**Issue**: Rate limit triggered for legitimate users
- **Solution**: Increase `max` value in `unauthorizedLimiter`

**Issue**: Logs not appearing
- **Solution**: Check file permissions on `backend/logs/` directory

**Issue**: Frontend redirects not working
- **Solution**: Clear browser cache and cookies

### Contact

For issues or questions:
- Check logs first: `backend/logs/error-*.log`
- Review this checklist
- Check `SECURITY_FIXES_SUMMARY.md` for details

## Completion

Date Deployed: _______________
Deployed By: _______________
All Tests Passed: [ ] Yes [ ] No
Issues Encountered: _______________
