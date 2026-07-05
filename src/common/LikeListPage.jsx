import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getMyLikes } from '../api/likeApi';

import LoadingSpinner from "../components/LoadingSpinner";
import useAlert from "../hooks/useAlert";
import PostListCard from "../post/components/PostListCard";

const LikeListPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const nickname = localStorage.getItem("nickname");
    const { alert, showAlert } = useAlert();
    const navigate = useNavigate();
    const isLoggedIn = !!localStorage.getItem('accessToken');

    useEffect(() => {
        getFavoriteList();
    }, []);

    const goToWrite = () => {
        if (isLoggedIn) {
            navigate("/post/write");
        } else {
            showAlert("로그인 필요", "danger");
        }
    };

    const getFavoriteList = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getMyLikes();
            setPosts(data.result.content);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-light min-vh-100 py-4" style={{ overflowX: "hidden" }}>
            <div className="container py-3" style={{ maxWidth: 850 }}>
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-1"
                            style={{ color: "#6c45e0", fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif", fontSize: "2rem" }}>
                            찜 목록
                        </h3>
                    </div>
                </div>
                {loading ? (
                    <LoadingSpinner minHeight={140} />
                ) : error ? (
                    <div className="text-danger text-center py-5">에러 발생: {error.message}</div>
                ) : posts.length === 0 ? (
                    <div className="text-center text-secondary py-5 fs-5">게시글이 없습니다.</div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {posts.map((post) => (
                            <PostListCard key={post.postId} post={post} />
                        ))}
                    </div>
                )}
            </div>
            <style>
                {`
.post-list-card {
  transition: box-shadow 0.18s, transform 0.16s, background 0.16s, border 0.13s;
}
.post-list-card:hover, .post-list-card:focus {
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

export default LikeListPage;
