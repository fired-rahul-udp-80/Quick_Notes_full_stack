import apiClient from './api/axios';

/**
 * Dashboard API Service
 */
export const dashboardApi = {
  getStudentStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },
};

export default dashboardApi;
