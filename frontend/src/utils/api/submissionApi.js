import api from '../axiosInstance';

export const submissionApi = {
  submit: (assignmentId, data) => api.post(`/api/assignments/${assignmentId}/submit`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getByAssignment: (assignmentId) => api.get(`/api/assignments/${assignmentId}/submissions`),
  getMySubmission: (assignmentId) => api.get(`/api/assignments/${assignmentId}/my-submission`),
  grade: (submissionId, data) => api.patch(`/api/submissions/${submissionId}/grade`, data),
};
