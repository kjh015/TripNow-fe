import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { getLogProcesses } from '../../../api/log/logProcessApi';
import { formatDate } from '../../../utils/dateUtils';
import AdminPageHeader from '../../../admin/AdminPageHeader';
import InputProcess from './InputProcess';
import EditProcess from './EditProcess';

const ProcessManagement = ({ setPID, onMenuClick }) => {
    const [processList, setProcessList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProcessId, setSelectedProcessId] = useState(null);
    const [editComp, setEditComp] = useState(0);

    const getProcesses = async () => {
        try {
            const { data } = await getLogProcesses({ size: 100 });
            setProcessList(data.result.content);
        } catch {
            // 에러 시 목록 유지
        }
    };

    useEffect(() => {
        getProcesses();
    }, [showModal, editComp]);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProcessId(null);
    };
    const handleEditComp = () => setEditComp(0);

    return (
        <div className="log-page-spacer">
            <AdminPageHeader title="프로세스 관리">
                <button className="btn admin-btn admin-btn-primary" onClick={() => setShowModal(true)}>
                    + 프로세스 추가
                </button>
            </AdminPageHeader>

            <div className="admin-table-card mb-4">
                <table className="table admin-table align-middle text-center mb-0">
                    <thead>
                        <tr>
                            <th className="log-col-15">ID</th>
                            <th className="text-start">이름</th>
                            <th>생성 날짜</th>
                            <th>수정 날짜</th>
                            <th className="log-col-15">수정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processList.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-5 text-muted">프로세스가 없습니다.</td>
                            </tr>
                        )}
                        {processList.map(process => (
                            <React.Fragment key={process.logProcessId}>
                                <tr>
                                    <td>{process.logProcessId}</td>
                                    <td className="text-start">
                                        <span
                                            className="process-name-hover fw-bold"
                                            role="button"
                                            onClick={() => {
                                                setPID(process.logProcessId);
                                                onMenuClick('format');
                                            }}
                                            title="포맷 관리로 이동"
                                        >
                                            {process.name}
                                        </span>
                                    </td>
                                    <td>{process.createdAt && formatDate(process.createdAt)}</td>
                                    <td>{process.updatedAt && formatDate(process.updatedAt)}</td>
                                    <td>
                                        <button
                                            className="btn admin-btn admin-btn-outline admin-btn-sm px-3"
                                            onClick={() => setEditComp(process.logProcessId)}
                                        >
                                            수정
                                        </button>
                                    </td>
                                </tr>
                                {editComp === process.logProcessId && (
                                    <tr className="admin-table-detail-row">
                                        <td colSpan={5} className="process-edit-row">
                                            <EditProcess
                                                onClose={handleEditComp}
                                                processId={process.logProcessId}
                                                _name={process.name}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="fw-bold">프로세스 추가</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputProcess onClose={handleCloseModal} processId={selectedProcessId} />
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default ProcessManagement;
