import { decodeToken } from "../utils/tokenUtils";

/**
 * Matomo 데이터 레이어(window._mtm) 접근 유일 창구.
 * - MTM 컨테이너는 `_mtm`만 push 래핑으로 상시 수신하므로(M0 조사, 이슈 #72)
 *   모든 push는 이 파일을 통해 `_mtm`으로만 보낸다.
 * - 컴포넌트는 이 파일을 직접 쓰지 않고 events.js의 트래커 함수만 호출한다.
 */

const getDataLayer = () => {
  window._mtm = window._mtm || [];
  return window._mtm;
};

/**
 * 익명 사용자 식별용 UUID를 localStorage에서 조회하고, 없으면 생성해 저장한다.
 * Matomo 유저 식별 전용 값으로 분석 레이어 밖에서는 사용하지 않는다.
 */
export const getOrCreateAnonymousId = () => {
  let id = localStorage.getItem("anonymousId");
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
            (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
          );
    localStorage.setItem("anonymousId", id);
  }
  return id;
};

/**
 * Matomo에 보낼 userId를 결정한다.
 * 로그인 상태면 토큰의 sub(또는 loginId), 아니면 익명 UUID.
 */
export const getUserIdForMatomo = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    const payload = decodeToken(token);
    if (payload) return payload.sub ?? payload.loginId ?? getOrCreateAnonymousId();
  }
  return getOrCreateAnonymousId();
};

/**
 * 이벤트를 데이터 레이어에 push한다. 모든 이벤트 발화는 이 함수를 거친다.
 * 공통 필드(isLoggedIn, userId)를 자동 주입하므로 호출부에서 조립하지 않는다.
 * 트래킹 실패가 기능을 깨지 않도록 예외는 삼키고 console.error만 남긴다.
 */
export const pushEvent = (eventName, payload = {}) => {
  try {
    getDataLayer().push({
      event: eventName,
      isLoggedIn: !!localStorage.getItem("accessToken"),
      userId: getUserIdForMatomo(),
      ...payload,
    });
  } catch (e) {
    console.error("analytics pushEvent 실패:", e);
  }
};

/**
 * 유저 속성(userId, nickname, gender, age, role 등)을 데이터 레이어에 push한다.
 * 호출 위치: src/index.js(앱 부팅), src/sign/component/SignInPage.jsx(로그인 성공)
 */
export const setUserAttributes = (attributes) => {
  try {
    getDataLayer().push({ ...attributes });
  } catch (e) {
    console.error("analytics setUserAttributes 실패:", e);
  }
};

/**
 * 로그아웃 시 유저 속성을 익명 상태로 되돌린다.
 * 호출 위치: 미연결 — 이슈 M2에서 Navbar 로그아웃에 연결 예정.
 */
export const resetUser = () => {
  setUserAttributes({ userId: getOrCreateAnonymousId(), nickname: null, gender: null, age: null, role: "user" });
};
