import { getPost } from '../../../api/postSearchApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CountUp from 'react-countup';
import { CATEGORY_CODE_TO_LABEL, REGION_CODE_TO_LABEL } from '../../../constants/categoryRegion';
import { CATEGORY_REGION_IMAGES } from './categoryRegionImages';
import { trackRankingClick } from '../../../analytics/events';

// 1~5위 색상 예시 (secondary variant 순위 뱃지)
const rankColors = ["#ffd700", "#C0C0C0", "#cd7f32", "#90caf9", "#b39ddb"];

/**
 * variant:
 *  - 'primary'   : 게시글 1위 카드 (postId로 API 조회, 점수 카운트업, 클릭 시 상세)
 *  - 'secondary' : 게시글 2~5위 카드 (postId로 API 조회, 순위 뱃지, 클릭 시 상세)
 *  - 'category'  : 지역/카테고리 랭킹 카드 (data/type prop, 로컬 이미지, 클릭 시 목록 필터)
 */
const MainPageCard = ({ variant = 'primary', rank, postId, score, data, type }) => {
  const navigate = useNavigate();
  const isPost = variant !== 'category';

  const [post, setPost] = useState({
    postId: '', title: '', content: '', memberNickname: '',
    travelPlace: '', address: '', category: '', region: '', images: [],
  });

  useEffect(() => {
    if (!isPost) return;
    const load = async () => {
      try {
        const { data } = await getPost(postId);
        const result = data.result || {};
        setPost({ ...result, images: result.images || [] });
      } catch {
        // 에러 시 기본 상태 유지
      }
    };
    load();
  }, [isPost, postId]);

  const label = variant === 'category'
    ? (type === 'region' ? (REGION_CODE_TO_LABEL[data] || data) : (CATEGORY_CODE_TO_LABEL[data] || data))
    : null;

  const imageSrc = variant === 'category'
    ? CATEGORY_REGION_IMAGES[label]
    : (post.images.length > 0 ? `${process.env.REACT_APP_IMAGE_BASE_URL}/${post.images[0].imageKey}` : null);

  const handleClick = () => {
    if (variant === 'category') {
      trackRankingClick({ rankType: type, rank, label: data });
      navigate(`/post/list/?${type}=${data}`);
    } else {
      trackRankingClick({ rankType: 'post', rank, label: post.title, postId: post.postId });
      navigate(`/post/detail/?postId=${post.postId}`);
    }
  };

  if (variant === 'secondary') {
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
          onClick={handleClick}
        >
          <div className="mainpage-card2-image-wrap">
            {imageSrc ? (
              <img src={imageSrc} alt="preview" className="mainpage-card2-image" />
            ) : (
              <div className="mainpage-card2-image-placeholder" />
            )}
          </div>
          <div className="card-body py-3 px-4 d-flex flex-column justify-content-center mainpage-card2-content">
            <h6 className="fw-bold mainpage-card2-title">
              {post.title}
            </h6>
            <div className="mainpage-card2-score">
              score:&nbsp;
              {/* start prop을 주면 react-countup이 렌더 중 ref가 붙기 전 인스턴스를 생성해 크래시 — preserveValue가 이전 값 유지를 담당 */}
              <CountUp
                end={score ?? 0}
                decimals={1}
                duration={0.5}
                separator=","
                preserveValue // 리렌더링 중간값 유지
              />
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted mainpage-card-nickname">
                by <b className="mainpage-card-nickname-name">{post.memberNickname}</b>
              </small>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // primary / category — 동일한 카드 골격 (왕관 배지 + 이미지 + 오버레이 뱃지) 공유
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
        onClick={handleClick}
      >
        {/* 이미지 */}
        <div className="mainpage-card-image-wrap">
          {imageSrc ? (
            <img
              src={imageSrc}
              alt="Main visual"
              className={variant === 'category' ? 'card-img-top rank-card-image' : 'card-img-top mainpage-card-image'}
            />
          ) : (
            <div className={variant === 'category' ? 'rank-card-image-placeholder' : 'mainpage-card-image-placeholder'} />
          )}
          <div className="mainpage-card-overlay-badge">
            {variant === 'category' ? (
              <span className="mainpage-card-overlay-label">{label}</span>
            ) : (
              <>
                Score:
                {/* start prop을 주면 react-countup이 렌더 중 ref가 붙기 전 인스턴스를 생성해 크래시 — preserveValue가 이전 값 유지를 담당 */}
                <CountUp
                  end={score ?? 0}
                  decimals={1}
                  duration={0.5}
                  separator=","
                  preserveValue // 리렌더링 중간값 유지
                />
              </>
            )}
          </div>
        </div>
        {variant !== 'category' && (
          <div className="card-body px-4 py-4">
            <div className="mb-3 mainpage-card-title">
              {post.title}
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
              <small className="text-muted mainpage-card-nickname">
                by <b className="mainpage-card-nickname-name">{post.memberNickname}</b>
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPageCard;
