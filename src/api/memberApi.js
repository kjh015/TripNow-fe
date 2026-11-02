import apiClient from './client';

// 회원가입
export const signUp = (payload) =>
  apiClient.post('/api/v1/members', payload);

// 내 프로필 조회
export const getMyProfile = () =>
  apiClient.get('/api/v1/members/me');

// 내 정보 수정 (nickname 필수, gender/birthDate 선택 — 소셜 가입 추가 정보 입력에도 사용)
export const updateMyProfile = (payload) =>
  apiClient.patch('/api/v1/members/me', payload);

// 회원 탈퇴
export const deleteMyProfile = () =>
  apiClient.delete('/api/v1/members/me');

// 비밀번호 변경
export const changePassword = (payload) =>
  apiClient.patch('/api/v1/members/me/password', payload);

// 닉네임 중복 확인
export const checkNickname = (nickname) =>
  apiClient.get('/api/v1/members/availability/nickname', { params: { nickname } });

// 로그인 ID 중복 확인
export const checkLoginId = (loginId) =>
  apiClient.get('/api/v1/members/availability/login-id', { params: { loginId } });

// 이메일 중복 확인
export const checkEmail = (email) =>
  apiClient.get('/api/v1/members/availability/email', { params: { email } });

// === Admin ===

// 회원 목록 검색 (값이 없는 조건은 적용되지 않음)
export const getAdminMembers = ({ keyword, provider, role, deleted, joinedFrom, joinedTo, page, size, sort } = {}) =>
  apiClient.get('/api/v1/admin/members', {
    params: { keyword, provider, role, deleted, joinedFrom, joinedTo, page, size, sort },
  });

// 회원 상세
export const getAdminMember = (memberId) =>
  apiClient.get(`/api/v1/admin/members/${memberId}`);

// 관리자 권한 부여
export const updateMemberRole = (memberId) =>
  apiClient.patch(`/api/v1/admin/members/${memberId}/role`);

// 회원 강제 탈퇴
export const deleteAdminMember = (memberId) =>
  apiClient.delete(`/api/v1/admin/members/${memberId}`);
