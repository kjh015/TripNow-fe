import apiClient from './client';

export const toggleFavorite = (payload) =>
  apiClient.post('/api/favorite/toggle', payload);

export const existsFavorite = (payload) =>
  apiClient.post('/api/favorite/exists', payload);
