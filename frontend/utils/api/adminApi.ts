import api from './axiosInstance';

export const adminApi = {
  // User Management
  getAllUsers:    (params?: any) => api.get('/api/admin/users', { params }),
  updateUser:     (id: string, data: any) => api.put(`/api/admin/users/${id}`, data),
  deleteUser:     (id: string) => api.delete(`/api/admin/users/${id}`),
  changeStatus:   (id: string, status: string) => api.patch(`/api/admin/users/${id}/status`, { status }),
  changeRole:     (id: string, role: string) => api.patch(`/api/admin/users/${id}/role`, { role }),
  impersonate:    (id: string) => api.post(`/api/admin/users/${id}/impersonate`),
  
  // Platform Analytics
  getStats:       () => api.get('/api/admin/stats'),
  getOverview:    () => api.get('/api/admin/analytics/overview'),
  getGradeAnalytics:     () => api.get('/api/admin/analytics/grades'),
  getUserAnalytics:      () => api.get('/api/admin/analytics/users'),
  getAttendanceAnalytics:() => api.get('/api/admin/analytics/attendance'),
  getEnrollmentTrends:   () => api.get('/api/admin/analytics/enrollment-trends'),
  getLogs:        (params?: any) => api.get('/api/admin/logs', { params }),
  
  // Course Management (Admin level)
  getAllCourses:  (params?: any) => api.get('/api/admin/courses', { params }),
  approveCourse:  (id: string) => api.patch(`/api/admin/courses/${id}/approve`),
  changeCourseStatus: (id: string, status: string) => api.patch(`/api/admin/courses/${id}/status`, { status }),
  deleteCourse:   (id: string) => api.delete(`/api/admin/courses/${id}`),
  reassignTeacher:(id: string, teacherId: string) => api.patch(`/api/admin/courses/${id}/reassign`, { teacherId }),
};
