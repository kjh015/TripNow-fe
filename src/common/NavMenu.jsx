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
            style={{
                width: '300px',
                background: "linear-gradient(135deg, #283593D9 60%, #6F8AE7DD 100%)",
                color: "white", borderTopLeftRadius: "28px", borderBottomLeftRadius: "28px",
                boxShadow: "0 0 32px 0 rgba(40,53,147,0.13)",
                backdropFilter: "blur(10px)", WebkitBackdropFilter: "blur(10px)"
            }}
        >
            <Offcanvas.Header
                closeButton
                style={{ background: "none", color: "white", borderBottom: "1px solid rgba(255,255,255,0.10)" }}
            >
                <Offcanvas.Title
                    id="offcanvasNavbarLabel"
                    style={{ fontWeight: 600, letterSpacing: "0.05em", fontSize: "1.2rem" }}
                >
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
                            <span
                                className="nav-link w-100 fs-6 text-light bg-secondary bg-opacity-50 rounded px-3 py-2 disabled"
                                style={{ pointerEvents: 'none', opacity: 0.7, background: "rgba(100, 100, 180, 0.16)" }}
                            >
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
        className={`nav-link w-100 ${fs} text-light bg-opacity-75 rounded px-3 py-2`}
        style={{ position: "relative", transition: "background 0.2s, box-shadow 0.16s", fontWeight: 500, borderRadius: "18px", letterSpacing: "0.01em" }}
        onClick={onClick}
        onMouseOver={e => { e.target.style.background = "rgba(255,255,255,0.11)"; e.target.style.color = "#FFF"; e.target.style.boxShadow = "0 2px 12px 0 rgba(91,142,255,0.09)"; }}
        onMouseOut={e => { e.target.style.background = ""; e.target.style.color = "#FFF"; e.target.style.boxShadow = ""; }}
    >
        <i className={`bi ${icon} me-2`} style={{ opacity: 0.96 }} />
        {label}
    </Link>
);
