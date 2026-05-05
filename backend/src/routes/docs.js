const express = require('express');

const router = express.Router();

// API Documentation endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Virtual Learning Environment API Documentation',
    version: '1.0.0',
    documentation: {
      html: '/api-docs/html',
      json: '/api-docs',
    },
    endpoints: {
      auth: [
        {
          method: 'POST',
          path: '/api/auth/register',
          description: 'Register new user',
          params: {
            firstName: 'string (required)',
            lastName: 'string (required)',
            email: 'string (required)',
            password: 'string (required)',
            role: 'string (optional: student, teacher, admin)',
          },
        },
        {
          method: 'POST',
          path: '/api/auth/login',
          description: 'Login user',
          params: {
            email: 'string (required)',
            password: 'string (required)',
          },
        },
      ],
      courses: [
        {
          method: 'GET',
          path: '/api/courses',
          description: 'Get all courses',
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/courses/:id',
          description: 'Get specific course',
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/courses',
          description: 'Create new course',
          auth: true,
          role: 'teacher',
          params: {
            title: 'string (required)',
            description: 'string (required)',
            code: 'string (required)',
            capacity: 'number (optional)',
          },
        },
        {
          method: 'PUT',
          path: '/api/courses/:id',
          description: 'Update course',
          auth: true,
          role: 'teacher',
        },
        {
          method: 'DELETE',
          path: '/api/courses/:id',
          description: 'Delete course',
          auth: true,
          role: 'teacher',
        },
      ],
      enrollments: [
        {
          method: 'GET',
          path: '/api/enrollments',
          description: 'Get enrollments',
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/enrollments',
          description: 'Enroll in course',
          auth: true,
          params: {
            courseId: 'string (required)',
          },
        },
        {
          method: 'DELETE',
          path: '/api/enrollments/:id',
          description: 'Drop course',
          auth: true,
        },
      ],
      assignments: [
        {
          method: 'GET',
          path: '/api/assignments',
          description: 'Get assignments',
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/assignments/:id',
          description: 'Get specific assignment',
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/assignments',
          description: 'Create assignment',
          auth: true,
          role: 'teacher',
        },
        {
          method: 'PUT',
          path: '/api/assignments/:id',
          description: 'Update assignment',
          auth: true,
          role: 'teacher',
        },
        {
          method: 'DELETE',
          path: '/api/assignments/:id',
          description: 'Delete assignment',
          auth: true,
          role: 'teacher',
        },
      ],
      submissions: [
        {
          method: 'GET',
          path: '/api/submissions',
          description: 'Get submissions',
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/submissions',
          description: 'Submit assignment',
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/submissions/:id',
          description: 'Get specific submission',
          auth: true,
        },
      ],
      modules: [
        {
          method: 'GET',
          path: '/api/modules',
          description: 'Get course modules',
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/modules',
          description: 'Create module',
          auth: true,
          role: 'teacher',
        },
      ],
      quizzes: [
        {
          method: 'GET',
          path: '/api/quizzes',
          description: 'Get quizzes',
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/quizzes',
          description: 'Create quiz',
          auth: true,
          role: 'teacher',
        },
        {
          method: 'POST',
          path: '/api/quizzes/:id/submit',
          description: 'Submit quiz',
          auth: true,
        },
      ],
      communication: [
        {
          method: 'GET',
          path: '/api/communication/messages',
          description: 'Get messages',
          auth: true,
        },
        {
          method: 'POST',
          path: '/api/communication/messages',
          description: 'Send message',
          auth: true,
        },
        {
          method: 'GET',
          path: '/api/communication/notifications',
          description: 'Get notifications',
          auth: true,
        },
      ],
      admin: [
        {
          method: 'GET',
          path: '/api/admin/users',
          description: 'Get all users',
          auth: true,
          role: 'admin',
        },
        {
          method: 'GET',
          path: '/api/admin/analytics',
          description: 'Get analytics',
          auth: true,
          role: 'admin',
        },
        {
          method: 'GET',
          path: '/api/admin/logs',
          description: 'Get admin logs',
          auth: true,
          role: 'admin',
        },
      ],
    },
    baseUrl: process.env.API_BASE_URL || 'http://localhost:5000',
    authentication: {
      type: 'JWT Bearer Token',
      format: 'Authorization: Bearer <token>',
      expiration: '7 days',
    },
    rateLimit: {
      window: '15 minutes',
      maxRequests: 100,
    },
    requestTimeout: '30 seconds',
    documentation_url: 'https://github.com/sammyopare321-boop/Virtual-Learning-Environment',
  });
});

// HTML documentation page
router.get('/html', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Virtual Learning Environment API Documentation</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #f5f5f5;
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px;
          border-radius: 8px;
          margin-bottom: 30px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        
        header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
        }
        
        header p {
          font-size: 1.1em;
          opacity: 0.9;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .info-card {
          background: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .info-card h3 {
          color: #667eea;
          margin-bottom: 10px;
        }
        
        .info-card p {
          font-size: 0.9em;
          color: #666;
        }
        
        .endpoint-section {
          background: white;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .endpoint-section h2 {
          color: #667eea;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 2px solid #667eea;
        }
        
        .endpoint {
          padding: 15px;
          margin-bottom: 15px;
          background: #f9f9f9;
          border-left: 4px solid #667eea;
          border-radius: 4px;
        }
        
        .endpoint-method {
          display: inline-block;
          padding: 5px 10px;
          border-radius: 4px;
          color: white;
          font-weight: bold;
          margin-right: 10px;
          font-size: 0.85em;
        }
        
        .endpoint-method.get { background: #61affe; }
        .endpoint-method.post { background: #49cc90; }
        .endpoint-method.put { background: #fca130; }
        .endpoint-method.delete { background: #f93e3e; }
        
        .endpoint-path {
          font-family: 'Courier New', monospace;
          background: white;
          padding: 10px;
          border-radius: 4px;
          margin: 10px 0;
          font-size: 0.9em;
        }
        
        .endpoint-description {
          margin: 10px 0;
          color: #666;
        }
        
        .auth-badge {
          display: inline-block;
          background: #ff6b6b;
          color: white;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.8em;
          margin-left: 10px;
        }
        
        footer {
          text-align: center;
          padding: 20px;
          color: #666;
          margin-top: 40px;
        }
        
        .quick-start {
          background: #667eea;
          color: white;
          padding: 20px;
          border-radius: 8px;
          margin-bottom: 30px;
        }
        
        .quick-start h2 {
          margin-bottom: 15px;
        }
        
        .quick-start pre {
          background: rgba(0,0,0,0.2);
          padding: 15px;
          border-radius: 4px;
          overflow-x: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h1>🎓 Virtual Learning Environment</h1>
          <p>API Documentation - v1.0.0</p>
        </header>
        
        <div class="quick-start">
          <h2>🚀 Quick Start</h2>
          <p>Get the full API documentation in JSON format:</p>
          <pre>curl http://localhost:5000/api-docs</pre>
        </div>
        
        <div class="info-grid">
          <div class="info-card">
            <h3>📡 Base URL</h3>
            <p>http://localhost:5000/api</p>
          </div>
          <div class="info-card">
            <h3>🔐 Authentication</h3>
            <p>JWT Bearer Token (7 days)</p>
          </div>
          <div class="info-card">
            <h3>⏱️ Timeout</h3>
            <p>30 seconds per request</p>
          </div>
          <div class="info-card">
            <h3>🚦 Rate Limit</h3>
            <p>100 requests per 15 minutes</p>
          </div>
        </div>
        
        <div class="endpoint-section">
          <h2>📚 Key Features</h2>
          <ul style="margin-left: 20px;">
            <li>✅ User Authentication & Authorization</li>
            <li>✅ Course Management</li>
            <li>✅ Assignment & Submission Tracking</li>
            <li>✅ Grading System</li>
            <li>✅ Quiz Management</li>
            <li>✅ Real-time Communication</li>
            <li>✅ Attendance Tracking</li>
            <li>✅ Admin Analytics</li>
            <li>✅ File Upload with Cloudinary</li>
            <li>✅ Live Sessions Support</li>
          </ul>
        </div>
        
        <div class="endpoint-section">
          <h2>🔌 Main Endpoints</h2>
          
          <div class="endpoint">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/auth/register</span>
            <p class="endpoint-description">Register a new user account</p>
          </div>
          
          <div class="endpoint">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/auth/login</span>
            <p class="endpoint-description">Login with email and password</p>
          </div>
          
          <div class="endpoint">
            <span class="endpoint-method get">GET</span>
            <span class="endpoint-path">/courses</span>
            <span class="auth-badge">Auth Required</span>
            <p class="endpoint-description">Retrieve all courses</p>
          </div>
          
          <div class="endpoint">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/courses</span>
            <span class="auth-badge">Auth Required</span>
            <p class="endpoint-description">Create a new course (Teachers only)</p>
          </div>
          
          <div class="endpoint">
            <span class="endpoint-method get">GET</span>
            <span class="endpoint-path">/enrollments</span>
            <span class="auth-badge">Auth Required</span>
            <p class="endpoint-description">Get user enrollments</p>
          </div>
          
          <div class="endpoint">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/enrollments</span>
            <span class="auth-badge">Auth Required</span>
            <p class="endpoint-description">Enroll in a course</p>
          </div>
          
          <div class="endpoint">
            <span class="endpoint-method get">GET</span>
            <span class="endpoint-path">/assignments</span>
            <span class="auth-badge">Auth Required</span>
            <p class="endpoint-description">Get course assignments</p>
          </div>
          
          <div class="endpoint">
            <span class="endpoint-method post">POST</span>
            <span class="endpoint-path">/submissions</span>
            <span class="auth-badge">Auth Required</span>
            <p class="endpoint-description">Submit an assignment</p>
          </div>
        </div>
        
        <footer>
          <p>For detailed API documentation, visit: <a href="/api-docs" style="color: #667eea;">API JSON Docs</a></p>
          <p>© 2024 Virtual Learning Environment - All Rights Reserved</p>
        </footer>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
