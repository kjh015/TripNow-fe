import { Link } from 'react-router-dom';

const NotFoundPage = () => {
    return (
        <div
            className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-3"
            style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}
        >
            <i className="bi bi-map text-primary mb-4" style={{ fontSize: '5rem' }} />
            <h1 className="display-1 fw-bold text-primary">404</h1>
            <h2 className="h4 fw-semibold mb-3 text-secondary">페이지를 찾을 수 없습니다</h2>
            <p className="text-muted mb-4">
                요청하신 페이지가 존재하지 않거나 이동되었습니다.
            </p>
            <Link to="/" className="btn btn-primary px-5 py-2 fw-bold rounded-pill shadow">
                <i className="bi bi-house-fill me-2" />
                홈으로 돌아가기
            </Link>
        </div>
    );
};

export default NotFoundPage;
