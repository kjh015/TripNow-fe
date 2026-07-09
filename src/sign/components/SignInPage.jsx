import { useState } from 'react';
import { login, getOauth2AuthorizeUrl } from '../../api/authApi';
import { useNavigate } from 'react-router-dom';
import { trackLoginFail } from '../../analytics/events';
import useAlert from '../../hooks/useAlert';
import useLoginSuccess from '../../hooks/useLoginSuccess';
import { OAUTH2_PROVIDERS } from '../../constants/oauth';

const SignInPage = () => {
    const [loginData, setLoginData] = useState({
        loginId: '',
        password: ''
    });
    const { alert, showAlert } = useAlert();
    const navigate = useNavigate();
    const { completeLogin } = useLoginSuccess();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { headers } = await login(loginData);
            const accessToken = headers.authorization?.replace(/^Bearer\s+/i, '');
            await completeLogin(accessToken);
        } catch (error) {
            trackLoginFail();
            showAlert(error.response?.data?.message || "에러가 발생했습니다.", "danger");
        }
    };

    // 카카오 인가는 XHR이 아닌 최상위 페이지 이동으로 시작해야 한다 (백엔드가 카카오로 302 릴레이)
    const handleKakaoLogin = () => {
        window.location.href = getOauth2AuthorizeUrl(OAUTH2_PROVIDERS.KAKAO);
    };

    return (
        <div className="min-vh-100 d-flex flex-column sign-page-bg sign-page-bg-full">
            <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="col-md-5 col-lg-4">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h2 className="text-center mb-4">로그인</h2>
                            {/* Alert 메시지 */}
                            {alert.show && (
                                <div className={`alert alert-${alert.type} text-center`} role="alert">
                                    {alert.message}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="loginId" className="form-label">아이디</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="loginId"
                                        name="loginId"
                                        value={loginData.loginId}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">비밀번호</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                {/* 버튼 영역: 회원가입 왼쪽, 로그인 오른쪽 */}
                                <div className="d-flex justify-content-between mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-outline-success"
                                        onClick={() => navigate('/sign/up')}
                                    >
                                        회원가입
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        로그인
                                    </button>
                                </div>
                            </form>
                            {/* 소셜 로그인 */}
                            <div className="d-flex align-items-center my-4">
                                <hr className="flex-grow-1" />
                                <span className="px-3 text-muted small">또는</span>
                                <hr className="flex-grow-1" />
                            </div>
                            <button
                                type="button"
                                className="btn w-100 kakao-login-btn"
                                onClick={handleKakaoLogin}
                            >
                                <svg
                                    className="kakao-login-symbol"
                                    viewBox="0 0 24 24"
                                    width="18"
                                    height="18"
                                    aria-hidden="true"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M12 3C6.48 3 2 6.54 2 10.9c0 2.8 1.86 5.26 4.66 6.66l-1.18 4.36c-.1.39.34.7.68.47l5.21-3.45c.21.01.42.02.63.02 5.52 0 10-3.54 10-7.9S17.52 3 12 3z"
                                    />
                                </svg>
                                카카오 로그인
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignInPage;