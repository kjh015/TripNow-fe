import CommentList from "./CommentList";
import WriteComment from "./WriteComment";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import * as commentApi from "../../api/commentApi";
import { useEffect, useState } from "react";

function ConfirmModal({ show, type = "danger", message, onConfirm, onCancel }) {
    if (!show) return null;
    return (
        <div className="modal show fade" tabIndex="-1" style={{ display: "block", background: "rgba(0,0,0,0.23)", zIndex: 1060 }}>
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

const CommentPage = ({ no, isLoggedIn, ratingAvg, setCommentFlag, category, region, title }) => {
    const [commentList, setCommentList] = useState([]);
    const [modal, setModal] = useState({ show: false, type: 'danger', message: '', onConfirm: null });
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const getCommentList = async () => {
        try {
            const { data } = await commentApi.getCommentList(no);
            setCommentList(data);
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
                    const { data: message } = await commentApi.removeComment(commentId);
                    setAlert({ show: true, message, type: "success" });
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({ event: "travel_comment_remove", boardId: no, category, region, title });
                    getCommentList();
                    setCommentFlag?.(prev => !prev);
                } catch (err) {
                    const message = err.response?.data || "오류가 발생했습니다.";
                    setAlert({ show: true, message, type: "danger" });
                }
            }
        });
    };

    const addComment = async ({ rating, comment }) => {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "travel_comment_add", boardId: no, category, region, title });
        const nickname = localStorage.getItem("nickname");
        const payload = { rating, content: comment, nickname, no };
        try {
            const { data: message } = await commentApi.addComment(payload);
            setAlert({ show: true, message, type: "success" });
            getCommentList();
            setCommentFlag?.(prev => !prev);
        } catch (err) {
            const message = err.response?.data || "오류가 발생했습니다.";
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
        if (!no) return;
        getCommentList();
    }, [no]);

    return (
        <div>
            {alert.show && (
                <div className={`alert alert-${alert.type} text-center`} role="alert"
                    style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", minWidth: 220, zIndex: 2000 }}>
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
