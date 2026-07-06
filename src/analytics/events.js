import { pushEvent } from "./analytics";

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
 * 호출 위치: src/board/component/page/MainPage.jsx
 * 페이로드: 없음 (visit_time·referrer는 Matomo 기본 수집과 중복이라 보내지 않는다)
 */
export const trackMainView = () => {
  pushEvent(EVENT_NAMES.MAIN_VIEW);
};

/**
 * 검색 버튼 클릭 시 발화.
 * 호출 위치: src/post/components/PostSearch.jsx
 * 페이로드: category(string|null), region(string|null)
 */
export const trackSearchClick = ({ category, region }) => {
  pushEvent(EVENT_NAMES.SEARCH_CLICK, { category: orNull(category), region: orNull(region) });
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
 * 호출 위치: src/comment/component/CommentPage.jsx
 * 페이로드: postId(number|null), category, region, title
 */
export const trackCommentAdd = ({ postId, category, region, title }) => {
  pushEvent(EVENT_NAMES.COMMENT_ADD, buildPostPayload({ postId, category, region, title }));
};

/**
 * 댓글 삭제 성공 시 발화.
 * 호출 위치: src/comment/component/CommentPage.jsx
 * 페이로드: postId(number|null), category, region, title
 */
export const trackCommentRemove = ({ postId, category, region, title }) => {
  pushEvent(EVENT_NAMES.COMMENT_REMOVE, buildPostPayload({ postId, category, region, title }));
};
