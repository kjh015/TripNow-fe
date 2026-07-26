import apiClient, { BASE_URL } from './client';

export const login = (payload) =>
  apiClient.post('/api/v1/auth/login', payload);

export const logout = () =>
  apiClient.post('/api/v1/auth/logout');

export const refreshTokens = () =>
  apiClient.post('/api/v1/auth/tokens/refresh');

export const oauth2Tokens = (payload) =>
  apiClient.post('/api/v1/auth/oauth2/tokens', payload);

// 소셜 로그인 인가 시작 URL — XHR이 아닌 최상위 페이지 이동(window.location)으로 진입해야 한다.
// 백엔드가 벤더 인증 후 FRONTEND_REDIRECT_URI(/oauth2/redirect)로 일회용 코드를 리다이렉트한다.
export const getOauth2AuthorizeUrl = (provider) =>
  `${BASE_URL}/api/v1/auth/oauth2/authorize/${provider}`;
