import React, { useState, useEffect, useCallback } from 'react';
import { getLogProcesses } from '../../../api/log/logProcessApi';
import InputProcess from './InputProcess';
import EditProcess from './EditProcess';

const ProcessManagement = ({ setPID, onMenuClick }) => {
    const [processList, setProcessList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedProcessId, setSelectedProcessId] = useState(null);
    const [editComp, setEditComp] = useState(0);
    const [alert, setAlert] = useState(null);

    // 공통 경고창 함수 (자동 사라짐)
    const showAlert = useCallback((type, message, duration = 1800) => {
        setAlert({ type, message });
        if (duration > 0) setTimeout(() => setAlert(null), duration);
    }, []);

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

    // 모달 body 스크롤 방지
    useEffect(() => {
        if (showModal) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
    }, [showModal]);

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedProcessId(null);
    };
    const handleEditComp = () => setEditComp(0);

    const processDate = (isoString) => {
        if (!isoString) return "-";
        return isoString.substring(0, 16).replace("T", " ");
    };

    return (
        <div className="log-page-spacer">
            <div className="d-flex align-items-center mb-4 process-header-row">
                <h2 className="fw-bold process-status-dot">●</h2>
                <h2 className="fw-bold process-header-title">프로세스 관리</h2>
            </div>
            <div className="d-flex justify-content-end  mb-3">
                <button
                    className="btn btn-success shadow-sm log-btn-rounded"
                    onClick={() => setShowModal(true)}
                >
                    + 프로세스 추가
                </button>
            </div>

            {/* 중앙 상단 고정 경고창 */}
            {alert && (
                <div className={`alert alert-${alert.type} fw-semibold py-2 px-3 mb-0 d-inline-block text-center custom-alert-center`}>
                    {alert.message}
                </div>
            )}

            <div className="card shadow-sm rounded-4 mb-4 log-card-noborder">
                <table className="table table-hover table-bordered align-middle text-center mb-0">
                    <thead className="table-light">
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
                                    <td>{process.createdAt && processDate(process.createdAt)}</td>
                                    <td>{process.updatedAt && processDate(process.updatedAt)}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-primary btn-sm px-3 log-btn-rounded-sm"
                                            onClick={() => setEditComp(process.logProcessId)}
                                        >
                                            수정
                                        </button>
                                    </td>
                                </tr>
                                {editComp === process.logProcessId && (
                                    <tr>
                                        <td colSpan={5} className="process-edit-row">
                                            <EditProcess
                                                onClose={handleEditComp}
                                                processId={process.logProcessId}
                                                _name={process.name}
                                                showAlert={showAlert}
                                            />
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>


            {/* 모달 구조 */}
            {showModal && (
                <div
                    className="modal fade show log-modal-backdrop-30"
                    tabIndex="-1"
                    onClick={handleCloseModal}
                >
                    <div
                        className="modal-dialog modal-dialog-centered log-modal-dialog-sm"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="modal-content rounded-4" >
                            <div className="modal-header" >
                                <h5 className="modal-title fw-bold">프로세스 추가</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <InputProcess
                                    onClose={handleCloseModal}
                                    processId={selectedProcessId}
                                    showAlert={showAlert}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProcessManagement;
