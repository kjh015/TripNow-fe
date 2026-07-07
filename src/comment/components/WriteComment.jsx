import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const WriteComment = ({ onAddComment }) => {
    const [comment, setComment] = useState("");
    const [rating, setRating] = useState(0);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const navigate = useNavigate();

    // 별점 클릭 렌더 함수
    const renderStars = () => (
        <span>
            {[1, 2, 3, 4, 5].map(star => (
                <i
                    key={star}
                    className={`${star <= rating ? "bi bi-star-fill" : "bi bi-star"} comment-write-star`}
                    style={{ color: star <= rating ? "#ffc107" : "#dee2e6" }}
                    onClick={() => setRating(star)}
                />
            ))}
        </span>
    );

    // 제출 핸들러 (onAddComment 콜백 예시)
    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            if (!comment.trim()) return;
            if (localStorage.getItem('accessToken') == null) {
                setAlert({ show: true, message: "로그인이 필요합니다.", type: "danger" });

                navigate(-1);
                return;
            }

            if (onAddComment) onAddComment({ comment, rating });
            setComment("");
            setRating(0);
        } catch {

        }

    };

    return (
        <div className="card shadow-sm rounded-4 px-4 py-3 mx-auto comment-write-card">
            <form onSubmit={handleSubmit}>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label mb-0 comment-write-label" htmlFor="comment">
                        댓글
                    </label>
                    {renderStars()}
                </div>
                <textarea
                    id="comment"
                    className="form-control mb-3 comment-write-textarea"
                    rows={3}
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    placeholder="댓글을 입력하세요"
                />
                <div className="d-flex justify-content-end">


                    <button type="submit" className="btn btn-primary px-4">작성하기</button>
                </div>
            </form>
        </div>
    );
};

export default WriteComment;
