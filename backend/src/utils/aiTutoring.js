/**
 * AI Tutoring Service
 * Provides personalized tutoring assistance to students
 */

const { createCompletion } = require('./aiClient');

async function generateTutoringResponse(question, courseTitle, topic, studentLevel = 'intermediate') {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert tutor. Course: ${courseTitle}, Topic: ${topic}, Level: ${studentLevel}. Respond with JSON only.

Format:
{"explanation": string, "keyPoints": [string], "examples": [string], "practiceProblems": [string], "relatedConcepts": [string], "tips": string}`,
    },
    { role: 'user', content: question },
  ], 1500);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { explanation: content, keyPoints: [], examples: [], practiceProblems: [], relatedConcepts: [], tips: '' };
}

async function generatePracticeProblems(topic, difficulty = 'medium', count = 5) {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert educator. Generate ${count} ${difficulty} practice problems for: ${topic}. Respond with JSON array only.

Format:
[{"problem": string, "hint": string, "solution": string, "explanation": string}]`,
    },
    { role: 'user', content: `Generate ${count} ${difficulty} practice problems for: ${topic}` },
  ], 2000);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

async function analyzeStudentAnswer(question, studentAnswer, topic) {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert tutor analyzing a student's answer. Topic: ${topic}. Respond with JSON only.

Format:
{"isCorrect": boolean, "correctnessScore": number, "strengths": [string], "improvements": [string], "correctAnswer": string, "feedback": string, "nextSteps": string}`,
    },
    { role: 'user', content: `Question: ${question}\n\nStudent's Answer: ${studentAnswer}` },
  ], 1000);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { isCorrect: false, correctnessScore: 0, strengths: [], improvements: [], correctAnswer: '', feedback: content, nextSteps: '' };
}

async function explainConcept(concept, courseContext, studentLevel = 'intermediate') {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert tutor. Course: ${courseContext}, Level: ${studentLevel}. Respond with JSON only.

Format:
{"definition": string, "explanation": string, "realWorldExamples": [string], "commonMisconceptions": [string], "relatedConcepts": [string], "visualDescription": string, "practiceAdvice": string}`,
    },
    { role: 'user', content: `Explain the concept: ${concept}` },
  ], 1500);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);
  return { definition: '', explanation: content, realWorldExamples: [], commonMisconceptions: [], relatedConcepts: [], visualDescription: '', practiceAdvice: '' };
}

module.exports = { generateTutoringResponse, generatePracticeProblems, analyzeStudentAnswer, explainConcept };
