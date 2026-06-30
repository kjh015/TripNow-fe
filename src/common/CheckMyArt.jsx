import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import CommonApiClient from './service/CommonApiClient';

import LoadingSpinner from "../components/LoadingSpinner";
import useAlert from "../hooks/useAlert";
import PostListCard from "../post/components/PostListCard";

const CheckMyArt = () => {
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const nickname = localStorage.getItem("nickname");
    const { alert, showAlert } = useAlert();



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
                    <LoadingSpinner minHeight={140} />
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
                        {boards.map((board) => (
                            <PostListCard key={board.id} post={board} />
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
