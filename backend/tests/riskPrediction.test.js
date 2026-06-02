/**
 * Unit tests for Risk Prediction System
 * Tests Requirements 1.2, 1.3, 5.1 from ai-system-critical-fixes spec
 */

const {
  predictStudentRisk,
  generateInterventionPlan,
  identifyAtRiskStudents,
  trackInterventionProgress,
  generateRiskReport,
} = require('../src/utils/riskPrediction');

// Mock the aiClient module
jest.mock('../src/utils/aiClient');
const { createCompletion, parseJSON } = require('../src/utils/aiClient');

describe('Risk Prediction System', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Suppress console output during tests
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
    console.warn.mockRestore();
    console.log.mockRestore();
  });

  describe('predictStudentRisk', () => {
    const mockStudentData = {
      studentId: 'student123',
      name: 'Test Student',
      recentScores: [75, 65, 60],
      averageGrade: 67,
    };
    const mockHistoricalData = [
      { assignment: 'Test 1', score: 75 },
      { assignment: 'Test 2', score: 65 },
    ];

    it('should successfully predict student risk with valid AI response', async () => {
      const mockAIResponse = {
        choices: [{
          message: {
            content: JSON.stringify({
              riskScore: 65,
              riskLevel: 'medium',
              riskFactors: [{ factor: 'Declining grades', severity: 60, description: 'Grades trending down', trend: 'declining' }],
              predictedOutcome: 'May struggle without intervention',
              interventionUrgency: 'medium',
              confidenceScore: 75,
              keyIndicators: ['grade trend', 'attendance'],
              recommendations: ['Additional tutoring', 'Check in regularly'],
            }),
          },
        }],
      };

      createCompletion.mockResolvedValue(mockAIResponse);
      parseJSON.mockReturnValue(JSON.parse(mockAIResponse.choices[0].message.content));

      const result = await predictStudentRisk(mockStudentData, mockHistoricalData);

      expect(createCompletion).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user' }),
        ]),
        2000
      );
      expect(result).toEqual({
        riskScore: 65,
        riskLevel: 'medium',
        riskFactors: expect.any(Array),
        predictedOutcome: 'May struggle without intervention',
        interventionUrgency: 'medium',
        confidenceScore: 75,
        keyIndicators: expect.any(Array),
        recommendations: expect.any(Array),
      });
    });

    it('should return fallback structure when AI call fails', async () => {
      createCompletion.mockRejectedValue(new Error('AI provider failed'));

      const result = await predictStudentRisk(mockStudentData, mockHistoricalData);

      expect(result).toEqual({
        riskScore: 0,
        riskLevel: 'low',
        riskFactors: [],
        predictedOutcome: 'Unknown',
        interventionUrgency: 'low',
        confidenceScore: 0,
        keyIndicators: [],
        recommendations: [],
      });
      expect(console.error).toHaveBeenCalledWith(
        'Error predicting student risk:',
        expect.any(Error)
      );
    });

    it('should return fallback structure when JSON parsing fails', async () => {
      const mockAIResponse = {
        choices: [{
          message: {
            content: 'invalid json response',
          },
        }],
      };

      createCompletion.mockResolvedValue(mockAIResponse);
      parseJSON.mockImplementation(() => {
        throw new Error('JSON parse error');
      });

      const result = await predictStudentRisk(mockStudentData, mockHistoricalData);

      expect(result).toEqual({
        riskScore: 0,
        riskLevel: 'low',
        riskFactors: [],
        predictedOutcome: 'Unknown',
        interventionUrgency: 'low',
        confidenceScore: 0,
        keyIndicators: [],
        recommendations: [],
      });
      expect(console.warn).toHaveBeenCalledWith(
        'Failed to parse AI response for predictStudentRisk, falling back to default.'
      );
    });

    it('should execute without TypeError (no getClient error)', async () => {
      createCompletion.mockResolvedValue({
        choices: [{ message: { content: '{}' } }],
      });
      parseJSON.mockReturnValue({
        riskScore: 0,
        riskLevel: 'low',
        riskFactors: [],
        predictedOutcome: 'Unknown',
        interventionUrgency: 'low',
        confidenceScore: 0,
        keyIndicators: [],
        recommendations: [],
      });

      await expect(predictStudentRisk(mockStudentData, mockHistoricalData)).resolves.toBeDefined();
    });
  });

  describe('generateInterventionPlan', () => {
    const mockRiskPrediction = {
      riskScore: 70,
      riskLevel: 'high',
      riskFactors: [{ factor: 'Poor attendance', severity: 75 }],
    };
    const mockStudentData = { studentId: 'student123', name: 'Test Student' };

    it('should successfully generate intervention plan', async () => {
      const mockPlan = {
        planName: 'Academic Support Plan',
        description: 'Support plan for at-risk student',
        duration: '8 weeks',
        interventions: [],
        supportTeam: ['Teacher', 'Counselor'],
        checkpoints: [],
        communicationPlan: 'Weekly check-ins',
        escalationProcedure: 'Contact admin if no improvement',
        expectedOutcome: 'Improved grades and engagement',
        contingencyPlans: [],
      };

      const mockAIResponse = {
        choices: [{ message: { content: JSON.stringify(mockPlan) } }],
      };

      createCompletion.mockResolvedValue(mockAIResponse);
      parseJSON.mockReturnValue(mockPlan);

      const result = await generateInterventionPlan(mockRiskPrediction, mockStudentData);

      expect(createCompletion).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user' }),
        ]),
        2500
      );
      expect(result).toMatchObject(mockPlan);
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('lastUpdated');
    });

    it('should return fallback structure when AI call fails', async () => {
      createCompletion.mockRejectedValue(new Error('Network error'));

      const result = await generateInterventionPlan(mockRiskPrediction, mockStudentData);

      expect(result).toEqual({
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
        createdAt: expect.any(Date),
        lastUpdated: expect.any(Date),
      });
    });

    it('should return fallback structure when JSON parsing fails', async () => {
      createCompletion.mockResolvedValue({
        choices: [{ message: { content: 'invalid' } }],
      });
      parseJSON.mockImplementation(() => {
        throw new Error('Parse error');
      });

      const result = await generateInterventionPlan(mockRiskPrediction, mockStudentData);

      expect(result.planName).toBe('Default Intervention Plan');
      expect(result).toHaveProperty('createdAt');
    });
  });

  describe('identifyAtRiskStudents', () => {
    const mockStudents = [
      { studentId: 'student1', name: 'Alice', averageGrade: 55 },
      { studentId: 'student2', name: 'Bob', averageGrade: 85 },
    ];
    const mockCourseData = { courseId: 'course123', courseName: 'Math 101' };

    it('should successfully identify at-risk students', async () => {
      const mockResult = [
        {
          studentId: 'student1',
          name: 'Alice',
          riskScore: 75,
          riskLevel: 'high',
          primaryConcerns: ['Low grades'],
          urgency: 'high',
          recommendedAction: 'Immediate intervention',
        },
      ];

      const mockAIResponse = {
        choices: [{ message: { content: JSON.stringify(mockResult) } }],
      };

      createCompletion.mockResolvedValue(mockAIResponse);
      parseJSON.mockReturnValue(mockResult);

      const result = await identifyAtRiskStudents(mockStudents, mockCourseData);

      expect(createCompletion).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user' }),
        ]),
        2000
      );
      expect(result).toEqual(mockResult);
      expect(result).toHaveLength(1);
    });

    it('should return empty array when AI call fails', async () => {
      createCompletion.mockRejectedValue(new Error('Provider unavailable'));

      const result = await identifyAtRiskStudents(mockStudents, mockCourseData);

      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Error identifying at-risk students:',
        expect.any(Error)
      );
    });

    it('should return empty array when JSON parsing fails', async () => {
      createCompletion.mockResolvedValue({
        choices: [{ message: { content: 'not json' } }],
      });
      parseJSON.mockImplementation(() => {
        throw new Error('Parse error');
      });

      const result = await identifyAtRiskStudents(mockStudents, mockCourseData);

      expect(result).toEqual([]);
    });
  });

  describe('trackInterventionProgress', () => {
    const mockStudentId = 'student123';
    const mockInterventionPlan = {
      planName: 'Academic Support',
      interventions: [{ title: 'Tutoring' }],
    };
    const mockProgressData = {
      completedSessions: 5,
      attendanceRate: 0.8,
    };

    it('should successfully track intervention progress', async () => {
      const mockProgress = {
        progressScore: 70,
        progressLevel: 'moderate',
        completedInterventions: ['Tutoring'],
        pendingInterventions: [],
        effectivenessAnalysis: 'Good progress',
        adjustments: [],
        nextSteps: ['Continue tutoring'],
        estimatedTimeToRecovery: '4 weeks',
        motivationalMessage: 'Keep up the good work!',
        flagsForReview: [],
      };

      const mockAIResponse = {
        choices: [{ message: { content: JSON.stringify(mockProgress) } }],
      };

      createCompletion.mockResolvedValue(mockAIResponse);
      parseJSON.mockReturnValue(mockProgress);

      const result = await trackInterventionProgress(
        mockStudentId,
        mockInterventionPlan,
        mockProgressData
      );

      expect(createCompletion).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user' }),
        ]),
        1500,
        0.7
      );
      expect(result).toEqual(mockProgress);
    });

    it('should return fallback structure when AI call fails', async () => {
      createCompletion.mockRejectedValue(new Error('Timeout'));

      const result = await trackInterventionProgress(
        mockStudentId,
        mockInterventionPlan,
        mockProgressData
      );

      expect(result).toEqual({
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
      });
    });
  });

  describe('generateRiskReport', () => {
    const mockStudents = [
      { studentId: 'student1', averageGrade: 55 },
      { studentId: 'student2', averageGrade: 85 },
    ];
    const mockCourseData = { courseId: 'course123', totalEnrollment: 2 };

    it('should successfully generate risk report', async () => {
      const mockReport = {
        reportDate: '2024-01-01',
        courseOverview: 'Course overview',
        totalStudents: 2,
        atRiskCount: 1,
        riskDistribution: { low: 1, medium: 0, high: 1, critical: 0 },
        commonRiskFactors: ['Low grades'],
        trends: ['Declining performance'],
        recommendations: ['Increase support'],
        resourcesNeeded: ['Tutors'],
        successStories: [],
        areasOfConcern: ['Student retention'],
      };

      const mockAIResponse = {
        choices: [{ message: { content: JSON.stringify(mockReport) } }],
      };

      createCompletion.mockResolvedValue(mockAIResponse);
      parseJSON.mockReturnValue(mockReport);

      const result = await generateRiskReport(mockStudents, mockCourseData);

      expect(createCompletion).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ role: 'system' }),
          expect.objectContaining({ role: 'user' }),
        ]),
        1500,
        0.7
      );
      expect(result).toEqual(mockReport);
    });

    it('should return fallback structure when AI call fails', async () => {
      createCompletion.mockRejectedValue(new Error('Service unavailable'));

      const result = await generateRiskReport(mockStudents, mockCourseData);

      expect(result).toEqual({
        reportDate: expect.any(Date),
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
      });
    });
  });

  describe('Error handling and logging', () => {
    it('should log errors with context when AI fails', async () => {
      const errorMessage = 'All AI providers failed';
      createCompletion.mockRejectedValue(new Error(errorMessage));

      await predictStudentRisk({ studentId: 'test' }, []);

      expect(console.error).toHaveBeenCalledWith(
        'Error predicting student risk:',
        expect.objectContaining({ message: errorMessage })
      );
    });

    it('should not throw unhandled exceptions on AI failure', async () => {
      createCompletion.mockRejectedValue(new Error('Critical failure'));

      await expect(predictStudentRisk({}, [])).resolves.toBeDefined();
      await expect(generateInterventionPlan({}, {})).resolves.toBeDefined();
      await expect(identifyAtRiskStudents([], {})).resolves.toBeDefined();
      await expect(trackInterventionProgress('id', {}, {})).resolves.toBeDefined();
      await expect(generateRiskReport([], {})).resolves.toBeDefined();
    });
  });
});
