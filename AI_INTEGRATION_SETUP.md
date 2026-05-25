# AI Integration Setup Guide

## Overview
This guide explains how to set up and use the AI Course Assistant feature in your Virtual Learning Environment.

## Features Implemented

### 1. **Course Outline Generator**
- Automatically generates a complete course structure
- Creates modules with learning outcomes and activities
- Suggests assessments and resources

### 2. **Quiz Question Generator**
- Creates multiple-choice quiz questions
- Supports different difficulty levels (easy, medium, hard)
- Includes explanations for each answer

### 3. **Assignment Prompt Generator**
- Generates detailed assignment descriptions
- Creates rubrics with scoring criteria
- Includes learning objectives and requirements

### 4. **Lecture Notes Generator**
- Creates comprehensive lecture notes
- Includes key concepts, examples, and discussion questions
- Provides further reading suggestions

### 5. **Student Feedback Generator**
- Generates constructive feedback on submissions
- Highlights strengths and areas for improvement
- Provides actionable suggestions

### 6. **Syllabus Generator**
- Creates complete course syllabi
- Includes policies, grading, and accessibility information
- Professional formatting

---

## Setup Instructions

### Backend Setup

#### 1. Install Dependencies
```bash
cd backend
npm install
```

#### 2. Set Environment Variables
Add to your `.env` file:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

Get your OpenAI API key from: https://platform.openai.com/api-keys

#### 3. Verify Routes
The AI routes are automatically registered in `src/server.js`:
```javascript
app.use('/api/ai', aiRoutes);
```

#### 4. Test the API
```bash
npm run dev
```

Test endpoint:
```bash
curl -X POST http://localhost:5000/api/ai/quiz-questions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "topic": "JavaScript Promises",
    "difficulty": "medium",
    "count": 5
  }'
```

### Frontend Setup

#### 1. AI Assistant Component
The component is located at: `frontend/components/dashboard/AIAssistant.tsx`

#### 2. API Utility
The API utility is at: `frontend/utils/api/aiApi.ts`

#### 3. Integration in Teacher Dashboard
The AI Assistant is integrated in: `frontend/app/(dashboard)/dashboard/teacher/page.tsx`

Click the "AI Generator" button in the quick actions to open the assistant.

---

## API Endpoints

### 1. Generate Course Outline
**POST** `/api/ai/course-outline`

Request:
```json
{
  "courseTitle": "Introduction to Web Development",
  "courseDescription": "Learn HTML, CSS, and JavaScript",
  "duration": 12
}
```

Response:
```json
{
  "success": true,
  "data": {
    "modules": [
      {
        "week": 1,
        "title": "HTML Basics",
        "topics": ["HTML structure", "Tags and elements"],
        "learningOutcomes": ["Understand HTML structure"],
        "activities": ["Create a simple webpage"]
      }
    ],
    "assessments": ["Quiz 1", "Project 1"],
    "resources": ["MDN Web Docs"]
  }
}
```

### 2. Generate Quiz Questions
**POST** `/api/ai/quiz-questions`

Request:
```json
{
  "topic": "JavaScript Promises",
  "difficulty": "medium",
  "count": 5
}
```

Response:
```json
{
  "success": true,
  "data": {
    "questions": [
      {
        "question": "What is a Promise in JavaScript?",
        "type": "multiple_choice",
        "options": ["...", "...", "...", "..."],
        "correctAnswer": 0,
        "explanation": "A Promise is...",
        "difficulty": "medium"
      }
    ]
  }
}
```

### 3. Generate Assignment Prompt
**POST** `/api/ai/assignment-prompt`

Request:
```json
{
  "topic": "Building a REST API",
  "learningOutcomes": ["Create API endpoints", "Handle requests"],
  "difficulty": "medium"
}
```

### 4. Generate Lecture Notes
**POST** `/api/ai/lecture-notes`

Request:
```json
{
  "topic": "Machine Learning Basics",
  "subtopics": ["Supervised Learning", "Unsupervised Learning"]
}
```

### 5. Generate Student Feedback
**POST** `/api/ai/student-feedback`

Request:
```json
{
  "submissionContent": "Student's submission text...",
  "rubricCriteria": ["Clarity", "Completeness", "Accuracy"],
  "score": 85
}
```

### 6. Generate Syllabus
**POST** `/api/ai/syllabus`

Request:
```json
{
  "title": "Introduction to Web Development",
  "code": "CS101",
  "instructor": "Dr. Smith",
  "duration": 12,
  "level": "Beginner",
  "description": "Learn web development fundamentals"
}
```

---

## Authentication

All AI endpoints require authentication. Include your JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

Only teachers and admins can access AI endpoints.

---

## Cost Estimation

### OpenAI Pricing (as of May 2026)
- **GPT-4o**: $0.03 per 1K input tokens, $0.06 per 1K output tokens
- **Average cost per request**: $0.10 - $0.50

### Monthly Estimates
- 100 requests/month: ~$10-50
- 1000 requests/month: ~$100-500

### Cost Optimization Tips
1. Use GPT-3.5 Turbo for simpler tasks (cheaper)
2. Implement caching for similar requests
3. Set reasonable token limits
4. Monitor usage regularly

---

## Troubleshooting

### Issue: "OPENAI_API_KEY not found"
**Solution**: Ensure your `.env` file has the correct API key

### Issue: "Unauthorized" error
**Solution**: Make sure you're logged in as a teacher or admin

### Issue: "Rate limit exceeded"
**Solution**: OpenAI has rate limits. Wait a few minutes before retrying

### Issue: "Invalid request"
**Solution**: Check that all required fields are provided in the request

---

## Best Practices

1. **Review Generated Content**: Always review AI-generated content before using it with students
2. **Customize**: Modify generated content to match your course style and requirements
3. **Combine with Human Expertise**: Use AI as a starting point, not a replacement for instructor expertise
4. **Provide Feedback**: The more you use the tool, the better you can tailor prompts
5. **Monitor Costs**: Keep track of API usage to manage costs

---

## Future Enhancements

Potential features to add:
- [ ] Image generation for course materials
- [ ] Video script generation
- [ ] Automated grading with AI
- [ ] Student learning path recommendations
- [ ] Plagiarism detection
- [ ] Multilingual support
- [ ] Custom AI model fine-tuning

---

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review OpenAI documentation: https://platform.openai.com/docs
3. Check API logs in `backend/logs/`

---

## License

This AI integration is part of the Virtual Learning Environment project.
