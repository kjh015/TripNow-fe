import React, { useEffect, useState } from "react";
import { getPostListBySearch } from "../../../api/postSearchApi";
import { deletePost } from "../../../api/postApi";
import { useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { toast } from "react-toastify";
import { CATEGORY_CODE_TO_LABEL, REGION_CODE_TO_LABEL } from "../../../constants/categoryRegion";
import { formatDate } from "../../../utils/dateUtils";
import AdminPageHeader from "../../../common/AdminPageHeader";

const Pagination = ({ total, page, onChange, pageSize = 10 }) => {
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

const BoardList = ({ title, boards, loading, error, categoryColors, regionColors, formatDate, onRemove, onClickCard }) => (
    <div className="mb-4">
        <h5 className="fw-bold mb-3">{title}</h5>
        {loading ? (
            <div className="text-center py-5 fs-5">
                <div className="spinner-border text-primary me-2" role="status"></div>로딩 중...
            </div>
        ) : error ? (
            <div className="text-danger text-center py-5">에러 발생: {error.message}</div>
        ) : boards.length === 0 ? (
            <div className="text-center text-secondary py-5 fs-5">게시글이 없습니다. 검색해주세요.</div>
        ) : (
            <div className="d-flex flex-column gap-4">
                {boards.map((board) => (
                    <div
                        key={board.postId}
                        className="p-3 rounded-3 border board-list-card"
                        tabIndex={0}
                        onClick={() => onClickCard(board)}
                        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") onClickCard(board); }}
                    >
                        <div className="d-flex justify-content-between align-items-start fw-bold board-list-card-title-row">
                            <div className="text-truncate board-list-card-title">
                                <span className="board-list-card-title-text" title={board.title}>
                                    {board.title}
                                </span>
                            </div>
                            <span className="text-secondary ms-2 board-list-card-date">
                                {formatDate(board.updatedAt)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between board-list-card-meta">
                            <div>
                                <Badge bg={categoryColors[CATEGORY_CODE_TO_LABEL[board.category] ?? board.category]} className="me-1">{CATEGORY_CODE_TO_LABEL[board.category] ?? board.category}</Badge>
                                <Badge bg={regionColors[REGION_CODE_TO_LABEL[board.region] ?? board.region]} className="me-2">{REGION_CODE_TO_LABEL[board.region] ?? board.region}</Badge>
                                <span className="board-list-card-author">by {board.memberNickname}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="badge text-dark d-flex align-items-center board-list-card-stat">
                                    <i className="bi bi-eye me-1" />{board.viewCount || 0}
                                </span>
                                <span className="badge board-list-card-star">
                                    <i className="bi bi-star-fill me-1" />{board.starAvg ? board.starAvg.toFixed(1) : 0}
                                </span>
                                {onRemove &&
                                    <button className="btn btn-sm btn-outline-danger"
                                        onClick={e => { e.stopPropagation(); onRemove({ no: board.postId }); }}>
                                        삭제
                                    </button>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        )}
    </div>
);

const AdmnBoard = () => {
    const [esBoards, setEsBoards] = useState([]);
    const [esLoading, setEsLoading] = useState(false);
    const [esError, setEsError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [removeTarget, setRemoveTarget] = useState(null);

    const ES_PAGE_SIZE = 10;
    const [esPage, setEsPage] = useState(0);
    const [esDocCount, setEsDocCount] = useState(0);

    const categoryColors = {
        축제: "danger", 공연: "primary", 행사: "success", 체험: "warning",
        쇼핑: "info", 자연: "success", 역사: "secondary", 가족: "dark", 음식: "warning",
    };
    const regionColors = {
        서울: "primary", 부산: "info", 제주: "success", 강원: "danger", 경기: "info", 기타: "warning",
        대구: "secondary", 인천: "dark", 전남: "secondary"
    };

    const handleRemove = ({ no }) => {
        setRemoveTarget(no);
        setShowConfirm(true);
    };

    const removeBoard = async () => {
        try {
            await deletePost(removeTarget);
            toast.success("삭제에 성공했습니다.");
            getEsBoards();
        } catch {
            toast.error("삭제에 실패했습니다.");
        } finally {
            setShowConfirm(false);
            setRemoveTarget(null);
        }
    };

    const getEsBoards = async (page = 0) => {
        setEsLoading(true);
        try {
            const { data } = await getPostListBySearch({ category: "", region: "", keyword: "", sort: "id", direction: "asc", page });
            setEsBoards(data.result.content);
            setEsDocCount(data.result.totalElements);
        } catch (e) {
            setEsError(e);
        } finally {
            setEsLoading(false);
        }
    };

    useEffect(() => {
        getEsBoards(0);
    }, []);

    const navigate = useNavigate();
    const handleGoDetail = (board) => navigate(`/post/detail?no=${board.postId}`);

    const handleEsPageChange = (newPage) => {
        setEsPage(newPage);
        getEsBoards(newPage);
    };

    return (
        <div className="admin-page-spacer">
            {showConfirm && (
                <div className="modal show fade d-block admin-modal-backdrop" tabIndex={-1}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content admin-modal-content">
                            <div className="modal-header border-0">
                                <h5 className="modal-title text-danger fw-semibold">
                                    <i className="bi bi-trash3 me-2"></i>게시글 삭제
                                </h5>
                                <button type="button" className="btn-close admin-modal-close-icon" aria-label="닫기"
                                    onClick={() => setShowConfirm(false)} />
                            </div>
                            <div className="modal-body text-center">
                                <p className="fs-5 mb-3 text-dark">정말 <span className="fw-bold text-danger">삭제</span>하시겠습니까?</p>
                                <div className="d-flex justify-content-center gap-3 mt-4">
                                    <button className="btn btn-outline-secondary px-4" onClick={() => setShowConfirm(false)}>취소</button>
                                    <button className="btn btn-danger px-4 shadow-sm" onClick={removeBoard}>
                                        <i className="bi bi-trash3 me-1"></i> 삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="container admin-board-container">
                <AdminPageHeader title="여행지 관리" />
                <div className="row g-4">
                    <div className="col-12">
                        <div className="panel-bg p-4 rounded-4 h-100 shadow-sm admin-board-panel">
                            <BoardList
                                title={<span className="text-info"><i className="bi bi-search me-1"></i>게시글 목록</span>}
                                boards={esBoards} loading={esLoading} error={esError}
                                categoryColors={categoryColors} regionColors={regionColors}
                                formatDate={formatDate} onRemove={handleRemove} onClickCard={handleGoDetail}
                            />
                            <Pagination total={esDocCount} page={esPage} onChange={handleEsPageChange} pageSize={ES_PAGE_SIZE} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdmnBoard;
