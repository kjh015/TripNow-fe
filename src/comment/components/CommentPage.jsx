import CommentList from "./CommentList";
import WriteComment from "./WriteComment";
import * as commentApi from "../../api/commentApi";
import { useEffect, useState } from "react";
import { trackCommentAdd, trackCommentRemove } from "../../analytics/events";

function ConfirmModal({ show, type = "danger", message, onConfirm, onCancel }) {
    if (!show) return null;
    return (
        <div className="modal show fade comment-modal-backdrop" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className={`modal-content border-${type}`}>
                    <div className={`modal-header bg-${type} bg-opacity-10`}>
                        <h5 className="modal-title">{type === "danger" ? "경고" : "확인"}</h5>
                    </div>
                    <div className="modal-body"><p>{message}</p></div>
                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onCancel}>취소</button>
                        <button className={`btn btn-${type}`} onClick={onConfirm}>확인</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const CommentPage = ({ postId, isLoggedIn, ratingAvg, setCommentFlag, category, region, title }) => {
    const [commentList, setCommentList] = useState([]);
    const [modal, setModal] = useState({ show: false, type: 'danger', message: '', onConfirm: null });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const getCommentList = async () => {
        try {
            const { data } = await commentApi.getCommentList(postId);
            setCommentList(data.result.content);
        } catch {}
    };

    const removeComment = ({ commentId }) => {
        setModal({
            show: true,
            type: "danger",
            message: "정말 삭제하시겠습니까?",
            onConfirm: async () => {
                setModal(prev => ({ ...prev, show: false }));
                try {
                    await commentApi.deleteComment(commentId);
                    setCommentList(prev => prev.filter((c) => c.commentId !== commentId));
                    const message = "댓글이 삭제되었습니다.";
                    setAlert({ show: true, message, type: "success" });
                    trackCommentRemove({ postId, category, region, title });
                    setCommentFlag?.(prev => !prev);
                } catch (err) {
                    const message = err.response?.data?.message || "오류가 발생했습니다.";
                    setAlert({ show: true, message, type: "danger" });
                }
            }
        });
    };

    const addComment = async ({ rating, comment }) => {
        trackCommentAdd({ postId, category, region, title, star: rating });
        const payload = { postId: parseInt(postId), content: comment, star: rating };
        try {
            const { data } = await commentApi.addComment(payload);
            // 댓글 조회는 검색엔진 색인을 거치므로 작성 직후 재조회 시 반영이 늦을 수 있어,
            // 응답으로 받은 commentId로 화면에 즉시 반영한다.
            const newComment = {
                commentId: data.result.commentId,
                postId: payload.postId,
                memberNickname: localStorage.getItem("nickname") || "",
                content: payload.content,
                star: payload.star,
            };
            setCommentList(prev => [newComment, ...prev]);
            setAlert({ show: true, message: "댓글이 등록되었습니다.", type: "success" });
            setCommentFlag?.(prev => !prev);
        } catch (err) {
            const message = err.response?.data?.message || "오류가 발생했습니다.";
            setAlert({ show: true, message, type: "danger" });
        }
    };

    useEffect(() => {
        if (alert.show) {
            const t = setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 500);
            return () => clearTimeout(t);
        }
    }, [alert.show]);

    useEffect(() => {
        if (!postId) return;
        getCommentList();
    }, [postId]);

    return (
        <div>
            {alert.show && (
                <div className={`alert alert-${alert.type} text-center comment-alert`} role="alert">
                    {alert.message}
                </div>
            )}
            <ConfirmModal
                show={modal.show}
                type={modal.type}
                message={modal.message}
                onConfirm={() => {
                    if (modal.onConfirm) modal.onConfirm();
                    setModal({ ...modal, show: false });
                }}
                onCancel={() => setModal({ ...modal, show: false })}
            />
            <CommentList comments={commentList} onRemoveComment={removeComment} ratingAvg={ratingAvg} />
            {isLoggedIn && <WriteComment onAddComment={addComment} />}
        </div>
    );
};

export default CommentPage;
