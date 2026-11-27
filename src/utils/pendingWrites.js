import {
  PENDING_WRITES_STORAGE_KEY,
  PENDING_POST_MAX,
  PENDING_COMMENT_POST_MAX,
  PENDING_POST_CONTENT_FIELDS,
} from '../constants/pendingWrites';

/**
 * 미반영 쓰기 목록.
 *
 * 게시글·댓글 조회는 검색 서버를 읽는데, 쓰기가 검색 서버에 반영되기까지 시간이 걸린다.
 * 이 탭에서 방금 한 쓰기를 sessionStorage에 기록해 두고, 조회 결과에 아직 반영되지 않았으면 기록으로 보여 준다.
 *
 * - 게시글: 조회 결과의 version이 기록의 version 이상이면 반영된 것으로 보고 기록을 지운다.
 *   아니면 기록의 본문 필드로 덮어쓰고(통계는 조회 값 유지), 삭제 기록이면 숨긴다. version이 없는 조회 결과는 -1로 본다.
 * - 댓글: 버전이 없어 존재 여부로 판단한다. 작성 기록은 목록에 같은 commentId가 오면, 삭제 기록은 목록에 없으면 지운다.
 *
 * 저장소에 접근하지 못하면 기록 없이 동작한다(화면이 깨지지 않게).
 *
 * 저장 형태:
 * {
 *   posts: { [postId]: { version, deleted, created, data, recordedAt } },
 *   comments: { [postId]: { added: { [commentId]: comment }, removed: [commentId], recordedAt } }
 * }
 */

const emptyState = () => ({ posts: {}, comments: {} });

const readState = () => {
  try {
    const raw = window.sessionStorage.getItem(PENDING_WRITES_STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return {
      posts: parsed?.posts && typeof parsed.posts === 'object' ? parsed.posts : {},
      comments: parsed?.comments && typeof parsed.comments === 'object' ? parsed.comments : {},
    };
  } catch {
    return emptyState();
  }
};

const writeState = (state) => {
  try {
    window.sessionStorage.setItem(PENDING_WRITES_STORAGE_KEY, JSON.stringify(state));
  } catch {
    // 저장하지 못하면 기록 없이 동작한다
  }
};

// 기록이 너무 많으면 오래 전에 기록한 것부터 버린다
const trimOldest = (entries, max) => {
  const keys = Object.keys(entries);
  if (keys.length <= max) return entries;
  const kept = keys
    .sort((a, b) => (entries[b].recordedAt ?? 0) - (entries[a].recordedAt ?? 0))
    .slice(0, max);
  return Object.fromEntries(kept.map((key) => [key, entries[key]]));
};

const toVersion = (version) => (typeof version === 'number' ? version : -1);

const overlayContent = (readPost, record) => {
  const merged = { ...readPost, version: record.version };
  PENDING_POST_CONTENT_FIELDS.forEach((field) => {
    if (record.data && field in record.data) {
      merged[field] = record.data[field];
    }
  });
  return merged;
};

/**
 * 읽은 게시글에 기록을 적용한다. 반영이 확인된 기록은 state에서 지우고 changed를 true로 둔다.
 * 반환값이 null이면 삭제 기록이 이긴 것(없는 글로 취급)이다.
 */
const applyPostRecord = (state, readPost) => {
  const key = String(readPost.postId);
  const record = state.posts[key];
  if (!record) return { post: readPost, changed: false };
  if (toVersion(readPost.version) >= record.version) {
    delete state.posts[key];
    return { post: readPost, changed: true };
  }
  if (record.deleted) return { post: null, changed: false };
  return { post: overlayContent(readPost, record), changed: false };
};

/**
 * 게시글 작성·수정 응답을 기록한다. 같은 글에 더 높은 version의 기록이 이미 있으면 무시한다.
 * created는 작성 응답일 때 true. 목록에 아직 없는 작성 글을 끼워 넣을지 정하는 데 쓴다.
 */
export const recordPostWrite = (response, { created = false } = {}) => {
  if (!response || response.postId == null) return;
  const state = readState();
  const key = String(response.postId);
  const existing = state.posts[key];
  const version = toVersion(response.version);
  if (existing && existing.version > version) return;
  state.posts = trimOldest(
    {
      ...state.posts,
      [key]: {
        version,
        deleted: false,
        created: created || Boolean(existing?.created),
        data: response,
        recordedAt: Date.now(),
      },
    },
    PENDING_POST_MAX
  );
  writeState(state);
};

/** 게시글 삭제 응답({ postId, version })을 기록한다 */
export const recordPostDelete = ({ postId, version } = {}) => {
  if (postId == null) return;
  const state = readState();
  const key = String(postId);
  const existing = state.posts[key];
  const deletedVersion = toVersion(version);
  if (existing && existing.version > deletedVersion) return;
  state.posts = trimOldest(
    {
      ...state.posts,
      [key]: { version: deletedVersion, deleted: true, created: false, data: null, recordedAt: Date.now() },
    },
    PENDING_POST_MAX
  );
  writeState(state);
};

/** 상세·수정 화면용. 읽은 게시글에 기록을 적용한다. 삭제 기록이 이기면 null */
export const mergePost = (readPost) => {
  if (!readPost || readPost.postId == null) return readPost;
  const state = readState();
  const { post, changed } = applyPostRecord(state, readPost);
  if (changed) writeState(state);
  return post;
};

/**
 * 목록용. 각 항목에 기록을 적용하고 삭제 기록이 이긴 항목은 뺀다.
 * insertCreated가 true면 목록에 없는 작성 기록 중 filter를 통과한 것을 createdAt 내림차순으로 맨 앞에 넣는다.
 */
export const mergePostList = (list, { insertCreated = false, filter = () => true } = {}) => {
  const items = Array.isArray(list) ? list : [];
  const state = readState();
  let changed = false;
  const merged = [];
  items.forEach((item) => {
    if (!item || item.postId == null) {
      merged.push(item);
      return;
    }
    const result = applyPostRecord(state, item);
    changed = changed || result.changed;
    if (result.post) merged.push(result.post);
  });
  if (changed) writeState(state);
  if (!insertCreated) return merged;

  const listedIds = new Set(merged.map((post) => String(post?.postId)));
  const inserted = Object.entries(state.posts)
    .filter(([key, record]) => record.created && !record.deleted && !listedIds.has(key))
    .map(([, record]) => ({ ...record.data, version: record.version }))
    .filter((post) => filter(post))
    .sort((a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0));
  return [...inserted, ...merged];
};

/** 상세 조회가 404일 때 보여 줄 기록. 삭제 기록이거나 없으면 null */
export const getPendingPost = (postId) => {
  if (postId == null) return null;
  const record = readState().posts[String(postId)];
  if (!record || record.deleted || !record.data) return null;
  return { ...record.data, version: record.version };
};

const commentEntry = (state, postId) => {
  const entry = state.comments[String(postId)];
  return {
    added: entry?.added && typeof entry.added === 'object' ? entry.added : {},
    removed: Array.isArray(entry?.removed) ? entry.removed : [],
  };
};

const saveCommentEntry = (state, postId, entry) => {
  const key = String(postId);
  if (Object.keys(entry.added).length === 0 && entry.removed.length === 0) {
    delete state.comments[key];
  } else {
    state.comments = trimOldest(
      { ...state.comments, [key]: { ...entry, recordedAt: Date.now() } },
      PENDING_COMMENT_POST_MAX
    );
  }
};

/** 댓글 작성 기록 */
export const recordCommentAdd = (postId, comment) => {
  if (postId == null || !comment || comment.commentId == null) return;
  const state = readState();
  const entry = commentEntry(state, postId);
  entry.added = { ...entry.added, [String(comment.commentId)]: comment };
  entry.removed = entry.removed.filter((id) => String(id) !== String(comment.commentId));
  saveCommentEntry(state, postId, entry);
  writeState(state);
};

/** 댓글 삭제 기록. 같은 탭에서 작성한 댓글이면 작성 기록도 지운다 */
export const recordCommentRemove = (postId, commentId) => {
  if (postId == null || commentId == null) return;
  const state = readState();
  const entry = commentEntry(state, postId);
  const added = { ...entry.added };
  delete added[String(commentId)];
  entry.added = added;
  if (!entry.removed.some((id) => String(id) === String(commentId))) {
    entry.removed = [...entry.removed, commentId];
  }
  saveCommentEntry(state, postId, entry);
  writeState(state);
};

/** 댓글 목록에 기록을 적용한다. 목록에 없는 작성 기록은 최근 것부터 맨 앞에 넣는다 */
export const mergeComments = (postId, list) => {
  const items = Array.isArray(list) ? list : [];
  const state = readState();
  if (!state.comments[String(postId)]) return items;
  const entry = commentEntry(state, postId);
  const listedIds = new Set(items.map((comment) => String(comment?.commentId)));

  const pendingAdded = Object.fromEntries(
    Object.entries(entry.added).filter(([commentId]) => !listedIds.has(commentId))
  );
  const pendingRemoved = entry.removed.filter((commentId) => listedIds.has(String(commentId)));
  const removedIds = new Set(pendingRemoved.map(String));

  const confirmed =
    Object.keys(pendingAdded).length !== Object.keys(entry.added).length ||
    pendingRemoved.length !== entry.removed.length;
  if (confirmed) {
    // 반영이 확인된 기록은 지운다. 기록 시각은 그대로 둔다
    const key = String(postId);
    if (Object.keys(pendingAdded).length === 0 && pendingRemoved.length === 0) {
      delete state.comments[key];
    } else {
      state.comments[key] = { ...state.comments[key], added: pendingAdded, removed: pendingRemoved };
    }
    writeState(state);
  }

  const added = Object.values(pendingAdded).sort((a, b) => Number(b.commentId) - Number(a.commentId));
  return [...added, ...items.filter((comment) => !removedIds.has(String(comment?.commentId)))];
};

/** 기록을 모두 지운다(로그아웃·토큰 만료) */
export const clearPendingWrites = () => {
  try {
    window.sessionStorage.removeItem(PENDING_WRITES_STORAGE_KEY);
  } catch {
    // 저장소에 접근하지 못하면 지울 기록도 없다
  }
};
