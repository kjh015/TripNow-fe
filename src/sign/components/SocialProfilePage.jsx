import useSocialProfileForm from '../../hooks/useSocialProfileForm';

/**
 * 소셜 로그인 추가 정보 입력 페이지 (/sign/social-profile)
 * 카카오 첫 로그인 시 백엔드가 이메일만으로 자동 가입시키므로,
 * useLoginSuccess가 nickname 없는 회원을 이 페이지로 보낸다. 폼 로직은 useSocialProfileForm에 위임.
 */
const SocialProfilePage = () => {
    const {
        formData,
        birthDate,
        alert,
        setAlert,
        touched,
        errors,
        isSubmitting,
        nicknameDup,
        isFormValid,
        inputRefs,
        handleChange,
        handleBirthDate,
        handleSubmit,
    } = useSocialProfileForm();

    return (
        <div className="min-vh-100 d-flex flex-column sign-page-bg">
            <main className="flex-grow-1 d-flex align-items-center justify-content-center">
                <div className="card shadow-sm signup-card">
                    <div className="card-body p-4">
                        <div className="text-center signup-card-title">추가 정보 입력</div>
                        <p className="text-muted text-center mb-4">
                            처음 오셨네요! 서비스 이용에 필요한 정보를 입력하면 가입이 완료됩니다.
                        </p>
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
                                <label htmlFor="nickname" className="form-label fw-semibold">닉네임</label>
                                <input
                                    type="text"
                                    ref={inputRefs.nickname}
                                    className={`form-control${touched.nickname && errors.nickname ? " is-invalid" : ""}${touched.nickname && nicknameDup === false ? " is-valid" : ""}`}
                                    id="nickname" name="nickname"
                                    value={formData.nickname}
                                    onChange={handleChange}
                                    placeholder="닉네임을 입력하세요"
                                    required
                                />
                                {touched.nickname && nicknameDup === false && !errors.nickname && (
                                    <div className="valid-feedback">사용 가능한 닉네임입니다.</div>
                                )}
                                {touched.nickname && errors.nickname && (
                                    <div className="invalid-feedback">{errors.nickname}</div>
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
                                        value="MALE"
                                        checked={formData.gender === 'MALE'}
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
                                        value="FEMALE"
                                        checked={formData.gender === 'FEMALE'}
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
                                    className="btn text-white shadow signup-submit-btn"
                                    disabled={!isFormValid}>
                                    {isSubmitting ? (
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    ) : null}
                                    입력 완료
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SocialProfilePage;
