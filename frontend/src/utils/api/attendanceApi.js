import api from "@/utils/axiosInstance";

export const attendanceApi = {
  createSession: (courseId, data) => api.post(`/api/courses/${courseId}/attendance`, data),
  getSummary: (courseId) => api.get(`/api/courses/${courseId}/attendance/summary`),
  getMyAttendance: (courseId) => api.get(`/api/students/me/attendance/${courseId}`),
  getRecords: (courseId, sessionId) => api.get(`/api/courses/${courseId}/attendance/${sessionId}`),
  mark: (courseId, sessionId, data) => api.post(`/api/courses/${courseId}/attendance/${sessionId}/mark`, data)
};
