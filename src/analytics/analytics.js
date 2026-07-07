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
 * 유저 속성(userId, gender, ageGroup, role 등)을 데이터 레이어에 push한다.
 * 호출 위치: src/index.js(앱 부팅), 로그인/로그아웃은 아래 setLoggedInUserAttributes/resetUser 경유
 */
export const setUserAttributes = (attributes) => {
  try {
    getDataLayer().push({ ...attributes });
  } catch (e) {
    console.error("analytics setUserAttributes 실패:", e);
  }
};

/**
 * 나이 원값을 연령대 구간 문자열로 변환한다. (개인정보 최소화 — 원값은 보내지 않는다)
 * 예: 27 → "20대". 60 이상은 "60대 이상", 10 미만·비정상 값은 null.
 */
const toAgeGroup = (age) => {
  const n = Number(age);
  if (!Number.isFinite(n) || n < 10) return null;
  const decade = Math.floor(n / 10) * 10;
  return decade >= 60 ? "60대 이상" : `${decade}대`;
};

/**
 * 로그인 성공 시 유저 속성을 갱신한다. userId를 익명 UUID → 토큰 식별자로 전환한다.
 * 개인정보 최소화 방침(M2 결정): nickname은 보내지 않고, age는 연령대 구간(ageGroup)으로 변환한다.
 * 호출 위치: src/sign/components/SignInPage.jsx (accessToken 저장 이후에 호출해야 userId가 갱신된다)
 */
export const setLoggedInUserAttributes = ({ gender, age, role }) => {
  setUserAttributes({
    userId: getUserIdForMatomo(),
    gender: gender || null,
    ageGroup: toAgeGroup(age),
    role,
  });
};

/**
 * 로그아웃 시 유저 속성을 익명 상태로 되돌린다.
 * 호출 위치: src/common/Navbar.jsx (handleLogout)
 */
export const resetUser = () => {
  setUserAttributes({ userId: getOrCreateAnonymousId(), gender: null, ageGroup: null, role: "user" });
};
