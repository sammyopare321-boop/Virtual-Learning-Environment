const { createCompletion, parseJSON } = require('./aiClient');

async function generateCourseOutline(courseTitle, courseDescription, duration) {
  const response = await createCompletion([
    { role: 'system', content: 'You are an expert course designer. Generate detailed, structured course outlines. Always respond with valid JSON only, no markdown.' },
    { role: 'user', content: `Create a detailed course outline for:\nTitle: ${courseTitle}\nDescription: ${courseDescription}\nDuration: ${duration} weeks\n\nFormat as JSON:\n{\n  "modules": [{"week": number, "title": string, "topics": [string], "learningOutcomes": [string], "activities": [string]}],\n  "assessments": [string],\n  "resources": [string]\n}` }
  ], 2000);
  return parseJSON(response.choices[0].message.content);
}

async function generateQuizQuestions(topic, difficulty = 'medium', count = 5) {
  const response = await createCompletion([
    { role: 'system', content: 'You are an expert educator. Generate high-quality quiz questions. Always respond with valid JSON only, no markdown.' },
    { role: 'user', content: `Generate ${count} ${difficulty} quiz questions about: ${topic}\n\nFormat as JSON:\n{\n  "questions": [\n    {\n      "question": string,\n      "type": "multiple_choice",\n      "options": [string, string, string, string],\n      "correctAnswer": number (0-3 index),\n      "explanation": string,\n      "difficulty": "${difficulty}"\n    }\n  ]\n}` }
  ], 2000);
  return parseJSON(response.choices[0].message.content);
}

async function generateAssignmentPrompt(topic, learningOutcomes, difficulty = 'medium') {
  const response = await createCompletion([
    { role: 'system', content: 'You are an expert course designer. Create engaging assignment prompts. Always respond with valid JSON only, no markdown.' },
    { role: 'user', content: `Create an assignment prompt for:\nTopic: ${topic}\nLearning Outcomes: ${learningOutcomes.join(', ')}\nDifficulty: ${difficulty}\n\nFormat as JSON:\n{\n  "title": string,\n  "description": string,\n  "objectives": [string],\n  "requirements": [string],\n  "rubric": {"criteria": [{"name": string, "description": string, "points": number}], "totalPoints": number},\n  "dueDate": "2 weeks",\n  "resources": [string]\n}` }
  ], 2000);
  return parseJSON(response.choices[0].message.content);
}

async function generateLectureNotes(topic, subtopics = []) {
  const response = await createCompletion([
    { role: 'system', content: 'You are an expert educator. Create comprehensive, well-structured lecture notes.' },
    { role: 'user', content: `Create detailed lecture notes for:\nTopic: ${topic}\n${subtopics.length > 0 ? `Subtopics: ${subtopics.join(', ')}` : ''}\n\nInclude clear headings, key concepts, examples, summary points, discussion questions, and further reading.` }
  ], 3000);
  return response.choices[0].message.content;
}

async function generateStudentFeedback(submissionContent, rubricCriteria, score) {
  const response = await createCompletion([
    { role: 'system', content: 'You are an expert educator providing constructive feedback. Always respond with valid JSON only, no markdown.' },
    { role: 'user', content: `Provide feedback for a student submission:\nSubmission: ${String(submissionContent).substring(0, 500)}\nRubric: ${rubricCriteria}\nScore: ${score}/100\n\nFormat as JSON:\n{\n  "strengths": [string],\n  "areasForImprovement": [string],\n  "suggestions": [string],\n  "encouragement": string,\n  "nextSteps": [string]\n}` }
  ], 1500);
  return parseJSON(response.choices[0].message.content);
}

async function generateSyllabus(courseInfo) {
  const response = await createCompletion([
    { role: 'system', content: 'You are an expert course designer. Create comprehensive, professional course syllabi.' },
    { role: 'user', content: `Create a complete course syllabus for:\nCourse Title: ${courseInfo.title}\nCourse Code: ${courseInfo.code}\nInstructor: ${courseInfo.instructor}\nDuration: ${courseInfo.duration} weeks\nLevel: ${courseInfo.level}\nDescription: ${courseInfo.description}\n\nInclude course overview, objectives, learning outcomes, grading, weekly schedule, policies, and academic integrity statement. Format as professional markdown.` }
  ], 3000);
  return response.choices[0].message.content;
}

module.exports = {
  parseJSON,
  generateCourseOutline,
  generateQuizQuestions,
  generateAssignmentPrompt,
  generateLectureNotes,
  generateStudentFeedback,
  generateSyllabus,
};
