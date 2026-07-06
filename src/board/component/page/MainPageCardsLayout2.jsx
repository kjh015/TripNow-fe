import React from 'react';
import MainPageCard from './MainPageCard/MainPageCard';
import LoadingSpinner from '../../../components/LoadingSpinner';

const cardHeight = 200;

const MainPageCardsLayout2 = ({ top5Data }) => {
    // 데이터 없거나 5개 미만이면 로딩 애니메이션
    if (!top5Data || top5Data.length < 5) {
        return <LoadingSpinner text="순위 데이터를 불러오는 중..." minHeight={cardHeight + 80} />;
    }

    // 데이터 있을 때 카드 렌더링
    return (
        <div className="d-flex justify-content-center align-items-center mainpage-layout2-row">
            {top5Data.map((data, idx) => (
                <div key={idx}>
                    <div className="mainpage-layout2-card">
                        <MainPageCard
                            variant="category"
                            data={data.region || data.category}
                            type={data.region ? "region" : "category"}
                            rank={idx + 1}
                        />
                    </div>
                    <div className="mainpage-layout2-badge">
                        <span>
                            Score: {data.score}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MainPageCardsLayout2;
