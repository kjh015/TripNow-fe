import apiClient from './client';

export const getMyFavorite = (nickname) =>
  apiClient.post('/api/common/my-favorite', JSON.stringify(nickname), {
    params: { nickname },
    headers: { 'Content-Type': 'application/json' },
  });

export const getMyComment = (nickname) =>
  apiClient.post('/api/common/my-comment', JSON.stringify(nickname), {
    params: { nickname },
    headers: { 'Content-Type': 'application/json' },
  });

export const getMyBoard = (nickname) =>
  apiClient.post('/api/common/my-board', JSON.stringify(nickname), {
    params: { nickname },
    headers: { 'Content-Type': 'application/json' },
  });
