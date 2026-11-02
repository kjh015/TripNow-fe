import { useCallback, useEffect, useRef, useState } from 'react';
import { getPostFeed } from '../api/postSearchApi';
import { trackSearchResult, trackError } from '../analytics/events';
import { POST_FEED_SIZE, POST_LIST_MAX_RETRY, POST_LIST_RETRY_DELAY_MS } from '../constants/post';

// 조회수·평점 같은 정렬 값은 읽는 사이에 바뀔 수 있어, 이미 받은 글이 다음 응답에 다시 올 수 있다
const appendNewPosts = (posts, content) => {
  const postIds = new Set(posts.map(post => post.postId));
  return [...posts, ...content.filter(post => !postIds.has(post.postId))];
};

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
      setPosts(prev => (cursor ? appendNewPosts(prev, content) : content));
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
