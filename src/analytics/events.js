import { pushEvent, toAgeGroup } from "./analytics";

/**
 * 이벤트 카탈로그.
 * - 이벤트명은 반드시 이 상수로만 사용한다 (문자열 리터럴 금지).
 * - 트래커 함수는 이벤트당 1개. 페이로드 조립은 전부 이 파일 안에서 하고,
 *   호출부는 항상 1줄 호출만 한다.
 * - 공통 필드(isLoggedIn, userId)는 pushEvent가 자동 주입하므로 여기서 넣지 않는다.
 * - 값이 없으면 null을 보낸다 ("없음" 같은 매직 문자열 금지).
 */
export const EVENT_NAMES = {
  MAIN_VIEW: "travel_main_view",
  SEARCH_CLICK: "travel_search_click",
  DETAIL_PAGEVIEW: "travel_detail_pageview",
  DETAIL_EXIT: "travel_detail_exit",
  FAVORITE_ADD: "travel_favorite_add",
  FAVORITE_REMOVE: "travel_favorite_remove",
  COMMENT_ADD: "travel_comment_add",
  COMMENT_REMOVE: "travel_comment_remove",
  SIGNUP_COMPLETE: "travel_signup_complete",
  LOGIN: "travel_login",
  LOGIN_FAIL: "travel_login_fail",
  POST_ADD: "travel_post_add",
  POST_UPDATE: "travel_post_update",
  POST_REMOVE: "travel_post_remove",
  SEARCH_RESULT: "travel_search_result",
  LIST_ITEM_CLICK: "travel_list_item_click",
  RANKING_CLICK: "travel_ranking_click",
  ERROR: "travel_error",
};

/** 게시글 ID는 항상 number로 보낸다. 캐스팅 불가하면 null. */
const toPostId = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? null : n;
};

/** 빈 문자열/undefined를 null로 통일한다. */
const orNull = (value) => (value ? value : null);

/** 게시글 계열 이벤트의 공통 페이로드. */
const buildPostPayload = (post) => ({
  postId: toPostId(post.postId),
  category: orNull(post.category),
  region: orNull(post.region),
  title: orNull(post.title),
});

/**
 * 메인 페이지 진입 시 1회 발화.
 * 호출 위치: src/main/pages/MainPage.jsx
 * 페이로드: 없음 (visit_time·referrer는 Matomo 기본 수집과 중복이라 보내지 않는다)
 */
export const trackMainView = () => {
  pushEvent(EVENT_NAMES.MAIN_VIEW);
};

/**
 * 검색 버튼 클릭 시 발화.
 * 호출 위치: src/post/components/PostSearch.jsx
 * 페이로드: category(string|null), region(string|null), keyword(string|null)
 */
export const trackSearchClick = ({ category, region, keyword }) => {
  pushEvent(EVENT_NAMES.SEARCH_CLICK, {
    category: orNull(category),
    region: orNull(region),
    keyword: orNull(keyword),
  });
};

/**
 * 게시글 상세 데이터 로드 후 발화.
 * 호출 위치: src/post/pages/PostDetailPage.jsx
 * 페이로드: postId(number|null), category, region, title
 */
export const trackDetailPageview = (post) => {
  pushEvent(EVENT_NAMES.DETAIL_PAGEVIEW, buildPostPayload(post));
};

/**
 * 게시글 상세 이탈 시 발화 (effect cleanup).
 * 호출 위치: src/post/pages/PostDetailPage.jsx
 * 페이로드: postId(number|null), staySeconds(number), title
 */
export const trackDetailExit = ({ postId, staySeconds, title }) => {
  pushEvent(EVENT_NAMES.DETAIL_EXIT, { postId: toPostId(postId), staySeconds, title: orNull(title) });
};

/**
 * 찜 추가 성공 시 발화.
 * 호출 위치: src/post/pages/PostDetailPage.jsx
 * 페이로드: postId(number|null), category, region, title
 */
export const trackFavoriteAdd = (post) => {
  pushEvent(EVENT_NAMES.FAVORITE_ADD, buildPostPayload(post));
};

/**
 * 찜 삭제 성공 시 발화.
 * 호출 위치: src/post/pages/PostDetailPage.jsx
 * 페이로드: postId(number|null), category, region, title
 */
export const trackFavoriteRemove = (post) => {
  pushEvent(EVENT_NAMES.FAVORITE_REMOVE, buildPostPayload(post));
};

/**
 * 댓글 등록 시 발화.
 * 호출 위치: src/comment/components/CommentPage.jsx
 * 페이로드: postId(number|null), category, region, title, star(number|null — 별점 1~5)
 */
export const trackCommentAdd = ({ postId, category, region, title, star }) => {
  pushEvent(EVENT_NAMES.COMMENT_ADD, {
    ...buildPostPayload({ postId, category, region, title }),
    star: Number.isFinite(Number(star)) && star !== null && star !== "" ? Number(star) : null,
  });
};

/**
 * 댓글 삭제 성공 시 발화.
 * 호출 위치: src/comment/components/CommentPage.jsx
 * 페이로드: postId(number|null), category, region, title
 */
export const trackCommentRemove = ({ postId, category, region, title }) => {
  pushEvent(EVENT_NAMES.COMMENT_REMOVE, buildPostPayload({ postId, category, region, title }));
};

/** 생년월일(yyyy-MM-dd)로 만 나이를 계산한다. 파싱 불가하면 null. */
const toAgeFromBirthDate = (birthDate) => {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const beforeBirthday =
    now.getMonth() < birth.getMonth() ||
    (now.getMonth() === birth.getMonth() && now.getDate() < birth.getDate());
  return beforeBirthday ? age - 1 : age;
};

/**
 * 회원가입 성공 시 발화. (가입 퍼널 — 일반 가입은 signUp 성공, 소셜 가입은 추가 정보 입력 완료가 가입 완료 시점)
 * 개인정보 최소화 방침(M2 결정): 나이 원값은 보내지 않고 연령대 구간(ageGroup)으로 변환한다.
 * 호출 위치: src/hooks/useSignUpForm.js (일반), src/hooks/useSocialProfileForm.js (소셜)
 * 페이로드: gender(string|null), ageGroup(string|null — 예: "20대")
 */
export const trackSignupComplete = ({ gender, birthDate }) => {
  pushEvent(EVENT_NAMES.SIGNUP_COMPLETE, {
    gender: orNull(gender),
    ageGroup: toAgeGroup(toAgeFromBirthDate(birthDate)),
  });
};

/**
 * 로그인 성공 시 발화. (로그인 퍼널 — 일반/카카오 소셜 로그인 공통)
 * 호출 위치: src/hooks/useLoginSuccess.js (SignInPage·OAuth2RedirectPage가 공유)
 * 페이로드: role("admin"|"user")
 */
export const trackLogin = ({ role }) => {
  pushEvent(EVENT_NAMES.LOGIN, { role: orNull(role) });
};

/**
 * 로그인 실패 시 발화. (로그인 퍼널 — 실패 원인은 보안상 페이로드에 싣지 않는다)
 * 호출 위치: src/sign/components/SignInPage.jsx, src/sign/components/OAuth2RedirectPage.jsx
 * 페이로드: 없음 (공통 필드만)
 */
export const trackLoginFail = () => {
  pushEvent(EVENT_NAMES.LOGIN_FAIL);
};

/**
 * 게시글 작성 성공 시 발화. (콘텐츠 생산 지표)
 * 호출 위치: src/post/pages/PostWritePage.jsx
 * 페이로드: postId(number|null — 생성 응답에서 확보), category, region (코드값)
 */
export const trackPostAdd = ({ postId, category, region }) => {
  pushEvent(EVENT_NAMES.POST_ADD, {
    postId: toPostId(postId),
    category: orNull(category),
    region: orNull(region),
  });
};

/**
 * 게시글 수정 성공 시 발화. (콘텐츠 생산 지표)
 * 호출 위치: src/post/pages/PostEditPage.jsx
 * 페이로드: postId(number|null), category, region (코드값)
 */
export const trackPostUpdate = ({ postId, category, region }) => {
  pushEvent(EVENT_NAMES.POST_UPDATE, {
    postId: toPostId(postId),
    category: orNull(category),
    region: orNull(region),
  });
};

/**
 * 게시글 삭제 성공 시 발화. (콘텐츠 생산 지표)
 * 호출 위치: src/post/pages/PostEditPage.jsx
 * 페이로드: postId(number|null), category, region (코드값)
 */
export const trackPostRemove = ({ postId, category, region }) => {
  pushEvent(EVENT_NAMES.POST_REMOVE, {
    postId: toPostId(postId),
    category: orNull(category),
    region: orNull(region),
  });
};

/**
 * 검색 결과 로드 성공 시 발화. resultCount 0 = 콘텐츠 갭 신호.
 * 정렬/페이지 이동도 결과 로드이므로 매 로드마다 발화된다.
 * 호출 위치: src/post/pages/PostListPage.jsx
 * 페이로드: keyword, category, region, resultCount(number — 전체 건수, 서버가 안 주면 현재 페이지 건수)
 */
export const trackSearchResult = ({ keyword, category, region, resultCount }) => {
  pushEvent(EVENT_NAMES.SEARCH_RESULT, {
    keyword: orNull(keyword),
    category: orNull(category),
    region: orNull(region),
    resultCount: Number.isFinite(Number(resultCount)) ? Number(resultCount) : null,
  });
};

/**
 * 검색 결과 리스트에서 게시글 카드 클릭 시 발화. (검색 CTR)
 * 호출 위치: src/post/pages/PostListPage.jsx
 * 페이로드: postId(number|null), position(number — 현재 페이지 내 순번, 1부터), keyword
 */
export const trackListItemClick = ({ postId, position, keyword }) => {
  pushEvent(EVENT_NAMES.LIST_ITEM_CLICK, {
    postId: toPostId(postId),
    position,
    keyword: orNull(keyword),
  });
};

/**
 * 메인 랭킹 카드 클릭 시 발화. (랭킹 기능 효용 검증)
 * 호출 위치: src/main/components/MainPageCard/MainPageCard.jsx
 * 페이로드: rankType("post"|"region"|"category"), rank(number|null — 1~5),
 *           label(string|null — post는 제목, region/category는 코드값), postId(number|null — post일 때만)
 */
export const trackRankingClick = ({ rankType, rank, label, postId }) => {
  pushEvent(EVENT_NAMES.RANKING_CLICK, {
    rankType,
    rank: Number.isFinite(Number(rank)) && rank !== null && rank !== undefined ? Number(rank) : null,
    label: orNull(label),
    postId: toPostId(postId),
  });
};

/**
 * 사용자 체감 장애 발생 시 발화.
 * - 렌더 크래시: src/components/ErrorBoundary.jsx (errorType "render")
 * - 목록 로드 실패(에러 화면 노출): src/post/pages/PostListPage.jsx (errorType "api")
 * 페이로드: errorType("render"|"api"), message(string|null), path(string — window.location.pathname)
 */
export const trackError = ({ errorType, message, path }) => {
  pushEvent(EVENT_NAMES.ERROR, {
    errorType: orNull(errorType),
    message: orNull(message),
    path: orNull(path),
  });
};
