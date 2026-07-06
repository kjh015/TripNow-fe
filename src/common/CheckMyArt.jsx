import React, { useEffect, useState } from "react";

import { getMyPosts } from '../api/postSearchApi';

import LoadingSpinner from "../components/LoadingSpinner";
import useAlert from "../hooks/useAlert";
import PostListCard from "../post/components/PostListCard";

const CheckMyArt = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const nickname = localStorage.getItem("nickname");
    const { alert, showAlert } = useAlert();

    const getMyPostList = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await getMyPosts();
            setPosts(data.result.content);
        } catch (e) {
            setError(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getMyPostList();
    }, []);

    return (
        <div className="min-vh-100 py-4 mypage-list-page">
            <div className="container py-3 mypage-list-container">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                        <h3 className="fw-bold mb-1 page-title">
                            나의 여행지 목록
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
        </div>
    );
};

export default CheckMyArt;
