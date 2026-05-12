import api from './axiosInstance';

export const teacherApi = {
  getStats: () => api.get('/api/teachers/me/stats'),
};
