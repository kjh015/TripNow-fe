import React from 'react';
import MainPageCard from './MainPageCard/MainPageCard';
import { AnimatePresence, motion } from 'framer-motion';
import LoadingSpinner from '../../../components/LoadingSpinner';



const mainCardHeight = 520;

/**
 * 인기 게시판 카드 레이아웃
 * - 데이터가 5개 미만이면 비행기 로딩 애니메이션 표시
 * - 5개 이상이면 1~5위 카드 정렬
 */
const MainPageCardsLayout = ({ top5Posts }) => {
    // 데이터가 5개 미만이면 로딩 화면
    if (!top5Posts || top5Posts.length < 5) {
        return <LoadingSpinner text="여행지 인기순위를 불러오는 중..." minHeight={mainCardHeight} />;
    }

    // 데이터 있을 때 카드 레이아웃 렌더링
    return (
        <div className="d-flex justify-content-center align-items-stretch mainpage-layout-row">
            {/* 왼쪽 큰 카드 (1위) */}
            <div className="mainpage-layout-primary">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={top5Posts[0].postId}
                        initial={{ opacity: 0, scale: 0.95, y: 25 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.93, y: -18 }}
                        transition={{ type: "spring", stiffness: 360, damping: 30 }}
                        className="mainpage-layout-primary-motion"
                    >
                        <AnimatePresence mode="wait">
                            <div className="main-rank-crown">
                                <motion.div
                                    key={top5Posts[0].postId}
                                    initial={{ opacity: 0.6, scale: 1.1, boxShadow: "0 0 14px 8px #ffd70044" }}
                                    animate={{
                                        opacity: 1,
                                        scale: [1, 1.13, 1, 1.13, 1],
                                        boxShadow: [
                                            "0 0 12px 8px #ffd70033",       // 시작: 옅은 glow
                                            "0 0 32px 14px #ffd700bb",      // 첫 번째 반짝
                                            "0 0 12px 8px #ffd70055",       // 돌아옴
                                            "0 0 32px 14px #ffd700bb",      // 두 번째 반짝
                                            "0 0 10px 5px #ffd70077"         // 마지막: 노란 glow 남김!
                                        ]
                                    }}
                                    exit={{ opacity: 0, scale: 0.9, boxShadow: "0 0 0 0 #ffd70000" }}
                                    transition={{
                                        duration: 3.0, // 전체 애니메이션 시간 더 길게!
                                        times: [0, 0.19, 0.5, 0.81, 1], // keyframes 간 타이밍
                                        ease: "easeInOut",
                                        exit: { duration: 1.5, ease: "easeInOut" }
                                    }}
                                    className="mainpage-layout-crown-glow"
                                >
                                    <span role="img" aria-label="king-crown">
                                        👑
                                    </span>
                                </motion.div>
                            </div>
                        </AnimatePresence>


                        {/* 카드 본문 */}
                        <MainPageCard variant="primary" postId={top5Posts[0].postId} score={top5Posts[0].score} rank={1} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* 오른쪽 2~5위 카드 */}
            <div className="mainpage-layout-secondary">
                {top5Posts.slice(1, 5).map((board, idx) => (
                    <motion.div
                        key={board.postId}
                        layout
                        className="mainpage-layout-secondary-item"
                        transition={{ type: "spring", stiffness: 350, damping: 34 }}
                    >
                        <MainPageCard variant="secondary" postId={board.postId} score={board.score} rank={idx + 2} />
                    </motion.div>
                ))}

            </div>
        </div>
    );
};

export default MainPageCardsLayout;
