import React, { useEffect, useState } from "react";
import { getMyComments } from "../api/commentApi";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

const renderStarsStatic = (score = 0) => (
    <span>
        {[1, 2, 3, 4, 5].map(star => (
            <span key={star} className="mypage-comment-star" style={{ color: star <= score ? "#ffc107" : "#e4e5e9" }}>★</span>
        ))}
    </span>
);

const ChckMyCom = () => {
    const navigate = useNavigate();
    const nickname = localStorage.getItem("nickname");
    const [commentList, setCommentList] = useState([]);
    const [loading, setLoading] = useState(true);

    const getCommentList = async () => {
        setLoading(true);
        try {
            const { data } = await getMyComments();
            setCommentList(data.result.content);
        } catch {
            // 에러 시 빈 목록 유지
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getCommentList();
    }, []);

    if (loading) {
        return <div className="mypage-comment-loading"><LoadingSpinner minHeight={140} /></div>;
    }

    return (
        <div className="container mypage-comment-page">
            <div className="card shadow-sm border-1 rounded-4 mx-auto mypage-comment-card">
                <div className="card-body p-4">
                    <div className="d-flex align-items-center mb-4 justify-content-between">
                        <h5 className="mb-0 fw-bold">작성 댓글 목록</h5>
                        <div className="d-flex align-items-center mypage-comment-header-gap">
                            <span className="text-secondary mypage-comment-count">
                                작성 댓글 수 <span className="fw-semibold">{commentList.length}</span>
                            </span>
                        </div>
                    </div>
                    {commentList.length === 0 && <p className="text-muted">댓글이 없습니다.</p>}
                    <div>
                        {commentList.map((c, idx) => (
                            <div key={idx} className="mainpage-card-hover card mb-3 border-0 shadow-sm rounded-3 position-relative"
                                onClick={() => navigate(`/post/detail/?no=${c.postId}`)}>
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-2">
                                        <strong className="me-2">{c.memberNickname}</strong>
                                        {c.star > 0 && <span className="ms-1">{renderStarsStatic(c.star)}</span>}
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

export default ChckMyCom;
