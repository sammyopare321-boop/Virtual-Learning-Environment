import api from "@/utils/axiosInstance";

export const quizApi = {
  getByCourse: (courseId) => api.get(`/api/courses/${courseId}/quizzes`),
  create: (courseId, data) => api.post(`/api/courses/${courseId}/quizzes`, data),
  getQuestions: (courseId, quizId) => api.get(`/api/courses/${courseId}/quizzes/${quizId}/questions`),
  addQuestion: (courseId, quizId, data) => api.post(`/api/courses/${courseId}/quizzes/${quizId}/questions`, data),
  start: (courseId, quizId) => api.post(`/api/courses/${courseId}/quizzes/${quizId}/start`),
  submit: (courseId, quizId, data) => api.post(`/api/courses/${courseId}/quizzes/${quizId}/submit`, data)
};
