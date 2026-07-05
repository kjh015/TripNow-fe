import apiClient from './client';

// 좋아요 등록
export const addLike = (postId) =>
  apiClient.post('/api/v1/likes', { postId });

// 좋아요 취소
export const deleteLike = (postId) =>
  apiClient.delete('/api/v1/likes', { params: { postId } });

// 내가 좋아요 한 게시글 목록
export const getMyLikes = ({ page, size } = {}) =>
  apiClient.get('/api/v1/search/likes/me', { params: { page, size } });
