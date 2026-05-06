import api from "@/utils/axiosInstance";

export const gradeApi = {
  getWeights: (courseId) => api.get(`/api/courses/${courseId}/grade-weights/weights`),
  setWeights: (courseId, data) => api.patch(`/api/courses/${courseId}/grade-weights/weights`, data),
  getGradeBook: (courseId) => api.get(`/api/courses/${courseId}/gradebook/gradebook`),
  getCourseAnalytics: (courseId) => api.get(`/api/courses/${courseId}/analytics/analytics`),
  getAtRisk: (courseId) => api.get(`/api/courses/${courseId}/analytics/analytics/at-risk`),
  getMyGrades: () => api.get("/api/students/me/grades"),
  getMyCourseGrades: (courseId) => api.get(`/api/students/me/grades/${courseId}`)
};
