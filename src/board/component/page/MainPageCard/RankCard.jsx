import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 서울 from '../../imgs/지역별/서울.jpg'
import 부산 from '../../imgs/지역별/부산.jpg'
import 강원 from '../../imgs/지역별/강원.jpg'
import 제주 from '../../imgs/지역별/제주.jpg'
import 대구 from '../../imgs/지역별/대구.webp'
import 경기 from '../../imgs/지역별/경기.jpg'
import 인천 from '../../imgs/지역별/인천.jpg'
import 전남 from '../../imgs/지역별/전남.jpg'
import 기타 from '../../imgs/지역별/기타.jpg'


import 축제 from '../../imgs/카테고리별/축제.jpg'
import 음식 from '../../imgs/카테고리별/음식.jpg'
import 쇼핑 from '../../imgs/카테고리별/쇼핑.avif'
import 자연 from '../../imgs/카테고리별/자연.jpg'
import 가족 from '../../imgs/카테고리별/가족.png'
import 공연 from '../../imgs/카테고리별/공연.jpg'
import 역사 from '../../imgs/카테고리별/역사.webp'
import 행사 from '../../imgs/카테고리별/행사.png'
import 체험 from '../../imgs/카테고리별/체험.jpg'




import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_CODE_TO_LABEL, REGION_CODE_TO_LABEL } from '../../../../constants/categoryRegion';

const images = {
  "서울": 서울,
  "부산": 부산,
  "강원": 강원,
  "제주": 제주,
  "대구": 대구,
  "경기": 경기,
  "인천": 인천,
  "전남": 전남,
  "기타": 기타,
  "축제": 축제,
  "음식": 음식,
  "쇼핑": 쇼핑,
  "자연": 자연,
  "가족": 가족,
  "공연": 공연,
  "역사": 역사,
  "행사": 행사,
  "체험": 체험
};

// 1등 왕관 배지 스타일 (z-index: 99, pointerEvents: "none")
const firstRankBadgeStyle = {
    position: 'absolute',
    top: 22,
    left: 22,
    background: 'linear-gradient(135deg, #ffd700 70%, #fff9c4 100%)',
    color: "#725b10",
    fontWeight: 900,
    borderRadius: "50%",
    width: 54,
    height: 54,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    boxShadow: "0 4px 12px rgba(180,140,20,0.13)",
    border: "3px solid #fffbe8",
    zIndex: 99,            // 왕관을 카드보다 항상 위에!
    pointerEvents: "none", // 카드 클릭 방해 X
};

const RankCard = ({ data, type, rank }) => {
    const navigate = useNavigate();

    // data는 Swagger enum 코드(SEOUL, FESTIVAL 등) — 이미지/표시는 한글 라벨 사용
    const label = type === "region"
        ? (REGION_CODE_TO_LABEL[data] || data)
        : (CATEGORY_CODE_TO_LABEL[data] || data);

    return (
        <div
            className="w-100 h-100 d-flex align-items-stretch position-relative"
            style={{ position: 'relative' }} // 반드시 필요!
        >
            {/* 1등 왕관 배지 (hover와 무관, 항상 위) */}
            {(rank === 1 || rank === undefined) && (
                <div style={firstRankBadgeStyle}>
                    <span role="img" aria-label="king-crown" style={{ fontSize: "2.2rem", marginTop: "-4px" }}>👑</span>
                </div>
            )}

            {/* 카드 본문 */}
            <div
                className="mainpage-card-hover card border-0 shadow-lg rounded-4 overflow-hidden w-100"
                style={{
                    background: "rgba(250,250,255,0.96)",
                    boxShadow: "0 8px 32px rgba(60,60,100,0.14)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.25s cubic-bezier(.19,1,.22,1), box-shadow 0.22s",
                    cursor: "pointer",
                    zIndex: 1, // 왕관보다 낮음 (중요)
                }}
                onClick={() => navigate(`/post/list/?${type}=${data}`)}
            >
                {/* 이미지 */}
                <div style={{ position: "relative", width: "100%" }}>
                    {data ? (
                        <img
                            src={images[label]}
                            alt="Main visual"
                            className="card-img-top"
                            style={{
                                height: '200px',
                                width: '100%',
                                objectFit: 'cover',
                                filter: "brightness(98%)",
                                display: 'block'
                            }}
                        />
                    ) : (
                        <div style={{ height: '200px', background: "#f3f3f8" }} />
                    )}
                    <div style={{
                        position: "absolute",
                        bottom: "18px",
                        left: "20px",
                        background: "rgba(30,30,55,0.56)",
                        color: "#fff",
                        padding: "0.75rem 1.25rem",
                        borderRadius: "1.2rem",
                        fontWeight: 600,
                        fontSize: "1.2rem",
                        letterSpacing: "-0.01em",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.6rem"
                    }}>
                        <span style={{ color: "#e0c3fc", fontWeight: 700 }}>{label}</span>

                    </div>
                </div>
            </div>
            {/* Hover 효과 CSS */}
            <style>
                {`
          .mainpage-card-hover:hover {
            transform: scale(1.035);
            box-shadow: 0 12px 36px 0 rgba(100,100,150,0.19);
            z-index: 2; /* 이 값도 왕관(99)보다 낮아야 함 */
          }
        `}
            </style>
        </div>
    );
};

export default RankCard;
