import api from '../axiosInstance';

export const contentApi = {
  getByModule: (moduleId) => api.get(`/api/modules/${moduleId}/content`),
  upload: (moduleId, data) => api.post(`/api/modules/${moduleId}/content`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getOne: (id) => api.get(`/api/content/${id}`),
  delete: (id) => api.delete(`/api/content/${id}`),
};
