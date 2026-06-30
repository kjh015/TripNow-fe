import apiClient from './client';

export const getCommentList = (no) =>
  apiClient.get('/api/comment/list', { params: { no } });

export const addComment = (payload) =>
  apiClient.post('/api/comment/add', payload);

export const removeComment = (commentId) =>
  apiClient.post('/api/comment/remove', null, { params: { commentId } });
