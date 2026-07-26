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

      try {
        const refreshRes = await axios.post(
          `${BASE_URL}/api/v1/auth/tokens/refresh`,
          {},
          { withCredentials: true }
        );
        const accessToken = refreshRes.headers.authorization?.replace(/^Bearer\s+/i, "");
        localStorage.setItem("accessToken", accessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("nickname");
        toast.error("로그인이 만료되었습니다. 다시 로그인해주세요.");
        if (window._navigate) window._navigate("/");
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
