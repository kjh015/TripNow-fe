import { useState } from 'react';
import { login } from '../../api/authApi';
import { getMyProfile } from '../../api/memberApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { isAdmin } from '../../utils/tokenUtils';
import { setLoggedInUserAttributes } from '../../analytics/analytics';
import { trackLogin, trackLoginFail } from '../../analytics/events';
import useAlert from '../../hooks/useAlert';

const SignInPage = () => {
    const [loginData, setLoginData] = useState({
        loginId: '',
        password: ''
    });
    const { alert, showAlert } = useAlert();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { headers } = await login(loginData);
            const accessToken = headers.authorization?.replace(/^Bearer\s+/i, '');
            localStorage.setItem('accessToken', accessToken);
            const { data: profileRes } = await getMyProfile();
            const member = profileRes.result ?? profileRes;
            localStorage.setItem('nickname', member.nickname);
            const role = isAdmin(accessToken) ? "admin" : "user";
            setLoggedInUserAttributes({
                gender: member.gender,
                age: member.age,
                role
            });
            trackLogin({ role });
            toast.success(`${member.nickname}님 환영합니다.`);
            navigate("/");
        } catch (error) {
            trackLoginFail();
            showAlert(error.response?.data?.message || "에러가 발생했습니다.", "danger");
        }
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
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignInPage;