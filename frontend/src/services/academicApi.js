import apiClient from './api/axios';

/**
 * Academic API service handling courses, semesters, and subjects
 */
export const academicApi = {
  // Course APIs
  createCourse: async (data) => {
    const response = await apiClient.post('/courses', data);
    return response.data;
  },

  getMyCourses: async (params = {}) => {
    const response = await apiClient.get('/courses/my', { params });
    return response.data;
  },

  getAllCourses: async (params = {}) => {
    const response = await apiClient.get('/courses', { params });
    return response.data;
  },

  getCourseById: async (id) => {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  },

  // Semester APIs
  createSemester: async (courseId, data) => {
    const response = await apiClient.post(`/courses/${courseId}/semesters`, data);
    return response.data;
  },

  getSemestersByCourse: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/semesters`);
    return response.data;
  },

  getSemestersByNotesId: async (courseId) => {
    const response = await apiClient.get(`/courses/${courseId}/semesters`);
    return response.data;
  },

  // Subject APIs
  createSubject: async (semesterId, data) => {
    const response = await apiClient.post(`/semesters/${semesterId}/subjects`, data);
    return response.data;
  },

  getSubjectsBySemester: async (semesterId) => {
    const response = await apiClient.get(`/semesters/${semesterId}/subjects`);
    return response.data;
  },

 // Bookmark / Saved Notes APIs
  saveNote: async (noteId) => {
    const response = await apiClient.post(`/saved-notes/${noteId}`);
    return response.data;
  },

  removeSavedNote: async (noteId) => {
    const response = await apiClient.delete(`/saved-notes/${noteId}`);
    return response.data;
  },

  getSavedNotes: async (params = {}) => {
    const response = await apiClient.get('/saved-notes', { params });
    return response.data;
  },
};

export default academicApi;
