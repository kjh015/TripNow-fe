import apiClient from './client';

// 전체 게시글 목록 (삭제 여부 필터, 페이징) — deleted 생략 시 전체
export const getAdminPosts = ({ deleted, page, size, sort } = {}) =>
  apiClient.get('/api/v1/admin/posts', { params: { deleted, page, size, sort } });

// 삭제 포함 게시글 상세 조회
export const getAdminPost = (postId) =>
  apiClient.get(`/api/v1/admin/posts/${postId}`);

// 게시글 강제 삭제 (작성자 확인 없는 소프트 삭제)
export const deleteAdminPost = (postId) =>
  apiClient.delete(`/api/v1/admin/posts/${postId}`);

// 게시글 복구
export const restoreAdminPost = (postId) =>
  apiClient.patch(`/api/v1/admin/posts/${postId}/restore`);

// 게시글 영구 삭제 (DB + S3)
export const permanentDeleteAdminPost = (postId) =>
  apiClient.delete(`/api/v1/admin/posts/${postId}/permanent`);

// 전체 댓글 목록 (게시글/삭제 여부 필터, 페이징)
export const getAdminComments = ({ postId, deleted, page, size, sort } = {}) =>
  apiClient.get('/api/v1/admin/comments', { params: { postId, deleted, page, size, sort } });

// 댓글 강제 삭제
export const deleteAdminComment = (commentId) =>
  apiClient.delete(`/api/v1/admin/comments/${commentId}`);

// 댓글 복구
export const restoreAdminComment = (commentId) =>
  apiClient.patch(`/api/v1/admin/comments/${commentId}/restore`);
