import api from "@/utils/axiosInstance";

export const assignmentApi = {
  getByCourse: (courseId) => api.get(`/api/courses/${courseId}/assignments`),
  create: (courseId, data) => api.post(`/api/courses/${courseId}/assignments`, data),
  getOne: (id) => api.get(`/api/assignments/${id}`),
  update: (id, data) => api.put(`/api/assignments/${id}`, data),
  delete: (id) => api.delete(`/api/assignments/${id}`),
  submit: (id, data) => api.post(`/api/assignments/${id}/submit`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  }),
  getSubmissions: (id) => api.get(`/api/assignments/${id}/submissions`),
  getMySubmission: (id) => api.get(`/api/assignments/${id}/my-submission`)
};
