/**
 * AI Tutoring Service
 * Provides personalized tutoring assistance to students
 */

const { createCompletion, sanitizeInput } = require('./aiClient');

async function generateTutoringResponse(question, courseTitle, topic, studentLevel = 'intermediate') {
  const sanitizedQuestion = sanitizeInput(question);
  const sanitizedCourseTitle = sanitizeInput(courseTitle);
  const sanitizedTopic = sanitizeInput(topic);
  
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert tutor. Course: ${sanitizedCourseTitle}, Topic: ${sanitizedTopic}, Level: ${studentLevel}. Respond with JSON only.

Format:
{"explanation": string, "keyPoints": [string], "examples": [string], "practiceProblems": [string], "relatedConcepts": [string], "tips": string}`,
    },
    { role: 'user', content: sanitizedQuestion },
  ], 1500);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { explanation: content, keyPoints: [], examples: [], practiceProblems: [], relatedConcepts: [], tips: '' };
}

async function generatePracticeProblems(topic, difficulty = 'medium', count = 5) {
  const sanitizedTopic = sanitizeInput(topic);
  
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert educator. Generate ${count} ${difficulty} practice problems for: ${sanitizedTopic}. Respond with JSON array only.

Format:
[{"problem": string, "hint": string, "solution": string, "explanation": string}]`,
    },
    { role: 'user', content: `Generate ${count} ${difficulty} practice problems for: ${sanitizedTopic}` },
  ], 2000);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

async function analyzeStudentAnswer(question, studentAnswer, topic) {
  const sanitizedQuestion = sanitizeInput(question);
  const sanitizedAnswer = sanitizeInput(studentAnswer);
  const sanitizedTopic = sanitizeInput(topic);
  
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert tutor analyzing a student's answer. Topic: ${sanitizedTopic}. Respond with JSON only.

Format:
{"isCorrect": boolean, "correctnessScore": number, "strengths": [string], "improvements": [string], "correctAnswer": string, "feedback": string, "nextSteps": string}`,
    },
    { role: 'user', content: `Question: ${sanitizedQuestion}\n\nStudent's Answer: ${sanitizedAnswer}` },
  ], 1000);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { isCorrect: false, correctnessScore: 0, strengths: [], improvements: [], correctAnswer: '', feedback: content, nextSteps: '' };
}

async function explainConcept(concept, courseContext, studentLevel = 'intermediate') {
  const sanitizedConcept = sanitizeInput(concept);
  const sanitizedContext = sanitizeInput(courseContext);
  
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert tutor. Course: ${sanitizedContext}, Level: ${studentLevel}. Respond with JSON only.

Format:
{"definition": string, "explanation": string, "realWorldExamples": [string], "commonMisconceptions": [string], "relatedConcepts": [string], "visualDescription": string, "practiceAdvice": string}`,
    },
    { role: 'user', content: `Explain the concept: ${sanitizedConcept}` },
  ], 1500);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { definition: '', explanation: content, realWorldExamples: [], commonMisconceptions: [], relatedConcepts: [], visualDescription: '', practiceAdvice: '' };
}

module.exports = { generateTutoringResponse, generatePracticeProblems, analyzeStudentAnswer, explainConcept };
