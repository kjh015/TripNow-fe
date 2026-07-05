import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { getPostListBySearch } from "../../api/postSearchApi";
import PostSearch from "../components/PostSearch";
import LoadingSpinner from "../../components/LoadingSpinner";
import PostListCard from "../components/PostListCard";
import useAlert from "../../hooks/useAlert";

const PostListPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [pagination, setPagination] = useState({ totalPages: 0, isFirst: true, isLast: true });
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
  const page = parseInt(params.get("page") || "0", 10);
  const sortName = SORT_NAME_MAP[`${sort}-${direction}`] || "정렬";
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('accessToken');

  useEffect(() => {
    setSearched(true);
    getPostList();
  }, [location.search]);

  const goToWrite = () => {
    if (isLoggedIn) {
      navigate("/post/write");
    } else {
      showAlert("로그인 필요", "danger");
    }
  };

  const [retryCount, setRetryCount] = useState(0);

  const getPostList = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getPostListBySearch({ category, region, keyword, sort, direction, page });
      const result = data.result;
      setPosts(result.content ?? []);
      setPagination({ totalPages: result.totalPages ?? 0, isFirst: result.isFirst ?? true, isLast: result.isLast ?? true });
      setRetryCount(0);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (error && retryCount < 2) {
      const timer = setTimeout(() => {
        setRetryCount(c => c + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [error, retryCount]);

  useEffect(() => {
    if (retryCount > 0 && retryCount <= 2) {
      getPostList();
    }
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(0);
    getPostList();
  };

  const handleSort = ({ sort, direction }) => {
    params.set("sort", sort);
    params.set("direction", direction);
    params.set("page", 0);
    navigate(`/post/list?${params.toString()}`);
  };

  const handlePage = (pageNum) => {
    params.set("page", pageNum);
    navigate(`/post/list?${params.toString()}`);
  };

  return (
    <div className="bg-light min-vh-100 py-4" style={{ overflowX: "hidden" }}>
      <div style={{ marginTop: "3rem" }} />
      <PostSearch selectedCategory={category} selectedRegion={region} />
      <div
        style={{
          height: "3.5px", width: "60px", margin: "0.7rem auto 1.1rem auto",
          borderRadius: "2rem", background: "linear-gradient(90deg,#bdaafc 20%, #92e0f6 90%)",
          opacity: 0.88, marginTop: "1rem", marginBottom: "5rem"
        }}
      />
      <div className="container py-3" style={{ maxWidth: 850 }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold mb-1"
              style={{ color: "#6c45e0", fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif", fontSize: "2rem" }}>
              여행지 목록
            </h3>
            <div className="text-secondary" style={{ fontSize: "1.07rem" }}>
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
                className="btn fw-bold px-4"
                style={{ background: "linear-gradient(90deg, #a084ee 30%, #7c3aed 100%)", color: "#fff", border: "none" }}
                onClick={goToWrite}
              >글쓰기</button>
            )}
          </div>
        </div>

        {loading ? (
          <LoadingSpinner minHeight={140} />
        ) : error ? (
          <div className="text-danger text-center py-5">
            에러 발생: {error.message}<br />
            {retryCount < 2 ? (
              <span>잠시 후 자동으로 다시 시도합니다... ({retryCount + 1}/3)</span>
            ) : (
              <button className="btn btn-outline-danger mt-3" onClick={handleRetry}>다시 시도</button>
            )}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center text-secondary py-5 fs-5">
            게시글이 없습니다. 검색해주세요.
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {posts.map((post) => (
              <PostListCard
                key={post.postId}
                post={post}
                navigateTo={`/post/detail?no=${post.postId}`}
                navigateState={{ from: location.search }}
              />
            ))}
          </div>
        )}

        <div className="mt-4 mb-3 text-center">
          <button
            type="button"
            className="btn btn-outline-primary me-2 px-4"
            onClick={() => handlePage(page - 1)}
            disabled={pagination.isFirst}
          >
            이전
          </button>
          {Array.from({ length: pagination.totalPages }, (_, i) => i).map(num => (
            <button
              key={num}
              className={`btn mx-1 px-3 ${page === num ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => handlePage(num)}
              style={{ fontWeight: page === num ? 'bold' : undefined }}
            >
              {num + 1}
            </button>
          ))}
          <button
            type="button"
            className="btn btn-outline-primary px-4"
            onClick={() => handlePage(page + 1)}
            disabled={pagination.isLast}
          >
            다음
          </button>
        </div>
      </div>
      <style>
        {`
.post-list-card {
  transition: box-shadow 0.18s, transform 0.16s, background 0.16s, border 0.13s;
}
.post-list-card:hover, .post-list-card:focus {
  box-shadow: 0 6px 24px 0 rgba(123,82,255,0.14), 0 1.5px 10px rgba(60,0,128,0.04);
  border-color: #a084ee;
  background: #faf8ff;
  transform: translateY(-2px) scale(1.012);
  cursor: pointer;
}
        `}
      </style>
    </div>
  );
};

export default PostListPage;
