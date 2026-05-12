import api from './axiosInstance';
import { Quiz, Question, Attempt, LiveSession } from '@/types';

export const submissionApi = {
  submitAssignment: (assignmentId: string, formData: FormData) =>
    api.post(`/api/assignments/${assignmentId}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getSubmissions: (assignmentId: string) => api.get(`/api/assignments/${assignmentId}/submissions`),
  getMySubmission: (assignmentId: string) => api.get(`/api/assignments/${assignmentId}/my-submission`),
  gradeSubmission: (submissionId: string, data: { grade: number, feedback?: string }) =>
    api.patch(`/api/submissions/${submissionId}/grade`, data),
};

export const quizApi = {
  getQuizzes: (courseId: string) => api.get(`/api/courses/${courseId}/quizzes`),
  createQuiz: (courseId: string, data: Partial<Quiz>) => api.post(`/api/courses/${courseId}/quizzes`, data),
  getQuiz: (quizId: string) => api.get(`/api/quizzes/${quizId}`),
  updateQuiz: (quizId: string, data: Partial<Quiz>) => api.put(`/api/quizzes/${quizId}`, data),
  deleteQuiz: (quizId: string) => api.delete(`/api/quizzes/${quizId}`),
  publishQuiz: (quizId: string) => api.patch(`/api/quizzes/${quizId}/publish`),

  // Questions
  getQuestions: (quizId: string) => api.get(`/api/quizzes/${quizId}/questions`),
  addQuestion: (quizId: string, data: Partial<Question>) => api.post(`/api/quizzes/${quizId}/questions`, data),
  updateQuestion: (questionId: string, data: Partial<Question>) => api.put(`/api/questions/${questionId}`, data),
  deleteQuestion: (questionId: string) => api.delete(`/api/questions/${questionId}`),

  // Attempts
  startAttempt: (quizId: string) => api.post(`/api/quizzes/${quizId}/start`),
  submitAttempt: (quizId: string, data: { answers: Record<string, string> }) => api.post(`/api/quizzes/${quizId}/submit`, data),
  getMyAttempt: (quizId: string) => api.get(`/api/quizzes/${quizId}/my-attempt`),
  getAllAttempts: (quizId: string) => api.get(`/api/quizzes/${quizId}/attempts`),
  gradeAttempt: (attemptId: string, data: { score: number, feedback?: string }) => api.patch(`/api/attempts/${attemptId}/grade`, data),
};

export const liveSessionApi = {
  getLiveSessions: (courseId: string) => api.get(`/api/courses/${courseId}/live-sessions`),
  createLiveSession: (courseId: string, data: Partial<LiveSession>) => api.post(`/api/courses/${courseId}/live-sessions`, data),
  startSession: (sessionId: string) => api.patch(`/api/live-sessions/${sessionId}/start`),
  endSession: (sessionId: string) => api.patch(`/api/live-sessions/${sessionId}/end`),
  joinSession: (sessionId: string) => api.get(`/api/live-sessions/${sessionId}/join`),
};
