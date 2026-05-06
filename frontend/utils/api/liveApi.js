import api from "@/utils/axiosInstance";

export const liveApi = {
  getByCourse: (courseId) => api.get(`/api/courses/${courseId}/live-sessions`),
  create: (courseId, data) => api.post(`/api/courses/${courseId}/live-sessions`, data),
  start: (courseId, id) => api.patch(`/api/courses/${courseId}/live-sessions/${id}/start`),
  end: (courseId, id) => api.patch(`/api/courses/${courseId}/live-sessions/${id}/end`),
  join: (courseId, id) => api.get(`/api/courses/${courseId}/live-sessions/${id}/join`)
};
