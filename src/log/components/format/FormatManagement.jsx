import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'react-bootstrap';
import { getFormatRules } from '../../../api/log/formatApi';
import { formatDate } from '../../../utils/dateUtils';
import AdminPageHeader from '../../../admin/AdminPageHeader';
import AdminPipelineNav from '../../../admin/AdminPipelineNav';
import InputFormat from './InputFormat';
import DetailFormat from './DetailFormat';

const FormatManagement = ({ processId, onMenuClick }) => {
    const [formatList, setFormatList] = useState([]);
    const [inputComp, setInputComp] = useState(false);
    const [detailComp, setDetailComp] = useState(0);

    const getFormats = useCallback(async () => {
        try {
            const { data } = await getFormatRules(processId, { size: 100 });
            setFormatList(data.result.content);
        } catch {
            // 에러 시 목록 유지
        }
    }, [processId]);

    useEffect(() => { getFormats(); }, [inputComp, detailComp, getFormats]);

    return (
        <div className="log-page-spacer">
            <AdminPageHeader title="포맷 관리">
                <button className="btn admin-btn admin-btn-primary" onClick={() => setInputComp(true)}>+ 포맷 추가</button>
            </AdminPageHeader>

            <AdminPipelineNav active="format" onNavigate={onMenuClick} />

            <div className="admin-table-card mb-4">
                <table className="table admin-table text-center align-middle mb-0">
                    <thead>
                        <tr>
                            <th className="log-col-10">ID</th>
                            <th className="text-start log-col-25">이름</th>
                            <th>생성 날짜</th>
                            <th>수정 날짜</th>
                            <th className="log-col-18">관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formatList.length === 0 &&
                            <tr>
                                <td colSpan={5} className="py-5 text-muted">포맷이 없습니다.</td>
                            </tr>
                        }
                        {formatList.map(format => (
                            <React.Fragment key={format.formatRuleId}>
                                <tr>
                                    <td>{format.formatRuleId}</td>
                                    <td className="text-start">
                                        <span
                                            className="format-name-hover fw-bold"
                                            role="button"
                                            onClick={() => setDetailComp(detailComp === format.formatRuleId ? 0 : format.formatRuleId)}
                                        >
                                            {format.name}
                                        </span>
                                    </td>
                                    <td>{format.createdAt && formatDate(format.createdAt)}</td>
                                    <td>{format.updatedAt && formatDate(format.updatedAt)}</td>
                                    <td>
                                        <button className={`btn btn-sm admin-toggle ${format.isActive ? 'admin-toggle-on' : 'admin-toggle-off'}`}>
                                            {format.isActive ? 'ON' : 'OFF'}
                                        </button>
                                    </td>
                                </tr>
                                {detailComp === format.formatRuleId && (
                                    <tr className="admin-table-detail-row">
                                        <td colSpan="5" className="text-center">
                                            <DetailFormat
                                                onClose={() => setDetailComp(0)}
                                                formatId={format.formatRuleId}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={inputComp} onHide={() => setInputComp(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>포맷 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputFormat onClose={() => setInputComp(false)} processId={processId} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default FormatManagement;
