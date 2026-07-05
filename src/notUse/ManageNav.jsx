import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const ManageNav = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top" aria-label="Main navbar">
            <div className="container-fluid">
                <span className="navbar-brand">Format Management</span>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <a className="nav-link" href="/component/admnpage">관리자 페이지</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="./process">프로세스 관리</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default ManageNav;   