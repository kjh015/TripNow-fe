import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getHistories, getHistory } from '../../../api/log/historyApi';
import AdminPageHeader from '../../../admin/AdminPageHeader';
import LogTable from './LogTable';

const LogManagement = ({ onMenuClick }) => {
    const [successList, setSuccessList] = useState([]);
    const [failFilterList, setFailFilterList] = useState([]);
    const [failDedupList, setFailDedupList] = useState([]);

    const [expandedSuccessRowId, setExpandedSuccessRowId] = useState(null);
    const [expandedFailFilterRowId, setExpandedFailFilterRowId] = useState(null);
    const [expandedFailDedupRowId, setExpandedFailDedupRowId] = useState(null);

    const [successDetails, setSuccessDetails] = useState({});
    const [failFilterDetails, setFailFilterDetails] = useState({});
    const [failDedupDetails, setFailDedupDetails] = useState({});

    const [successSortConfig, setSuccessSortConfig] = useState({ key: 'historyId', direction: 'desc' });
    const [failFilterSortConfig, setFailFilterSortConfig] = useState({ key: 'historyId', direction: 'desc' });
    const [failDedupSortConfig, setFailDedupSortConfig] = useState({ key: 'historyId', direction: 'desc' });

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await getHistories({ status: 'SUCCESS', size: 100 });
                setSuccessList(data.result.content);
            } catch {
                toast.error("성공 기록을 불러오지 못했습니다.");
            }
            try {
                const { data } = await getHistories({ status: 'FAIL', stage: 'FILTER', size: 100 });
                setFailFilterList(data.result.content);
            } catch {
                toast.error("필터 실패 기록을 불러오지 못했습니다.");
            }
            try {
                const { data } = await getHistories({ status: 'FAIL', stage: 'DEDUP', size: 100 });
                setFailDedupList(data.result.content);
            } catch {
                toast.error("중복제거 실패 기록을 불러오지 못했습니다.");
            }
        };
        load();
    }, []);

    const loadDetail = async (historyId, cache, setCache) => {
        if (cache[historyId]) return;
        try {
            const { data } = await getHistory(historyId);
            setCache(prev => ({ ...prev, [historyId]: data.result.logData }));
        } catch {
            setCache(prev => ({ ...prev, [historyId]: { error: '로그 데이터를 불러오지 못했습니다.' } }));
        }
    };

    useEffect(() => {
        if (expandedSuccessRowId) loadDetail(expandedSuccessRowId, successDetails, setSuccessDetails);
        // eslint-disable-next-line
    }, [expandedSuccessRowId]);

    useEffect(() => {
        if (expandedFailFilterRowId) loadDetail(expandedFailFilterRowId, failFilterDetails, setFailFilterDetails);
        // eslint-disable-next-line
    }, [expandedFailFilterRowId]);

    useEffect(() => {
        if (expandedFailDedupRowId) loadDetail(expandedFailDedupRowId, failDedupDetails, setFailDedupDetails);
        // eslint-disable-next-line
    }, [expandedFailDedupRowId]);

    const columnsSuccess = [
        { key: 'historyId', label: 'History ID', width: '20%', sortable: true },
        { key: 'logProcessName', label: 'Process', width: '20%', sortable: true },
        { key: 'createdAt', label: '생성 시간', sortable: true },
    ];

    const columnsFailFilter = [
        { key: 'historyId', label: 'History ID', width: '15%', sortable: true },
        { key: 'logProcessName', label: 'Process', width: '15%', sortable: true },
        { key: 'failRuleName', label: '실패 원인', width: '20%', sortable: true },
        { key: 'createdAt', label: '생성 시간', sortable: true },
    ];

    const columnsFailDedup = [
        { key: 'historyId', label: 'History ID', width: '15%', sortable: true },
        { key: 'logProcessName', label: 'Process', width: '15%', sortable: true },
        { key: 'failRuleName', label: '실패 원인', width: '20%', sortable: true },
        { key: 'createdAt', label: '생성 시간', sortable: true },
    ];

    return (
        <div className="container log-page-padding">
            <AdminPageHeader title="처리 기록" />

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
                        details={successDetails}
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
                        details={failFilterDetails}
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
                        details={failDedupDetails}
                        color="warning"
                    />
                </div>
            </div>
        </div>
    );
};

export default LogManagement;
