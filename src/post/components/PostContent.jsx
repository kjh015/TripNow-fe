import { Tooltip, Card, Badge, OverlayTrigger, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { categoryColors, regionColors } from "../../constants/colorMaps";

const PostContent = ({ post, liked, onLike, nickname }) => {
    return (
        <Card
            className="shadow-sm flex-fill"
            style={{ borderRadius: "18px", width: "100%", minWidth: "0", background: "#fff", display: "flex", flexDirection: "column" }}
        >
            <Card.Body className="pb-2 pt-4 d-flex flex-column" style={{ flex: 1 }}>
                {post.images && post.images.length > 0 && (
                    <Carousel
                        interval={null}
                        indicators={post.images.length > 1}
                        style={{ maxWidth: 800, margin: "0 auto 24px auto", borderRadius: 16, overflow: "hidden", boxShadow: "0 6px 18px #0001" }}
                    >
                        {post.images.map(img => (
                            <Carousel.Item key={img.imageKey}>
                                <img
                                    src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${img.imageKey}`}
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
                <div className="mb-2 text-muted small">
                    조회수: <span className="fw-semibold">{post.viewCount}</span> | 작성자: <span className="fw-semibold">{post.memberNickname ? post.memberNickname : 0}</span> |
                </div>
                <hr className="my-2" />
                <div className="mb-2">
                    <span className="fw-semibold"><i className="bi bi-geo-alt-fill"></i> 여행지:</span> {post.travelPlace}
                    <div className="text-muted small">{post.address}</div>
                </div>
                <div className="mb-2 d-flex align-items-center justify-content-between">
                    <div>
                        <span className="fw-semibold"><i className="bi bi-map-fill"></i> 지역:</span>
                        <Badge bg={regionColors[post.region] || "secondary"} className="ms-1">{post.region}</Badge>
                    </div>
                    {nickname === post.memberNickname && (
                        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-edit">수정하기</Tooltip>}>
                            <Link
                                to={`/post/edit?no=${post.postId}`}
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
                        className={`favorite-btn btn btn-link p-0 heart-btn text-decoration-none${liked ? " liked" : ""}`}
                        data-travel="123"
                        onClick={onLike}
                        aria-label={liked ? "찜 취소" : "찜하기"}
                    >
                        <i className={liked ? "bi bi-heart-fill" : "bi bi-heart"} />
                        <span className="fw-semibold"> {post.likeCount ? post.likeCount : 0}</span>
                    </button>
                </div>
            </Card.Body>
        </Card>
    );
};

export default PostContent;
