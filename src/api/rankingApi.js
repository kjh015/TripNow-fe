const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000';

// 실시간 랭킹 SSE 구독 — EventSource 인스턴스를 반환
export const subscribeRankings = () =>
  new EventSource(`${BASE_URL}/api/v1/rankings/live`, { withCredentials: true });
