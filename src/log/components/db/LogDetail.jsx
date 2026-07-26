import React, { useState } from 'react';
import PropTypes from 'prop-types';

/** logData 값 하나를 타입에 맞게 렌더링 (null/boolean/number/object 구분) */
const ValueCell = ({ value }) => {
    if (value === null || value === undefined) {
        return <span className="log-detail-value-null">null</span>;
    }
    if (typeof value === 'boolean' || typeof value === 'number') {
        return <span className="log-detail-value-accent">{String(value)}</span>;
    }
    if (typeof value === 'object') {
        return <pre className="log-detail-value-pre">{JSON.stringify(value, null, 2)}</pre>;
    }
    return <span>{String(value)}</span>;
};

ValueCell.propTypes = {
    value: PropTypes.any,
};

/**
 * 처리 기록 상세(logData) 뷰.
 * detail이 없으면 로딩, detail.error면 에러, 그 외에는 key-value 표를 보여주고
 * 헤더의 토글 버튼으로 원본 JSON 보기로 전환할 수 있다.
 */
const LogDetail = ({ detail }) => {
    const [showRawJson, setShowRawJson] = useState(false);

    if (!detail) {
        return (
            <div className="log-detail-card p-3 text-center text-muted">
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                불러오는 중...
            </div>
        );
    }

    if (detail.error) {
        return (
            <div className="log-detail-card p-3 text-center text-danger">
                <i className="bi bi-exclamation-triangle me-2" />
                {detail.error}
            </div>
        );
    }

    const entries = Object.entries(detail.logData || {});

    return (
        <div className="log-detail-card">
            <div className="log-detail-header">
                <i className="bi bi-braces log-detail-title" />
                <span className="log-detail-title">원본 로그 데이터</span>
                <span className="log-detail-count">{entries.length}개 필드</span>
                <button
                    type="button"
                    className="admin-btn admin-btn-sm admin-btn-outline ms-auto"
                    onClick={() => setShowRawJson(prev => !prev)}
                >
                    <i className={`bi ${showRawJson ? 'bi-table' : 'bi-code-slash'} me-1`} />
                    {showRawJson ? '표로 보기' : 'JSON으로 보기'}
                </button>
            </div>
            {entries.length === 0 ? (
                <div className="p-3 text-center text-muted">로그 데이터가 없습니다.</div>
            ) : showRawJson ? (
                <pre className="log-table-detail-pre log-detail-raw">
                    {JSON.stringify(detail.logData, null, 2)}
                </pre>
            ) : (
                <div className="log-detail-grid">
                    {entries.map(([key, value]) => (
                        <React.Fragment key={key}>
                            <div className="log-detail-key">{key}</div>
                            <div className="log-detail-value"><ValueCell value={value} /></div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

LogDetail.propTypes = {
    detail: PropTypes.shape({
        error: PropTypes.string,
        logData: PropTypes.object,
    }),
};

export default LogDetail;
