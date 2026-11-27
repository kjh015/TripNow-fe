import { useCallback, useEffect, useRef, useState } from 'react';
import { getPostFeed } from '../api/postSearchApi';
import { trackSearchResult, trackError } from '../analytics/events';
import { POST_FEED_SIZE, POST_LIST_MAX_RETRY, POST_LIST_RETRY_DELAY_MS } from '../constants/post';
import { CATEGORY_LABEL_TO_CODE, REGION_LABEL_TO_CODE } from '../constants/categoryRegion';
import { mergePostList } from '../utils/pendingWrites';

// 조회수·평점 같은 정렬 값은 읽는 사이에 바뀔 수 있어, 이미 받은 글이 다음 응답에 다시 올 수 있다
const appendNewPosts = (posts, content) => {
  const postIds = new Set(posts.map(post => post.postId));
  return [...posts, ...content.filter(post => !postIds.has(post.postId))];
};

// URL의 카테고리·지역은 한글 라벨과 코드값이 섞여 있어 코드값으로 맞춰 비교한다
const toCategoryCode = (value) => (value ? (CATEGORY_LABEL_TO_CODE[value] ?? value) : '');
const toRegionCode = (value) => (value ? (REGION_LABEL_TO_CODE[value] ?? value) : '');

/**
 * 검색에 반영되기 전인 방금 쓴 글을 끼워 넣어도 되는 목록인지.
 * 최신순이고 검색어가 없을 때만 새 글이 맨 앞에 온다고 확신할 수 있다. 다른 정렬에서는 위치를 알 수 없어 넣지 않는다
 */
const canInsertCreated = ({ keyword, sort, direction }) =>
  sort === 'modifiedDate' && direction === 'desc' && !keyword;

/**
 * 게시글 목록을 cursor 방식으로 이어서 읽는다.
 * 검색 조건이 바뀌면 처음부터 다시 읽고, 실패하면 자동으로 재시도한다.
 */
const usePostFeed = ({ category, region, keyword, sort, direction }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const cursorRef = useRef(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async () => {
    const requestId = ++requestIdRef.current;
    const cursor = cursorRef.current;
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPostFeed({
        category, region, keyword, sort, direction, cursor: cursor ?? undefined, size: POST_FEED_SIZE,
      });
      // 조건을 바꾼 뒤 늦게 도착한 이전 응답은 버린다
      if (requestId !== requestIdRef.current) return;
      const result = data.result;
      const content = result.content ?? [];
      // 방금 수정·삭제한 글은 기록으로 덮어쓰거나 숨기고, 조건이 맞는 첫 페이지에는 방금 쓴 글을 맨 앞에 넣는다
      const categoryCode = toCategoryCode(category);
      const regionCode = toRegionCode(region);
      const merged = mergePostList(content, {
        insertCreated: !cursor && canInsertCreated({ keyword, sort, direction }),
        filter: (post) =>
          (!categoryCode || post.category === categoryCode) && (!regionCode || post.region === regionCode),
      });
      setPosts(prev => (cursor ? appendNewPosts(prev, merged) : merged));
      setHasNext(result.hasNext ?? false);
      cursorRef.current = result.nextCursor ?? null;
      setRetryCount(0);
      trackSearchResult({ keyword, category, region, resultCount: content.length });
    } catch (e) {
      if (requestId !== requestIdRef.current) return;
      setError(e);
      trackError({ errorType: 'api', message: e.message, path: window.location.pathname });
    } finally {
      if (requestId === requestIdRef.current) setLoading(false);
    }
  }, [category, region, keyword, sort, direction]);

  useEffect(() => {
    cursorRef.current = null;
    setPosts([]);
    setHasNext(false);
    setRetryCount(0);
    load();
  }, [load]);

  useEffect(() => {
    if (error && retryCount < POST_LIST_MAX_RETRY) {
      const timer = setTimeout(() => {
        setRetryCount(c => c + 1);
        load();
      }, POST_LIST_RETRY_DELAY_MS);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [error, retryCount, load]);

  const loadMore = useCallback(() => {
    if (!loading && !error && hasNext) load();
  }, [loading, error, hasNext, load]);

  const retry = useCallback(() => {
    setRetryCount(0);
    load();
  }, [load]);

  return { posts, loading, error, hasNext, retryCount, loadMore, retry };
};

export default usePostFeed;
