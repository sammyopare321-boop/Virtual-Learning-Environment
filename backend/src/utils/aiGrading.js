/**
 * AI Grading Service
 * Automatically grades assignments and provides constructive feedback
 */

const { createCompletion } = require('./aiClient');

async function gradeSubmission(submissionContent, rubricCriteria, totalPoints, assignmentDescription) {
  const rubricText = rubricCriteria
    .map((c, i) => `${i + 1}. ${c.name} (${c.points} points): ${c.description}`)
    .join('\n');

  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert educator grading student submissions. Evaluate against the rubric and respond with JSON only.

Assignment: ${assignmentDescription}
Rubric:\n${rubricText}
Total Points: ${totalPoints}

JSON format:
{
  "totalScore": number,
  "percentage": number,
  "rubricScores": [{"criterion": string, "score": number, "maxScore": number, "feedback": string}],
  "strengths": [string],
  "improvements": [string],
  "generalFeedback": string,
  "suggestions": string,
  "grade": "A/B/C/D/F"
}`,
    },
    { role: 'user', content: `Grade this submission:\n\n${submissionContent}` },
  ], 2000, 0.5);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);

  return { totalScore: 0, percentage: 0, rubricScores: [], strengths: [], improvements: [], generalFeedback: content, suggestions: '', grade: 'F' };
}

async function gradeSubmissionsBatch(submissions, rubricCriteria, totalPoints, assignmentDescription) {
  const results = [];
  for (const submission of submissions) {
    const result = await gradeSubmission(submission.content, rubricCriteria, totalPoints, assignmentDescription);
    results.push({ submissionId: submission._id, studentId: submission.studentId, ...result });
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return results;
}

async function generateRubric(assignmentDescription, totalPoints = 100) {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert educator creating grading rubrics. Total points: ${totalPoints}. Respond with JSON array only.

Format:
[{"name": string, "description": string, "points": number, "levels": [{"level": string, "description": string}]}]`,
    },
    { role: 'user', content: `Create a rubric for:\n\n${assignmentDescription}` },
  ], 2000, 0.7);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  return jsonMatch ? JSON.parse(jsonMatch[0]) : [];
}

async function compareGrades(aiGrade, teacherGrade) {
  const difference = Math.abs(aiGrade.totalScore - teacherGrade);
  const percentDifference = (difference / (aiGrade.totalScore || 1)) * 100;

  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an expert educator analyzing grading consistency. Respond with JSON only.

AI Grade: ${aiGrade.totalScore}, Teacher Grade: ${teacherGrade}, Difference: ${difference} points (${percentDifference.toFixed(1)}%)

Format:
{"isConsistent": boolean, "consistencyScore": number, "insights": string, "possibleReasons": [string], "recommendations": string}`,
    },
    { role: 'user', content: `AI: ${aiGrade.totalScore}, Teacher: ${teacherGrade}` },
  ], 1000, 0.5);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);

  return { isConsistent: percentDifference < 10, consistencyScore: Math.max(0, 100 - percentDifference), insights: `Difference of ${difference} points`, possibleReasons: [], recommendations: '' };
}

async function generatePersonalizedFeedback(gradingResult, studentName) {
  const response = await createCompletion([
    {
      role: 'system',
      content: `You are an encouraging educator providing personalized feedback. Respond with JSON only.

Student: ${studentName}, Score: ${gradingResult.totalScore}, Grade: ${gradingResult.grade}

Format:
{"greeting": string, "celebration": string, "strengths": [string], "improvements": [string], "actionItems": [string], "encouragement": string, "nextSteps": string}`,
    },
    { role: 'user', content: `Generate feedback for ${studentName} who scored ${gradingResult.totalScore} points` },
  ], 1500, 0.7);

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) return JSON.parse(jsonMatch[0]);

  return { greeting: `Hello ${studentName}!`, celebration: '', strengths: gradingResult.strengths || [], improvements: gradingResult.improvements || [], actionItems: [], encouragement: 'Keep up the good work!', nextSteps: '' };
}

module.exports = { gradeSubmission, gradeSubmissionsBatch, generateRubric, compareGrades, generatePersonalizedFeedback };
