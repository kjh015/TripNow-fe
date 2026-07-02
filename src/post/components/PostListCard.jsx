import { Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { categoryColors, regionColors } from "../../constants/colorMaps";
import { formatDate } from "../../utils/dateUtils";

const PostListCard = ({ post, navigateTo, navigateState }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    const to = navigateTo ?? `/post/detail?no=${post.postId}`;
    navigate(to, navigateState ? { state: navigateState } : undefined);
  };

  return (
    <div
      className="p-3 rounded-3 border post-list-card"
      style={{
        background: "#fff",
        minHeight: "88px",
        boxShadow: "0 2px 10px 0 rgba(0,0,0,0.04)",
        position: "relative",
      }}
      onClick={handleClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") handleClick();
      }}
    >
      <div
        className="d-flex justify-content-between align-items-start fw-bold"
        style={{ fontSize: "1.12rem", marginBottom: 6 }}
      >
        <div
          className="text-truncate"
          style={{ maxWidth: "75%", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
        >
          <span
            style={{
              color: "#222",
              fontWeight: "bold",
              fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif",
            }}
            title={post.title}
          >
            {post.title}
          </span>
        </div>
        <span className="text-secondary ms-2" style={{ fontSize: "0.95rem", whiteSpace: "nowrap" }}>
          {formatDate(post.updatedAt)}
        </span>
      </div>

      <div
        className="d-flex align-items-center flex-wrap gap-2 justify-content-between"
        style={{ fontSize: "0.97rem" }}
      >
        <div>
          <Badge bg={categoryColors[post.category]} className="me-1">{post.category}</Badge>
          <Badge bg={regionColors[post.region]} className="me-2">{post.region}</Badge>
          <span style={{ color: "#222" }}>by {post.memberNickname}</span>
        </div>
        <div className="d-flex align-items-center">
          <span className="badge text-dark d-flex align-items-center" style={{ fontSize: "1rem", fontWeight: 500 }}>
            <i className="bi bi-eye me-1" />
            {post.viewCount}
          </span>
          <span className="badge" style={{ color: "#ffc107", fontSize: "1rem", fontWeight: 500 }}>
            <i className="bi bi-star-fill me-1" />
            {post.starAvg ? post.starAvg.toFixed(1) : 0}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PostListCard;
