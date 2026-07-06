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

const RankCard = ({ data, type, rank }) => {
    const navigate = useNavigate();

    // data는 Swagger enum 코드(SEOUL, FESTIVAL 등) — 이미지/표시는 한글 라벨 사용
    const label = type === "region"
        ? (REGION_CODE_TO_LABEL[data] || data)
        : (CATEGORY_CODE_TO_LABEL[data] || data);

    return (
        <div className="w-100 h-100 d-flex align-items-stretch position-relative">
            {/* 1등 왕관 배지 (hover와 무관, 항상 위) */}
            {(rank === 1 || rank === undefined) && (
                <div className="main-rank-crown">
                    <span role="img" aria-label="king-crown">👑</span>
                </div>
            )}

            {/* 카드 본문 */}
            <div
                className="mainpage-card-hover mainpage-card-body card border-0 shadow-lg rounded-4 overflow-hidden w-100"
                onClick={() => navigate(`/post/list/?${type}=${data}`)}
            >
                {/* 이미지 */}
                <div className="mainpage-card-image-wrap">
                    {data ? (
                        <img
                            src={images[label]}
                            alt="Main visual"
                            className="card-img-top rank-card-image"
                        />
                    ) : (
                        <div className="rank-card-image-placeholder" />
                    )}
                    <div className="mainpage-card-overlay-badge">
                        <span className="mainpage-card-overlay-label">{label}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RankCard;
