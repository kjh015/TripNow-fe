import apiClient from './client';

export const getPostListBySearch = ({ keyword, category, region, sort, direction, page }) =>
  apiClient.get('/api/board/search', { params: { keyword, category, region, sort, direction, page } });

export const autoCompleteSearch = (keyword, signal) =>
  apiClient.get('/api/board/autocomplete', { params: { keyword: encodeURIComponent(keyword) }, signal });

export const getPostList = () =>
  apiClient.get('/api/board/list');

export const getPost = (no) =>
  apiClient.get('/api/board/view', { params: { no } });

export const addPost = (formData) =>
  apiClient.post('/api/board/add', formData);

export const editPost = (formData) =>
  apiClient.post('/api/board/edit', formData);

export const removePost = (no) =>
  apiClient.post('/api/board/remove', null, { params: { no } });

export const migratePost = () =>
  apiClient.post('/api/board/admin/migrate-data');
