import apiClient from '../client';

// 포맷 규칙 목록 조회
export const getFormatRules = (logProcessId, { page, size, sort } = {}) =>
  apiClient.get(`/api/v1/admin/log-processes/${logProcessId}/format-rules`, { params: { page, size, sort } });

// 포맷 규칙 생성
export const createFormatRule = (logProcessId, { name, isActive, defaultValues, fieldMappings }) =>
  apiClient.post(`/api/v1/admin/log-processes/${logProcessId}/format-rules`, { name, isActive, defaultValues, fieldMappings });

// 활성 포맷 규칙 필드 조회
export const getActiveFormatRuleFields = (logProcessId) =>
  apiClient.get(`/api/v1/admin/log-processes/${logProcessId}/format-rules/fields`);

// 포맷 규칙 상세 조회
export const getFormatRule = (formatRuleId) =>
  apiClient.get(`/api/v1/admin/format-rules/${formatRuleId}`);

// 포맷 규칙 수정
export const updateFormatRule = (formatRuleId, { name, isActive, defaultValues, fieldMappings }) =>
  apiClient.patch(`/api/v1/admin/format-rules/${formatRuleId}`, { name, isActive, defaultValues, fieldMappings });

// 포맷 규칙 삭제
export const deleteFormatRule = (formatRuleId) =>
  apiClient.delete(`/api/v1/admin/format-rules/${formatRuleId}`);
