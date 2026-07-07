import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";

import { getPost } from "../../api/postSearchApi";
import { addLike, deleteLike, getMyLikes } from "../../api/likeApi";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import CommentPage from "../../comment/component/CommentPage";
import useAlert from "../../hooks/useAlert";
import PostContent from "../components/PostContent";
import { trackFavoriteAdd, trackFavoriteRemove, trackDetailPageview, trackDetailExit } from "../../analytics/events";

const PostDetailPage = () => {
  const enterTime = useRef(Date.now());
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const no = searchParams.get('no');
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
        await deleteLike(Number(no));
        setLiked(false);
        trackFavoriteRemove(post);
        showAlert("찜 목록에서 삭제되었습니다.", "danger");
      } else {
        await addLike(Number(no));
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
      setLiked(likes.some((p) => String(p.postId) === String(no)));
    } catch {
      showAlert("오류가 발생했습니다.", "danger");
    }
  };

  const loadPost = async () => {
    try {
      const { data } = await getPost(no);
      const post = data.result;
      setPost({ ...post, images: post.images || [] });
    } catch {
      showAlert("게시글을 불러오지 못했습니다.", "danger");
    }
  };

  useEffect(() => {
    loadPost();
    getLike();
    enterTime.current = Date.now();
    return () => {
      const leaveTime = Date.now();
      const stayDuration = Math.floor((leaveTime - enterTime.current) / 1000);
      trackDetailExit({ postId: no, staySeconds: stayDuration, title: post.title });
    };
  }, [no, liked, commentFlag]);

  useEffect(() => {
    if (post && post.category && post.region) {
      trackDetailPageview(post);
    }
  }, [post, no]);

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
                    no={post.postId}
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
