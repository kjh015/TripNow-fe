import { Button } from 'react-bootstrap';
import { useEffect, useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import { logout } from "../api/authApi";
import UserAuthentication from '../sign/service/UserAuthentication';
import { toast } from 'react-toastify';
import useAlert from '../hooks/useAlert';
import NavMenu from './NavMenu';

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
      <div className="app-alert-fixed">
        {alert.show && (
          <div className={`alert alert-${alert.type || "info"} text-center shadow`} role="alert">
            {alert.message}
          </div>
        )}
      </div>
      <nav className="navbar navbar-dark fixed-top shadow app-navbar">
        <div className="container-fluid px-3 d-flex align-items-center app-navbar-inner">
          <div className="nav-brand-wrap">
            <Link to="/" className="navbar-brand mb-0 h1 nav-brand">
              <i className="bi bi-airplane-engines-fill me-2" />
              Trip Now
            </Link>
          </div>
          <div className="flex-grow-1 d-flex justify-content-center"></div>
          <div className="d-flex justify-content-end nav-toggler-wrap">
            <Button variant="dark" className="navbar-toggler shadow-sm nav-toggler" onClick={handleShow}
              aria-controls="offcanvasNavbar">
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
