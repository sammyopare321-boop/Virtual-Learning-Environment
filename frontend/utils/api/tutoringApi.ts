import axiosInstance from './axiosInstance';

const tutoringApi = {
  /**
   * Get tutoring response for a student question
   */
  getTutoringResponse: async (
    question: string,
    courseTitle: string,
    topic: string,
    studentLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ) => {
    const response = await axiosInstance.post(`/api/ai/tutoring`, {
      question,
      courseTitle,
      topic,
      studentLevel,
    });
    return response.data;
  },

  /**
   * Generate practice problems for a topic
   */
  generatePracticeProblems: async (
    topic: string,
    difficulty: 'easy' | 'medium' | 'hard' = 'medium',
    count: number = 5
  ) => {
    const response = await axiosInstance.post(`/api/ai/practice-problems`, {
      topic,
      difficulty,
      count,
    });
    return response.data;
  },

  /**
   * Analyze student's answer and provide feedback
   */
  analyzeAnswer: async (
    question: string,
    studentAnswer: string,
    topic: string
  ) => {
    const response = await axiosInstance.post(`/api/ai/analyze-answer`, {
      question,
      studentAnswer,
      topic,
    });
    return response.data;
  },

  /**
   * Get concept explanation
   */
  explainConcept: async (
    concept: string,
    courseContext: string,
    studentLevel: 'beginner' | 'intermediate' | 'advanced' = 'intermediate'
  ) => {
    const response = await axiosInstance.post(`/api/ai/explain-concept`, {
      concept,
      courseContext,
      studentLevel,
    });
    return response.data;
  },

  /**
   * Get tutoring history for a student
   */
  getTutoringHistory: async (studentId: string, limit: number = 50) => {
    const response = await axiosInstance.get(`/api/ai/tutoring-history/${studentId}`, {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Save tutoring interaction
   */
  saveTutoringInteraction: async (
    studentId: string,
    question: string,
    response: string,
    topic: string
  ) => {
    const response_data = await axiosInstance.post(`/api/ai/tutoring-history`, {
      studentId,
      question,
      response,
      topic,
    });
    return response_data.data;
  },
};

export default tutoringApi;

