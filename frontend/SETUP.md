# UniLearn Setup & Deployment Guide

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+ (or MongoDB)
- Redis (for caching/sessions)
- AWS S3 or similar (for file storage)

## Environment Setup

### 1. Clone Repository
```bash
git clone <repository-url>
cd unilearn
npm install
```

### 2. Environment Variables
Create `.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRY=24h

# File Storage (AWS S3)
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET=your_bucket_name
AWS_S3_REGION=us-east-1

# Email Service (SendGrid)
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=noreply@unilearn.com

# Error Tracking (Sentry)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/unilearn

# Redis
REDIS_URL=redis://localhost:6379
```

### 3. Install Dependencies
```bash
npm install
# or
yarn install
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000`

## Security Checklist

- [ ] Enable HTTPS in production
- [ ] Set secure cookies (httpOnly, Secure, SameSite)
- [ ] Implement CSRF protection
- [ ] Enable rate limiting
- [ ] Validate all file uploads
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Implement request logging
- [ ] Set up error tracking (Sentry)
- [ ] Regular security audits

## Database Setup

### PostgreSQL
```bash
# Create database
createdb unilearn

# Run migrations
npm run migrate

# Seed data (optional)
npm run seed
```

### MongoDB
```bash
# Connection string in .env.local
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/unilearn
```

## File Storage Setup

### AWS S3
1. Create S3 bucket
2. Set up IAM user with S3 permissions
3. Add credentials to `.env.local`
4. Configure bucket CORS policy

```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## Email Service Setup

### SendGrid
1. Create SendGrid account
2. Generate API key
3. Add to `.env.local`
4. Verify sender email

## Testing

### Run Tests
```bash
npm run test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run E2E Tests
```bash
npm run test:e2e
```

## Build & Deployment

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm run start
```

### Deploy to Vercel
```bash
vercel deploy --prod
```

### Deploy to Docker
```bash
docker build -t unilearn .
docker run -p 3000:3000 unilearn
```

## Performance Optimization

### Enable Caching
- Redis for session storage
- CDN for static assets
- Browser caching headers

### Database Optimization
- Add indexes on frequently queried fields
- Use connection pooling
- Monitor slow queries

### Frontend Optimization
- Code splitting
- Image optimization
- Lazy loading
- Minification

## Monitoring & Logging

### Error Tracking
- Sentry for error monitoring
- LogRocket for session replay
- Custom logging middleware

### Performance Monitoring
- Web Vitals tracking
- API response time monitoring
- Database query monitoring

### Uptime Monitoring
- Pingdom or similar
- Health check endpoints
- Alert notifications

## Backup & Recovery

### Database Backups
```bash
# PostgreSQL
pg_dump unilearn > backup.sql

# MongoDB
mongodump --db unilearn --out backup/
```

### File Storage Backups
- Enable S3 versioning
- Set up lifecycle policies
- Regular backup verification

## Troubleshooting

### Common Issues

**Port Already in Use**
```bash
lsof -i :3000
kill -9 <PID>
```

**Database Connection Error**
- Check DATABASE_URL
- Verify database is running
- Check firewall rules

**File Upload Fails**
- Verify S3 credentials
- Check bucket permissions
- Verify CORS configuration

**Authentication Issues**
- Check JWT_SECRET
- Verify token expiry
- Check cookie settings

## Support & Documentation

- API Documentation: `/api/docs`
- Component Storybook: `npm run storybook`
- Architecture Guide: `ARCHITECTURE.md`
- Contributing Guide: `CONTRIBUTING.md`

## License

MIT License - See LICENSE file for details
