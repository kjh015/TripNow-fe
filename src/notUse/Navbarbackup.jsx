import { useState } from "react";

const Navbar = () => {
    const [id, setid] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleLogin = (e) => {
        e.preventDefault();
        // 실제 로그인 처리 생략
        setIsLoggedIn(true);  // 로그인 상태로 변경
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
        setid('');
        setPassword('');
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">Travel React</a>

                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon" />
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item"><a className="nav-link active" href="#">Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Link</a></li>
                        <li className="nav-item"><a className="nav-link" href="/component/admnpage">관리자 페이지</a></li>
                        <li className="nav-item"><a className="nav-link" href="board/returnboard">게시판</a></li>


                    </ul>

                    <div className="d-flex align-items-center gap-3">
                        {!isLoggedIn ? (
                            // 로그인 버튼 → 상태 변경
                            <a className="btn btn-primary" href="/component/login" onClick={() => setIsLoggedIn(true)}>로그인</a>
                        ) : (
                            // 로그인 상태일 때 드롭다운
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    UserName
                                </button>
                                <ul className="dropdown-menu">
                                    <li><a className="dropdown-item" href="/component/mypage">마이페이지</a></li>
                                    <li><button onClick={handleLogout} className="dropdown-item">로그아웃</button></li>
                                    <li><a className="dropdown-item" href="#">기타</a></li>
                                </ul>
                            </div>
                        )}

                        {/* 추가 버튼들 */}
                        <a className="btn btn-success" href="/component/signup">Sign up</a>
                        <a className="btn btn-danger" href="/component/place">상세보기</a>

                        {/* 검색 폼 */}
                        <form className="d-flex">
                            <input className="form-control me-2" type="search" placeholder="검색" style={{ width: '150px', height: '40px' }} />
                            <button type="submit" className="btn btn-primary">검색</button>
                        </form>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
