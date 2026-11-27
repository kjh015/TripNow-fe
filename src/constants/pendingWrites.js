// 미반영 쓰기 목록(src/utils/pendingWrites.js)의 sessionStorage 키
export const PENDING_WRITES_STORAGE_KEY = 'pendingWrites';

// 보관하는 게시글 기록 최대 개수. 넘으면 오래 전에 기록한 것부터 버린다
export const PENDING_POST_MAX = 50;

// 댓글 기록을 보관하는 게시글 최대 개수. 넘으면 오래 전에 기록한 게시글부터 버린다
export const PENDING_COMMENT_POST_MAX = 50;

// 게시글 기록이 읽은 값을 덮어쓰는 본문 필드. 통계(조회수·좋아요·댓글 수·평점·인기 점수)는 읽은 값을 쓴다
export const PENDING_POST_CONTENT_FIELDS = [
  'title',
  'content',
  'travelPlace',
  'address',
  'category',
  'region',
  'images',
  'updatedAt',
];
