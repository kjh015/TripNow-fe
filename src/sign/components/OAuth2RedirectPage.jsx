import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { oauth2Tokens } from '../../api/authApi';
import { trackLoginFail } from '../../analytics/events';
import useLoginSuccess from '../../hooks/useLoginSuccess';
import { OAUTH2_ERROR_MESSAGES, OAUTH2_DEFAULT_ERROR_MESSAGE } from '../../constants/oauth';

/**
 * 소셜 로그인 콜백 페이지 (/oauth2/redirect)
 * 백엔드 OAuth2AuthenticationSuccessHandler가 카카오 인증 완료 후
 * ?code=<일회용 코드> (실패 시 ?error=<코드>)를 실어 이 경로로 리다이렉트한다.
 * 코드를 /api/v1/auth/oauth2/tokens에 제출해 토큰을 받고 일반 로그인과 동일하게 로그인을 완료한다.
 */
const OAuth2RedirectPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { completeLogin } = useLoginSuccess();
    // 일회용 코드는 재사용이 불가하므로 StrictMode의 effect 중복 실행을 가드한다
    const consumedRef = useRef(false);

    useEffect(() => {
        if (consumedRef.current) return;
        consumedRef.current = true;

        const code = searchParams.get('code');
        const error = searchParams.get('error');

        const failToSignIn = (message) => {
            trackLoginFail();
            toast.error(message);
            navigate('/sign/in', { replace: true });
        };

        if (error || !code) {
            failToSignIn(OAUTH2_ERROR_MESSAGES[error] || OAUTH2_DEFAULT_ERROR_MESSAGE);
            return;
        }

        const exchangeCode = async () => {
            try {
                const { headers } = await oauth2Tokens({ code });
                const accessToken = headers.authorization?.replace(/^Bearer\s+/i, '');
                await completeLogin(accessToken);
            } catch (err) {
                failToSignIn(err.response?.data?.message || OAUTH2_DEFAULT_ERROR_MESSAGE);
            }
        };
        exchangeCode();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center justify-content-center sign-page-bg sign-page-bg-full">
            <div className="spinner-border text-primary mb-3" role="status" />
            <p className="text-muted">소셜 로그인 처리 중입니다...</p>
        </div>
    );
};

export default OAuth2RedirectPage;
