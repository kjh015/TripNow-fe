import { Offcanvas } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NavMenu = ({ show, onClose, isLoggedIn, isAdmin, curUser, onLogout, onLogin, onSignup }) => {
    return (
        <Offcanvas
            show={show}
            onHide={onClose}
            placement="end"
            id="offcanvasNavbar"
            aria-labelledby="offcanvasNavbarLabel"
            className="nav-menu"
        >
            <Offcanvas.Header closeButton className="nav-menu-header">
                <Offcanvas.Title id="offcanvasNavbarLabel" className="nav-menu-title">
                    <i className="bi bi-menu-button-wide me-2" />메뉴
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <div className="d-flex flex-column justify-content-between h-100">
                    <div className="d-flex flex-column align-items-stretch gap-2">
                        <MenuLink to="/post/list" icon="bi-card-list" label="여행지" onClick={onClose} />
                        {!isLoggedIn && (
                            <>
                                <MenuLink to="sign/component/signinpage" icon="bi-box-arrow-in-right" label="로그인" onClick={onLogin} />
                                <MenuLink to="sign/component/signuppage" icon="bi-person-plus" label="회원 가입" onClick={onSignup} />
                            </>
                        )}
                        {isLoggedIn && (
                            <>
                                {isAdmin && (
                                    <MenuLink to="/component/admnpage" icon="bi-gear" label="관리자 메뉴" onClick={onClose} />
                                )}
                                <MenuLink to="/common/MyPage" icon="bi-person-circle" label="마이페이지" onClick={onClose} />
                            </>
                        )}
                    </div>
                    <div className="d-flex flex-column align-items-stretch gap-2 mt-4">
                        {isLoggedIn && (
                            <MenuLink to="#" icon="bi-box-arrow-right" label="로그아웃" onClick={onLogout} />
                        )}
                        {isLoggedIn && (
                            <span className="nav-link w-100 fs-6 text-light bg-secondary bg-opacity-50 rounded px-3 py-2 disabled nav-menu-nickname">
                                <i className="bi bi-person-badge me-2"></i>닉네임: {curUser}
                            </span>
                        )}
                    </div>
                </div>
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default NavMenu;

const MenuLink = ({ to, icon, label, onClick, fs = "fs-5" }) => (
    <Link
        to={to}
        className={`nav-link w-100 ${fs} text-light bg-opacity-75 rounded px-3 py-2 nav-menu-link`}
        onClick={onClick}
    >
        <i className={`bi ${icon} me-2`} />
        {label}
    </Link>
);
