import apiClient from './client';

export const sendItem = (item) =>
  apiClient.post('/sse/item', item);
