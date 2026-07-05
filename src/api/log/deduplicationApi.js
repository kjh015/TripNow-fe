import apiClient from '../client';

export const getDeduplicationList = (processId) =>
  apiClient.get('/api/deduplication/admin/list', { params: { processId } });

export const viewDeduplication = (deduplicationId) =>
  apiClient.get('/api/deduplication/admin/view', { params: { deduplicationId } });

export const addDeduplication = ({ processId, name, active, rows }) =>
  apiClient.post('/api/deduplication/admin/add', { processId, name, active, rows });

export const updateDeduplication = ({ id, name, active, rows }) =>
  apiClient.post('/api/deduplication/admin/update', { id, name, active, rows });

export const removeDeduplication = (deduplicationId) =>
  apiClient.post('/api/deduplication/admin/remove', null, { params: { deduplicationId } });

export const getFormatKeys = (processId) =>
  apiClient.get('/api/deduplication/admin/keys', { params: { processId } });
