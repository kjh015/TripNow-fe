import apiClient from '../client';

export const getFilterList = (processId) =>
  apiClient.get('/api/filter/admin/list', { params: { processId } });

export const viewFilter = (filterId) =>
  apiClient.get('/api/filter/admin/view', { params: { filterId } });

export const addFilter = (processId, name, active, conditionStr, tokens) =>
  apiClient.post('/api/filter/admin/add', {
    expression: conditionStr,
    tokens,
  }, { params: { processId, name, active } });

export const updateFilter = (filterId, name, active, conditionStr, tokens) =>
  apiClient.post('/api/filter/admin/update', {
    expression: conditionStr,
    tokens,
  }, { params: { filterId, name, active } });

export const removeFilter = (filterId) =>
  apiClient.post('/api/filter/admin/remove', null, { params: { filterId } });

export const getFormatKeys = (processId) =>
  apiClient.get('/api/filter/admin/keys', { params: { processId } });
