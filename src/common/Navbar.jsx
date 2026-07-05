import { Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { logout } from "../api/authApi";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserAuthentication from '../sign/service/UserAuthentication';
import { toast } from 'react-toastify';
import useAlert from '../hooks/useAlert';
import NavMenu from './NavMenu';

const GRADIENT = "linear-gradient(90deg, #5C6BC0 0%, #283593 100%)";

const Navbar = () => {
  const [curUser, setCurUser] = useState('');
  const [show, setShow] = useState(false);
  const { alert, showAlert } = useAlert(500);
  const navigate = useNavigate();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('nickname');
      toast.info("로그아웃 되었습니다.");
      handleClose();
      navigate("/");
    } catch {
      toast.error("로그아웃에 실패했습니다.");
    }
  };

  const goToLogin = () => {
    if (localStorage.getItem('accessToken') != null) {
      showAlert("이미 로그인되어 있습니다.", "info");
    } else {
      navigate("/sign/component/SignInPage");
    }
  };

  const goToSignup = () => {
    if (localStorage.getItem('accessToken') != null) {
      showAlert("이미 로그인되어 있습니다.", "info");
    } else {
      navigate("/sign/component/SignUpPage");
    }
  };

  const isLoggedIn = !!localStorage.getItem('accessToken');
  const isAdmin = UserAuthentication.isAdmin();

  useEffect(() => {
    setCurUser(localStorage.getItem('nickname'));
    document.body.style.overflow = 'auto';
    document.body.classList.remove('offcanvas-backdrop', 'modal-open');
  }, [handleShow]);

  return (
    <>
      <div style={{ position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)", minWidth: 260, zIndex: 2000 }}>
        {alert.show && (
          <div className={`alert alert-${alert.type || "info"} text-center shadow`} role="alert">
            {alert.message}
          </div>
        )}
      </div>
      <nav
        className="navbar navbar-dark fixed-top shadow"
        style={{
          background: GRADIENT, color: "#fff",
          boxShadow: "0 4px 32px rgba(40,53,147,0.18)",
          borderRadius: "0 0 24px 24px", minHeight: 68, padding: 0, zIndex: 1030,
        }}
      >
        <div className="container-fluid px-3 d-flex align-items-center" style={{ minHeight: 68, margin: "0 auto" }}>
          <div style={{ minWidth: 180, display: "flex", alignItems: "center" }}>
            <Link to="/" className="navbar-brand mb-0 h1"
              style={{
                display: "inline-block", fontWeight: 800, padding: "0.5rem 1.6rem", borderRadius: "2rem",
                background: "linear-gradient(90deg, #B794F4 40%, #90CDF4 100%)", color: "#fff",
                fontSize: "1.35rem", letterSpacing: "0.02em", boxShadow: "0 2px 12px rgba(136,97,255,0.13)", border: "none"
              }}>
              <i className="bi bi-airplane-engines-fill me-2" style={{ fontSize: "1.2rem" }} />
              Trip Now
            </Link>
          </div>
          <div className="flex-grow-1 d-flex justify-content-center"></div>
          <div style={{ minWidth: 54 }} className="d-flex justify-content-end">
            <Button variant="dark" className="navbar-toggler shadow-sm" onClick={handleShow}
              aria-controls="offcanvasNavbar"
              style={{ background: "rgba(44,62,160,0.88)", borderColor: "rgba(44,62,160,0.88)", borderRadius: "16px", transition: "box-shadow 0.2s" }}>
              <span className="navbar-toggler-icon" />
            </Button>
          </div>
        </div>
        <NavMenu
          show={show}
          onClose={handleClose}
          isLoggedIn={isLoggedIn}
          isAdmin={isAdmin}
          curUser={curUser}
          onLogout={handleLogout}
          onLogin={() => { goToLogin(); handleClose(); }}
          onSignup={() => { goToSignup(); handleClose(); }}
        />
      </nav>
    </>
  );
};

export default Navbar;
