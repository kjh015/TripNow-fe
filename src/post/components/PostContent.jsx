import { Tooltip, Card, Badge, OverlayTrigger, Carousel } from "react-bootstrap";
import { Link } from "react-router-dom";
import { categoryColors, regionColors } from "../../constants/colorMaps";
import { CATEGORY_CODE_TO_LABEL, REGION_CODE_TO_LABEL } from "../../constants/categoryRegion";

const PostContent = ({ post, liked, onLike, nickname }) => {
    const categoryLabel = CATEGORY_CODE_TO_LABEL[post.category] ?? post.category;
    const regionLabel = REGION_CODE_TO_LABEL[post.region] ?? post.region;
    return (
        <Card className="shadow-sm flex-fill post-content-card">
            <Card.Body className="pb-2 pt-4 d-flex flex-column post-content-body">
                {post.images && post.images.length > 0 && (
                    <Carousel
                        interval={null}
                        indicators={post.images.length > 1}
                        className="post-content-carousel"
                    >
                        {post.images.map(img => (
                            <Carousel.Item key={img.imageKey}>
                                <img
                                    src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${img.imageKey}`}
                                    alt="uploaded"
                                    className="post-content-image"
                                />
                            </Carousel.Item>
                        ))}
                    </Carousel>
                )}
                <div className="d-flex justify-content-between align-items-start mb-1">
                    <h4 className="fw-bold mb-1">{post.title}</h4>
                    <Badge bg={categoryColors[categoryLabel] || "secondary"} className="post-content-badge">
                        {categoryLabel}
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
                        <Badge bg={regionColors[regionLabel] || "secondary"} className="ms-1">{regionLabel}</Badge>
                    </div>
                    {nickname === post.memberNickname && (
                        <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-edit">수정하기</Tooltip>}>
                            <Link
                                to={`/post/edit?no=${post.postId}`}
                                className="btn btn-outline-primary btn-sm ms-2 text-nowrap"
                            >
                                🖊
                            </Link>
                        </OverlayTrigger>
                    )}
                </div>
                <Card className="mb-0 post-content-body-card">
                    <Card.Body className="py-2 px-3 post-content-body-text">
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
