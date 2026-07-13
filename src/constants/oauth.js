// 소셜 로그인 상수
// 백엔드 OAuth2FailureCode(web-api-service)가 /oauth2/redirect?error=<코드>로 전달하는 값과 1:1 매핑

export const OAUTH2_PROVIDERS = {
    KAKAO: 'kakao',
};

export const OAUTH2_ERROR_MESSAGES = {
    access_denied: '로그인 동의가 취소되었습니다.',
    provider_server_error: '인증 서버와 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    session_expired: '세션이 만료되었습니다. 다시 시도해주세요.',
    authentication_failed: '인증에 실패했습니다. 다시 시도해주세요.',
    system_error: '인증 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
};

export const OAUTH2_DEFAULT_ERROR_MESSAGE = '소셜 로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
