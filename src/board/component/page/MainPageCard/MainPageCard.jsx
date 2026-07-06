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
        onClick={() => navigate(`/post/detail/?no=${board.postId}`)}
      >
        {/* 이미지 */}
        <div className="mainpage-card-image-wrap">
          {board.images && board.images.length > 0 ? (
            <img
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${board.images[0].imageKey}`}
              alt="Main visual"
              className="card-img-top mainpage-card-image"
            />
          ) : (
            <div className="mainpage-card-image-placeholder" />
          )}
          <div className="mainpage-card-overlay-badge">
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
          <div className="mb-3 mainpage-card-title">
            {board.title}
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            {/* 작성자 이름 한 줄로 보이게 수정?*/}
            <small className="text-muted mainpage-card-nickname">
              by <b className="mainpage-card-nickname-name">{board.memberNickname}</b>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageCard;
