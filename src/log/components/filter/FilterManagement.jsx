import React, { useEffect, useState, useCallback } from 'react';
import { getFilterRules } from '../../../api/log/filterApi';
import DetailFilter from './DetailFilter';
import ConditionBuilder from './ConditionBuilder';

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

    const getFilters = async () => {
        try {
            const { data } = await getFilterRules(processId, { size: 100 });
            setFilterList(data.result.content);
        } catch {
            // 에러 시 목록 유지
        }
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
        <div className="log-page-spacer">
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

            <div className="card shadow-sm rounded-4 mb-4 log-card-noborder">
                <table className="table table-bordered text-center align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th className="log-col-10">ID</th>
                            <th className="text-start log-col-30">이름</th>
                            <th>생성 날짜</th>
                            <th>수정 날짜</th>
                            <th className="log-col-10">활성화</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filterList.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-muted py-5">필터가 없습니다.</td>
                            </tr>
                        ) : filterList.map(filter => (
                            <React.Fragment key={filter.filterRuleId}>
                                <tr>
                                    <td>{filter.filterRuleId}</td>
                                    <td className="text-start">
                                        <span
                                            className="format-name-hover fw-bold"
                                            role="button"
                                            onClick={() => setDetailComp(detailComp === filter.filterRuleId ? 0 : filter.filterRuleId)}
                                            title={filter.name}
                                        >
                                            {filter.name}
                                        </span>
                                    </td>
                                    <td>{filterDate(filter.createdAt)}</td>
                                    <td>{filterDate(filter.updatedAt)}</td>
                                    <td>
                                        <button
                                            className={`btn btn-sm ${filter.isActive ? 'btn-success' : 'btn-outline-success'}`}
                                        >
                                            {filter.isActive ? 'ON' : 'OFF'}
                                        </button>
                                    </td>
                                </tr>
                                {detailComp === filter.filterRuleId && (
                                    <tr>
                                        <td colSpan="5" className="text-center bg-light">
                                            <DetailFilter
                                                onClose={() => setDetailComp(0)}
                                                filterId={filter.filterRuleId}
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
                <div className="modal show d-block log-modal-backdrop-50" tabIndex="-1">
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
