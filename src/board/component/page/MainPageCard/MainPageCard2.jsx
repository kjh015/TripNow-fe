import { getPost } from '../../../../api/postSearchApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';

// 1~5위 색상 예시
const rankColors = ["#ffd700", "#C0C0C0", "#cd7f32", "#90caf9", "#b39ddb"];

const MainPageCard2 = ({ postId, score, rank }) => {
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
    <div className="w-100 h-100 d-flex align-items-stretch position-relative mainpage-card2-wrap">
      {/* --- 순위 뱃지 (배경색은 rank별 런타임 값이라 인라인 유지) --- */}
      {rank &&
        <div className="main-rank-badge" style={{ background: rankColors[(rank - 1) % 5] }}>
          {rank}
        </div>
      }

      <div
        className="mainpage-card2-hover mainpage-card2-body card border-0 shadow rounded-4 overflow-hidden w-100"
        onClick={() => { navigate(`/post/detail/?no=${board.postId}`); }}
      >
        {/* 이미지 or 배경 */}
        <div className="mainpage-card2-image-wrap">
          {board.images && board.images.length > 0 ? (
            <img
              src={`${process.env.REACT_APP_IMAGE_BASE_URL}/${board.images[0].imageKey}`}
              alt="preview"
              className="mainpage-card2-image"
            />
          ) : (
            <div className="mainpage-card2-image-placeholder" />
          )}
        </div>
        <div className="card-body py-3 px-4 d-flex flex-column justify-content-center mainpage-card2-content">
          <h6 className="fw-bold mainpage-card2-title">
            {board.title}
          </h6>
          <div className="mainpage-card2-score">
            score:&nbsp;
            {/* start prop을 주면 react-countup이 렌더 중 ref가 붙기 전 인스턴스를 생성해 크래시 — preserveValue가 이전 값 유지를 담당 */}
            <CountUp
              end={score ?? 0}
              duration={0.5}
              separator=","
              preserveValue // 리렌더링 중간값 유지
            />
          </div>
          <div className="d-flex justify-content-between align-items-center mt-2">
            {/* 닉네임 한줄로 보이게 수정 */}
            <small className="text-muted mainpage-card-nickname">
              by <b className="mainpage-card-nickname-name">{board.memberNickname}</b>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPageCard2;
