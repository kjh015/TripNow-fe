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
 * events.js의 trackSignupComplete도 같은 방침을 쓰므로 export한다.
 */
export const toAgeGroup = (age) => {
  const n = Number(age);
  if (!Number.isFinite(n) || n < 10) return null;
  const decade = Math.floor(n / 10) * 10;
  return decade >= 60 ? "60대 이상" : `${decade}대`;
};

/**
 * 로그인 성공 시 유저 속성을 갱신한다. userId를 익명 UUID → 토큰 식별자로 전환한다.
 * 개인정보 최소화 방침(M2 결정): nickname은 보내지 않고, age는 연령대 구간(ageGroup)으로 변환한다.
 * 호출 위치: src/hooks/useLoginSuccess.js — 일반/소셜 로그인 공통 (accessToken 저장 이후에 호출해야 userId가 갱신된다)
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

/**
 * 앱 부팅 시 1회 호출: 유저 식별(userId) push 후 MTM 컨테이너 스크립트를 삽입한다.
 * 컨테이너 주소는 REACT_APP_MATOMO_URL + REACT_APP_MATOMO_CONTAINER_ID 환경변수로만 결정하며,
 * 둘 중 하나라도 없으면 삽입을 건너뛰고 console.error만 남긴다 (트래킹 실패가 기능을 깨지 않는다).
 * gender/ageGroup/role은 부팅 시점에 알 수 없으므로 보내지 않는다 — 로그인 시 setLoggedInUserAttributes가 채운다.
 * 호출 위치: src/index.js
 */
export const initAnalytics = () => {
  try {
    if (document.getElementById("matomo-container-script")) return;

    // 컨테이너 로드 전에 큐에 넣어 첫 이벤트부터 userId가 실리게 한다.
    setUserAttributes({ userId: getUserIdForMatomo() });

    const matomoUrl = process.env.REACT_APP_MATOMO_URL;
    const containerId = process.env.REACT_APP_MATOMO_CONTAINER_ID;
    if (!matomoUrl || !containerId) {
      console.error(
        "analytics initAnalytics: REACT_APP_MATOMO_URL / REACT_APP_MATOMO_CONTAINER_ID 환경변수가 없어 MTM 컨테이너를 삽입하지 않습니다."
      );
      return;
    }

    getDataLayer().push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });

    const script = document.createElement("script");
    script.id = "matomo-container-script";
    script.async = true;
    script.src = `${matomoUrl}/js/${containerId}.js`;
    document.body.appendChild(script);
  } catch (e) {
    console.error("analytics initAnalytics 실패:", e);
  }
};
