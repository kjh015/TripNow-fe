import { useEffect, useState } from "react";
import PostSearch from "../../post/components/PostSearch";
import tgd3 from '../imgs/tgd3.jpg';
import { subscribeRankings } from "../../api/rankingApi";
import { trackMainView } from "../../analytics/events";

import PostRankingCards from "../components/PostRankingCards";
import CategoryRegionRankingCards from "../components/CategoryRegionRankingCards";


const MainPage = () => {
  const [top5Posts, setTop5Posts] = useState([]);
  const [top5Region, setTop5Region] = useState([]);
  const [top5Category, setTop5Category] = useState([]);

  useEffect(() => {
    trackMainView();

    const evt = subscribeRankings();
    evt.addEventListener("ranking-update", (e) => {
      try {
        const data = JSON.parse(e.data);
        setTop5Posts(data.posts || []);
        setTop5Region(data.regions || []);
        setTop5Category(data.categories || []);
      } catch (err) {
        console.error("랭킹 데이터 파싱 실패:", err);
      }
    });
    evt.onerror = (err) => {
      console.error("SSE 연결 오류:", err);
    };

    return () => {
      evt.close();
    };
  }, []);

  return (
    <div className="mainpage-root">
      {/* 히어로 섹션 */}
      <div
        className="mainpage-hero"
        style={{
          background: `linear-gradient(180deg, rgba(70,70,110,0.14) 15%, rgba(255,255,255,0.91) 65%), url(${tgd3}) center/cover no-repeat`,
        }}
      >
        {/* 히어로 콘텐츠 */}
        <div className="mainpage-hero-content">
          <div className="mainpage-hero-panel">
            {/* 그라데이션 타이틀 */}
            <h2 className="mainpage-hero-title">
              Trip Now!
            </h2>
            {/* 장식선 */}
            <div className="mainpage-hero-divider" />
            {/* 서브텍스트 */}
            <p className="mainpage-hero-subtext">
              지금, 가장 인기 있는 여행지를 만나보세요!<br />
              모두의 이야기에서 당신만의 여행을 찾아보세요.
            </p>
          </div>
        </div>
        {/* 하단 블러/그라데이션 오버레이 */}
        <div className="mainpage-hero-overlay" />
      </div>

      {/* 본문 컨테이너 (검색 + 카드) */}
      <div className="mainpage-body-container">
        <div >
          <PostSearch />
          <div className="mainpage-top5-section">
            <h2 className="mainpage-section-title">
              실시간 인기 여행지
            </h2>

            <PostRankingCards top5Posts={top5Posts} />
          </div>
        </div>
      </div>


      {/* 지역/카테고리별 */}
      <div >
        <div className="mainpage-category-section" >
          <h4 className="mainpage-subsection-title">실시간 인기 카테고리</h4>
          <CategoryRegionRankingCards top5Data={top5Category} />
        </div>
        <div className="mainpage-region-section">
          <h4 className="mainpage-subsection-title">실시간 인기 지역</h4>
          <CategoryRegionRankingCards top5Data={top5Region} />
        </div>

      </div>
    </div>
  );
};

export default MainPage;
