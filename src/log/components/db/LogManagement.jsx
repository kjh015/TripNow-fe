import React, { useEffect, useState } from 'react';
import LogDBApiClient from '../../service/LogDBApiClient';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogTable from './LogTable';

const LogManagement = ({ onMenuClick }) => {
    const [successList, setSuccessList] = useState([]);
    const [failFilterList, setFailFilterList] = useState([]);
    const [failDedupList, setFailDedupList] = useState([]);

    const [expandedSuccessRowId, setExpandedSuccessRowId] = useState(null);
    const [expandedFailFilterRowId, setExpandedFailFilterRowId] = useState(null);
    const [expandedFailDedupRowId, setExpandedFailDedupRowId] = useState(null);

    const [successSortConfig, setSuccessSortConfig] = useState({ key: 'id', direction: 'desc' });
    const [failFilterSortConfig, setFailFilterSortConfig] = useState({ key: 'id', direction: 'desc' });
    const [failDedupSortConfig, setFailDedupSortConfig] = useState({ key: 'id', direction: 'desc' });

    // alert 상태 추가
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    useEffect(() => {
        LogDBApiClient.getSuccessList().then(res => {
            if (res.ok) res.json().then(setSuccessList);
            else setAlert({ show: true, message: "Success Log DB get fail", type: "danger" });
        });
        LogDBApiClient.getFailListByFilter().then(res => {
            if (res.ok) res.json().then(setFailFilterList);
            else setAlert({ show: true, message: "Fail-Filter Log DB get fail", type: "danger" });
        });
        LogDBApiClient.getFailListByDeduplication().then(res => {
            if (res.ok) res.json().then(setFailDedupList);
            else setAlert({ show: true, message: "Fail-Deduplication Log DB get fail", type: "danger" });
        });
    }, []);

    const columnsSuccess = [
        { key: 'id', label: 'Log ID', width: '20%', sortable: true },
        { key: 'process', label: 'Process', width: '20%', sortable: true },
        { key: 'createdTime', label: '생성 시간', sortable: true },
    ];

    const columnsFailFilter = [
        { key: 'id', label: 'Log ID', width: '15%', sortable: true },
        { key: 'process', label: 'Process', width: '15%', sortable: true },
        { key: 'filter', label: '실패 원인', width: '20%', sortable: true },
        { key: 'createdTime', label: '생성 시간', sortable: true },
    ];

    const columnsFailDedup = [
        { key: 'id', label: 'Log ID', width: '15%', sortable: true },
        { key: 'process', label: 'Process', width: '15%', sortable: true },
        { key: 'deduplication', label: '실패 원인', width: '20%', sortable: true },
        { key: 'createdTime', label: '생성 시간', sortable: true },
    ];

    const nestedProcess = item => item.process;
    const nestedFilter = item => item.filter;
    const nestedDedup = item => item.deduplication;

    return (
        <div className="container" style={{ paddingTop: '80px' }}>
            {/* Alert 메시지 */}
            {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" aria-label="Close"
                        onClick={() => setAlert({ ...alert, show: false })}></button>
                </div>
            )}

            <h2 className="fw-bold mb-4">결과 로그</h2>

            <div className="row">
                <div className="col-12 mb-4">
                    <LogTable
                        title="성공"
                        data={successList}
                        expandedRowId={expandedSuccessRowId}
                        setExpandedRowId={setExpandedSuccessRowId}
                        sortConfig={successSortConfig}
                        setSortConfig={setSuccessSortConfig}
                        columns={columnsSuccess}
                        nestedFields={{ process: nestedProcess }}
                        color="primary"
                    />
                </div>
                <div className="col-12 mb-4">
                    <LogTable
                        title="필터 실패"
                        data={failFilterList}
                        expandedRowId={expandedFailFilterRowId}
                        setExpandedRowId={setExpandedFailFilterRowId}
                        sortConfig={failFilterSortConfig}
                        setSortConfig={setFailFilterSortConfig}
                        columns={columnsFailFilter}
                        nestedFields={{ process: nestedProcess, filter: nestedFilter }}
                        color="danger"
                    />
                </div>
                <div className="col-12 mb-4">
                    <LogTable
                        title="중복제거 실패"
                        data={failDedupList}
                        expandedRowId={expandedFailDedupRowId}
                        setExpandedRowId={setExpandedFailDedupRowId}
                        sortConfig={failDedupSortConfig}
                        setSortConfig={setFailDedupSortConfig}
                        columns={columnsFailDedup}
                        nestedFields={{ process: nestedProcess, deduplication: nestedDedup }}
                        color="warning"
                    />
                </div>
            </div>
        </div>
    );
};

export default LogManagement;
