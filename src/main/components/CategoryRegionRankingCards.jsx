import React from 'react';
import MainPageCard from './MainPageCard/MainPageCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const cardHeight = 200;

const CategoryRegionRankingCards = ({ top5Data }) => {
    // 데이터가 아직 없으면 로딩 애니메이션
    if (!top5Data || top5Data.length === 0) {
        return <LoadingSpinner text="순위 데이터를 불러오는 중..." minHeight={cardHeight + 80} />;
    }

    // 데이터 있는 만큼 카드 렌더링
    return (
        <div className="mainpage-ranking-cards-row">
            {top5Data.map((data, idx) => (
                <div key={idx}>
                    <div className="mainpage-ranking-cards-card">
                        <MainPageCard
                            variant="category"
                            data={data.region || data.category}
                            type={data.region ? "region" : "category"}
                            rank={idx + 1}
                        />
                    </div>
                    <div className="mainpage-ranking-cards-badge">
                        <span>
                            Score: {data.score}
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CategoryRegionRankingCards;
