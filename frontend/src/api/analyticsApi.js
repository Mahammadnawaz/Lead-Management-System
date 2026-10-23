import api from './axios';

export const analyticsApi = {
  getMetrics: async () => {
    const response = await api.get('/analytics/metrics');
    return response.data;
  },
};
