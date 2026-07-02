import apiClient from './client';

// 게시글 생성
export const createPost = (payload) =>
  apiClient.post('/api/v1/posts', payload);

// 게시글 수정
export const updatePost = (postId, payload) =>
  apiClient.patch(`/api/v1/posts/${postId}`, payload);

// 게시글 삭제
export const deletePost = (postId) =>
  apiClient.delete(`/api/v1/posts/${postId}`);

// 이미지 업로드용 Presigned URL 발급
export const getPresignedUrl = () =>
  apiClient.get('/api/v1/posts/images/presigned-url');
