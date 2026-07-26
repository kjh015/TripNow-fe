import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkNickname, getMyProfile, updateMyProfile } from '../api/memberApi';
import { isAdmin } from '../utils/tokenUtils';
import { setLoggedInUserAttributes } from '../analytics/analytics';
import { trackSignupComplete } from '../analytics/events';

/**
 * 소셜 로그인 추가 정보 입력 폼 훅 (SocialProfilePage 전용).
 * 신규 소셜 회원은 백엔드가 provider/providerId/email만으로 자동 가입시키므로
 * nickname/gender/birthDate를 여기서 받아 PATCH /members/me로 채운다.
 * 제출 성공 = 소셜 가입 완료 시점 → travel_signup_complete 발화 + 유저 속성 갱신.
 */
const useSocialProfileForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ nickname: '', gender: '' });
    const [birthDate, setBirthDate] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });
    const [touched, setTouched] = useState({});
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nicknameDup, setNicknameDup] = useState(null);
    const inputRefs = {
        nickname: useRef(null),
        gender: useRef(null),
        birthDate: useRef(null)
    };

    // 이미 프로필이 완성된 회원(직접 URL 진입 등)은 메인으로 돌려보낸다
    useEffect(() => {
        const guard = async () => {
            try {
                const { data } = await getMyProfile();
                const member = data.result ?? data;
                if (member.nickname) navigate('/', { replace: true });
            } catch {
                navigate('/sign/in', { replace: true });
            }
        };
        guard();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        if (name === 'nickname') setNicknameDup(null);
    };

    const handleBirthDate = (e) => {
        setBirthDate(e.target.value);
        setTouched(prev => ({ ...prev, birthDate: true }));
    };

    // 닉네임 중복 확인 (회원가입 폼과 동일한 500ms 디바운스)
    useEffect(() => {
        if (!formData.nickname) return;
        const timer = setTimeout(async () => {
            try {
                const { data } = await checkNickname(formData.nickname);
                const result = data.result;
                setNicknameDup(result.exists === true || result.available === false);
            } catch {
                setNicknameDup(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [formData.nickname]);

    useEffect(() => {
        const newErrors = {};
        if (!formData.nickname) newErrors.nickname = "닉네임을 입력하세요.";
        else if (nicknameDup === true) newErrors.nickname = "이미 사용중인 닉네임입니다.";
        if (!formData.gender) newErrors.gender = "성별을 선택하세요.";
        if (!birthDate) newErrors.birthDate = "생년월일을 입력하세요.";
        setErrors(newErrors);
    }, [formData, birthDate, nicknameDup]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({ nickname: true, gender: true, birthDate: true });
        if (Object.keys(errors).length > 0) {
            const firstError = Object.keys(errors)[0];
            inputRefs[firstError]?.current?.focus();
            setAlert({ show: true, message: "모든 항목을 올바르게 입력해주세요.", type: "danger" });
            return;
        }
        setIsSubmitting(true);
        try {
            await updateMyProfile({ nickname: formData.nickname, gender: formData.gender, birthDate });
            localStorage.setItem('nickname', formData.nickname);
            const role = isAdmin(localStorage.getItem('accessToken')) ? "admin" : "user";
            // 백엔드가 birthDate로 계산한 age를 쓰기 위해 프로필을 재조회한다
            const { data: profileRes } = await getMyProfile();
            const member = profileRes.result ?? profileRes;
            setLoggedInUserAttributes({
                gender: member.gender,
                age: member.age,
                role
            });
            trackSignupComplete({ gender: member.gender, birthDate });
            toast.success(`${formData.nickname}님 환영합니다.`);
            navigate("/");
        } catch (error) {
            const msg = error.response?.data;
            setAlert({ show: true, message: msg?.message || "에러가 발생했습니다.", type: "danger" });
        }
        setIsSubmitting(false);
    };

    const isFormValid = Object.keys(errors).length === 0 && !isSubmitting;

    return {
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
    };
};

export default useSocialProfileForm;
