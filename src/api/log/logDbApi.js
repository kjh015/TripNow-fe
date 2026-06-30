import apiClient from '../client';

export const getSuccessList = () =>
  apiClient.get('/api/log-db/admin/success');

export const getFailListByFilter = () =>
  apiClient.get('/api/log-db/admin/fail-filter');

export const getFailListByDeduplication = () =>
  apiClient.get('/api/log-db/admin/fail-deduplication');
