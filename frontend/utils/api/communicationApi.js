import api from "@/utils/axiosInstance";

export const communicationApi = {
  createAnnouncement: (courseId, data) => api.post(`/api/courses/${courseId}/announcements`, data),
  getAnnouncements: (courseId) => api.get(`/api/courses/${courseId}/announcements`),
  getDiscussions: (courseId) => api.get(`/api/courses/${courseId}/discussions`),
  startDiscussion: (courseId, data) => api.post(`/api/courses/${courseId}/discussions`, data),
  getDiscussion: (courseId, discussionId) => api.get(`/api/courses/${courseId}/discussions/${discussionId}`),
  reply: (courseId, discussionId, data) => api.post(`/api/courses/${courseId}/discussions/${discussionId}/reply`, data),
  getMessages: (userId) => api.get(`/api/communication/messages/${userId}`),
  getNotifications: () => api.get("/api/communication/notifications/me"),
  markRead: (id) => api.patch(`/api/communication/notifications/${id}/read`)
};
