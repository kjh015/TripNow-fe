import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link, useNavigate } from 'react-router-dom';
import SignApiClient from '../sign/service/SignApiClient';
import { useEffect, useState } from 'react';
import UserAuthentication from '../sign/service/UserAuthentication';
import { toast } from 'react-toastify';

// 프로필 이미지 예시
const myPageImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

const MyPage = () => {
  const [member, setMember] = useState({
    loginId: '',
    email: '',
    nickname: '',
    gender: '',
    roles: [],
    regDate: '',
    birthDate: '',
    age: ''
  });
  const navigate = useNavigate();
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showConfirm, setShowConfirm] = useState(false);

  // Alert 띄우기
  const showAlert = (message, type = "success", delay, redirect) => {
    setAlert({ show: true, message, type });
    if (delay) {
      setTimeout(() => {
        setAlert({ show: false, message: '', type: '' });
        if (redirect) redirect();
      }, delay);
    }
  };

  // 회원 탈퇴 (모달에서 OK 클릭 시)
  const handleDelete = () => {
    setShowConfirm(false);
    SignApiClient.withdraw().then(res => {
      if (res.ok) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('nickname');
          toast.info("회원 탈퇴가 완료되었습니다.");
        } else {
          toast.error("회원 탈퇴에 실패하였습니다.")
        }
    });
  };
  const getMember = () => {
    SignApiClient.getMemberDetail({ loginId: UserAuthentication.getLoginIdFromToken() })
      .then(res => {
        if (res.ok) {
          res.json().then(data => {
            setMember(data);
          });
        }
        else {
          showAlert("회원 정보 조회 실패", "danger");
        }
      })
  }
  useEffect(() => {
    getMember();
  }, []);

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return isoString.substring(0, 16).replace("T", " ");
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg,#eaf4fc 60%,#fff 100%)',
      minHeight: '100vh',
      paddingTop: 110,
      paddingBottom: 36
    }}>
      {/* Bootstrap Alert */}
      {alert.show && (
        <div className={`alert alert-${alert.type} text-center`}
          style={{
            position: "fixed",
            top: 60, left: "50%", transform: "translateX(-50%)",
            minWidth: 200, zIndex: 2000
          }}
          role="alert"
        >
          {alert.message}
        </div>
      )}

      {/* Confirm Modal */}
      {showConfirm && (
        <div className="modal show fade d-block" tabIndex={-1} style={{ background: 'rgba(0,0,0,0.28)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-danger">회원 탈퇴</h5>
                <button type="button" className="btn-close" onClick={() => setShowConfirm(false)} />
              </div>
              <div className="modal-body">
                <p>정말 탈퇴하시겠습니까?</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowConfirm(false)}>취소</button>
                <button className="btn btn-danger" onClick={handleDelete}>탈퇴</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="container mb-3">
        <div className="row justify-content-center">
          <div className="col-12 col-md-7 col-lg-5">
            <div className="card shadow rounded-4 p-4 text-center border-0" style={{ background: "#fffdfcf2" }}>
              {/* 프로필 이미지 + 닉네임 + 등급 */}
              <img
                src={myPageImage}
                alt="프로필"
                className="rounded-circle shadow-sm mx-auto d-block"
                style={{
                  width: 108, height: 108, objectFit: 'cover',
                  background: '#f4f6fa', border: '4px solid #e3e8ee'
                }}
              />
              <h3 className="fw-bold mt-3 mb-1" style={{ color: "#274071", letterSpacing: "1px" }}>
                {member.nickname || "-"}
              </h3>
              <div>
                {member.roles?.includes("ROLE_ADMIN") ?
                  <span className="badge rounded-pill bg-success-subtle text-success px-3">관리자</span>
                  :
                  <span className="badge rounded-pill bg-primary-subtle text-primary px-3">일반 회원</span>
                }
              </div>

              {/* 회원 정보 */}
              <div className="my-4">
                <div className="row g-2 justify-content-center">
                  <div className="col-12">
                    <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 shadow-sm mb-2">
                      <i className="bi bi-envelope-fill text-primary me-2" />
                      <span className="text-secondary small fw-semibold me-2">이메일</span>
                      <span
                        className="fw-bold ms-auto text-dark"
                        style={{
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          display: 'block',
                          textAlign: 'right'
                        }}
                        title={member.email}
                      >
                        {member.email || '-'}
                      </span>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 shadow-sm mb-2">
                      <i className="bi bi-calendar-check-fill text-danger me-2" />
                      <span className="text-secondary small fw-semibold me-2">가입일</span>
                      <span className="ms-auto fw-bold">
                        {member.regDate ? formatDate(member.regDate) : '-'}
                      </span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 shadow-sm mb-2">
                      <i className="bi bi-gender-ambiguous text-info me-2" />
                      <span className="text-secondary small fw-semibold me-2">성별</span>
                      <span className="ms-auto fw-bold">{member.gender || '-'}</span>
                    </div>
                  </div>
                  <div className="col-6 col-sm-3">
                    <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 shadow-sm mb-2">
                      <i className="bi bi-person-badge-fill text-warning me-2" />
                      <span className="text-secondary small fw-semibold me-2">나이</span>
                      <span className="ms-auto fw-bold">{member.age === -1 ? '-' : member.age}</span>
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <div className="d-flex align-items-center bg-light rounded-3 px-3 py-2 shadow-sm mb-2">
                      <i className="bi bi-calendar-date text-success me-2" />
                      <span className="text-secondary small fw-semibold me-2">생년월일</span>
                      <span className="ms-auto fw-bold">
                        {member.birthDate ? member.birthDate.substring(0, 10) : '-'}
                      </span>
                    </div>
                  </div>

                </div>
              </div>
              {/* 주요 기능 버튼 카드 */}
              <div className="d-flex justify-content-between mb-2 gap-3">
                <Link to="/board/favorite-list" className="btn btn-outline-danger rounded-pill w-100">
                  <i className="bi bi-heart-fill me-1" /> 찜 목록
                </Link>
                <Link to="/board/my-article" className="btn btn-outline-info rounded-pill w-100 text-dark">
                  <i className="bi bi-geo-alt-fill me-1" /> 여행지 관리
                </Link>
                <Link to="/page/chckmycom" className="btn btn-light border rounded-pill w-100">
                  <i className="bi bi-chat-text me-1" /> 작성 댓글
                </Link>
              </div>
              <hr style={{ marginTop: "2rem" }} />

              {/* 정보수정/탈퇴 버튼 */}
              <div className="gap-2 mt-3">
                <Link to="/sign/update" className="btn btn-outline-primary rounded-pill px-3 shadow-sm me-2">
                  <i className="bi bi-pencil-square me-1" /> 정보수정
                </Link>
                <button className="btn btn-outline-danger rounded-pill px-3 shadow-sm"
                  onClick={() => setShowConfirm(true)}
                >
                  <i className="bi bi-person-x me-1" /> 회원 탈퇴
                </button>
              </div>


            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MyPage;
