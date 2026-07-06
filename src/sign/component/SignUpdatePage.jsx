import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile } from '../../api/memberApi';

const SignUpdatePage = () => {
    const [formData, setFormData] = useState({
        loginId: '',
        email: '',
        nickname: '',
        gender: '',
        roles: [],
    });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // 추가
    const navigate = useNavigate();

    const getMember = async () => {
        try {
            const { data } = await getMyProfile();
            setFormData(data.result);
        } catch {
            setAlert({ show: true, message: "회원 정보 조회 실패", type: "danger" });
        }
    };

    const handleChange = (e) => {
        const { id, name, value } = e.target;
        const key = name || id;
        setFormData(prev => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await updateMyProfile({ nickname: formData.nickname });
            setAlert({ show: true, message: "회원수정 성공", type: "success" });
            localStorage.setItem('nickname', formData.nickname);
            setTimeout(() => {
                setAlert({ show: false, message: '', type: '' });
                navigate("/");
            }, 500);
        } catch (error) {
            const msg = error.response?.data;
            setAlert({ show: true, message: msg?.message || "에러가 발생했습니다.", type: "danger" });
        }
    };

    useEffect(() => {
        getMember();
    }, []);

    return (
        <div className="min-vh-100 d-flex flex-column">
            <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="sign-card">
                    <div className="sign-card-title text-center mb-4">회원 정보 수정</div>
                    {/* Alert 메시지 */}
                    {alert.show && (
                        <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                            {alert.message}
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setAlert({ ...alert, show: false })}
                            ></button>
                        </div>
                    )}
                    <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                        {/* 닉네임 */}
                        <div className="sign-card-input-box">
                            <label htmlFor="nickname" className="form-label fw-semibold">닉네임</label>
                            <input
                                type="text"
                                className="form-control"
                                id="nickname"
                                value={formData.nickname}
                                onChange={handleChange}
                                required
                                placeholder="닉네임을 입력하세요"
                            />
                            <div className="invalid-feedback">닉네임을 입력해주세요.</div>
                        </div>
                        {/* 아이디 */}
                        <div className="sign-card-input-box">
                            <label htmlFor="loginId" className="form-label fw-semibold">아이디</label>
                            <input
                                type="text"
                                className="form-control"
                                id="loginId"
                                value={formData.loginId}
                                onChange={handleChange}
                                required
                                placeholder="아이디를 입력하세요"
                                disabled
                            />
                            <div className="invalid-feedback">아이디를 입력해주세요.</div>
                        </div>
                        {/* 이메일 */}
                        <div className="sign-card-input-box">
                            <label htmlFor="email" className="form-label fw-semibold">
                                이메일
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="you@example.com"
                                disabled
                            />
                            <div className="invalid-feedback">유효한 이메일을 입력해주세요.</div>
                        </div>                        
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn btn-outline-secondary flex-fill sign-card-btn"
                                onClick={() => navigate('/sign/update/password')}
                            >
                                비밀번호 변경
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-fill sign-card-btn">
                                수정 완료
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default SignUpdatePage;
