import React, { useEffect, useRef, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { Tooltip, Card, Badge, OverlayTrigger, Carousel } from "react-bootstrap";

import { getPost } from "../../api/postApi";
import { toggleFavorite, existsFavorite } from "../../api/favoriteApi";
import { useSearchParams, Link, useNavigate, useLocation } from "react-router-dom";
import CommentPage from "../../comment/component/CommentPage";
import { categoryColors, regionColors } from "../../constants/colorMaps";
import useAlert from "../../hooks/useAlert";

const PostDetailPage = () => {
  const enterTime = useRef(Date.now());
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const no = searchParams.get('no');
  const navigate = useNavigate();
  const [post, setPost] = useState({
    id: '', title: '', content: '', memberNickname: '',
    travelPlace: '', address: '', category: '', region: '', imagePaths: [],
    createdDate: '', modifiedDate: '', ratingAvg: '', viewCount: '', favoriteCount: '', commentCount: ''
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
    const nickname = localStorage.getItem("nickname");
    const payload = { boardId: no, memberNickname: nickname };
    try {
      const { data } = await toggleFavorite(payload);
      setLiked(data);
      if (data) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "travel_favorite_add",
          boardId: no,
          category: post.category,
          region: post.region,
          title: post.title
        });
        showAlert("찜 목록에 추가되었습니다.", "success");
      } else {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "travel_favorite_remove",
          boardId: no,
          category: post.category,
          region: post.region,
          title: post.title
        });
        showAlert("찜 목록에서 삭제되었습니다.", "danger");
      }
    } catch {
      showAlert("오류가 발생했습니다.", "danger");
    }
  };

  const getLike = async () => {
    const nickname = localStorage.getItem("nickname");
    const payload = { boardId: no, memberNickname: nickname };
    try {
      const { data } = await existsFavorite(payload);
      setLiked(data);
    } catch {
      showAlert("오류가 발생했습니다.", "danger");
    }
  };

  const viewBoard = async () => {
    try {
      const { data } = await getPost(no);
      setPost({ ...data, images: data.images || [] });
    } catch {
      showAlert("게시글을 불러오지 못했습니다.", "danger");
    }
  };

  const goToEdit = () => {
    if (localStorage.getItem('nickname') == post.memberNickname) {
      navigate(`/post/edit?no=${post.id}`);
    } else {
      showAlert("권한이 없습니다.", "danger");
    }
  };

  useEffect(() => {
    viewBoard();
    getLike();
    enterTime.current = Date.now();
    return () => {
      const leaveTime = Date.now();
      const stayDuration = Math.floor((leaveTime - enterTime.current) / 1000);
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "travel_detail_exit",
        boardId: no,
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
        boardId: no,
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
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          overflowX: "hidden",
          position: "relative"
        }}
      >
        <div className="container py-5 mt-5" style={{ minHeight: "100vh", maxWidth: "1600px" }}>
          <div style={{ display: "flex", gap: "32px", width: "95%", margin: "0 auto", alignItems: "stretch" }}>
            <Card className="shadow-sm flex-fill"
              style={{ borderRadius: "18px", width: "100%", minWidth: "0", background: "#fff", display: "flex", flexDirection: "column" }}>
              <Card.Body className="pb-2 pt-4 d-flex flex-column" style={{ flex: 1 }}>
                {post.imagePaths && post.imagePaths.length > 0 && (
                  <Carousel
                    interval={null}
                    indicators={post.imagePaths.length > 1}
                    style={{ maxWidth: 800, margin: "0 auto 24px auto", borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 18px #0001" }}
                  >
                    {post.imagePaths.map(filename => (
                      <Carousel.Item key={filename}>
                        <img
                          src={`${process.env.REACT_APP_IMAGE_BASE_URL}${filename}`}
                          alt="uploaded"
                          style={{ width: "100%", height: 400, objectFit: "cover", display: "block", background: "#eee" }}
                        />
                      </Carousel.Item>
                    ))}
                  </Carousel>
                )}
                <div className="d-flex justify-content-between align-items-start mb-1">
                  <h4 className="fw-bold mb-1">{post.title}</h4>
                  <Badge bg={categoryColors[post.category] || "secondary"} style={{ fontSize: "1rem" }}>
                    {post.category}
                  </Badge>
                </div>
                <div className="mb-2 text-muted" style={{ fontSize: "0.96rem" }}>
                  조회수: <span className="fw-semibold">{post.viewCount}</span> | 작성자: <span className="fw-semibold">{post.memberNickname ? post.memberNickname : 0}</span> |
                </div>
                <hr className="my-2" />
                <div className="mb-2">
                  <span className="fw-semibold"><i className="bi bi-geo-alt-fill"></i> 여행지:</span> {post.travelPlace}
                  <div className="text-muted" style={{ fontSize: "0.97rem" }}>{post.address}</div>
                </div>
                <div className="mb-2 d-flex align-items-center justify-content-between">
                  <div>
                    <span className="fw-semibold"><i className="bi bi-map-fill"></i> 지역:</span>
                    <Badge bg={regionColors[post.region] || "secondary"} className="ms-1">{post.region}</Badge>
                  </div>
                  {(nickname === post.memberNickname) && (
                    <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-edit">수정하기</Tooltip>}>
                      <Link
                        to={`/post/edit?no=${post.id}`}
                        className="btn btn-outline-primary btn-sm ms-2"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        🖊
                      </Link>
                    </OverlayTrigger>
                  )}
                </div>
                <Card className="mb-0" style={{ background: "#f7fafc", border: "none" }}>
                  <Card.Body className="py-2 px-3" style={{ minHeight: "50px", fontSize: "1.08rem", whiteSpace: "pre-line" }}>
                    {post.content}
                  </Card.Body>
                </Card>
                <div className="d-flex justify-content-between align-items-center mt-auto pt-3">
                  <button
                    className={`favorite-btn btn btn-link p-0 heart-btn${liked ? " liked" : ""}`}
                    data-travel="123"
                    onClick={handleLike}
                    style={{ textDecoration: "none" }}
                    aria-label={liked ? "찜 취소" : "찜하기"}
                  >
                    <i className={liked ? "bi bi-heart-fill" : "bi bi-heart"} />
                    <span className="fw-semibold"> {post.favoriteCount ? post.favoriteCount : 0}</span>
                  </button>
                </div>
              </Card.Body>
            </Card>
            <Card className="shadow-sm flex-fill"
              style={{ borderRadius: "18px", width: "70%", minWidth: "0", background: "#fff", display: "flex", flexDirection: "column" }}>
              {post.id &&
                <Card.Body className="d-flex flex-column py-4" style={{ flex: 1 }}>
                  <CommentPage no={post.id} isLoggedIn={isLoggedIn} ratingAvg={post.ratingAvg} setCommentFlag={setCommentFlag} category={post.category} region={post.region} title={post.title} />
                </Card.Body>}
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
