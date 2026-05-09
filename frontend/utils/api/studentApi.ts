import api from './axiosInstance';

export const studentApi = {
  getMyCourses: () => api.get('/api/students/me/courses'),
  getMyGrades: () => api.get('/api/students/me/grades'),
  getMyCourseGrades: (courseId: string) => api.get(`/api/students/me/grades/${courseId}`),
  getMyAttendance: (courseId: string) => api.get(`/api/students/me/attendance/${courseId}`),
};
