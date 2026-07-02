import apiClient from './client';

// 댓글 작성
export const addComment = (payload) =>
  apiClient.post('/api/v1/comments', payload);

// 댓글 수정
export const updateComment = (commentId, payload) =>
  apiClient.patch(`/api/v1/comments/${commentId}`, payload);

// 댓글 삭제
export const deleteComment = (commentId) =>
  apiClient.delete(`/api/v1/comments/${commentId}`);

// 게시글별 댓글 조회
export const getCommentList = (postId, { page, size, sort } = {}) =>
  apiClient.get('/api/v1/search/comments', { params: { postId, page, size, sort } });

// 내가 쓴 댓글 조회
export const getMyComments = ({ page, size } = {}) =>
  apiClient.get('/api/v1/search/comments/me', { params: { page, size } });
