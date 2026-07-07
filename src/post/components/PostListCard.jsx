import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { categoryColors, regionColors } from "../../constants/colorMaps";
import { CATEGORY_CODE_TO_LABEL, REGION_CODE_TO_LABEL } from "../../constants/categoryRegion";
import { formatDate } from "../../utils/dateUtils";

const PostListCard = ({ post, navigateTo, navigateState }) => {
  const navigate = useNavigate();
  const categoryLabel = CATEGORY_CODE_TO_LABEL[post.category] ?? post.category;
  const regionLabel = REGION_CODE_TO_LABEL[post.region] ?? post.region;

  const handleClick = () => {
    const to = navigateTo ?? `/post/detail?postId=${post.postId}`;
    navigate(to, navigateState ? { state: navigateState } : undefined);
  };

  return (
    <div
      className="p-3 rounded-3 border post-list-card"
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div className="d-flex justify-content-between align-items-start fw-bold post-list-card-title-row">
        <div className="text-truncate post-list-card-title">
          <span className="post-list-card-title-text" title={post.title}>
            {post.title}
          </span>
        </div>
        <span className="text-secondary ms-2 post-list-card-date">
          {formatDate(post.updatedAt)}
        </span>
      </div>

      <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between post-list-card-meta">
        <div>
          <Badge bg={categoryColors[categoryLabel]} className="me-1">{categoryLabel}</Badge>
          <Badge bg={regionColors[regionLabel]} className="me-2">{regionLabel}</Badge>
          <span className="post-list-card-author">by {post.memberNickname}</span>
        </div>
        <div className="d-flex align-items-center">
          <span className="badge text-dark d-flex align-items-center post-list-card-stat">
            <i className="bi bi-eye me-1" />
            {post.viewCount}
          </span>
          <span className="badge post-list-card-star">
            <i className="bi bi-star-fill me-1" />
            {post.starAvg ? post.starAvg.toFixed(1) : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostListCard;
