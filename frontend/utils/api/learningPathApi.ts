import axiosInstance from './axiosInstance';

export interface LearningPathResponse {
  success: boolean;
  data: {
    pathName: string;
    description: string;
    duration: string;
    modules: Array<{
      moduleId: string;
      title: string;
      description: string;
      duration: string;
      difficulty: string;
      resources: string[];
      objectives: string[];
      assessments: string[];
      prerequisites: string[];
      estimatedCompletion: string;
    }>;
    milestones: Array<{
      name: string;
      description: string;
      targetDate: string;
      successCriteria: string[];
    }>;
    adaptiveStrategies: string[];
    supportResources: string[];
    checkpoints: string[];
    studentId: string;
    createdAt: string;
    lastUpdated: string;
  };
  message: string;
}

export interface ResourcesResponse {
  success: boolean;
  data: Array<{
    title: string;
    type: 'video' | 'article' | 'interactive' | 'book' | 'podcast';
    description: string;
    duration: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    url: string;
    rating: number;
    relevance: number;
    suitableFor: string[];
  }>;
  message: string;
}

export interface UpdatePathResponse {
  success: boolean;
  data: {
    adjustments: string[];
    nextSteps: string[];
    acceleratedModules: string[];
    reviewModules: string[];
    newResources: string[];
    estimatedCompletion: string;
    motivationalMessage: string;
    recommendations: string;
    lastUpdated: string;
  };
  message: string;
}

const learningPathApi = {
  /**
   * Generate a personalized learning path for a student
   */
  generateLearningPath: async (
    studentId: string,
    courseTitle: string
  ): Promise<LearningPathResponse> => {
    const response = await axiosInstance.post(`/ai/learning-path`, {
      studentId,
      courseTitle,
    });
    return response.data;
  },

  /**
   * Get a student's current learning path
   */
  getStudentLearningPath: async (
    studentId: string
  ): Promise<LearningPathResponse> => {
    const response = await axiosInstance.get(`/ai/learning-path/${studentId}`);
    return response.data;
  },

  /**
   * Update a learning path based on student progress
   */
  updateLearningPath: async (
    studentId: string,
    progressData: {
      completedModules: string[];
      currentScore: number;
      timeSpent: number;
      strugglingAreas: string[];
    }
  ): Promise<UpdatePathResponse> => {
    const response = await axiosInstance.post(`/ai/learning-path/update`, {
      studentId,
      progressData,
    });
    return response.data;
  },

  /**
   * Get recommended resources for a specific topic
   */
  getRecommendedResources: async (
    topic: string,
    learningStyle: string,
    difficultyLevel: 'beginner' | 'intermediate' | 'advanced'
  ): Promise<ResourcesResponse> => {
    const response = await axiosInstance.get(`/ai/learning-resources`, {
      params: {
        topic,
        learningStyle,
        difficultyLevel,
      },
    });
    return response.data;
  },
};

export default learningPathApi;


