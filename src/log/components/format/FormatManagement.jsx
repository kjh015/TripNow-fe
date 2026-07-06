import React, { useEffect, useState, useCallback } from 'react';
import { getFormatRules } from '../../../api/log/formatApi';
import InputFormat from './InputFormat';
import DetailFormat from './DetailFormat';

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

    const getFormats = useCallback(async () => {
        try {
            const { data } = await getFormatRules(processId, { size: 100 });
            setFormatList(data.result.content);
        } catch {
            // 에러 시 목록 유지
        }
    }, [processId]);

    useEffect(() => { getFormats(); }, [inputComp, detailComp, getFormats]);

    const formatDate = (isoString) => {
        if (!isoString) return "-";
        return isoString.substring(0, 16).replace("T", " ");
    };

    return (
        <div style={{ marginTop: '80px' }}>
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
                                        <button className={`btn btn-sm ${format.isActive ? 'btn-primary' : 'btn-outline-primary'} me-2`}>
                                            {format.isActive ? 'ON' : 'OFF'}
                                        </button>
                                    </td>
                                </tr>
                                {detailComp === format.formatRuleId && (
                                    <tr>
                                        <td colSpan="5" className="text-center bg-light">
                                            <DetailFormat
                                                onClose={() => setDetailComp(0)}
                                                formatId={format.formatRuleId}
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
