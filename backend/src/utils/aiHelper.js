const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

/**
 * Generate course outline using AI
 */
async function generateCourseOutline(courseTitle, courseDescription, duration) {
  try {
    const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert course designer. Generate detailed, structured course outlines.'
        },
        {
          role: 'user',
          content: `Create a detailed course outline for:
Title: ${courseTitle}
Description: ${courseDescription}
Duration: ${duration} weeks

Format the response as a JSON object with:
{
  "modules": [
    {
      "week": number,
      "title": string,
      "topics": [string],
      "learningOutcomes": [string],
      "activities": [string]
    }
  ],
  "assessments": [string],
  "resources": [string]
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating course outline:', error);
    throw new Error('Failed to generate course outline');
  }
}

/**
 * Generate quiz questions using AI
 */
async function generateQuizQuestions(topic, difficulty = 'medium', count = 5) {
  try {
    const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator. Generate high-quality quiz questions with correct answers and explanations.'
        },
        {
          role: 'user',
          content: `Generate ${count} ${difficulty} quiz questions about: ${topic}

Format as JSON:
{
  "questions": [
    {
      "question": string,
      "type": "multiple_choice",
      "options": [string, string, string, string],
      "correctAnswer": number (0-3),
      "explanation": string,
      "difficulty": "${difficulty}"
    }
  ]
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating quiz questions:', error);
    throw new Error('Failed to generate quiz questions');
  }
}

/**
 * Generate assignment prompt using AI
 */
async function generateAssignmentPrompt(topic, learningOutcomes, difficulty = 'medium') {
  try {
    const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert course designer. Create engaging, clear assignment prompts.'
        },
        {
          role: 'user',
          content: `Create an assignment prompt for:
Topic: ${topic}
Learning Outcomes: ${learningOutcomes.join(', ')}
Difficulty: ${difficulty}

Format as JSON:
{
  "title": string,
  "description": string,
  "objectives": [string],
  "requirements": [string],
  "rubric": {
    "criteria": [
      {
        "name": string,
        "description": string,
        "points": number
      }
    ],
    "totalPoints": number
  },
  "dueDate": "2 weeks",
  "resources": [string]
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    }, {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating assignment:', error);
    throw new Error('Failed to generate assignment');
  }
}

/**
 * Generate lecture notes summary using AI
 */
async function generateLectureNotes(topic, subtopics = []) {
  try {
    const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator. Create comprehensive, well-structured lecture notes.'
        },
        {
          role: 'user',
          content: `Create detailed lecture notes for:
Topic: ${topic}
${subtopics.length > 0 ? `Subtopics: ${subtopics.join(', ')}` : ''}

Format as markdown with:
- Clear headings and subheadings
- Key concepts highlighted
- Examples and real-world applications
- Summary points
- Discussion questions
- Further reading suggestions`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    }, {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating lecture notes:', error);
    throw new Error('Failed to generate lecture notes');
  }
}

/**
 * Generate student feedback using AI
 */
async function generateStudentFeedback(submissionContent, rubricCriteria, score) {
  try {
    const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator providing constructive, encouraging feedback to students.'
        },
        {
          role: 'user',
          content: `Provide constructive feedback for a student submission:
Submission: ${submissionContent.substring(0, 500)}...
Rubric Criteria: ${rubricCriteria.join(', ')}
Score: ${score}/100

Provide feedback in JSON format:
{
  "strengths": [string],
  "areasForImprovement": [string],
  "suggestions": [string],
  "encouragement": string,
  "nextSteps": [string]
}`
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    }, {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    });

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (error) {
    console.error('Error generating feedback:', error);
    throw new Error('Failed to generate feedback');
  }
}

/**
 * Generate complete syllabus using AI
 */
async function generateSyllabus(courseInfo) {
  try {
    const response = await axios.post(`${OPENAI_BASE_URL}/chat/completions`, {
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: 'You are an expert course designer. Create comprehensive, professional course syllabi.'
        },
        {
          role: 'user',
          content: `Create a complete course syllabus for:
Course Title: ${courseInfo.title}
Course Code: ${courseInfo.code}
Instructor: ${courseInfo.instructor}
Duration: ${courseInfo.duration} weeks
Level: ${courseInfo.level}
Description: ${courseInfo.description}

Include:
- Course overview and objectives
- Learning outcomes
- Course requirements and grading
- Weekly schedule
- Policies (attendance, late work, etc.)
- Academic integrity statement
- Accessibility information
- Contact information

Format as professional markdown.`
        }
      ],
      temperature: 0.7,
      max_tokens: 3000
    }, {
      headers: { 'Authorization': `Bearer ${OPENAI_API_KEY}` }
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating syllabus:', error);
    throw new Error('Failed to generate syllabus');
  }
}

module.exports = {
  generateCourseOutline,
  generateQuizQuestions,
  generateAssignmentPrompt,
  generateLectureNotes,
  generateStudentFeedback,
  generateSyllabus
};
