import apiClient from './client';

// 게시글 통합 검색
export const getPostListBySearch = ({ keyword, category, region, sort, direction, page, size } = {}) =>
  apiClient.get('/api/v1/search/posts', { params: { keyword, category, region, sort, direction, page, size } });

// 게시글 상세 조회
export const getPost = (postId) =>
  apiClient.get(`/api/v1/search/posts/${postId}`);

// 내 게시글 검색
export const getMyPosts = ({ page, size } = {}) =>
  apiClient.get('/api/v1/search/posts/me', { params: { page, size } });

// 검색어 자동완성
export const autoCompleteSearch = (keyword, signal) =>
  apiClient.get('/api/v1/search/posts/autocomplete', { params: { keyword }, signal });
