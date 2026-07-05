import apiClient from '../client';

// 처리 기록 목록 조회
export const getHistories = ({ status, stage, page, size, sort } = {}) =>
  apiClient.get('/api/v1/admin/histories', { params: { status, stage, page, size, sort } });

// 처리 기록 상세 조회
export const getHistory = (historyId) =>
  apiClient.get(`/api/v1/admin/histories/${historyId}`);
