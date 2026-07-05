import React, { useState, useEffect, useCallback } from 'react';
import ProcessApiClient from '../../service/ProcessApiClient';
import InputProcess from './InputProcess';
import EditProcess from './EditProcess';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

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

    const getProcesses = () => {
        ProcessApiClient.getProcessList().then(res => {
            if (res.ok) res.json().then(data => setProcessList(data));
        });
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
        <div style={{ marginTop: '80px' }}>
            <style>{`
                .process-name-hover {
                    font-weight: bold;
                    cursor: pointer;
                    text-decoration: none;
                    transition: text-decoration 0.13s;
                }
                .process-name-hover:hover {
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

            <div className="d-flex align-items-center mb-4" style={{ minHeight: 40 }}>
                <h2 className="fw-bold" style={{ color: "#34a853", paddingBottom: "2px" }}>●</h2>
                <h2 className="fw-bold" style={{ marginLeft: "7px" }}>프로세스 관리</h2>
            </div>
            <div className="d-flex justify-content-end  mb-3">
                <button
                    className="btn btn-success shadow-sm"
                    style={{ borderRadius: "0.7rem", fontWeight: 600 }}
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

            <div className="card shadow-sm rounded-4 mb-4" style={{ border: 0 }}>
                <table className="table table-hover table-bordered align-middle text-center mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '15%' }}>ID</th>
                            <th className="text-start">이름</th>
                            <th>생성 날짜</th>
                            <th>수정 날짜</th>
                            <th style={{ width: '15%' }}>수정</th>
                        </tr>
                    </thead>
                    <tbody>
                        {processList.length === 0 && (
                            <tr>
                                <td colSpan={5} className="py-5 text-muted">프로세스가 없습니다.</td>
                            </tr>
                        )}
                        {processList.map(process => (
                            <React.Fragment key={process.id}>
                                <tr>
                                    <td>{process.id}</td>
                                    <td className="text-start">
                                        <span
                                            className="process-name-hover fw-bold"
                                            role="button"
                                            onClick={() => {
                                                setPID(process.id);
                                                onMenuClick('format');
                                            }}
                                            title="포맷 관리로 이동"
                                        >
                                            {process.name}
                                        </span>
                                    </td>
                                    <td>{process.createdTime && processDate(process.createdTime)}</td>
                                    <td>{process.updatedTime && processDate(process.updatedTime)}</td>
                                    <td>
                                        <button
                                            className="btn btn-outline-primary btn-sm px-3"
                                            style={{ borderRadius: '0.7rem', fontWeight: 500 }}
                                            onClick={() => setEditComp(process.id)}
                                        >
                                            수정
                                        </button>
                                    </td>
                                </tr>
                                {editComp === process.id && (
                                    <tr>
                                        <td colSpan={5} style={{ background: "#f6f8fa", borderBottomLeftRadius: '0.7rem', borderBottomRightRadius: '0.7rem' }}>
                                            <EditProcess
                                                onClose={handleEditComp}
                                                processId={process.id}
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
                    className="modal fade show"
                    tabIndex="-1"
                    style={{
                        display: 'block',
                        background: 'rgba(0,0,0,0.3)',
                        zIndex: 1050,
                    }}
                    onClick={handleCloseModal}
                >
                    <div
                        className="modal-dialog modal-dialog-centered"
                        style={{ maxWidth: 480 }}
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
