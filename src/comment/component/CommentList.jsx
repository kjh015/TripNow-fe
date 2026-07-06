
// 별점만 보여주는 함수 (별 5개 중에 색상표시)
const renderStarsStatic = (score = 0) => (
    <span>
        {[1, 2, 3, 4, 5].map(star => (
            <span
                key={star}
                className="comment-star"
                style={{ color: star <= score ? "#ffc107" : "#e4e5e9" }}
            >★</span>
        ))}
    </span>
);

const CommentList = ({ comments = [], onRemoveComment, ratingAvg }) => {
    return (
        <div className="container my-4">
            <div className="card shadow-sm border-1 rounded-4 mx-auto comment-list-card">
                <div className="card-body p-4">
                    {/* 타이틀, 댓글수, 평점수 한 줄에 정렬 */}
                    <div className="d-flex align-items-center mb-4 justify-content-between">
                        <h5 className="mb-0 fw-bold">댓글 목록</h5>
                        <div className="d-flex align-items-center comment-header-gap">
                            <span className="text-secondary comment-count-text">
                                댓글 수 <span className="fw-semibold">{comments.length}</span>
                            </span>
                            <span className="text-secondary comment-count-text">
                                <span className="ms-1 comment-rating-star">★
                                </span>
                                <span className="fw-semibold"> {ratingAvg ? ratingAvg.toFixed(1) : 0}</span>
                            </span>
                        </div>
                    </div>
                    {/* 실제 댓글 리스트 */}
                    {comments.length === 0 && <p className="text-muted">댓글이 없습니다.</p>}
                    <div>
                        {comments.map((c, idx) => (
                            <div key={idx} className="card mb-3 border-0 shadow-sm rounded-3 position-relative">
                                <div className="card-body">
                                    {/* x 버튼 */}
                                    {localStorage.getItem("nickname") === c.memberNickname &&
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light position-absolute comment-delete-btn"
                                            onClick={() => onRemoveComment({ commentId: c.commentId })}
                                            aria-label="댓글 삭제"
                                        >
                                            ×
                                        </button>
                                    }

                                    <div className="d-flex align-items mb-2">
                                        <strong className="me-2">{c.memberNickname || "(탈퇴 회원)"}</strong>
                                        <span className="comment-item-meta">
                                            {c.star > 0 && (
                                                <div className="mb-1">{renderStarsStatic(c.star)}</div>
                                            )}
                                        </span>
                                    </div>
                                    <div className="mb-2">{c.content}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentList; 