import React, { useEffect, useRef, useState } from 'react';
import AdminPageHeader from '../../../admin/AdminPageHeader';

const KIBANA_URL = process.env.REACT_APP_KIBANA_URL;
const KIBANA_DASHBOARD_ID = process.env.REACT_APP_KIBANA_DASHBOARD_ID;

// cross-origin iframe은 로드 실패해도 onError가 오지 않아, 제한 시간 내 onLoad가 없으면 연결 실패로 간주한다
const LOAD_TIMEOUT_MS = 10000;

// Kibana 대시보드 임베드 URL
// _g: 자동 새로고침(60초) + 기본 시간 범위(최근 7일), show-*: 대시보드 내 시간/검색 UI 노출
const KIBANA_GLOBAL_STATE = '(refreshInterval:(pause:!t,value:60000),time:(from:now-7d/d,to:now))';

const buildDashboardUrl = () => {
    if (!KIBANA_URL || !KIBANA_DASHBOARD_ID) return null;
    const params = [
        'embed=true',
        `_g=${encodeURIComponent(KIBANA_GLOBAL_STATE)}`,
        'show-top-menu=true',
        'show-query-input=true',
        'show-time-filter=true',
    ].join('&');
    return `${KIBANA_URL}/app/dashboards#/view/${KIBANA_DASHBOARD_ID}?${params}`;
};

const Kibana = () => {
    const dashboardUrl = buildDashboardUrl();

    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [expanded, setExpanded] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const timerRef = useRef(null);

    // 로드 감시 타이머 — 마운트 및 새로고침(reloadKey)마다 재시작
    useEffect(() => {
        if (!dashboardUrl) return undefined;
        setStatus('loading');
        timerRef.current = setTimeout(
            () => setStatus(prev => (prev === 'loading' ? 'error' : prev)),
            LOAD_TIMEOUT_MS
        );
        return () => clearTimeout(timerRef.current);
    }, [dashboardUrl, reloadKey]);

    // 넓게 보기: Esc로 닫기 + 뒤 페이지 스크롤 잠금
    useEffect(() => {
        if (!expanded) return undefined;
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setExpanded(false);
        };
        window.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [expanded]);

    const handleLoaded = () => {
        clearTimeout(timerRef.current);
        setStatus('ready');
    };

    const handleReload = () => setReloadKey(prev => prev + 1);

    // 환경변수 미설정 — 대시보드를 만들 수 없으므로 안내만 노출
    if (!dashboardUrl) {
        return (
            <div className="container log-page-padding">
                <AdminPageHeader title="모니터링" />
                <div className="kibana-frame">
                    <div className="kibana-overlay">
                        <i className="bi bi-gear kibana-overlay-icon" />
                        <p className="kibana-overlay-title">Kibana 설정이 없습니다</p>
                        <p className="kibana-overlay-desc">
                            <code>REACT_APP_KIBANA_URL</code>, <code>REACT_APP_KIBANA_DASHBOARD_ID</code>를
                            <br />
                            .env에 설정한 뒤 앱을 다시 시작해 주세요.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="container log-page-padding">
            <AdminPageHeader title="모니터링">
                <button
                    type="button"
                    className="btn admin-btn admin-btn-outline admin-btn-sm"
                    onClick={handleReload}
                >
                    <i className="bi bi-arrow-clockwise" /> 새로고침
                </button>
                <button
                    type="button"
                    className="btn admin-btn admin-btn-outline admin-btn-sm"
                    onClick={() => setExpanded(true)}
                >
                    <i className="bi bi-arrows-fullscreen" /> 넓게 보기
                </button>
                <a
                    className="btn admin-btn admin-btn-primary admin-btn-sm"
                    href={dashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <i className="bi bi-box-arrow-up-right" /> 새 탭에서 열기
                </a>
            </AdminPageHeader>

            <div className={`kibana-frame${expanded ? ' kibana-frame-expanded' : ''}`}>
                {expanded && (
                    <button
                        type="button"
                        className="btn admin-btn admin-btn-outline admin-btn-sm kibana-collapse-btn"
                        onClick={() => setExpanded(false)}
                    >
                        <i className="bi bi-fullscreen-exit" /> 축소 (Esc)
                    </button>
                )}

                {status === 'loading' && (
                    <div className="kibana-overlay">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="kibana-overlay-desc">대시보드를 불러오는 중입니다...</p>
                    </div>
                )}

                {status === 'error' && (
                    <div className="kibana-overlay">
                        <i className="bi bi-exclamation-triangle kibana-overlay-icon" />
                        <p className="kibana-overlay-title">Kibana에 연결할 수 없습니다</p>
                        <p className="kibana-overlay-desc">
                            Kibana 서버가 실행 중인지, 로그인이 필요한지 확인해 주세요.
                        </p>
                        <div className="d-flex gap-2">
                            <button
                                type="button"
                                className="btn admin-btn admin-btn-outline admin-btn-sm"
                                onClick={handleReload}
                            >
                                다시 시도
                            </button>
                            <a
                                className="btn admin-btn admin-btn-primary admin-btn-sm"
                                href={dashboardUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                새 탭에서 열기
                            </a>
                        </div>
                    </div>
                )}

                {/* sandbox: Kibana 동작에 필요한 최소 권한만 허용 (상위 프레임 탈취·top navigation 차단) */}
                <iframe
                    key={reloadKey}
                    title="Kibana 로그 모니터링 대시보드"
                    src={dashboardUrl}
                    className="kibana-iframe"
                    sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads"
                    referrerPolicy="no-referrer"
                    allowFullScreen
                    onLoad={handleLoaded}
                />
            </div>
        </div>
    );
};

export default Kibana;
