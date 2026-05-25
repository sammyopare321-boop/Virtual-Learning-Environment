import axiosInstance from './axiosInstance';

export interface RiskFactor {
  factor: string;
  severity: number;
  description: string;
  trend: 'improving' | 'stable' | 'declining';
}

export interface RiskPrediction {
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: RiskFactor[];
  predictedOutcome: string;
  interventionUrgency: 'low' | 'medium' | 'high' | 'critical';
  confidenceScore: number;
  keyIndicators: string[];
  recommendations: string[];
}

export interface AtRiskStudent {
  studentId: string;
  name: string;
  riskScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  primaryConcerns: string[];
  urgency: 'low' | 'medium' | 'high' | 'critical';
  recommendedAction: string;
}

export interface InterventionPlan {
  planName: string;
  description: string;
  duration: string;
  interventions: Array<{
    type: 'academic' | 'social' | 'emotional' | 'behavioral';
    title: string;
    description: string;
    frequency: string;
    duration: string;
    responsible: string;
    successMetrics: string[];
    resources: string[];
  }>;
  supportTeam: string[];
  checkpoints: Array<{
    date: string;
    milestone: string;
    successCriteria: string[];
  }>;
  communicationPlan: string;
  escalationProcedure: string;
  expectedOutcome: string;
  contingencyPlans: string[];
}

export interface RiskReport {
  reportDate: string;
  courseOverview: string;
  totalStudents: number;
  atRiskCount: number;
  riskDistribution: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  commonRiskFactors: string[];
  trends: string[];
  recommendations: string[];
  resourcesNeeded: string[];
}

export interface AtRiskStudentsResponse {
  success: boolean;
  data: {
    students: AtRiskStudent[];
    report: RiskReport;
  };
  message: string;
}

export interface RiskScoreResponse {
  success: boolean;
  data: RiskPrediction;
  message: string;
}

export interface InterventionResponse {
  success: boolean;
  data: InterventionPlan;
  message: string;
}

const riskApi = {
  /**
   * Get at-risk students for a course
   */
  getAtRiskStudents: async (courseId: string): Promise<AtRiskStudentsResponse> => {
    const response = await axiosInstance.post(`/ai/at-risk-students`, {
      courseId,
    });
    return response.data;
  },

  /**
   * Get risk score for a specific student
   */
  getStudentRiskScore: async (
    studentId: string,
    courseId: string
  ): Promise<RiskScoreResponse> => {
    const response = await axiosInstance.get(`/ai/risk-score/${studentId}`, {
      params: {
        courseId,
      },
    });
    return response.data;
  },

  /**
   * Create intervention plan for at-risk student
   */
  createInterventionPlan: async (
    studentId: string,
    riskPrediction: RiskPrediction
  ): Promise<InterventionResponse> => {
    const response = await axiosInstance.post(`/ai/intervention`, {
      studentId,
      riskPrediction,
    });
    return response.data;
  },

  /**
   * Update intervention progress
   */
  updateInterventionProgress: async (
    studentId: string,
    progressData: {
      completedInterventions: string[];
      currentScore: number;
      notes: string;
    }
  ): Promise<{ success: boolean; data: any; message: string }> => {
    const response = await axiosInstance.post(`/ai/intervention/progress`, {
      studentId,
      progressData,
    });
    return response.data;
  },

  /**
   * Get intervention plan for student
   */
  getInterventionPlan: async (studentId: string): Promise<InterventionResponse> => {
    const response = await axiosInstance.get(`/ai/intervention/${studentId}`);
    return response.data;
  },

  /**
   * Generate risk report for course
   */
  generateRiskReport: async (
    courseId: string
  ): Promise<{ success: boolean; data: RiskReport; message: string }> => {
    const response = await axiosInstance.post(`/ai/risk-report`, {
      courseId,
    });
    return response.data;
  },
};

export default riskApi;


