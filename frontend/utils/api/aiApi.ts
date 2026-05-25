import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const aiApi = {
  /**
   * Generate course outline
   */
  generateCourseOutline: async (courseTitle: string, courseDescription: string, duration: number) => {
    return axios.post(`${API_BASE_URL}/ai/course-outline`, {
      courseTitle,
      courseDescription,
      duration
    });
  },

  /**
   * Generate quiz questions
   */
  generateQuizQuestions: async (topic: string, difficulty: string = 'medium', count: number = 5) => {
    return axios.post(`${API_BASE_URL}/ai/quiz-questions`, {
      topic,
      difficulty,
      count
    });
  },

  /**
   * Generate assignment prompt
   */
  generateAssignmentPrompt: async (topic: string, learningOutcomes: string[], difficulty: string = 'medium') => {
    return axios.post(`${API_BASE_URL}/ai/assignment-prompt`, {
      topic,
      learningOutcomes,
      difficulty
    });
  },

  /**
   * Generate lecture notes
   */
  generateLectureNotes: async (topic: string, subtopics: string[] = []) => {
    return axios.post(`${API_BASE_URL}/ai/lecture-notes`, {
      topic,
      subtopics
    });
  },

  /**
   * Generate student feedback
   */
  generateStudentFeedback: async (submissionContent: string, rubricCriteria: string[], score: number) => {
    return axios.post(`${API_BASE_URL}/ai/student-feedback`, {
      submissionContent,
      rubricCriteria,
      score
    });
  },

  /**
   * Generate complete syllabus
   */
  generateSyllabus: async (courseInfo: {
    title: string;
    code: string;
    instructor: string;
    duration: number;
    level: string;
    description: string;
  }) => {
    return axios.post(`${API_BASE_URL}/ai/syllabus`, courseInfo);
  }
};
