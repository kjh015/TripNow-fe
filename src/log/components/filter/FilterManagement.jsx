import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { getFilterRules } from '../../../api/log/filterApi';
import { formatDate } from '../../../utils/dateUtils';
import AdminPageHeader from '../../../common/AdminPageHeader';
import AdminPipelineNav from '../../../common/AdminPipelineNav';
import DetailFilter from './DetailFilter';
import ConditionBuilder from './ConditionBuilder';

const FilterManagement = ({ processId, onMenuClick }) => {
    const [filterList, setFilterList] = useState([]);
    const [detailComp, setDetailComp] = useState(0);
    const [builderComp, setBuilderComp] = useState(false);

    const getFilters = async () => {
        try {
            const { data } = await getFilterRules(processId, { size: 100 });
            setFilterList(data.result.content);
        } catch {
            // 에러 시 목록 유지
        }
    };

    useEffect(() => { getFilters(); }, [processId, builderComp, detailComp]);

    return (
        <div className="log-page-spacer">
            <AdminPageHeader title="필터링 관리">
                <button className="btn btn-primary" onClick={() => setBuilderComp(true)}>필터 추가</button>
            </AdminPageHeader>

            <AdminPipelineNav active="filter" onNavigate={onMenuClick} />

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
                                    <td>{formatDate(filter.createdAt)}</td>
                                    <td>{formatDate(filter.updatedAt)}</td>
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
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={builderComp} onHide={() => setBuilderComp(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>필터 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ConditionBuilder onClose={() => setBuilderComp(false)} processId={processId} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FilterManagement;
