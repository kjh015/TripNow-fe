import apiClient from '../client';

export const getDashboardData = ({ data }) =>
  apiClient.post('/api/monitoring/admin/top', null, { params: { data } });

export const getVisit = ({ period }) =>
  apiClient.post('/api/monitoring/admin/visit', null, { params: { period } });
