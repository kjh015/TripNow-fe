import React, { useEffect, useState, useCallback } from 'react';
import FormatApiClient from '../../service/FormatApiClient';
import InputFormat from './InputFormat';
import DetailFormat from './DetailFormat';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const FormatManagement = ({ processId, onMenuClick }) => {
    const [formatList, setFormatList] = useState([]);
    const [inputComp, setInputComp] = useState(false);
    const [detailComp, setDetailComp] = useState(0);
    const [alert, setAlert] = useState(null);

    // 경고창 자동 사라짐
    const showAlert = useCallback((type, message, duration = 1800) => {
        setAlert({ type, message });
        if (duration > 0) setTimeout(() => setAlert(null), duration);
    }, []);

    const getFormats = useCallback(() => {
        FormatApiClient.getFormatList(processId).then(res => {
            if (res.ok) res.json().then(data => setFormatList(data));
        });
    }, [processId]);

    useEffect(() => { getFormats(); }, [inputComp, detailComp, getFormats]);

    const formatDate = (isoString) => {
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

            <h2 className="fw-bold mb-4">포맷 관리</h2>

            {/* 중앙 상단 고정 경고창 */}
            {alert && (
                <div
                    className={`alert alert-${alert.type} fw-semibold py-2 px-3 mb-0 d-inline-block text-center custom-alert-center`}
                >
                    {alert.message}
                </div>
            )}

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-primary me-2" onClick={() => setInputComp(true)}>포맷 추가</button>
                <button className="btn btn-secondary" onClick={() => onMenuClick('filter')}>필터링 관리 ➡</button>
            </div>

            <div className="card shadow-sm rounded-4 mb-4" style={{ border: 0 }}>
                <table className="table table-bordered text-center align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: '10%' }}>ID</th>
                            <th className="text-start" style={{ width: '25%' }}>이름</th>
                            <th>생성 날짜</th>
                            <th>수정 날짜</th>
                            <th style={{ width: '18%' }}>관리</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formatList.length === 0 &&
                            <tr>
                                <td colSpan={5} className="py-5 text-muted">포맷이 없습니다.</td>
                            </tr>
                        }
                        {formatList.map(format => (
                            <React.Fragment key={format.id}>
                                <tr>
                                    <td>{format.id}</td>
                                    <td className="text-start">
                                        <span
                                            className="format-name-hover fw-bold"
                                            role="button"
                                            onClick={() => setDetailComp(detailComp === format.id ? 0 : format.id)}
                                        >
                                            {format.name}
                                        </span>
                                    </td>
                                    <td>{format.createdTime && formatDate(format.createdTime)}</td>
                                    <td>{format.updatedTime && formatDate(format.updatedTime)}</td>
                                    <td>
                                        <button className={`btn btn-sm ${format.active ? 'btn-primary' : 'btn-outline-primary'} me-2`}>
                                            {format.active ? 'ON' : 'OFF'}
                                        </button>
                                    </td>
                                </tr>
                                {detailComp === format.id && (
                                    <tr>
                                        <td colSpan="5" className="text-center bg-light">
                                            <DetailFormat
                                                onClose={() => setDetailComp(0)}
                                                formatId={format.id}
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

            {inputComp && (
                <InputFormat
                    onClose={() => setInputComp(false)}
                    processId={processId}
                    showAlert={showAlert}
                />
            )}
        </div>
    );
};

export default FormatManagement;
