import { getPost } from '../../../../api/postSearchApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

const MainPageCard = ({ postId, score, rank }) => {
  const navigate = useNavigate();
  const [board, setBoard] = useState({
    postId: '', title: '', content: '', memberNickname: '',
    travelPlace: '', address: '', category: '', region: '', images: [],
  });

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await getPost(postId);
        const result = data.result || {};
        setBoard({ ...result, images: result.images || [] });
      } catch {
        // 에러 시 기본 상태 유지
      }
    };
    load();
  }, [postId]);

  return (
    <div
      className="w-100 h-100 d-flex align-items-stretch position-relative"
      style={{ position: 'relative' }} // 반드시 필요!
    >
      {/* 1등 왕관 배지 (hover와 무관, 항상 위) */}
      {(rank === 1 || rank === undefined) && (
        <div className="main-rank-crown">
          <span role="img" aria-label="king-crown">👑</span>
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
        onClick={() => navigate(`/post/detail/?no=${board.postId}`)}
      >
        {/* 이미지 */}
        <div style={{ position: "relative", width: "100%" }}>
          {board.images && board.images.length > 0 ? (
            <img
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${board.images[0].imageKey}`}
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
            {/* start prop을 주면 react-countup이 렌더 중 ref가 붙기 전 인스턴스를 생성해 크래시 — preserveValue가 이전 값 유지를 담당 */}
            <CountUp
              end={score ?? 0}
              duration={0.5}
              separator=","
              preserveValue // 리렌더링 중간값 유지
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
    </div>
  );
};

export default MainPageCard;
