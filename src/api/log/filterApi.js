import apiClient from '../client';

// 필터 규칙 목록 조회
export const getFilterRules = (logProcessId, { page, size, sort } = {}) =>
  apiClient.get(`/api/v1/admin/log-processes/${logProcessId}/filter-rules`, { params: { page, size, sort } });

// 필터 규칙 생성
export const createFilterRule = (logProcessId, { name, conditions, isActive }) =>
  apiClient.post(`/api/v1/admin/log-processes/${logProcessId}/filter-rules`, { name, conditions, isActive });

// 필터 규칙 상세 조회
export const getFilterRule = (filterRuleId) =>
  apiClient.get(`/api/v1/admin/filter-rules/${filterRuleId}`);

// 필터 규칙 수정
export const updateFilterRule = (filterRuleId, { name, conditions, isActive }) =>
  apiClient.patch(`/api/v1/admin/filter-rules/${filterRuleId}`, { name, conditions, isActive });

// 필터 규칙 삭제
export const deleteFilterRule = (filterRuleId) =>
  apiClient.delete(`/api/v1/admin/filter-rules/${filterRuleId}`);
