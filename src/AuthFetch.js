import { toast } from "react-toastify";
export async function authFetch(url, options = {}) {
    let token = localStorage.getItem('accessToken');
    if (token == null) {
        toast.error('로그인이 필요한 서비스입니다.');
        return new Response(JSON.stringify({ error: "No AccessToken" }), {
            status: 401,
            statusText: "No AccessToken",
            headers: { "Content-Type": "application/json" }
        });
    }

    const isFormData = options.body instanceof FormData;

    const fetchOptions = {
        ...options,
        headers: isFormData
            ? { Authorization: `Bearer ${token}` }
            : {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
    };

    // FormData면 headers가 { Authorization: ... } 만 들어감
    // fetch가 boundary/Content-Type을 직접 자동 설정

    const res = await fetch(url, fetchOptions);

    if (res.status === 401) {
        // accessToken 만료 → refresh 요청
        const refreshRes = await fetch('http://14.63.178.161:8000/api/sign/refresh', {
            method: 'POST',
            credentials: 'include', // 쿠키 필요
        });

        if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('accessToken', data.accessToken);

            // 재요청
            const retryRes = await fetch(url, {
                ...options,
                headers: {
                    ...(options.headers || {}),
                    Authorization: `Bearer ${data.accessToken}`,
                },
            });
            return retryRes;
        } else {
            // refreshToken도 만료 → 로그아웃 처리
            localStorage.removeItem('accessToken');
            localStorage.removeItem('nickname');
            toast.error('로그인이 만료되었습니다. 다시 로그인해주세요.');
            if (window._navigate) window._navigate('/');
            return new Response(JSON.stringify({ error: "Token Expired" }), {
                status: 401,
                statusText: "Token Expired",
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    return res;
}