import api from "@/utils/axiosInstance";

export const courseApi = {
  getAll: (params) => api.get("/api/courses", { params }),
  getOne: (id) => api.get(`/api/courses/${id}`),
  create: (data) => api.post("/api/courses", data),
  update: (id, data) => api.put(`/api/courses/${id}`, data),
  delete: (id) => api.delete(`/api/courses/${id}`),
  getStudents: (id) => api.get(`/api/courses/${id}/students`),
  enroll: (id) => api.post(`/api/courses/${id}/enroll`),
  drop: (id) => api.delete(`/api/courses/${id}/enroll`),
  getMyCourses: () => api.get("/api/students/me/courses")
};
