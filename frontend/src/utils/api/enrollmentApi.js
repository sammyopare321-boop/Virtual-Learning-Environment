import api from '../axiosInstance';

export const enrollmentApi = {
  enroll: (courseId) => api.post(`/api/courses/${courseId}/enroll`),
  drop: (courseId) => api.delete(`/api/courses/${courseId}/enroll`),
  getEnrolledCourses: () => api.get('/api/enrollments/my-courses'),
};
