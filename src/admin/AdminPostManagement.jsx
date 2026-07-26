import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import {
    getAdminPosts, getAdminPost, deleteAdminPost, restoreAdminPost, permanentDeleteAdminPost,
    getAdminComments, deleteAdminComment, restoreAdminComment,
} from "../api/adminPostApi";
import { CATEGORY_CODE_TO_LABEL, REGION_CODE_TO_LABEL } from "../constants/categoryRegion";
import { categoryColors, regionColors } from "../constants/colorMaps";
import { formatDate } from "../utils/dateUtils";
import AdminPageHeader from "./AdminPageHeader";

const PAGE_SIZE = 10;
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || "";

const DELETED_FILTERS = [
    { key: "all", label: "전체", deleted: undefined },
    { key: "active", label: "활성", deleted: false },
    { key: "deleted", label: "삭제됨", deleted: true },
];

const Pagination = ({ total, page, onChange, pageSize = PAGE_SIZE }) => {
    const pageCount = Math.ceil(total / pageSize);
    if (pageCount <= 1) return null;
    const pages = Array.from({ length: pageCount }, (_, idx) => idx);
    return (
        <nav className="d-flex justify-content-center my-3">
            <ul className="pagination mb-0">
                <li className={`page-item${page === 0 ? ' disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page - 1)} disabled={page === 0}>이전</button>
                </li>
                {pages.map((p) => (
                    <li key={p} className={`page-item${page === p ? ' active' : ''}`}>
                        <button className="page-link" onClick={() => onChange(p)}>{p + 1}</button>
                    </li>
                ))}
                <li className={`page-item${page === pageCount - 1 ? ' disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page + 1)} disabled={page === pageCount - 1}>다음</button>
                </li>
            </ul>
        </nav>
    );
};

Pagination.propTypes = {
    total: PropTypes.number.isRequired,
    page: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
    pageSize: PropTypes.number,
};

const StatusBadge = ({ isDeleted }) => (
    isDeleted ? <Badge bg="danger">삭제됨</Badge> : <Badge bg="success">활성</Badge>
);

StatusBadge.propTypes = {
    isDeleted: PropTypes.bool,
};

const AdminPostManagement = () => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filterKey, setFilterKey] = useState("all");
    const [page, setPage] = useState(0);

    // { type: 'delete' | 'permanent', post }
    const [confirm, setConfirm] = useState(null);
    // { loading, data }
    const [detail, setDetail] = useState(null);
    // { post, page, list, totalElements, loading }
    const [comments, setComments] = useState(null);

    const loadPosts = async (filterArg, pageArg) => {
        setLoading(true);
        setError(null);
        try {
            const { deleted } = DELETED_FILTERS.find((f) => f.key === filterArg);
            const { data } = await getAdminPosts({ deleted, page: pageArg, size: PAGE_SIZE });
            const { content, totalElements: total } = data.result;
            if (content.length === 0 && pageArg > 0) {
                // 삭제/복구로 마지막 페이지가 비면 이전 페이지로 이동 (effect가 재조회)
                setPage(pageArg - 1);
                return;
            }
            setPosts(content);
            setTotalElements(total);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPosts(filterKey, page);
    }, [filterKey, page]);

    const handleFilterChange = (key) => {
        setFilterKey(key);
        setPage(0);
    };

    const openDetail = async (postId) => {
        setDetail({ loading: true, data: null });
        try {
            const { data } = await getAdminPost(postId);
            setDetail({ loading: false, data: data.result });
        } catch {
            toast.error("게시글 상세 조회에 실패했습니다.");
            setDetail(null);
        }
    };

    const restorePost = async (postId) => {
        try {
            await restoreAdminPost(postId);
            toast.success("게시글을 복구했습니다.");
            loadPosts(filterKey, page);
        } catch {
            toast.error("게시글 복구에 실패했습니다.");
        }
    };

    const runConfirmAction = async () => {
        const { type, post } = confirm;
        try {
            if (type === "permanent") {
                await permanentDeleteAdminPost(post.postId);
                toast.success("게시글을 영구 삭제했습니다.");
            } else {
                await deleteAdminPost(post.postId);
                toast.success("게시글을 삭제했습니다.");
            }
            loadPosts(filterKey, page);
        } catch {
            toast.error(type === "permanent" ? "영구 삭제에 실패했습니다." : "삭제에 실패했습니다.");
        } finally {
            setConfirm(null);
        }
    };

    const loadComments = async (post, pageArg) => {
        setComments((prev) => ({
            post,
            page: pageArg,
            list: prev?.post?.postId === post.postId ? prev.list : [],
            totalElements: prev?.post?.postId === post.postId ? prev.totalElements : 0,
            loading: true,
        }));
        try {
            const { data } = await getAdminComments({ postId: post.postId, page: pageArg, size: PAGE_SIZE });
            setComments({
                post,
                page: pageArg,
                list: data.result.content,
                totalElements: data.result.totalElements,
                loading: false,
            });
        } catch {
            toast.error("댓글 조회에 실패했습니다.");
            setComments(null);
        }
    };

    const removeComment = async (commentId) => {
        try {
            await deleteAdminComment(commentId);
            toast.success("댓글을 삭제했습니다.");
            loadComments(comments.post, comments.page);
        } catch {
            toast.error("댓글 삭제에 실패했습니다.");
        }
    };

    const restoreComment = async (commentId) => {
        try {
            await restoreAdminComment(commentId);
            toast.success("댓글을 복구했습니다.");
            loadComments(comments.post, comments.page);
        } catch {
            toast.error("댓글 복구에 실패했습니다.");
        }
    };

    const renderConfirmModal = () => {
        const isPermanent = confirm.type === "permanent";
        return (
            <div className="modal show fade d-block admin-modal-backdrop" tabIndex={-1}>
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content admin-modal-content">
                        <div className="modal-header border-0">
                            <h5 className="modal-title text-danger fw-semibold">
                                <i className="bi bi-trash3 me-2"></i>{isPermanent ? "게시글 영구 삭제" : "게시글 삭제"}
                            </h5>
                            <button type="button" className="btn-close admin-modal-close-icon" aria-label="닫기"
                                onClick={() => setConfirm(null)} />
                        </div>
                        <div className="modal-body text-center">
                            <p className="fs-6 mb-1 text-secondary text-truncate" title={confirm.post.title}>{confirm.post.title}</p>
                            {isPermanent ? (
                                <p className="fs-5 mb-3 text-dark">
                                    DB와 이미지(S3)에서 완전히 제거되며 <span className="fw-bold text-danger">복구할 수 없습니다</span>.<br />
                                    정말 <span className="fw-bold text-danger">영구 삭제</span>하시겠습니까?
                                </p>
                            ) : (
                                <p className="fs-5 mb-3 text-dark">정말 <span className="fw-bold text-danger">삭제</span>하시겠습니까?</p>
                            )}
                            <div className="d-flex justify-content-center gap-3 mt-4">
                                <button className="btn admin-btn admin-btn-outline px-4" onClick={() => setConfirm(null)}>취소</button>
                                <button className="btn admin-btn admin-btn-danger px-4" onClick={runConfirmAction}>
                                    <i className="bi bi-trash3 me-1"></i> {isPermanent ? "영구 삭제" : "삭제"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderDetailModal = () => {
        const post = detail.data;
        return (
            <div className="modal show fade d-block admin-modal-backdrop" tabIndex={-1}>
                <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                    <div className="modal-content admin-modal-content">
                        <div className="modal-header border-0">
                            <h5 className="modal-title admin-detail-title d-flex align-items-center gap-2">
                                <i className="bi bi-file-text me-1"></i>게시글 상세
                                {post && <StatusBadge isDeleted={post.isDeleted} />}
                            </h5>
                            <button type="button" className="btn-close admin-modal-close-icon" aria-label="닫기"
                                onClick={() => setDetail(null)} />
                        </div>
                        <div className="modal-body">
                            {detail.loading || !post ? (
                                <div className="text-center py-5 fs-5">
                                    <div className="spinner-border text-primary me-2" role="status"></div>로딩 중...
                                </div>
                            ) : (
                                <>
                                    <div className="d-flex align-items-center flex-wrap gap-2 mb-2">
                                        <Badge bg={categoryColors[CATEGORY_CODE_TO_LABEL[post.category]] ?? "secondary"}>
                                            {CATEGORY_CODE_TO_LABEL[post.category] ?? post.category}
                                        </Badge>
                                        <Badge bg={regionColors[REGION_CODE_TO_LABEL[post.region]] ?? "secondary"}>
                                            {REGION_CODE_TO_LABEL[post.region] ?? post.region}
                                        </Badge>
                                        <span className="fw-bold fs-5">{post.title}</span>
                                    </div>
                                    <div className="text-secondary small mb-3">
                                        <div><i className="bi bi-geo-alt me-1"></i>{post.travelPlace}{post.address ? ` · ${post.address}` : ""}</div>
                                        <div>
                                            작성자 ID {post.memberId} · 작성 {formatDate(post.createdAt)}
                                            {post.updatedAt && ` · 수정 ${formatDate(post.updatedAt)}`}
                                            {post.isDeleted && post.deletedAt && ` · 삭제 ${formatDate(post.deletedAt)}`}
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center gap-3 mb-3 text-secondary">
                                        <span><i className="bi bi-eye me-1"></i>{post.viewCount ?? 0}</span>
                                        <span><i className="bi bi-chat-dots me-1"></i>{post.commentCount ?? 0}</span>
                                        <span><i className="bi bi-heart me-1"></i>{post.likeCount ?? 0}</span>
                                        <span><i className="bi bi-star-fill me-1"></i>{post.starAvg ? post.starAvg.toFixed(1) : 0}</span>
                                    </div>
                                    <div className="admin-section-box p-3 admin-post-detail-content">{post.content}</div>
                                    {post.images?.length > 0 && (
                                        <div className="d-flex flex-wrap gap-2 mt-3">
                                            {post.images.map((imageKey) => (
                                                <img key={imageKey} src={`${IMAGE_BASE_URL}/${imageKey}`}
                                                    alt="게시글 이미지" className="admin-post-detail-thumb" />
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div className="modal-footer border-0">
                            {post && !post.isDeleted && (
                                <button className="btn admin-btn admin-btn-primary admin-btn-sm"
                                    onClick={() => navigate(`/post/detail?postId=${post.postId}`)}>
                                    <i className="bi bi-box-arrow-up-right me-1"></i>게시글 페이지로 이동
                                </button>
                            )}
                            <button className="btn admin-btn admin-btn-outline admin-btn-sm" onClick={() => setDetail(null)}>닫기</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderCommentsModal = () => (
        <div className="modal show fade d-block admin-modal-backdrop" tabIndex={-1}>
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content admin-modal-content">
                    <div className="modal-header border-0">
                        <h5 className="modal-title admin-detail-title text-truncate">
                            <i className="bi bi-chat-dots me-2"></i>댓글 관리 — {comments.post.title}
                        </h5>
                        <button type="button" className="btn-close admin-modal-close-icon" aria-label="닫기"
                            onClick={() => setComments(null)} />
                    </div>
                    <div className="modal-body">
                        {comments.loading ? (
                            <div className="text-center py-5 fs-5">
                                <div className="spinner-border text-primary me-2" role="status"></div>로딩 중...
                            </div>
                        ) : comments.list.length === 0 ? (
                            <div className="text-center text-secondary py-5">댓글이 없습니다.</div>
                        ) : (
                            <div className="table-responsive">
                                <table className="table admin-table align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>작성자</th>
                                            <th>내용</th>
                                            <th className="text-center">평점</th>
                                            <th>작성일</th>
                                            <th>상태</th>
                                            <th className="text-center">관리</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {comments.list.map((comment) => (
                                            <tr key={comment.commentId}>
                                                <td>{comment.commentId}</td>
                                                <td>{comment.memberId}</td>
                                                <td className="admin-comment-content" title={comment.content}>{comment.content}</td>
                                                <td className="text-center">
                                                    <i className="bi bi-star-fill text-warning me-1"></i>{comment.star ?? 0}
                                                </td>
                                                <td>{formatDate(comment.createdAt)}</td>
                                                <td><StatusBadge isDeleted={comment.isDeleted} /></td>
                                                <td className="text-center">
                                                    {comment.isDeleted ? (
                                                        <button className="btn admin-btn-icon admin-btn-outline" title="댓글 복구"
                                                            onClick={() => restoreComment(comment.commentId)}>
                                                            <i className="bi bi-arrow-counterclockwise"></i>
                                                        </button>
                                                    ) : (
                                                        <button className="btn admin-btn-icon admin-btn-danger" title="댓글 삭제"
                                                            onClick={() => removeComment(comment.commentId)}>
                                                            <i className="bi bi-trash3"></i>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                        <Pagination total={comments.totalElements} page={comments.page}
                            onChange={(p) => loadComments(comments.post, p)} />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="admin-page-spacer">
            {confirm && renderConfirmModal()}
            {detail && renderDetailModal()}
            {comments && renderCommentsModal()}
            <div className="container admin-post-container">
                <AdminPageHeader title="여행지 관리" />
                <div className="d-flex align-items-center gap-2 mb-3">
                    {DELETED_FILTERS.map((f) => (
                        <button key={f.key}
                            className={`btn admin-btn admin-btn-sm ${filterKey === f.key ? "admin-btn-primary" : "admin-btn-outline"}`}
                            onClick={() => handleFilterChange(f.key)}>
                            {f.label}
                        </button>
                    ))}
                    <span className="ms-auto text-secondary small">총 {totalElements}건</span>
                </div>
                <div className="admin-table-card">
                    <div className="table-responsive">
                        <table className="table admin-table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>제목</th>
                                    <th>작성자</th>
                                    <th className="text-center">조회</th>
                                    <th className="text-center">댓글</th>
                                    <th className="text-center">좋아요</th>
                                    <th className="text-center">평점</th>
                                    <th>작성일</th>
                                    <th>상태</th>
                                    <th className="text-center">관리</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={10} className="text-center py-5">
                                            <div className="spinner-border text-primary me-2" role="status"></div>로딩 중...
                                        </td>
                                    </tr>
                                ) : error ? (
                                    <tr>
                                        <td colSpan={10} className="text-center text-danger py-5">에러 발생: {error.message}</td>
                                    </tr>
                                ) : posts.length === 0 ? (
                                    <tr>
                                        <td colSpan={10} className="text-center text-secondary py-5">게시글이 없습니다.</td>
                                    </tr>
                                ) : (
                                    posts.map((post) => (
                                        <tr key={post.postId}>
                                            <td>{post.postId}</td>
                                            <td>
                                                <button className="admin-post-title-btn text-truncate" title={post.title}
                                                    onClick={() => openDetail(post.postId)}>
                                                    {post.title}
                                                </button>
                                            </td>
                                            <td>{post.memberId}</td>
                                            <td className="text-center">{post.viewCount ?? 0}</td>
                                            <td className="text-center">{post.commentCount ?? 0}</td>
                                            <td className="text-center">{post.likeCount ?? 0}</td>
                                            <td className="text-center">
                                                <i className="bi bi-star-fill text-warning me-1"></i>{post.starAvg ? post.starAvg.toFixed(1) : 0}
                                            </td>
                                            <td>{formatDate(post.createdAt)}</td>
                                            <td>
                                                <StatusBadge isDeleted={post.isDeleted} />
                                                {post.isDeleted && post.deletedAt && (
                                                    <div className="text-secondary small">{formatDate(post.deletedAt)}</div>
                                                )}
                                            </td>
                                            <td className="text-center">
                                                <div className="d-inline-flex gap-1">
                                                    <button className="btn admin-btn-icon admin-btn-outline" title="댓글 관리"
                                                        onClick={() => loadComments(post, 0)}>
                                                        <i className="bi bi-chat-dots"></i>
                                                    </button>
                                                    {post.isDeleted ? (
                                                        <>
                                                            <button className="btn admin-btn-icon admin-btn-outline" title="복구"
                                                                onClick={() => restorePost(post.postId)}>
                                                                <i className="bi bi-arrow-counterclockwise"></i>
                                                            </button>
                                                            <button className="btn admin-btn-icon admin-btn-danger" title="영구 삭제"
                                                                onClick={() => setConfirm({ type: "permanent", post })}>
                                                                <i className="bi bi-trash3-fill"></i>
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <button className="btn admin-btn-icon admin-btn-danger" title="삭제"
                                                            onClick={() => setConfirm({ type: "delete", post })}>
                                                            <i className="bi bi-trash3"></i>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <Pagination total={totalElements} page={page} onChange={setPage} />
            </div>
        </div>
    );
};

export default AdminPostManagement;
