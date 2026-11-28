import {
  recordPostWrite,
  recordPostDelete,
  mergePost,
  mergePostList,
  getPendingPost,
  recordCommentAdd,
  recordCommentRemove,
  mergeComments,
  clearPendingWrites,
} from './pendingWrites';
import { PENDING_WRITES_STORAGE_KEY, PENDING_POST_MAX } from '../constants/pendingWrites';

const written = (overrides = {}) => ({
  postId: 1,
  memberId: 7,
  memberNickname: '여행자',
  title: '방금 쓴 제목',
  content: '방금 쓴 본문',
  travelPlace: '황리단길',
  address: '경주시',
  category: 'FOOD',
  region: 'SEOUL',
  images: [{ imageKey: 'posts/7/a.png', sortOrder: 1 }],
  createdAt: '2026-11-19T00:00:00Z',
  updatedAt: '2026-11-19T00:00:00Z',
  version: 1,
  ...overrides,
});

const read = (overrides = {}) => ({
  postId: 1,
  memberNickname: '여행자',
  title: '예전 제목',
  content: '예전 본문',
  category: 'NATURE',
  region: 'BUSAN',
  images: [],
  starAvg: 4.5,
  viewCount: 30,
  likeCount: 3,
  commentCount: 2,
  popularityScore: 10,
  updatedAt: '2026-11-18T00:00:00Z',
  version: 0,
  ...overrides,
});

const stored = () => JSON.parse(window.sessionStorage.getItem(PENDING_WRITES_STORAGE_KEY) ?? 'null');

describe('pendingWrites', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.restoreAllMocks();
  });

  describe('게시글 버전 비교', () => {
    it('읽은 version이 기록보다 작으면 본문 필드만 기록으로 덮어쓰고 통계는 읽은 값을 쓴다', () => {
      recordPostWrite(written());

      const merged = mergePost(read());

      expect(merged.title).toBe('방금 쓴 제목');
      expect(merged.content).toBe('방금 쓴 본문');
      expect(merged.category).toBe('FOOD');
      expect(merged.images).toEqual([{ imageKey: 'posts/7/a.png', sortOrder: 1 }]);
      expect(merged.updatedAt).toBe('2026-11-19T00:00:00Z');
      expect(merged.version).toBe(1);
      expect(merged.starAvg).toBe(4.5);
      expect(merged.viewCount).toBe(30);
      expect(merged.likeCount).toBe(3);
      expect(merged.commentCount).toBe(2);
      expect(merged.popularityScore).toBe(10);
      expect(getPendingPost(1)).not.toBeNull();
    });

    it.each([1, 2])('읽은 version(%i)이 기록과 같거나 크면 읽은 값을 쓰고 기록을 지운다', (version) => {
      recordPostWrite(written({ version: 1 }));

      const merged = mergePost(read({ version, title: '반영된 제목' }));

      expect(merged.title).toBe('반영된 제목');
      expect(getPendingPost(1)).toBeNull();
    });

    it('읽은 version이 null이면 -1로 보고 기록을 쓴다(버전 0인 작성 기록도 이긴다)', () => {
      recordPostWrite(written({ version: 0 }), { created: true });

      expect(mergePost(read({ version: null })).title).toBe('방금 쓴 제목');
      expect(mergePost(read({ version: undefined })).title).toBe('방금 쓴 제목');
    });

    it('같은 글에 더 높은 version의 기록이 있으면 낮은 기록은 무시한다', () => {
      recordPostWrite(written({ version: 3, title: '최신' }));
      recordPostWrite(written({ version: 2, title: '늦게 온 예전 응답' }));

      expect(getPendingPost(1).title).toBe('최신');
    });
  });

  describe('삭제 기록', () => {
    it('삭제 기록이 이기면 상세는 null, 목록에서는 빠진다', () => {
      recordPostDelete({ postId: 1, version: 2 });

      expect(mergePost(read({ version: 1 }))).toBeNull();
      expect(mergePostList([read({ version: 1 }), read({ postId: 2 })]).map((p) => p.postId)).toEqual([2]);
      expect(getPendingPost(1)).toBeNull();
    });

    it('읽은 version이 삭제 version 이상이면(복구 등) 읽은 값을 쓰고 기록을 지운다', () => {
      recordPostDelete({ postId: 1, version: 2 });

      expect(mergePost(read({ version: 3 })).title).toBe('예전 제목');
      expect(stored().posts['1']).toBeUndefined();
    });

    it('삭제 뒤 늦게 기록하려는 예전 작성·수정 응답은 무시한다', () => {
      recordPostDelete({ postId: 1, version: 2 });
      recordPostWrite(written({ version: 1 }));

      expect(mergePost(read({ version: 0 }))).toBeNull();
    });
  });

  describe('목록에 작성 글 끼워 넣기', () => {
    it('insertCreated면 목록에 없는 작성 기록을 createdAt 내림차순으로 맨 앞에 넣는다', () => {
      recordPostWrite(written({ postId: 10, version: 0, createdAt: '2026-11-19T00:00:00Z' }), { created: true });
      recordPostWrite(written({ postId: 11, version: 0, createdAt: '2026-11-19T01:00:00Z' }), { created: true });

      const list = mergePostList([read({ postId: 2 })], { insertCreated: true });

      expect(list.map((p) => p.postId)).toEqual([11, 10, 2]);
    });

    it('insertCreated가 아니면 끼워 넣지 않는다', () => {
      recordPostWrite(written({ postId: 10, version: 0 }), { created: true });

      expect(mergePostList([read({ postId: 2 })]).map((p) => p.postId)).toEqual([2]);
    });

    it('수정 기록(작성이 아닌 글)은 목록에 없어도 끼워 넣지 않는다', () => {
      recordPostWrite(written({ postId: 10, version: 3 }));

      expect(mergePostList([], { insertCreated: true })).toEqual([]);
    });

    it('목록에 이미 있으면 중복해서 넣지 않고, 반영되지 않았으면 기록으로 덮어쓴다', () => {
      recordPostWrite(written({ postId: 1, version: 0 }), { created: true });

      const list = mergePostList([read({ postId: 1, version: null })], { insertCreated: true });

      expect(list).toHaveLength(1);
      expect(list[0].title).toBe('방금 쓴 제목');
    });

    it('filter를 통과한 작성 기록만 넣는다', () => {
      recordPostWrite(written({ postId: 10, version: 0, category: 'FOOD' }), { created: true });
      recordPostWrite(written({ postId: 11, version: 0, category: 'NATURE' }), { created: true });

      const list = mergePostList([], { insertCreated: true, filter: (p) => p.category === 'NATURE' });

      expect(list.map((p) => p.postId)).toEqual([11]);
    });

    it('목록에서 반영이 확인되면 기록을 지워 더는 끼워 넣지 않는다', () => {
      recordPostWrite(written({ postId: 10, version: 0 }), { created: true });

      mergePostList([read({ postId: 10, version: 0 })], { insertCreated: true });

      expect(mergePostList([], { insertCreated: true })).toEqual([]);
    });

    it('작성 뒤 수정해도 작성 기록으로 남아 끼워 넣는다', () => {
      recordPostWrite(written({ postId: 10, version: 0 }), { created: true });
      recordPostWrite(written({ postId: 10, version: 1, title: '수정' }));

      const list = mergePostList([], { insertCreated: true });

      expect(list.map((p) => p.title)).toEqual(['수정']);
    });
  });

  describe('댓글', () => {
    it('작성 기록은 목록에 없으면 최근 것부터 맨 앞에 넣고, 목록에 오면 기록을 지운다', () => {
      recordCommentAdd(1, { commentId: 5, content: '첫 댓글' });
      recordCommentAdd(1, { commentId: 6, content: '둘째 댓글' });

      expect(mergeComments(1, [{ commentId: 3 }]).map((c) => c.commentId)).toEqual([6, 5, 3]);

      expect(mergeComments(1, [{ commentId: 5 }, { commentId: 3 }]).map((c) => c.commentId)).toEqual([6, 5, 3]);
      expect(stored().comments['1'].added).toEqual({ 6: { commentId: 6, content: '둘째 댓글' } });
    });

    it('삭제 기록은 목록에서 숨기고, 목록에서 빠지면 기록을 지운다', () => {
      recordCommentRemove(1, 3);

      expect(mergeComments(1, [{ commentId: 3 }, { commentId: 2 }]).map((c) => c.commentId)).toEqual([2]);
      expect(mergeComments(1, [{ commentId: 2 }]).map((c) => c.commentId)).toEqual([2]);
      expect(stored().comments['1']).toBeUndefined();
    });

    it('같은 탭에서 작성한 댓글을 지우면 작성 기록을 지우고 삭제 기록을 남긴다', () => {
      recordCommentAdd(1, { commentId: 5 });
      recordCommentRemove(1, 5);

      // 작성이 늦게 반영돼 목록에 와도 삭제 기록이 숨긴다
      expect(mergeComments(1, [{ commentId: 5 }]).map((c) => c.commentId)).toEqual([]);
      // 목록에서 빠지면 삭제 기록도 지운다(R13: 존재 여부로 판단)
      expect(mergeComments(1, []).map((c) => c.commentId)).toEqual([]);
      expect(stored().comments['1']).toBeUndefined();
    });

    it('다른 게시글의 기록은 적용하지 않는다', () => {
      recordCommentAdd(1, { commentId: 5 });

      expect(mergeComments(2, [{ commentId: 9 }]).map((c) => c.commentId)).toEqual([9]);
    });
  });

  describe('보관과 저장소 예외', () => {
    it('최대 개수를 넘으면 오래 전에 기록한 것부터 버린다', () => {
      let now = 1000;
      jest.spyOn(Date, 'now').mockImplementation(() => now++);
      for (let id = 1; id <= PENDING_POST_MAX + 1; id += 1) {
        recordPostWrite(written({ postId: id }));
      }

      expect(Object.keys(stored().posts)).toHaveLength(PENDING_POST_MAX);
      expect(getPendingPost(1)).toBeNull();
      expect(getPendingPost(PENDING_POST_MAX + 1)).not.toBeNull();
    });

    it('clearPendingWrites는 기록을 모두 지운다', () => {
      recordPostWrite(written());
      recordCommentAdd(1, { commentId: 5 });

      clearPendingWrites();

      expect(getPendingPost(1)).toBeNull();
      expect(mergeComments(1, [])).toEqual([]);
    });

    it('저장소 접근이 실패해도 예외 없이 읽은 값을 그대로 돌려준다', () => {
      jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
        throw new Error('blocked');
      });
      jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('blocked');
      });
      jest.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
        throw new Error('blocked');
      });

      expect(() => recordPostWrite(written())).not.toThrow();
      expect(() => recordPostDelete({ postId: 1, version: 2 })).not.toThrow();
      expect(() => recordCommentAdd(1, { commentId: 5 })).not.toThrow();
      expect(() => clearPendingWrites()).not.toThrow();
      expect(mergePost(read())).toEqual(read());
      expect(mergePostList([read()], { insertCreated: true })).toEqual([read()]);
      expect(mergeComments(1, [{ commentId: 3 }])).toEqual([{ commentId: 3 }]);
      expect(getPendingPost(1)).toBeNull();
    });

    it('저장된 값이 깨져 있으면 기록이 없는 것으로 본다', () => {
      window.sessionStorage.setItem(PENDING_WRITES_STORAGE_KEY, '{broken');

      expect(mergePost(read())).toEqual(read());
    });
  });
});
