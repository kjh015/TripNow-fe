import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { checkDuplicate, signUp } from '../api/signApi';

const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+~\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const useSignUpForm = () => {
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
        loginId: null,
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setTouched(prev => ({ ...prev, [name]: true }));
        if (['loginId', 'email', 'nickname'].includes(name)) {
            setDups(prev => ({ ...prev, [name]: null }));
        }
    };

    useEffect(() => {
        const debounce = {};
        ["loginId", "email", "nickname"].forEach(field => {
            if (!formData[field]) return;
            if (debounce[field]) clearTimeout(debounce[field]);
            debounce[field] = setTimeout(async () => {
                try {
                    const { data } = await checkDuplicate({ type: field, value: formData[field] });
                    setDups(prev => ({ ...prev, [field]: !!data.exists }));
                } catch {
                    setDups(prev => ({ ...prev, [field]: false }));
                }
            }, 500);
        });
        return () => Object.values(debounce).forEach(clearTimeout);
        // eslint-disable-next-line
    }, [formData.loginId, formData.email, formData.nickname]);

    const handleBirthDate = (e) => {
        setBirthDate(e.target.value);
        setTouched(prev => ({ ...prev, birthDate: true }));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setTouched({
            loginId: true, password: true, passwordConfirm: true, nickname: true, email: true, gender: true, birthDate: true
        });
        if (Object.keys(errors).length > 0) {
            const firstError = Object.keys(errors)[0];
            inputRefs[firstError]?.current?.focus();
            setAlert({ show: true, message: "모든 항목을 올바르게 입력해주세요.", type: "danger" });
            return;
        }
        setIsSubmitting(true);
        try {
            await signUp({ ...formData, birthDate });
            toast.success("회원가입이 완료되었습니다! 🎉");
            navigate("/");
        } catch (error) {
            const msg = error.response?.data;
            setAlert({ show: true, message: msg?.message || "에러가 발생했습니다.", type: "danger" });
            if (msg?.field && inputRefs[msg.field]) {
                inputRefs[msg.field].current.focus();
            }
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
        dups,
        isFormValid,
        inputRefs,
        handleChange,
        handleBirthDate,
        handleSubmit,
    };
};

export default useSignUpForm;
