import apiClient from './client';

export const login = (payload) =>
  apiClient.post('/api/v1/auth/login', payload);

export const logout = () =>
  apiClient.post('/api/v1/auth/logout');

export const refreshTokens = () =>
  apiClient.post('/api/v1/auth/tokens/refresh');

export const oauth2Tokens = (payload) =>
  apiClient.post('/api/v1/auth/oauth2/tokens', payload);
