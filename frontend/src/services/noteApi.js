import apiClient from './api/axios';
export const noteApi = {
  createNote: async (data) => {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post('/notes', data, {
      headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : {},
    });
    return response.data;
  },

  getMyNotes: async (params = {}) => {
    const response = await apiClient.get('/notes/my', { params });
    return response.data;
  },

  getPublicNotes: async (params = {}) => {
    const response = await apiClient.get('/notes/public', { params });
    return response.data;
  },

  getNoteById: async (id) => {
    const response = await apiClient.get(`/notes/${id}`);
    return response.data;
  },

  deleteNote: async (id) => {
    const response = await apiClient.delete(`/notes/${id}`);
    return response.data;
  },

  enrollInNote: async (id) => {
    const response = await apiClient.post(`/notes/${id}/enroll`);
    return response.data;
  },

  unenrollFromNote: async (id) => {
    const response = await apiClient.delete(`/notes/${id}/enroll`);
    return response.data;
  },

  getMyEnrolledNotes: async (params = {}) => {
    const response = await apiClient.get('/notes/enrolled/my', { params });
    return response.data;
  },

  checkNoteEnrollment: async (id) => {
    const response = await apiClient.get(`/notes/${id}/enrollment`);
    return response.data;
  },

  updateNoteProgress: async (id, progress) => {
    const response = await apiClient.patch(`/notes/${id}/progress`, { progress });
    return response.data;
  },
};

export default noteApi;
