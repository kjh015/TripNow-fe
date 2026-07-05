import apiClient from '../client';

export const getFormatList = (processId) =>
  apiClient.get('/api/format/admin/list', { params: { processId } });

export const viewFormat = (formatId) =>
  apiClient.get('/api/format/admin/view', { params: { formatId } });

export const addFormat = (processId, name, active, formatJson, defaultJson) =>
  apiClient.post('/api/format/admin/add', {
    formatInfo: JSON.parse(formatJson),
    defaultInfo: JSON.parse(defaultJson),
  }, { params: { processId, name, active } });

export const updateFormat = (formatId, name, active, formatJson, defaultJson) =>
  apiClient.post('/api/format/admin/update', {
    formatInfo: JSON.parse(formatJson),
    defaultInfo: JSON.parse(defaultJson),
  }, { params: { formatId, name, active } });

export const removeFormat = (formatId) =>
  apiClient.post('/api/format/admin/remove', null, { params: { formatId } });
