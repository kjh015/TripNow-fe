import apiClient from '../client';

// 중복제거 규칙 목록 조회
export const getDedupRules = (logProcessId, { page, size, sort } = {}) =>
  apiClient.get(`/api/v1/admin/log-processes/${logProcessId}/dedup-rules`, { params: { page, size, sort } });

// 중복제거 규칙 생성
export const createDedupRule = (logProcessId, { name, rules, isActive }) =>
  apiClient.post(`/api/v1/admin/log-processes/${logProcessId}/dedup-rules`, { name, rules, isActive });

// 중복제거 규칙 상세 조회
export const getDedupRule = (dedupRuleId) =>
  apiClient.get(`/api/v1/admin/dedup-rules/${dedupRuleId}`);

// 중복제거 규칙 수정
export const updateDedupRule = (dedupRuleId, { name, rules, isActive }) =>
  apiClient.patch(`/api/v1/admin/dedup-rules/${dedupRuleId}`, { name, rules, isActive });

// 중복제거 규칙 삭제
export const deleteDedupRule = (dedupRuleId) =>
  apiClient.delete(`/api/v1/admin/dedup-rules/${dedupRuleId}`);
