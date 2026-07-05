import React, { useEffect, useState, useCallback } from 'react';
import FilterApiClient from '../../service/FilterApiClient';
import DetailFilter from './DetailFilter';
import ConditionBuilder from './ConditionBuilder';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const FilterManagement = ({ processId, onMenuClick }) => {
    const [filterList, setFilterList] = useState([]);
    const [detailComp, setDetailComp] = useState(0);
    const [builderComp, setBuilderComp] = useState(false);
    const [alert, setAlert] = useState(null);

    // 자동 사라지는 경고창
    const showAlert = useCallback(({ type, message, duration = 1800 }) => {
        setAlert({ type, message });
        if (duration > 0) setTimeout(() => setAlert(null), duration);
    }, []);

    const getFilters = () => {
        FilterApiClient.getFilterList(processId).then(res => {
            if (res.ok) res.json().then(data => setFilterList(data));
        });
    };

    useEffect(() => { getFilters(); }, [processId, builderComp, detailComp]);

    // 모달 스크롤 방지
    useEffect(() => {
        if (builderComp) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [builderComp]);

    const filterDate = (isoString) => {
        if (!isoString) return "-";
        return isoString.substring(0, 16).replace("T", " ");
    };

    return (
        <div style={{ marginTop: '80px' }}>
            <style>{`
                .format-name-hover {
                    font-weight: bold;
                    cursor: pointer;
                    text-decoration: none;
                    transition: text-decoration 0.13s;
                }
                .format-name-hover:hover {
                    text-decoration: underline;
                }
                .custom-alert-center {
                    position: fixed;
                    top: 64px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 3000;
                    min-width: 220px;
                    max-width: 380px;
                    border-radius: 0.95rem;
                    box-shadow: 0 3px 12px 0 rgba(0,0,0,0.14);
                    font-size: 1.06rem;
                    padding: 0.7rem 2rem;
                    pointer-events: none;
                }
            `}</style>

            {/* 화면 중앙 위 고정 알림 */}
            {alert && (
                <div className={`alert alert-${alert.type} fw-semibold mb-0 text-center custom-alert-center`}>
                    {alert.message}
                </div>
            )}

            <h2 className="fw-bold mb-4">필터링 관리</h2>

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary me-2" onClick={() => setBuilderComp(true)}>
                    필터 추가
                </button>
                <button className="btn btn-secondary me-2" onClick={() => onMenuClick('format')}>
                    ⬅ 포맷 관리
                </button>
                <button className="btn btn-secondary" onClick={() => onMenuClick('deduplication')}>
                    중복제거 관리 ➡
                </button>
            </div>

            <div className="card shadow-sm rounded-4 mb-4" style={{ border: 0 }}>
                <table className="table table-bordered text-center align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '10%' }}>ID</th>
                            <th className="text-start" style={{ width: '30%' }}>이름</th>
                            <th>생성 날짜</th>
                            <th>수정 날짜</th>
                            <th style={{ width: '10%' }}>활성화</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-muted py-5">필터가 없습니다.</td>
                            </tr>
                        ) : filterList.map(filter => (
                            <React.Fragment key={filter.id}>
                                <tr>
                                    <td>{filter.id}</td>
                                    <td className="text-start">
                                        <span
                                            className="format-name-hover fw-bold"
                                            role="button"
                                            onClick={() => setDetailComp(detailComp === filter.id ? 0 : filter.id)}
                                            title={filter.name}
                                        >
                                            {filter.name}
                                        </span>
                                    </td>
                                    <td>{filterDate(filter.createdTime)}</td>
                                    <td>{filterDate(filter.updatedTime)}</td>
                                    <td>
                                        <button
                                            className={`btn btn-sm ${filter.active ? 'btn-success' : 'btn-outline-success'}`}
                                        >
                                            {filter.active ? 'ON' : 'OFF'}
                                        </button>
                                    </td>
                                </tr>
                                {detailComp === filter.id && (
                                    <tr>
                                        <td colSpan="5" className="text-center bg-light">
                                            <DetailFilter
                                                onClose={() => setDetailComp(0)}
                                                filterId={filter.id}
                                                processId={processId}
                                                showOutAlert={showAlert}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            {builderComp && (
                <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg" role="document">
                        <div className="modal-content rounded-4">
                            <div className="modal-header">
                                <h5 className="modal-title">필터 추가</h5>
                                <button type="button" className="btn-close" aria-label="Close"
                                    onClick={() => setBuilderComp(false)}></button>
                            </div>
                            <div className="modal-body">
                                <ConditionBuilder
                                    onClose={() => setBuilderComp(false)}
                                    processId={processId}
                                    showOutAlert={showAlert}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterManagement;
