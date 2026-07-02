import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error('ErrorBoundary caught:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div
                    className="min-vh-100 d-flex flex-column align-items-center justify-content-center text-center px-3"
                    style={{ background: "linear-gradient(135deg, #fff5f5 0%, #fed7d7 100%)" }}
                >
                    <i className="bi bi-exclamation-triangle-fill text-danger mb-4" style={{ fontSize: '5rem' }} />
                    <h1 className="h2 fw-bold text-danger mb-3">오류가 발생했습니다</h1>
                    <p className="text-muted mb-4">
                        예상치 못한 오류가 발생했습니다. 페이지를 새로고침 해주세요.
                    </p>
                    <button
                        className="btn btn-danger px-5 py-2 fw-bold rounded-pill shadow"
                        onClick={() => window.location.reload()}
                    >
                        <i className="bi bi-arrow-clockwise me-2" />
                        새로고침
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}

export default ErrorBoundary;
