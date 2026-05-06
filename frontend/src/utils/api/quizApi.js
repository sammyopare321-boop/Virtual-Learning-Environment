import api from "@/utils/axiosInstance";

export const quizApi = {
  getByCourse: (courseId) => api.get(`/api/courses/${courseId}/quizzes`),
  create: (courseId, data) => api.post(`/api/courses/${courseId}/quizzes`, data),
  getOne: (id) => api.get(`/api/quizzes/${id}`),
  update: (id, data) => api.put(`/api/quizzes/${id}`, data),
  delete: (id) => api.delete(`/api/quizzes/${id}`),
  publish: (id) => api.patch(`/api/quizzes/${id}/publish`),
  getQuestions: (id) => api.get(`/api/quizzes/${id}/questions`),
  addQuestion: (id, data) => api.post(`/api/quizzes/${id}/questions`, data),
  updateQuestion: (questionId, data) => api.put(`/api/questions/${questionId}`, data),
  deleteQuestion: (questionId) => api.delete(`/api/questions/${questionId}`),
  start: (id) => api.post(`/api/quizzes/${id}/start`),
  submit: (id, data) => api.post(`/api/quizzes/${id}/submit`, data),
  getMyAttempt: (id) => api.get(`/api/quizzes/${id}/my-attempt`),
  getAllAttempts: (id) => api.get(`/api/quizzes/${id}/attempts`),
  gradeAttempt: (attemptId, data) => api.patch(`/api/attempts/${attemptId}/grade`, data)
};
