import api from "@/utils/axiosInstance";

export const adminApi = {
  getUsers: (params) => api.get("/api/admin/users", { params }),
  getUser: (id) => api.get(`/api/admin/users/${id}`),
  changeRole: (id, role) => api.patch(`/api/admin/users/${id}/role`, { role }),
  changeStatus: (id, status) => api.patch(`/api/admin/users/${id}/status`, { status }),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  impersonate: (id) => api.post(`/api/admin/users/${id}/impersonate`),
  exitImpersonation: () => api.post("/api/admin/impersonate/exit"),
  getCourses: (params) => api.get("/api/admin/courses", { params }),
  getCourse: (id) => api.get(`/api/admin/courses/${id}`),
  reassignTeacher: (id, teacherId) => api.patch(`/api/admin/courses/${id}/teacher`, { teacherId }),
  changeCourseStatus: (id, status) => api.patch(`/api/admin/courses/${id}/status`, { status }),
  deleteCourse: (id) => api.delete(`/api/admin/courses/${id}`),
  getOverview: () => api.get("/api/admin/analytics/overview"),
  getUserAnalytics: () => api.get("/api/admin/analytics/users"),
  getCourseAnalytics: () => api.get("/api/admin/analytics/courses"),
  getGradeAnalytics: () => api.get("/api/admin/analytics/grades"),
  getAttendanceAnalytics: () => api.get("/api/admin/analytics/attendance"),
  getEnrollmentTrends: () => api.get("/api/admin/analytics/enrollment-trends"),
  getLogs: (params) => api.get("/api/admin/logs", { params })
};
