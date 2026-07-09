import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getMyProfile } from '../api/memberApi';
import { isAdmin } from '../utils/tokenUtils';
import { setLoggedInUserAttributes } from '../analytics/analytics';
import { trackLogin } from '../analytics/events';

/**
 * 로그인 성공 공통 처리 훅 — 일반 로그인(SignInPage)과 소셜 로그인(OAuth2RedirectPage)이 공유한다.
 * completeLogin(accessToken): 토큰 저장 → 프로필 조회 → nickname 저장
 *   → Matomo 유저 속성 갱신 + travel_login 발화 → 환영 toast → 메인 이동.
 * 실패 예외는 삼키지 않고 호출부로 전파한다 (호출부에서 travel_login_fail·에러 안내 처리).
 */
const useLoginSuccess = () => {
    const navigate = useNavigate();

    const completeLogin = async (accessToken) => {
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
    };

    return { completeLogin };
};

export default useLoginSuccess;
