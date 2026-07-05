import React, { useEffect, useState } from "react";
import BoardApiClient from "../../service/BoardApiClient";
import { useLocation, useNavigate } from "react-router-dom";
import { Badge } from "react-bootstrap";
import { toast } from "react-toastify";

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


// 공통 리스트 컴포넌트 분리 (UI 재사용)
const BoardList = ({
    title, boards, loading, error,
    categoryColors, regionColors,
    formatDate, onRemove, onClickCard,
}) => (
    <div className="mb-4">
        <h5 className="fw-bold mb-3">{title}</h5>
        {loading ? (
            <div className="text-center py-5 fs-5">
                <div className="spinner-border text-primary me-2" role="status"></div>
                로딩 중...
            </div>
        ) : error ? (
            <div className="text-danger text-center py-5">
                에러 발생: {error.message}
            </div>
        ) : boards.length === 0 ? (
            <div className="text-center text-secondary py-5 fs-5">
                게시글이 없습니다. 검색해주세요.
            </div>
        ) : (
            <div className="d-flex flex-column gap-4">
                {boards.map((board) => (
                    <div
                        key={board.id}
                        className="p-3 rounded-3 border board-list-card"
                        style={{
                            background: "#fff",
                            minHeight: "88px",
                            boxShadow: "0 2px 10px 0 rgba(0,0,0,0.04)",
                            position: "relative"
                        }}
                        tabIndex={0}
                        onClick={() => onClickCard(board)}
                        onKeyDown={e => {
                            if (e.key === "Enter" || e.key === " ") onClickCard(board);
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-start fw-bold" style={{ fontSize: "1.12rem", marginBottom: 6 }}>
                            <div className="text-truncate" style={{ maxWidth: "75%" }}>
                                <span style={{
                                    color: "#222",
                                    fontWeight: "bold",
                                    fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif"
                                }}
                                    title={board.title}>
                                    {board.title}
                                </span>
                            </div>
                            <span className="text-secondary ms-2" style={{ fontSize: "0.95rem", whiteSpace: "nowrap" }}>
                                {formatDate(board.modifiedDate)}
                            </span>
                        </div>
                        <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between" style={{ fontSize: "0.97rem", minHeight: "36px" }}>
                            <div>
                                <Badge bg={categoryColors[board.category]} className="me-1">{board.category}</Badge>
                                <Badge bg={regionColors[board.region]} className="me-2">{board.region}</Badge>
                                <span style={{ color: "#222" }}>by {board.memberNickname}</span>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="badge text-dark d-flex align-items-center" style={{ fontSize: "1rem", fontWeight: 500 }}>
                                    <i className="bi bi-eye me-1" />
                                    {board.viewCount || 0}
                                </span>
                                <span className="badge" style={{ color: "#ffc107", fontSize: "1rem", fontWeight: 500 }}>
                                    <i className="bi bi-star-fill me-1" />
                                    {board.ratingAvg ? board.ratingAvg.toFixed(1) : 0}
                                </span>
                                {/* 삭제 버튼 (onRemove 있으면) */}
                                {onRemove &&
                                    <button className="btn btn-sm btn-outline-danger"
                                        onClick={e => { e.stopPropagation(); onRemove({ no: board.id }); }}>
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
    const [mysqlBoards, setMysqlBoards] = useState([]);
    const [esBoards, setEsBoards] = useState([]);
    const [mysqlLoading, setMysqlLoading] = useState(false);
    const [esLoading, setEsLoading] = useState(false);
    const [mysqlError, setMysqlError] = useState(null);
    const [esError, setEsError] = useState(null);
    const [showConfirm, setShowConfirm] = useState(false);
    const [removeTarget, setRemoveTarget] = useState(null);

    const MYSQL_PAGE_SIZE = 10;
    const ES_PAGE_SIZE = 10;

    const [mysqlPage, setMysqlPage] = useState(0);
    const [esPage, setEsPage] = useState(0);
    const [esDocCount, setEsDocCount] = useState(0);

    const pagedMysqlBoards = mysqlBoards.slice(mysqlPage * MYSQL_PAGE_SIZE, (mysqlPage + 1) * MYSQL_PAGE_SIZE);

    const categoryColors = {
        축제: "danger", 공연: "primary", 행사: "success", 체험: "warning",
        쇼핑: "info", 자연: "success", 역사: "secondary", 가족: "dark", 음식: "warning",
    };
    const regionColors = {
        서울: "primary", 부산: "info", 제주: "success", 강원: "danger", 경기: "info", 기타: "warning",
        대구: "secondary", 인천: "dark", 전남: "secondary"
    };

    // 날짜 포맷
    const formatDate = (isoString) => {
        if (!isoString) return "";
        return isoString.substring(0, 16).replace("T", " ");
    };
    const handleRemove = ({ no }) => {
        console.log(no);
        setRemoveTarget(no);
        setShowConfirm(true);

    }

    const removeBoard = () => {
        try {
            BoardApiClient.removeBoard(removeTarget).then(
                res => {
                    if (res.ok) {
                        toast.success("삭제에 성공했습니다.")
                        getMysqlBoards();
                        getEsBoards();
                    } else {
                        toast.error("삭제에 실패했습니다.")
                    }
                }
            );
        } catch (e) {
            toast.error("서버 에러 발생");
        } finally {
            setShowConfirm(false);
            setRemoveTarget(null);
        }
    };
    const migrateData = () => {
        try {
            BoardApiClient.migrateBoard().then(
                res => {
                    res.ok ? toast.success("동기화에 성공했습니다.") : toast.error("동기화에 실패했습니다.");
                }
            );
        } catch (e) {
            toast.error("서버 에러 발생");
        }
    };

    // MySQL 불러오기
    const getMysqlBoards = async () => {
        setMysqlLoading(true);
        try {
            const res = await BoardApiClient.getBoardList();
            const data = await res.json();
            setMysqlBoards(data);
        } catch (e) {
            setMysqlError(e);
        } finally {
            setMysqlLoading(false);
        }
    };

    // ES 불러오기 (예시)
    const getEsBoards = async (page = 0) => {
        setEsLoading(true);
        try {
            const res = await BoardApiClient.getBoardListBySearch({
                category: "", region: "", keyword: "",
                sort: "id", direction: "asc", page
            });
            const data = await res.json();
            setEsBoards(data.result);
            setEsDocCount(data.docCount);
        } catch (e) {
            setEsError(e);
        } finally {
            setEsLoading(false);
        }
    };

    // 둘 다 불러오기
    useEffect(() => {
        getMysqlBoards();
        getEsBoards(0);
        // eslint-disable-next-line
    }, []);

    // 카드 클릭 시 이동
    const navigate = useNavigate();
    const handleGoDetail = (board) => {
        navigate(`/board/detail?no=${board.id}`);
    };
    const handleMysqlPageChange = (newPage) => setMysqlPage(newPage);
    const handleEsPageChange = (newPage) => {
        setEsPage(newPage);
        getEsBoards(newPage);
    };

    // 레이아웃은 반응형 2열 그리드
    // ...생략(코드는 그대로)
    // 아래는 return문 전체만 교체!

    return (
        <div style={{
            marginTop: 80
        }}>
            {/* 삭제 컨펌 모달 */}
            {showConfirm && (
                <div className="modal show fade d-block" tabIndex={-1}
                    style={{
                        background: 'rgba(22, 22, 37, 0.40)',
                        backdropFilter: "blur(2px)",
                        zIndex: 1050
                    }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content" style={{
                            borderRadius: "1.3rem",
                            boxShadow: "0 6px 32px 0 rgba(80,55,255,0.08)"
                        }}>
                            <div className="modal-header border-0">
                                <h5 className="modal-title text-danger fw-semibold">
                                    <i className="bi bi-trash3 me-2"></i>
                                    게시글 삭제
                                </h5>
                                <button type="button" className="btn-close"
                                    aria-label="닫기"
                                    style={{ filter: "invert(0.5)" }}
                                    onClick={() => setShowConfirm(false)} />
                            </div>
                            <div className="modal-body text-center">
                                <p className="fs-5 mb-3 text-dark">
                                    정말 <span className="fw-bold text-danger">삭제</span>하시겠습니까?
                                </p>
                                <div className="d-flex justify-content-center gap-3 mt-4">
                                    <button className="btn btn-outline-secondary px-4"
                                        onClick={() => setShowConfirm(false)}>
                                        취소
                                    </button>
                                    <button className="btn btn-danger px-4 shadow-sm"
                                        onClick={removeBoard}>
                                        <i className="bi bi-trash3 me-1"></i> 삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container" style={{ maxWidth: 1500, paddingBottom: 40 }}>
                <h2 className="fw-bold">
                    여행지 관리
                </h2>               

                <div className="row g-4">
                    <div className="col-12 col-md-6">
                        <div className="panel-bg p-4 rounded-4 h-100 shadow-sm" style={{
                            background: "rgba(250,251,255,0.97)",
                            minHeight: 540,
                            boxShadow: "0 2px 16px 0 rgba(120,110,255,0.04)"
                        }}>
                            <BoardList
                                title={<span className="text-primary"><i className="bi bi-database me-1"></i>MySQL 게시글</span>}
                                boards={pagedMysqlBoards}
                                loading={mysqlLoading}
                                error={mysqlError}
                                categoryColors={categoryColors}
                                regionColors={regionColors}
                                formatDate={formatDate}
                                onRemove={handleRemove}
                                onClickCard={handleGoDetail}
                            />
                            <Pagination
                                total={mysqlBoards.length}
                                page={mysqlPage}
                                onChange={handleMysqlPageChange}
                                pageSize={MYSQL_PAGE_SIZE}
                            />
                        </div>
                    </div>
                    <div className="col-12 col-md-6">
                        <div className="panel-bg p-4 rounded-4 h-100 shadow-sm" style={{
                            background: "rgba(250,251,255,0.97)",
                            minHeight: 540,
                            boxShadow: "0 2px 16px 0 rgba(120,110,255,0.04)"
                        }}>
                            <BoardList
                                title={<span className="text-info"><i className="bi bi-search me-1"></i>Elasticsearch 게시글</span>}
                                boards={esBoards}
                                loading={esLoading}
                                error={esError}
                                categoryColors={categoryColors}
                                regionColors={regionColors}
                                formatDate={formatDate}
                                onClickCard={handleGoDetail}
                            />
                            <Pagination
                                total={esDocCount}
                                page={esPage}
                                onChange={handleEsPageChange}
                                pageSize={ES_PAGE_SIZE}
                            />
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-end my-3">
                    <button
                        className="btn btn-danger mb-4 px-4 fw-semibold shadow-sm"
                        onClick={migrateData}
                        style={{ borderRadius: "1.4rem" }}>
                        <i className="bi bi-cloud-arrow-up me-2"></i>
                        DB 동기화 (MySQL → ES)
                    </button>
                </div>
            </div>
            <style>
                {`
.board-list-card {
  transition: box-shadow 0.18s, transform 0.16s, background 0.16s, border 0.13s;
  border: 1.5px solid #f0f0f7;
  background: #f9faff;
  border-radius: 1.1rem;
}
.board-list-card:hover, .board-list-card:focus {
  box-shadow: 0 8px 28px 0 rgba(123,82,255,0.16), 0 2px 16px rgba(60,0,128,0.04);
  border-color: #a084ee;
  background: #f6f3ff;
  transform: translateY(-2px) scale(1.012);
  cursor: pointer;
}
.board-list-card .btn-outline-danger {
  border-radius: 1.2rem;
  padding: 2px 18px 2px 16px;
  font-size: 0.97rem;
  transition: background 0.14s, color 0.14s;
}
.board-list-card .btn-outline-danger:hover {
  background: #ffe8ea;
  color: #d00;
  border-color: #ffbfc3;
}
.board-list-card .badge {
  letter-spacing: -0.2px;
  font-size: 0.96em;
}
.board-list-card .badge.text-dark {
  background: #e9f0ff;
}
            `}
            </style>
        </div>
    );

};

export default AdmnBoard;
