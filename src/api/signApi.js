import apiClient from './client';

export const signUp = (payload) =>
  apiClient.post('/api/sign/sign-up', payload);

export const checkDuplicate = ({ type, value }) =>
  apiClient.get('/api/sign/check-duplicate', { params: { type, value } });

export const signIn = (payload) =>
  apiClient.post('/api/sign/sign-in', payload);

export const signOut = () =>
  apiClient.post('/api/sign/sign-out');

export const withdraw = () =>
  apiClient.post('/api/sign/withdraw');

export const getMemberDetail = ({ loginId }) =>
  apiClient.post('/api/sign/detail', null, { params: { loginId } });

export const getMemberList = () =>
  apiClient.post('/api/sign/admin/list');

export const delegateAdmin = ({ loginId }) =>
  apiClient.post('/api/sign/admin/delegate', null, { params: { loginId } });

export const updateMember = (payload) =>
  apiClient.post('/api/sign/update', payload);

export const updatePassword = (payload) =>
  apiClient.post('/api/sign/update-password', payload);

export const getNickname = (loginId) =>
  apiClient.post('/api/sign/nickname', { loginId });

export const testAuth = () =>
  apiClient.post('/api/sign/test');
