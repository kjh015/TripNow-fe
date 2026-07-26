import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";

import { getPost } from "../../api/postSearchApi";
import { addLike, deleteLike, getMyLikes } from "../../api/likeApi";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import CommentPage from "../../comment/components/CommentPage";
import useAlert from "../../hooks/useAlert";
import PostContent from "../components/PostContent";
import { trackFavoriteAdd, trackFavoriteRemove, trackDetailPageview, trackDetailExit } from "../../analytics/events";

const PostDetailPage = () => {
  const enterTime = useRef(Date.now());
  const titleRef = useRef(''); // exit 발화 시점의 최신 제목 (cleanup 클로저의 stale 값 방지)
  const lastPageviewPostId = useRef(null); // pageview 중복 발화 가드 (postId당 1회)
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const postId = searchParams.get('postId');
  const navigate = useNavigate();
  const [post, setPost] = useState({
    postId: '', title: '', content: '', memberNickname: '',
    travelPlace: '', address: '', category: '', region: '', images: [],
    updatedAt: '', starAvg: '', viewCount: '', likeCount: '', commentCount: ''
  });
  const [commentFlag, setCommentFlag] = useState(false);
  const [liked, setLiked] = useState(false);
  const { alert, showAlert } = useAlert(2500);

  const goToList = () => {
    if (location.state && location.state.from) {
      navigate(`/post/list${location.state.from}`);
    } else {
      navigate("/post/list");
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await deleteLike(Number(postId));
        setLiked(false);
        trackFavoriteRemove(post);
        showAlert("찜 목록에서 삭제되었습니다.", "danger");
      } else {
        await addLike(Number(postId));
        setLiked(true);
        trackFavoriteAdd(post);
        showAlert("찜 목록에 추가되었습니다.", "success");
      }
    } catch {
      showAlert("오류가 발생했습니다.", "danger");
    }
  };

  const getLike = async () => {
    if (!localStorage.getItem('accessToken')) return;
    try {
      const { data } = await getMyLikes();
      const likes = data.result.content ?? [];
      setLiked(likes.some((p) => String(p.postId) === String(postId)));
    } catch {
      showAlert("오류가 발생했습니다.", "danger");
    }
  };

  const loadPost = async () => {
    try {
      const { data } = await getPost(postId);
      const post = data.result;
      titleRef.current = post.title;
      setPost({ ...post, images: post.images || [] });
    } catch {
      showAlert("게시글을 불러오지 못했습니다.", "danger");
    }
  };

  useEffect(() => {
    loadPost();
    getLike();
  }, [postId, liked, commentFlag]);

  // 이탈 추적: no에만 의존해 실제 상세 진입/이탈 시에만 발화 (찜/댓글 상호작용에는 반응하지 않음)
  useEffect(() => {
    enterTime.current = Date.now();
    const fireExit = () => {
      const staySeconds = Math.floor((Date.now() - enterTime.current) / 1000);
      trackDetailExit({ postId, staySeconds, title: titleRef.current });
    };
    const handlePagehide = () => fireExit(); // 탭 닫기/외부 이동은 cleanup이 실행되지 않으므로 보완 발화
    const handlePageshow = () => { enterTime.current = Date.now(); }; // bfcache 복귀 시 체류시간 재시작
    window.addEventListener('pagehide', handlePagehide);
    window.addEventListener('pageshow', handlePageshow);
    return () => {
      window.removeEventListener('pagehide', handlePagehide);
      window.removeEventListener('pageshow', handlePageshow);
      fireExit();
    };
  }, [postId]);

  // 진입 추적: loadPost 재실행마다 재발화하지 않도록 postId당 1회만 발화
  useEffect(() => {
    if (post.postId && lastPageviewPostId.current !== post.postId) {
      lastPageviewPostId.current = post.postId;
      trackDetailPageview(post);
    }
  }, [post]);

  const nickname = localStorage.getItem("nickname");
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <>
      {alert.show && (
        <div className={`alert alert-${alert.type} alert-dismissible post-detail-alert`}>
          {alert.message}
        </div>
      )}
      <div className="post-viewport">
        <div className="container py-5 mt-5 post-detail-container">
          <div className="post-detail-row">
            <PostContent post={post} liked={liked} onLike={handleLike} nickname={nickname} />
            <Card className="shadow-sm flex-fill post-detail-comment-card">
              {post.postId && (
                <Card.Body className="d-flex flex-column py-4 post-detail-comment-body">
                  <CommentPage
                    postId={post.postId}
                    isLoggedIn={isLoggedIn}
                    ratingAvg={post.starAvg}
                    setCommentFlag={setCommentFlag}
                    category={post.category}
                    region={post.region}
                    title={post.title}
                  />
                </Card.Body>
              )}
            </Card>
          </div>
        </div>
        <button
          onClick={goToList}
          className="btn btn-lg btn-primary post-detail-fab"
          title="목록으로 이동"
        >
          <i className="bi bi-list"></i>
        </button>
      </div>
    </>
  );
};

export default PostDetailPage;
