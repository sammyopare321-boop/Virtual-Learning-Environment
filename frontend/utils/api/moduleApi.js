import api from "@/utils/axiosInstance";

export const moduleApi = {
  getByCourse: (courseId) => api.get(`/api/courses/${courseId}/modules`),
  create: (courseId, data) => api.post(`/api/courses/${courseId}/modules`, data),
  update: (id, data) => api.put(`/api/modules/${id}`, data),
  delete: (id) => api.delete(`/api/modules/${id}`),
  getContent: (id) => api.get(`/api/modules/${id}/content`),
  addContent: (id, data) => api.post(`/api/modules/${id}/content`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  })
};
