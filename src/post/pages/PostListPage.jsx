import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostSearch from "../components/PostSearch";
import LoadingSpinner from "../../components/LoadingSpinner";
import PostListCard from "../components/PostListCard";
import useAlert from "../../hooks/useAlert";
import usePostFeed from "../../hooks/usePostFeed";
import { trackListItemClick } from "../../analytics/events";
import { POST_FEED_PRELOAD_MARGIN, POST_LIST_MAX_RETRY } from "../../constants/post";

const PostListPage = () => {
  const { alert, showAlert } = useAlert(500);
  const SORT_NAME_MAP = {
    "popular-desc": "인기 순",
    "ratingAvg-desc": "높은 평점 순",
    "ratingAvg-asc": "낮은 평점 순",
    "modifiedDate-desc": "최신 순",
    "modifiedDate-asc": "오래된 순",
    "viewCount-desc": "조회수 순",
  };

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const category = params.get("category") || "";
  const region = params.get("region") || "";
  const keyword = params.get("keyword") || "";
  const sort = params.get("sort") || "popular";
  const direction = params.get("direction") || "desc";
  const sortName = SORT_NAME_MAP[`${sort}-${direction}`] || "정렬";
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const { posts, loading, error, hasNext, retryCount, loadMore, retry } =
    usePostFeed({ category, region, keyword, sort, direction });
  const sentinelRef = useRef(null);

  // 목록 끝의 표식이 화면 가까이 오면 다음 건을 읽는다
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNext || loading || error) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some(entry => entry.isIntersecting)) loadMore();
      },
      { rootMargin: POST_FEED_PRELOAD_MARGIN }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNext, loading, error, loadMore]);

  const goToWrite = () => {
    if (isLoggedIn) {
      navigate("/post/write");
    } else {
      showAlert("로그인 필요", "danger");
    }
  };

  const handleSort = ({ sort, direction }) => {
    params.set("sort", sort);
    params.set("direction", direction);
    params.delete("page");
    navigate(`/post/list?${params.toString()}`);
  };

  const errorNotice = error && (
    <div className="text-danger text-center py-5">
      에러 발생: {error.message}<br />
      {retryCount < POST_LIST_MAX_RETRY ? (
        <span>잠시 후 자동으로 다시 시도합니다... ({retryCount + 1}/{POST_LIST_MAX_RETRY + 1})</span>
      ) : (
        <button className="btn btn-outline-danger mt-3" onClick={retry}>다시 시도</button>
      )}
    </div>
  );

  return (
    <div className="min-vh-100 py-4 post-list-page">
      <div className="mt-5" />
      <PostSearch selectedCategory={category} selectedRegion={region} />
      <div className="post-list-divider" />
      <div className="container py-3 post-list-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1 page-title">
              여행지 목록
            </h3>
            <div className="text-secondary post-subtitle">
              인기 여행지의 다양한 후기를 만나보세요!
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="dropdown me-2">
              <button className="btn btn-outline-primary dropdown-toggle px-3 fw-semibold"
                type="button" data-bs-toggle="dropdown" aria-expanded="false">
                {sortName}
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => handleSort({ sort: "popular", direction: "desc" })}>인기 순</button></li>
                <li><button className="dropdown-item" onClick={() => handleSort({ sort: "modifiedDate", direction: "desc" })}>최신 순</button></li>
                <li><button className="dropdown-item" onClick={() => handleSort({ sort: "modifiedDate", direction: "asc" })}>오래된 순</button></li>
                <li><button className="dropdown-item" onClick={() => handleSort({ sort: "ratingAvg", direction: "desc" })}>높은 평점 순</button></li>
                <li><button className="dropdown-item" onClick={() => handleSort({ sort: "ratingAvg", direction: "asc" })}>낮은 평점 순</button></li>
                <li><button className="dropdown-item" onClick={() => handleSort({ sort: "viewCount", direction: "desc" })}>조회수 순</button></li>
              </ul>
            </div>
            {isLoggedIn && (
              <button
                className="btn fw-bold px-4 post-write-btn"
                onClick={goToWrite}
              >글쓰기</button>
            )}
          </div>
        </div>

        {posts.length > 0 ? (
          <div className="d-flex flex-column gap-4">
            {posts.map((post, idx) => (
              <PostListCard
                key={post.postId}
                post={post}
                navigateTo={`/post/detail?postId=${post.postId}`}
                navigateState={{ from: location.search }}
                onCardClick={() => trackListItemClick({ postId: post.postId, position: idx + 1, keyword })}
              />
            ))}
          </div>
        ) : !loading && !error ? (
          <div className="text-center text-secondary py-5 fs-5">
            게시글이 없습니다. 검색해주세요.
          </div>
        ) : null}

        {errorNotice}
        {loading && <LoadingSpinner minHeight={140} />}
        <div ref={sentinelRef} aria-hidden="true" />
      </div>
    </div>
  );
};

export default PostListPage;
