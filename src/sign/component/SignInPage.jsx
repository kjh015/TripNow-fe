import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from 'react';
import SignApiClient from '../service/SignApiClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserAuthentication from '../service/UserAuthentication';

const SignInPage = () => {
    const [loginData, setLoginData] = useState({
        loginId: '',
        password: ''
    });
    // alert 상태 추가
    const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // type: 'success' | 'danger'
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await SignApiClient.signIn(loginData);
            if (res.ok) {
                const data = await res.json();
                localStorage.setItem('accessToken', data.accessToken);
                const resDetail = await SignApiClient.getMemberDetail({loginId: getLoginIdFromToken({token: data.accessToken})});                
                if (resDetail.ok) {
                    const member = await resDetail.json();
                    localStorage.setItem('nickname', member.nickname);
                    window._mtm = window._mtm || [];
                    window._mtm.push({
                        nickname: member.nickname,
                        gender: member.gender,
                        age: member.age,
                        role: isAdmin({token: data.accessToken}) ? "admin" : "user"
                    });
                    toast.success(`${member.nickname}님 환영합니다.`);   
                    navigate("/");
                } else {
                    const data = await resDetail.json();                   
                    setAlert({ show: true, message: data.message, type: "danger" });
                }
            } else {
                const data = await res.json();
                setAlert({ show: true, message: data.message, type: "danger" });
            }
        } catch (error) {
            setAlert({ show: true, message: "에러가 발생했습니다.", type: "danger" });
        }
    };

    const getLoginIdFromToken = ({token}) => {
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || payload.loginId;
        } catch (e) {
            console.error("토큰 디코딩 실패:", e);
            return null;
        }
    };

    const isAdmin = ({token}) => {
        if (!token) {
            return false;
        }
        try {            
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.roles?.includes("ROLE_ADMIN");
        } catch (e) {
            console.error("토큰 디코딩 실패:", e);
            return false;
        }
    }

    // alert 자동 사라짐 (2초)
    useEffect(() => {
    }, [alert.show]);

    useEffect(() => {
        document.body.classList.add('bg-body-tertiary');
        return () => document.body.classList.remove('bg-body-tertiary');
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                width: "100vw",
                overflowX: "hidden",
                background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
                position: "relative"
            }}
            className="min-vh-100 d-flex flex-column"
        >
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
                                        onClick={() => navigate('/sign/component/SignUpPage')}
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