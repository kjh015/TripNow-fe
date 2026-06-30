import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import BoardApiClient from '../../../service/BoardApiClient';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

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

const MainPageCard = ({ boardId, score, rank }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState({
    id: '', title: '', content: '', memberNickname: '',
    travelPlace: '', address: '', category: '', region: '', imagePaths: [],
    createdDate: '', modifiedDate: ''
  });

  useEffect(() => {
    BoardApiClient.getBoard(boardId).then(
      res => {
        if (res.ok) {
          res.json().then(data => setBoard({ ...data, imagePaths: data.imagePaths || [] }));
        }
      }
    );
  }, [boardId]);

  const prevScoreRef = useRef(score);

  useEffect(() => {
    prevScoreRef.current = score;
  }, [score]);

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
        onClick={() => navigate(`/board/detail/?no=${board.id}`)}
      >
        {/* 이미지 */}
        <div style={{ position: "relative", width: "100%" }}>
          {board.imagePaths && board.imagePaths.length > 0 ? (
            <img
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}${board.imagePaths[0]}`}
              alt="Main visual"
              className="card-img-top"
              style={{
                height: '390px',
                width: '100%',
                objectFit: 'cover',
                filter: "brightness(98%)",
                display: 'block'
              }}
            />
          ) : (
            <div style={{ height: '390px', background: "#f3f3f8" }} />
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
            Score:
            <CountUp
              start={prevScoreRef.current}
              end={score}
              duration={0.5}
              separator=","
              preserveValue // 리렌더링 중간값 유지
              redraw // 점수만 바뀔 때도 애니메이션 작동하게
            />
          </div>
        </div>
        <div className="card-body px-4 py-4">
          <div className="mb-3" style={{ fontSize: "1.09rem", color: "#333", fontWeight: 500 }}>
            {board.title}
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            {/* 작성자 이름 한 줄로 보이게 수정?*/}
            <small className="text-muted" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: 220 }}>
              by <b style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', verticalAlign: 'bottom', maxWidth: 90, display: 'inline-block' }}>{board.memberNickname}</b>
            </small>
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

export default MainPageCard;
