import apiClient from '../client';

export const getProcessList = () =>
  apiClient.get('/api/process/admin/list');

export const addProcess = (name) =>
  apiClient.post('/api/process/admin/add', null, { params: { name } });

export const updateProcess = (processId, name) =>
  apiClient.post('/api/process/admin/update', null, { params: { processId, name } });

export const removeProcess = (processId) =>
  apiClient.post('/api/process/admin/remove', null, { params: { processId } });
