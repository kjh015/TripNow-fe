import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SignApiClient from '../service/SignApiClient';

const cardStyle = {
    maxWidth: "420px",
    width: "95%",
    margin: "40px auto",
    padding: "40px 34px 32px 34px",
    background: "rgba(255,255,255,0.97)",
    borderRadius: "1.5rem",
    boxShadow: "0 6px 36px 0 rgba(54,69,79,0.13)",
};

const titleGradient = {
    fontWeight: "bold",
    fontSize: "2rem",
    background: "#000000",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: "30px"
};

// 비밀번호 보안 패턴 (8자 이상, 영문/숫자/특수문자)
const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

const PasswordChangePage = () => {
    const [curPwd, setCurrPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [match, setMatch] = useState(true);

    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [pwdValid, setPwdValid] = useState(null); // null | true | false
    const navigate = useNavigate();

    const handleConfirmPwdChange = (e) => {
        const value = e.target.value;
        setConfirmPwd(value);
        setMatch(newPwd === value);
    };

    const handleNewPwdChange = (e) => {
        const value = e.target.value;
        setNewPwd(value);
        setMatch(value === confirmPwd);

        // 실시간 패턴 체크
        if (value.length === 0) {
            setPwdValid(null);
        } else {
            setPwdValid(passwordPattern.test(value));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setAlert({ show: false, message: '', type: '' });
        if (!curPwd || !newPwd || !confirmPwd) {
            setAlert({ show: true, message: '모든 항목을 입력하세요.', type: 'danger' });
            return;
        }
        if (!passwordPattern.test(newPwd)) {
            setAlert({ show: true, message: '새 비밀번호가 보안 규칙에 맞지 않습니다.', type: 'danger' });
            return;
        }
        if (newPwd !== confirmPwd) {
            setMatch(false);
            setAlert({ show: true, message: '새 비밀번호가 일치하지 않습니다.', type: 'danger' });
            return;
        }
        const payload = {
            curPassword: curPwd,
            newPassword: newPwd,
            loginId: getLoginIdFromToken()
        }
        try {
            const res = await SignApiClient.updatePassword(payload);
            if (res.ok) {
                setAlert({ show: true, message: '비밀번호가 변경되었습니다.', type: 'success' });
                setTimeout(() => navigate('/'), 1300);
            } else {
                const msg = await res.json();
                setAlert({ show: true, message: msg.message, type: 'danger' });
            }
        } catch {
            setAlert({ show: true, message: '서버 오류가 발생했습니다.', type: 'danger' });
        }
    };

    const getLoginIdFromToken = () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.sub || payload.loginId;
        } catch (e) {
            console.error("토큰 디코딩 실패:", e);
            return null;
        }
    }

    return (
        <div style={{
            minHeight: "100vh",
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
            display: "flex",
            flexDirection: "column",
        }}>
            <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div style={cardStyle}>
                    <div style={titleGradient} className="text-center mb-4">비밀번호 변경</div>
                    {/* Alert */}
                    {alert.show && (
                        <div className={`alert alert-${alert.type} py-2 alert-dismissible fade show`} role="alert">
                            {alert.message}
                            <button
                                type="button"
                                className="btn-close"
                                aria-label="Close"
                                onClick={() => setAlert({ ...alert, show: false })}
                            ></button>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">현재 비밀번호</label>
                            <input
                                type="password"
                                className="form-control"
                                value={curPwd}
                                onChange={e => setCurrPwd(e.target.value)}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">새 비밀번호</label>
                            <input
                                type="password"
                                className={`form-control ${newPwd.length > 0 ? (pwdValid ? 'is-valid' : 'is-invalid') : ''}`}
                                value={newPwd}
                                onChange={handleNewPwdChange}
                                required
                            />
                            {newPwd.length > 0 && (
                                <div className={pwdValid ? "valid-feedback" : "invalid-feedback"}>
                                    {pwdValid
                                        ? "안전한 비밀번호입니다."
                                        : "8자 이상, 영문/숫자/특수문자 각각 1개 이상 포함해야 합니다."
                                    }
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label">새 비밀번호 확인</label>
                            <input
                                type="password"
                                className={`form-control ${confirmPwd ? (match ? 'is-valid' : 'is-invalid') : ''}`}
                                value={confirmPwd}
                                onChange={handleConfirmPwdChange}
                                required
                            />
                            {confirmPwd && !match && (
                                <div className="invalid-feedback">
                                    새 비밀번호와 일치하지 않습니다.
                                </div>
                            )}
                        </div>
                        <div className="d-flex gap-2 mt-4">
                            <button
                                type="button"
                                className="btn btn-outline-secondary flex-fill"
                                onClick={() => navigate('/sign/update')}
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary flex-fill"
                                disabled={alert.type === 'success'}
                            >
                                변경 완료
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default PasswordChangePage;
