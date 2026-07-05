import { useEffect, useState } from "react";
import PostSearch from "../../../post/components/PostSearch";
import tgd3 from '../imgs/tgd3.jpg';
import { subscribeRankings } from "../../../api/rankingApi";

import MainPageCardsLayout from "./MainPageCardsLayout";
import MainPageCardsLayout2 from "./MainPageCardsLayout2";
import Footers from "../../../common/Footers";


const MainPage = () => {
  const [top5Posts, setTop5Posts] = useState([]);
  const [top5Region, setTop5Region] = useState([]);
  const [top5Category, setTop5Category] = useState([]);

  useEffect(() => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "travel_main_view",
      visit_time: new Date().toISOString(),
      referrer: document.referrer
    });

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
    <div
      style={{
        minHeight: "100vh",
        background: "#F5F6FF",
        width: "100%",
        overflowX: "hidden",
        marginTop: "-1px"
      }}
    >
      {/* 히어로 섹션 */}
      <div
        style={{
          width: "100%",
          minHeight: "500px",
          background: `linear-gradient(180deg, rgba(70,70,110,0.14) 15%, rgba(255,255,255,0.91) 65%), url(${tgd3}) center/cover no-repeat`,
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "32px",

        }}
      >
        {/* 히어로 콘텐츠 */}
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 2,

          }}
        >
          <div
            style={{
              textAlign: "center",
              position: "relative",
              display: "inline-block",
              padding: "1rem 4.5rem 10rem 4.5rem",
              background: "rgba(255,255,255,0.65)",
              boxShadow: "0 6px 36px rgba(80,60,180,0.08)",
              backdropFilter: "blur(4px)",
              border: "1.5px solid rgba(190,180,255,0.13)",
              zIndex: 3,
              minWidth: 320,
              maxWidth: "94vw"
            }}
          >
            {/* 그라데이션 타이틀 */}
            <h2
              style={{
                fontSize: "3.42rem",
                fontWeight: 900,
                letterSpacing: "-0.04em",
                background: "linear-gradient(90deg, #B794F4 40%, #90CDF4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                color: "transparent",
                textShadow: "0 1px 10px rgba(160,160,220,0.09)",
                margin: 0,
                fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif"
              }}
            >
              Trip Now!
            </h2>
            {/* 장식선 */}
            <div
              style={{
                height: "3.5px",
                width: "60px",
                margin: "0.7rem auto 1.1rem auto",
                borderRadius: "2rem",
                background: "linear-gradient(90deg,#bdaafc 20%, #92e0f6 90%)",
                opacity: 0.88
              }}
            />
            {/* 서브텍스트 */}
            <p style={{
              color: "#5B4B9A",
              fontWeight: 500,
              fontSize: "1.16rem",
              margin: "0.7rem 0 0 0",
              textShadow: "0 2px 8px rgba(255,255,255,0.09)"
            }}>
              지금, 가장 인기 있는 여행지를 만나보세요!<br />
              모두의 이야기에서 당신만의 여행을 찾아보세요.
            </p>
          </div>
        </div>
        {/* 하단 블러/그라데이션 오버레이 */}
        <div style={{
          position: "absolute",
          left: 0, right: 0, bottom: 0,
          height: "100px",
          background: "linear-gradient(180deg, rgba(245,245,255,0) 0%, rgba(245,245,255,0.84) 100%)",
          zIndex: 2
        }} />
      </div>

      {/* 본문 컨테이너 (검색 + 카드) */}
      <div
        style={{
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: "1020px",
          zIndex: 2,
          padding: "0 16px",
          marginTop: "-265px"
        }}
      >
        <div >
          <PostSearch />
          <div style={{ marginBottom: "32px", marginTop: "5rem" }}>
            <h2 style={{
              textAlign: "start",
              width: "100%",
              fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif",
              color: "#a68eff",
              fontWeight: 900,
              fontSize: "2.35rem",
              margin: "0 0 26px 0",
              letterSpacing: "-0.03em",
              textShadow: "0 2px 16px rgba(92,67,226,0.08)",
              transform: "translateY(28px)"
            }}>
              실시간 인기 여행지
            </h2>

            <MainPageCardsLayout top5Posts={top5Posts} />
          </div>
        </div>
      </div>


      {/* 지역/카테고리별 */}
      <div >
        <div style={{ marginTop: "8rem" }} >
          <h4 style={{            
            paddingLeft: "19rem",
            textAlign: "left",
            fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif",
            color: "#b7aaff",
            fontWeight: 700,
            fontSize: "1.55rem",
            letterSpacing: "-0.03em",
            marginBottom: "1.4rem"
          }}
            className="text-left mb-4">실시간 인기 카테고리</h4>
          <MainPageCardsLayout2 top5Data={top5Category} />
        </div>
        <div style={{ marginTop: "6rem"}}>
          <h4 style={{
            paddingLeft: "19rem",
            textAlign: "left",
            fontFamily: "'Montserrat', 'Gowun Dodum', sans-serif",
            color: "#b7aaff",
            fontWeight: 700,
            fontSize: "1.55rem",
            letterSpacing: "-0.03em",
            marginBottom: "1.4rem"
          }}
            className="text-left mb-4">실시간 인기 지역</h4>
          <MainPageCardsLayout2 top5Data={top5Region} />
        </div>

      </div>

      <Footers />
    </div>
  );
};

export default MainPage;
