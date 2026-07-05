import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

import CommonApiClient from './service/CommonApiClient';

import { Badge } from "react-bootstrap";
import { FaMapMarkedAlt } from "react-icons/fa";

const CheckMyArt = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const nickname = localStorage.getItem("nickname");
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('accessToken');

    const categoryColors = {
        축제: "danger", 공연: "primary", 행사: "success", 체험: "warning",
        쇼핑: "info", 자연: "success", 역사: "secondary", 가족: "dark", 음식: "warning",
    };
    const regionColors = {
        서울: "primary", 부산: "info", 제주: "success", 강원: "danger", 경기: "info", 기타: "warning",
        대구: "secondary", 인천: "dark", 전남: "secondary"
    };



    const getMyBoardList = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await CommonApiClient.getMyBoard(nickname);
            if (res.ok) {
                const data = await res.json();
                setBoards(data);
            } else {
                setError(new Error("서버 응답 에러"));
            }
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getMyBoardList();
    }, []);



    const formatDate = (isoString) => {
        if (!isoString) return "";
        return isoString.substring(0, 16).replace("T", " ");
    };

    return (
        <div
            className="bg-light min-vh-100 py-4"
            style={{ overflowX: "hidden" }}
        >


            <div className="container py-3" style={{ maxWidth: 850 }}>
                {/* 헤더, 정렬, 글쓰기 */}
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-1"
                            style={{
                                color: "#6c45e0",
                                fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif",
                                fontSize: "2rem"
                            }}>
                            나의 여행지 목록
                        </h3>

                    </div>
                </div>

                {/* 카드 리스트 */}
                {loading ? (
                    <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: 140 }}>
                        {/* 아이콘 + 스피너 */}
                        <div className="mb-3" style={{ position: "relative", width: 100, height: 100 }}>
                            <FaMapMarkedAlt size={70} color="#6cb4f8" style={{ filter: "drop-shadow(0 4px 12px #aee7ff77)" }} />
                            <div
                                className="spinner-border"
                                style={{
                                    position: "absolute",
                                    top: -10,
                                    left: -15,
                                    width: 100,
                                    height: 100,
                                    borderWidth: "6px",
                                    opacity: 0.5,
                                    color: "#6cb4f8"
                                }}
                                role="status"
                            />
                        </div>
                        <div className="mt-2 fs-5 text-secondary">
                            데이터를 불러오는 중...
                        </div>
                    </div>
                ) : error ? (
                    <div className="text-danger text-center py-5">
                        에러 발생: {error.message}
                    </div>
                ) : boards.length === 0 ? (
                    <div className="text-center text-secondary py-5 fs-5">
                        게시글이 없습니다.
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {boards.map((board, idx) => (
                            <div
                                key={board.id}
                                className="p-3 rounded-3 border board-list-card"
                                style={{
                                    background: "#fff",
                                    minHeight: "88px",
                                    boxShadow: "0 2px 10px 0 rgba(0,0,0,0.04)",
                                    position: "relative"
                                }}
                                onClick={() => navigate(`/board/detail?no=${board.id}`)}
                                tabIndex={0}
                                onKeyDown={e => {
                                    if (e.key === "Enter" || e.key === " ") {
                                        navigate(`/board/detail?no=${board.id}`);
                                    }
                                }}
                            >
                                {/* 제목 + 날짜 우측 상단 */}
                                <div
                                    className="d-flex justify-content-between align-items-start fw-bold"
                                    style={{
                                        fontSize: "1.12rem",
                                        marginBottom: 6
                                    }}
                                >
                                    <div
                                        className="text-truncate"
                                        style={{
                                            maxWidth: "75%",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: "#222",
                                                fontWeight: "bold",
                                                fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif"
                                            }}
                                            title={board.title}
                                        >
                                            {board.title}
                                        </span>
                                    </div>
                                    <span className="text-secondary ms-2" style={{ fontSize: "0.95rem", whiteSpace: "nowrap" }}>
                                        {formatDate(board.modifiedDate)}
                                    </span>
                                </div>

                                <div className="d-flex align-items-center flex-wrap gap-2 justify-content-between" style={{ fontSize: "0.97rem" }}>
                                    <div>
                                        <Badge bg={categoryColors[board.category]} className="me-1">{board.category}</Badge>
                                        <Badge bg={regionColors[board.region]} className="me-2">{board.region}</Badge>
                                        <span style={{ color: "#222" }}>by {board.memberNickname}</span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="badge text-dark d-flex align-items-center" style={{ fontSize: "1rem", fontWeight: 500 }}>
                                            <i className="bi bi-eye me-1" />
                                            {board.viewCount}
                                        </span>
                                        <span className="badge" style={{ color: "#ffc107", fontSize: "1rem", fontWeight: 500 }}>
                                            <i className="bi bi-star-fill me-1" />
                                            {board.ratingAvg ? board.ratingAvg.toFixed(1) : 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <style>
                {`
.board-list-card {
  transition: box-shadow 0.18s, transform 0.16s, background 0.16s, border 0.13s;
}
.board-list-card:hover, .board-list-card:focus {
  box-shadow: 0 6px 24px 0 rgba(123,82,255,0.14), 0 1.5px 10px rgba(60,0,128,0.04);
  border-color: #a084ee;
  background: #faf8ff;
  transform: translateY(-2px) scale(1.012);
  cursor: pointer;
}
        `}
            </style>
        </div>
    );
};

export default CheckMyArt;
