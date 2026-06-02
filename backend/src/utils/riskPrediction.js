/**
 * Risk Prediction Engine
 * Predicts at-risk students and generates intervention recommendations
 */

const { createCompletion, parseJSON } = require('./aiClient');

/**
 * Analyze student data and predict risk level
 * @param {Object} studentData - Student performance data
 * @param {Array} historicalData - Historical performance data
 * @returns {Promise<Object>} Risk prediction with score and factors
 */
async function predictStudentRisk(studentData, historicalData) {
  try {
    const systemPrompt = `You are an expert educational data analyst.
Analyze the student's performance data and predict their risk level.
Provide analysis in JSON format:
{
  "riskScore": 0-100,
  "riskLevel": "low/medium/high/critical",
  "riskFactors": [
    {
      "factor": "factor name",
      "severity": 0-100,
      "description": "why this is a risk",
      "trend": "improving/stable/declining"
    }
  ],
  "predictedOutcome": "likely outcome if no intervention",
  "interventionUrgency": "low/medium/high/critical",
  "confidenceScore": 0-100,
  "keyIndicators": ["indicator1", "indicator2"],
  "recommendations": ["recommendation1", "recommendation2"]
}`;

    const response = await createCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Predict risk for this student:\n\nStudent Data: ${JSON.stringify(studentData)}\n\nHistorical Data: ${JSON.stringify(historicalData)}` }
    ], 2000);

    try {
      return parseJSON(response.choices[0].message.content);
    } catch (e) {
      console.warn("Failed to parse AI response for predictStudentRisk, falling back to default.");
    }

    return {
      riskScore: 0,
      riskLevel: 'low',
      riskFactors: [],
      predictedOutcome: 'Unknown',
      interventionUrgency: 'low',
      confidenceScore: 0,
      keyIndicators: [],
      recommendations: [],
    };
  } catch (error) {
    console.error('Error predicting student risk:', error);
    return {
      riskScore: 0,
      riskLevel: 'low',
      riskFactors: [],
      predictedOutcome: 'Unknown',
      interventionUrgency: 'low',
      confidenceScore: 0,
      keyIndicators: [],
      recommendations: [],
    };
  }
}

/**
 * Generate intervention plan for at-risk student
 * @param {Object} riskPrediction - Risk prediction result
 * @param {Object} studentData - Student data
 * @returns {Promise<Object>} Intervention plan
 */
async function generateInterventionPlan(riskPrediction, studentData) {
  try {
    const systemPrompt = `You are an expert educational intervention specialist.
Create a detailed intervention plan for an at-risk student.

Format response as JSON:
{
  "planName": "Plan name",
  "description": "Plan description",
  "duration": "estimated duration",
  "interventions": [
    {
      "type": "academic/social/emotional/behavioral",
      "title": "Intervention title",
      "description": "Description",
      "frequency": "daily/weekly/bi-weekly",
      "duration": "duration",
      "responsible": "who is responsible",
      "successMetrics": ["metric1", "metric2"],
      "resources": ["resource1", "resource2"]
    }
  ],
  "supportTeam": ["role1", "role2"],
  "checkpoints": [
    {
      "date": "checkpoint date",
      "milestone": "milestone description",
      "successCriteria": ["criteria1", "criteria2"]
    }
  ],
  "communicationPlan": "How to communicate with student and family",
  "escalationProcedure": "When and how to escalate",
  "expectedOutcome": "Expected outcome if plan is followed",
  "contingencyPlans": ["plan1", "plan2"]
}`;

    const response = await createCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Create intervention plan for this at-risk student:\n\nRisk Prediction: ${JSON.stringify(riskPrediction)}\n\nStudent Data: ${JSON.stringify(studentData)}` }
    ], 2500);

    try {
      const plan = parseJSON(response.choices[0].message.content);
      return {
        ...plan,
        createdAt: new Date(),
        lastUpdated: new Date(),
      };
    } catch (e) {
      console.warn("Failed to parse AI response for generateInterventionPlan, falling back to default.");
    }

    return {
      planName: 'Default Intervention Plan',
      description: 'Default plan',
      duration: '0',
      interventions: [],
      supportTeam: [],
      checkpoints: [],
      communicationPlan: '',
      escalationProcedure: '',
      expectedOutcome: '',
      contingencyPlans: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error('Error generating intervention plan:', error);
    return {
      planName: 'Default Intervention Plan',
      description: 'Default plan',
      duration: '0',
      interventions: [],
      supportTeam: [],
      checkpoints: [],
      communicationPlan: '',
      escalationProcedure: '',
      expectedOutcome: '',
      contingencyPlans: [],
      createdAt: new Date(),
      lastUpdated: new Date(),
    };
  }
}

/**
 * Identify at-risk students in a course
 * @param {Array} students - Array of student data
 * @param {Object} courseData - Course data
 * @returns {Promise<Array>} List of at-risk students with risk scores
 */
async function identifyAtRiskStudents(students, courseData) {
  try {
    const systemPrompt = `You are an expert educational analyst.
Analyze the list of students and identify those at risk.

Format response as JSON array:
[
  {
    "studentId": "student id",
    "name": "student name",
    "riskScore": 0-100,
    "riskLevel": "low/medium/high/critical",
    "primaryConcerns": ["concern1", "concern2"],
    "urgency": "low/medium/high/critical",
    "recommendedAction": "recommended action"
  }
]`;

    const response = await createCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Identify at-risk students:\n\nStudents: ${JSON.stringify(students)}\n\nCourse Data: ${JSON.stringify(courseData)}` }
    ], 2000);

    try {
      return parseJSON(response.choices[0].message.content);
    } catch (e) {
      console.warn("Failed to parse AI response for identifyAtRiskStudents, falling back to default.");
    }

    return [];
  } catch (error) {
    console.error('Error identifying at-risk students:', error);
    return [];
  }
}

/**
 * Track intervention progress
 * @param {string} studentId - Student ID
 * @param {Object} interventionPlan - Intervention plan
 * @param {Object} progressData - Progress data
 * @returns {Promise<Object>} Progress tracking result
 */
async function trackInterventionProgress(studentId, interventionPlan, progressData) {
  try {
    const systemPrompt = `You are an expert in tracking intervention effectiveness.
Analyze the progress data and provide feedback on intervention effectiveness.

Format response as JSON:
{
  "progressScore": 0-100,
  "progressLevel": "no progress/minimal/moderate/significant/excellent",
  "completedInterventions": ["intervention1", "intervention2"],
  "pendingInterventions": ["intervention1", "intervention2"],
  "effectivenessAnalysis": "Analysis of what's working",
  "adjustments": ["adjustment1", "adjustment2"],
  "nextSteps": ["step1", "step2"],
  "estimatedTimeToRecovery": "estimated time",
  "motivationalMessage": "Encouraging message",
  "flagsForReview": ["flag1", "flag2"]
}`;

    const response = await createCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Track intervention progress:\n\nIntervention Plan: ${JSON.stringify(interventionPlan)}\n\nProgress Data: ${JSON.stringify(progressData)}` }
    ], 1500, 0.7);

    try {
      return parseJSON(response.choices[0].message.content);
    } catch (e) {
      console.warn("Failed to parse AI response for trackInterventionProgress, falling back to default.");
    }

    return {
      progressScore: 0,
      progressLevel: 'no progress',
      completedInterventions: [],
      pendingInterventions: [],
      effectivenessAnalysis: '',
      adjustments: [],
      nextSteps: [],
      estimatedTimeToRecovery: '',
      motivationalMessage: '',
      flagsForReview: [],
    };
  } catch (error) {
    console.error('Error tracking intervention progress:', error);
    return {
      progressScore: 0,
      progressLevel: 'no progress',
      completedInterventions: [],
      pendingInterventions: [],
      effectivenessAnalysis: '',
      adjustments: [],
      nextSteps: [],
      estimatedTimeToRecovery: '',
      motivationalMessage: '',
      flagsForReview: [],
    };
  }
}

/**
 * Generate risk report for course
 * @param {Array} students - Array of student data
 * @param {Object} courseData - Course data
 * @returns {Promise<Object>} Risk report
 */
async function generateRiskReport(students, courseData) {
  try {
    const systemPrompt = `You are an expert educational analyst.
Generate a comprehensive risk report for a course.

Format response as JSON:
{
  "reportDate": "date",
  "courseOverview": "Course overview",
  "totalStudents": 0,
  "atRiskCount": 0,
  "riskDistribution": {
    "low": 0,
    "medium": 0,
    "high": 0,
    "critical": 0
  },
  "commonRiskFactors": ["factor1", "factor2"],
  "trends": ["trend1", "trend2"],
  "recommendations": ["recommendation1", "recommendation2"],
  "resourcesNeeded": ["resource1", "resource2"],
  "successStories": ["story1", "story2"],
  "areasOfConcern": ["area1", "area2"]
}`;

    const response = await createCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `Generate risk report:\n\nStudents: ${JSON.stringify(students)}\n\nCourse Data: ${JSON.stringify(courseData)}` }
    ], 1500, 0.7);

    try {
      return parseJSON(response.choices[0].message.content);
    } catch (e) {
      console.warn("Failed to parse AI response for generateRiskReport, falling back to default.");
    }

    return {
      reportDate: new Date(),
      courseOverview: '',
      totalStudents: 0,
      atRiskCount: 0,
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
      commonRiskFactors: [],
      trends: [],
      recommendations: [],
      resourcesNeeded: [],
      successStories: [],
      areasOfConcern: [],
    };
  } catch (error) {
    console.error('Error generating risk report:', error);
    return {
      reportDate: new Date(),
      courseOverview: '',
      totalStudents: 0,
      atRiskCount: 0,
      riskDistribution: { low: 0, medium: 0, high: 0, critical: 0 },
      commonRiskFactors: [],
      trends: [],
      recommendations: [],
      resourcesNeeded: [],
      successStories: [],
      areasOfConcern: [],
    };
  }
}

module.exports = {
  predictStudentRisk,
  generateInterventionPlan,
  identifyAtRiskStudents,
  trackInterventionProgress,
  generateRiskReport,
};



