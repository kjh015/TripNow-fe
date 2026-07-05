import apiClient from '../client';

// 로그 프로세스 목록 조회
export const getLogProcesses = ({ page, size, sort } = {}) =>
  apiClient.get('/api/v1/admin/log-processes', { params: { page, size, sort } });

// 로그 프로세스 생성
export const createLogProcess = ({ name, description }) =>
  apiClient.post('/api/v1/admin/log-processes', { name, description });

// 로그 프로세스 수정
export const updateLogProcess = (logProcessId, { name, description }) =>
  apiClient.patch(`/api/v1/admin/log-processes/${logProcessId}`, { name, description });

// 로그 프로세스 삭제
export const deleteLogProcess = (logProcessId) =>
  apiClient.delete(`/api/v1/admin/log-processes/${logProcessId}`);
