import axios from "axios";
import { toast } from "react-toastify";

export const BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터: accessToken 자동 주입
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 토큰 갱신 중복 요청 방지
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

// 응답 인터셉터: 401 시 토큰 갱신 후 재시도
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      let accessToken;
      try {
        const refreshRes = await axios.post(
          `${BASE_URL}/api/v1/auth/tokens/refresh`,
          {},
          { withCredentials: true }
        );
        accessToken = refreshRes.headers.authorization?.replace(/^Bearer\s+/i, "");
        localStorage.setItem("accessToken", accessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
      } catch (refreshError) {
        processQueue(refreshError, null);
        // 서버 장애(5xx)·네트워크 실패는 토큰이 유효할 수 있으므로 로그아웃시키지 않는다
        const status = refreshError.response?.status;
        if (!status || status >= 500) {
          toast.error("일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
          return Promise.reject(refreshError);
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("nickname");
        toast.error("로그인이 만료되었습니다. 다시 로그인해주세요.");
        if (window._navigate) window._navigate("/");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }

      // 재시도는 재발급 try 밖에서 한다. 재시도 요청의 실패(400·409 등)를 재발급 실패로 보고 로그아웃시키지 않기 위해서다
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
