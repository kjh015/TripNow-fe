import React, { useEffect, useRef, useState } from "react";
import { Card } from "react-bootstrap";

import { getPost } from "../../api/postSearchApi";
import { addLike, deleteLike, getMyLikes } from "../../api/likeApi";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import CommentPage from "../../comment/component/CommentPage";
import useAlert from "../../hooks/useAlert";
import PostContent from "../components/PostContent";

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
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "travel_favorite_remove", postId: no, category: post.category, region: post.region, title: post.title });
        showAlert("찜 목록에서 삭제되었습니다.", "danger");
      } else {
        await addLike(Number(no));
        setLiked(true);
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "travel_favorite_add", postId: no, category: post.category, region: post.region, title: post.title });
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
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "travel_detail_exit",
        postId: no,
        staySeconds: stayDuration,
        title: post.title
      });
    };
  }, [no, liked, commentFlag]);

  useEffect(() => {
    if (post && post.category && post.region) {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "travel_detail_pageview",
        postId: no,
        category: post.category,
        region: post.region,
        title: post.title
      });
    }
  }, [post, no]);

  const nickname = localStorage.getItem("nickname");
  const isLoggedIn = !!localStorage.getItem('accessToken');

  return (
    <>
      <style>
        {`
        .heart-btn {
          font-size: 1.7rem;
          color: #b0b0b0;
          transition: color 0.15s;
        }
        .heart-btn.liked,
        .heart-btn:hover {
          color: #e64980 !important;
        }
        `}
      </style>
      {alert.show && (
        <div
          className={`alert alert-${alert.type} alert-dismissible`}
          style={{ position: "fixed", top: 80, right: 24, zIndex: 9999, minWidth: 260 }}
        >
          {alert.message}
        </div>
      )}
      <div style={{ minHeight: "100vh", width: "100vw", overflowX: "hidden", position: "relative" }}>
        <div className="container py-5 mt-5" style={{ minHeight: "100vh", maxWidth: "1600px" }}>
          <div style={{ display: "flex", gap: "32px", width: "95%", margin: "0 auto", alignItems: "stretch" }}>
            <PostContent post={post} liked={liked} onLike={handleLike} nickname={nickname} />
            <Card
              className="shadow-sm flex-fill"
              style={{ borderRadius: "18px", width: "70%", minWidth: "0", background: "#fff", display: "flex", flexDirection: "column" }}
            >
              {post.postId && (
                <Card.Body className="d-flex flex-column py-4" style={{ flex: 1 }}>
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
          className="btn btn-lg btn-primary"
          style={{
            position: "fixed", bottom: "36px", right: "48px", zIndex: 9999,
            borderRadius: "50%", width: "64px", height: "64px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 16px #0002", fontSize: "2rem",
          }}
          title="목록으로 이동"
        >
          <i className="bi bi-list"></i>
        </button>
      </div>
    </>
  );
};

export default PostDetailPage;
