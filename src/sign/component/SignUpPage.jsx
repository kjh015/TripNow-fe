import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import SignApiClient from '../service/SignApiClient';
import { useNavigate } from 'react-router-dom';

// 임시로 사용할 fetch 예시
async function checkDuplicate(type, value) {
    if (!value) return false;
    const res = await fetch(`/api/check-duplicate?type=${type}&value=${encodeURIComponent(value)}`);
    const data = await res.json();
    return data.exists;
}

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



const SignUpPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        loginId: '',
        password: '',
        passwordConfirm: '',
        email: '',
        nickname: '',
        gender: '',
    });
    const [birthDate, setBirthDate] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [dups, setDups] = useState({
        loginId: null,  // true: 중복, false: 사용가능, null: 미확인
        email: null,
        nickname: null,
    });
    const inputRefs = {
        loginId: useRef(null),
        password: useRef(null),
        passwordConfirm: useRef(null),
        nickname: useRef(null),
        email: useRef(null),
        gender: useRef(null),
        birthDate: useRef(null)
    };

    // 값 변경

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        // 중복 체크 항목은 변경시 중복상태 초기화
        if (['loginId', 'email', 'nickname'].includes(name)) {
            setDups(prev => ({ ...prev, [name]: null }));
        }
    };

    // 중복체크 (디바운스 포함, 즉시 변경시 API 너무 많이 나가는 것 방지)
    useEffect(() => {
        const debounce = {};
        ["loginId", "email", "nickname"].forEach(field => {
            if (!formData[field]) return;
            if (debounce[field]) clearTimeout(debounce[field]);
            debounce[field] = setTimeout(() => {
                // fetch 이후 JSON 파싱, exists값만 setDups에 반영
                SignApiClient.checkDuplicate({ type: field, value: formData[field] })
                    .then(res => res.json())
                    .then(data => {
                        setDups(prev => ({ ...prev, [field]: !!data.exists }));
                    })
                    .catch(() => {
                        setDups(prev => ({ ...prev, [field]: false })); // 에러시 중복 아님 처리
                    });
            }, 500);
        });
        return () => Object.values(debounce).forEach(clearTimeout);
        // eslint-disable-next-line
    }, [formData.loginId, formData.email, formData.nickname]);


    // 생년월일
    const handleBirthDate = (e) => {
        setBirthDate(e.target.value);
        setTouched(prev => ({ ...prev, birthDate: true }));
    };

    // 유효성 검사
    useEffect(() => {
        const newErrors = {};
        if (!formData.loginId) newErrors.loginId = "아이디를 입력하세요.";
        else if (dups.loginId === true) newErrors.loginId = "이미 사용중인 아이디입니다.";
        if (!formData.password) newErrors.password = "비밀번호를 입력하세요.";
        else if (!passwordPattern.test(formData.password)) newErrors.password = "8자 이상, 영문/숫자/특수문자 조합으로 입력하세요.";
        if (!formData.passwordConfirm) newErrors.passwordConfirm = "비밀번호 확인을 입력하세요.";
        else if (formData.password && formData.password !== formData.passwordConfirm) newErrors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
        if (!formData.nickname) newErrors.nickname = "닉네임을 입력하세요.";
        else if (dups.nickname === true) newErrors.nickname = "이미 사용중인 닉네임입니다.";
        if (!formData.email) newErrors.email = "이메일을 입력하세요.";
        else if (!emailPattern.test(formData.email)) newErrors.email = "이메일 형식이 올바르지 않습니다.";
        else if (dups.email === true) newErrors.email = "이미 사용중인 이메일입니다.";
        if (!formData.gender) newErrors.gender = "성별을 선택하세요.";
        if (!birthDate) newErrors.birthDate = "생년월일을 입력하세요.";
        setErrors(newErrors);
    }, [formData, birthDate, dups]);

    // 제출
    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({
            loginId: true, password: true, passwordConfirm: true, nickname: true, email: true, gender: true, birthDate: true
        });
        if (Object.keys(errors).length > 0) {
            // 첫 에러 필드로 focus
            const firstError = Object.keys(errors)[0];
            inputRefs[firstError]?.current?.focus();
            setAlert({ show: true, message: "모든 항목을 올바르게 입력해주세요.", type: "danger" });
            return;
        }
        setIsSubmitting(true);
        try {
            const res = await SignApiClient.signUp({ ...formData, birthDate });
            const msg = await res.json();
            if (res.ok) {          
                toast.success("회원가입이 완료되었습니다! 🎉");      
                navigate("/");
            } else {
                setAlert({ show: true, message: msg.message, type: "danger" });
                // 서버단 오류 발생 시 포커스
                if (msg && msg.field && inputRefs[msg.field]) {
                    inputRefs[msg.field].current.focus();
                }
            }
        } catch (error) {
            setAlert({ show: true, message: "에러가 발생했습니다.", type: "danger" });
        }
        setIsSubmitting(false);
    };

    useEffect(() => {
        document.body.classList.add('bg-body-tertiary');
        return () => document.body.classList.remove('bg-body-tertiary');
    }, []);
    // 모든 조건 충족해야 버튼 활성화
    const isFormValid = Object.keys(errors).length === 0 && !isSubmitting;

    return (
        <div className="min-vh-100 d-flex flex-column" style={{
            background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
        }}>
            <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div style={{
                    maxWidth: "410px",
                    width: "95%",
                    margin: "3rem auto",
                    borderRadius: "1.5rem",
                    boxShadow: "0 6px 32px 0 rgba(54,69,79,0.13)",
                    border: "none"
                }} className="card shadow-sm">
                    <div className="card-body p-4">
                        <div className="text-center" style={{
                            fontWeight: "bold",
                            fontSize: "2.05rem",
                            background: "#000000",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                            marginBottom: "24px"
                        }}>회원가입</div>
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
                            <div className="mb-3">
                                <label htmlFor="loginId" className="form-label fw-semibold">아이디</label>
                                <input
                                    type="text"
                                    ref={inputRefs.loginId}
                                    className={`form-control${touched.loginId && errors.loginId ? " is-invalid" : ""}${touched.loginId && dups.loginId === false ? " is-valid" : ""}`}
                                    id="loginId" name="loginId"
                                    value={formData.loginId}
                                    onChange={handleChange}
                                    placeholder="아이디를 입력하세요"
                                    required
                                />
                                {touched.loginId && dups.loginId === false && !errors.loginId && (
                                    <div className="valid-feedback">사용 가능한 아이디입니다.</div>
                                )}
                                {touched.loginId && errors.loginId && (
                                    <div className="invalid-feedback">{errors.loginId}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="password" className="form-label fw-semibold">비밀번호</label>
                                <input
                                    type="password"
                                    ref={inputRefs.password}
                                    className={`form-control${touched.password && errors.password ? " is-invalid" : ""}`}
                                    id="password" name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="8자 이상, 영문/숫자/특수문자 포함"
                                    required
                                />
                                {touched.password && errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                {touched.password && !errors.password && (
                                    <div className="valid-feedback">사용 가능한 비밀번호입니다.</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="passwordConfirm" className="form-label fw-semibold">비밀번호 확인</label>
                                <input
                                    type="password"
                                    ref={inputRefs.passwordConfirm}
                                    className={`form-control${touched.passwordConfirm && errors.passwordConfirm ? " is-invalid" : ""}${touched.passwordConfirm && !errors.passwordConfirm ? " is-valid" : ""}`}
                                    id="passwordConfirm" name="passwordConfirm"
                                    value={formData.passwordConfirm}
                                    onChange={handleChange}
                                    placeholder="비밀번호를 다시 입력하세요"
                                    required
                                />
                                {touched.passwordConfirm && errors.passwordConfirm && <div className="invalid-feedback">{errors.passwordConfirm}</div>}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="nickname" className="form-label fw-semibold">닉네임</label>
                                <input
                                    type="text"
                                    ref={inputRefs.nickname}
                                    className={`form-control${touched.nickname && errors.nickname ? " is-invalid" : ""}${touched.nickname && dups.nickname === false ? " is-valid" : ""}`}
                                    id="nickname" name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    placeholder="닉네임을 입력하세요"
                                    required
                                />
                                {touched.nickname && dups.nickname === false && !errors.nickname && (
                                    <div className="valid-feedback">사용 가능한 닉네임입니다.</div>
                                )}
                                {touched.nickname && errors.nickname && (
                                    <div className="invalid-feedback">{errors.nickname}</div>
                                )}
                            </div>

                            <div className="mb-3">
                                <label htmlFor="email" className="form-label fw-semibold">이메일</label>
                                <input
                                    type="email"
                                    ref={inputRefs.email}
                                    className={`form-control${touched.email && errors.email ? " is-invalid" : ""}${touched.email && dups.email === false && !errors.email ? " is-valid" : ""}`}
                                    id="email" name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    required
                                />
                                {touched.email && dups.email === false && !errors.email && (
                                    <div className="valid-feedback">사용 가능한 이메일입니다.</div>
                                )}
                                {touched.email && errors.email && (
                                    <div className="invalid-feedback">{errors.email}</div>
                                )}
                            </div>

                            {/* 성별 */}
                            <div className="mb-3">
                                <label className="form-label fw-semibold d-block mb-2">성별</label>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input"
                                        ref={inputRefs.gender}
                                        type="radio"
                                        name="gender"
                                        id="genderMale"
                                        value="남"
                                        checked={formData.gender === '남'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="genderMale">남</label>
                                </div>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input"
                                        type="radio"
                                        name="gender"
                                        id="genderFemale"
                                        value="여"
                                        checked={formData.gender === '여'}
                                        onChange={handleChange}
                                        required
                                    />
                                    <label className="form-check-label" htmlFor="genderFemale">여</label>
                                </div>
                                {touched.gender && errors.gender && <div className="form-text text-danger mt-1">{errors.gender}</div>}
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-semibold d-block mb-2">생년월일</label>
                                <input
                                    type="date"
                                    ref={inputRefs.birthDate}
                                    className={`form-control${touched.birthDate && errors.birthDate ? " is-invalid" : ""}`}
                                    value={birthDate}
                                    onChange={handleBirthDate}
                                    max={new Date().toISOString().split('T')[0]}
                                    required
                                />
                                {touched.birthDate && errors.birthDate && <div className="invalid-feedback">{errors.birthDate}</div>}
                            </div>

                            <div className="d-grid">
                                <button type="submit"
                                    className="btn text-white shadow"
                                    style={{
                                        fontWeight: "bold",
                                        fontSize: "1.08rem",
                                        letterSpacing: "0.03em",
                                        borderRadius: "2rem",
                                        padding: "0.75rem",
                                        marginTop: "12px",
                                        background: "#3f51b5",
                                        border: "none"
                                    }}
                                    disabled={!isFormValid}>
                                    {isSubmitting ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    회원가입 완료
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SignUpPage;
