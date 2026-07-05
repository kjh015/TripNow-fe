import { Offcanvas, Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import SignApiClient from "../sign/service/SignApiClient";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css'; // 아이콘 사용을 위해 import
import UserAuthentication from '../sign/service/UserAuthentication';
import { toast } from 'react-toastify';

const GRADIENT = "linear-gradient(90deg, #5C6BC0 0%, #283593 100%)";
const BLUR = "backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);";

const Navbar = () => {
  const [curUser, setCurUser] = useState('');
  const [show, setShow] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // type: 'success' | 'danger'
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // 로그아웃
  const handleLogout = () => {
    SignApiClient.signOut().then(
      res => {
        if (res.ok) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('nickname');
          toast.info("로그아웃 되었습니다.")
          handleClose();
          navigate("/");
        } else {
          toast.error("로그아웃에 실패했습니다.")
        }
      }
    );
  };

  // 기타 함수 (테스트, 로그인/회원가입 이동 등)
  const handleTest = () => {
    SignApiClient.test().then(
      res => {
        if (res.ok) {
          res.text().then(
            data => setAlert({ show: true, message: data, type: "success" })
          )
        } else {
          setAlert({ show: true, message: "실패", type: "danger" });
        }
      }
    )
  }

  const goToLogin = () => {
    if (localStorage.getItem('accessToken') != null) {
      setAlert({ show: true, message: "이미 로그인되어 있습니다.", type: "info" });
    }
    else {
      navigate("/sign/component/SignInPage");
    }
  }

  const goToSignup = () => {
    if (localStorage.getItem('accessToken') != null) {
      setAlert({ show: true, message: "이미 로그인되어 있습니다.", type: "info" });
    }
    else {
      navigate("/sign/component/SignUpPage");
    }
  }

  // 로그인 여부 체크
  const isLoggedIn = !!localStorage.getItem('accessToken');
  const isAdmin = UserAuthentication.isAdmin();

  useEffect(() => {
    setCurUser(localStorage.getItem('nickname'));
    document.body.style.overflow = 'auto';
    document.body.classList.remove('offcanvas-backdrop', 'modal-open');
  }, [handleShow]);

  // Alert 자동 사라짐
  useEffect(() => {
    if (alert.show) {
      const timer = setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 500);
      return () => clearTimeout(timer);
    }
  }, [alert.show]);

  return (
    <>
      {/* ----- Bootstrap Alert 메시지 ----- */}
      <div
        style={{
          position: "fixed",
          top: 80, // 네비게이션 아래
          left: "50%",
          transform: "translateX(-50%)",
          minWidth: 260,
          zIndex: 2000,
        }}
      >
        {alert.show && (
          <div className={`alert alert-${alert.type || "info"} text-center shadow`} role="alert">
            {alert.message}
          </div>
        )}
      </div>
      {/* ----- 네비바 시작 ----- */}
      변경

      <nav
        className="navbar navbar-dark fixed-top shadow"
        style={{
          background: GRADIENT,
          color: "#fff",
          boxShadow: "0 4px 32px rgba(40,53,147,0.18)",
          borderRadius: "0 0 24px 24px",
          minHeight: 68,
          padding: 0,
          zIndex: 1030,
        }}
      >
        <div
          className="container-fluid px-3 d-flex align-items-center"
          style={{ minHeight: 68, margin: "0 auto" }}
        >
          {/* 브랜드 */}
          <div style={{
            minWidth: 180,
            display: "flex",
            alignItems: "center"
          }}>
            <Link
              to="/"
              className="navbar-brand mb-0 h1"
              style={{
                display: "inline-block",
                fontWeight: 800,
                padding: "0.5rem 1.6rem",
                borderRadius: "2rem",
                background: "linear-gradient(90deg, #B794F4 40%, #90CDF4 100%)",
                color: "#fff",
                fontSize: "1.35rem",
                letterSpacing: "0.02em",
                boxShadow: "0 2px 12px rgba(136,97,255,0.13)",
                border: "none"
              }}
            >
              <i className="bi bi-airplane-engines-fill me-2" style={{ fontSize: "1.2rem" }} />
              Trip Now
            </Link>
          </div>
          {/* 가운데 비움 */}
          <div className="flex-grow-1 d-flex justify-content-center"></div>
          {/* 햄버거 버튼 */}
          <div style={{ minWidth: 54 }} className="d-flex justify-content-end">
            <Button
              variant="dark"
              className="navbar-toggler shadow-sm"
              onClick={handleShow}
              aria-controls="offcanvasNavbar"
              style={{
                background: "rgba(44,62,160,0.88)",
                borderColor: "rgba(44,62,160,0.88)",
                borderRadius: "16px",
                transition: "box-shadow 0.2s",
              }}
            >
              <span className="navbar-toggler-icon" />
            </Button>
          </div>
        </div>
        {/* 오프캔버스 */}
        <Offcanvas
          show={show}
          onHide={handleClose}
          placement="end"
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          style={{
            width: '300px',
            background: "linear-gradient(135deg, #283593D9 60%, #6F8AE7DD 100%)",
            color: "white",
            borderTopLeftRadius: "28px",
            borderBottomLeftRadius: "28px",
            boxShadow: "0 0 32px 0 rgba(40,53,147,0.13)",
            ...{
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)"
            }
          }}
        >
          <Offcanvas.Header closeButton style={{
            background: "none",
            color: "white",
            borderBottom: "1px solid rgba(255,255,255,0.10)"
          }}>
            <Offcanvas.Title id="offcanvasNavbarLabel" style={{
              fontWeight: 600, letterSpacing: "0.05em", fontSize: "1.2rem"
            }}>
              <i className="bi bi-menu-button-wide me-2" />
              메뉴
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <div className="d-flex flex-column justify-content-between h-100">
              <div className="d-flex flex-column align-items-stretch gap-2">
                {/* 아래 링크들 공통 스타일에 마우스오버 효과 추가 */}
                <MenuLink
                  to="/board/list"
                  icon="bi-card-list"
                  label="여행지"
                  onClick={handleClose}
                />
                {!isLoggedIn && (
                  <>
                    <MenuLink
                      to="sign/component/signinpage"
                      icon="bi-box-arrow-in-right"
                      label="로그인"
                      onClick={() => { goToLogin(); handleClose(); }}
                    />
                    <MenuLink
                      to="sign/component/signuppage"
                      icon="bi-person-plus"
                      label="회원 가입"
                      onClick={() => { goToSignup(); handleClose(); }}
                    />
                  </>
                )}
                {isLoggedIn && (
                  <>
                    {isAdmin &&
                      <MenuLink
                        to="/component/admnpage"
                        icon="bi-gear"
                        label="관리자 메뉴"
                        onClick={handleClose}
                      />}
                    <MenuLink
                      to="/common/MyPage"
                      icon="bi-person-circle"
                      label="마이페이지"
                      onClick={handleClose}
                    />
                  </>
                )}
              </div>
              {/* 하단 - 로그아웃 등 */}
              <div className="d-flex flex-column align-items-stretch gap-2 mt-4">
                {isLoggedIn && <MenuLink
                  to="#"
                  icon="bi-box-arrow-right"
                  label="로그아웃"
                  onClick={handleLogout}
                />}
                {isLoggedIn &&
                  <span
                    className="nav-link w-100 fs-6 text-light bg-secondary bg-opacity-50 rounded px-3 py-2 disabled"
                    style={{
                      pointerEvents: 'none',
                      opacity: 0.7,
                      background: "rgba(100, 100, 180, 0.16)"
                    }}>
                    <i className="bi bi-person-badge me-2"></i>닉네임: {curUser}
                  </span>
                }

              </div>
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </nav>
    </>
  );
};

export default Navbar;

// 파일 내에 추가
const MenuLink = ({ to, icon, label, onClick, fs = "fs-5" }) => (
  <Link
    to={to}
    className={`nav-link w-100 ${fs} text-light bg-opacity-75 rounded px-3 py-2`}
    style={{
      position: "relative",
      transition: "background 0.2s, box-shadow 0.16s",
      fontWeight: 500,
      borderRadius: "18px",
      letterSpacing: "0.01em"
    }}
    onClick={onClick}
    onMouseOver={e => {
      e.target.style.background = "rgba(255,255,255,0.11)";
      e.target.style.color = "#FFF";
      e.target.style.boxShadow = "0 2px 12px 0 rgba(91,142,255,0.09)";
    }}
    onMouseOut={e => {
      e.target.style.background = "";
      e.target.style.color = "#FFF";
      e.target.style.boxShadow = "";
    }}
  >
    <i className={`bi ${icon} me-2`} style={{ opacity: 0.96 }} />
    {label}
  </Link>
);
