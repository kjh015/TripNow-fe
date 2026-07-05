import { useEffect } from 'react';
import useSignUpForm from '../../hooks/useSignUpForm';

const SignUpPage = () => {
    const {
        formData,
        birthDate,
        alert,
        setAlert,
        touched,
        errors,
        isSubmitting,
        dups,
        isFormValid,
        inputRefs,
        handleChange,
        handleBirthDate,
        handleSubmit,
    } = useSignUpForm();

    useEffect(() => {
        document.body.classList.add('bg-body-tertiary');
        return () => document.body.classList.remove('bg-body-tertiary');
    }, []);

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
