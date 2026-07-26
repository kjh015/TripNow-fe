import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getHistories, getHistory } from '../../../api/log/historyApi';
import AdminPageHeader from '../../../admin/AdminPageHeader';
import LogTable from './LogTable';

const PAGE_SIZE = 10;

// 컬럼 키 → 백엔드 정렬 프로퍼티 (Spring Data ES가 @Field명 @timestamp/log_process_name/fail_info.fail_rule_name으로 변환)
// historyId는 ES 자동 생성 랜덤 id라 정렬 의미가 없어 제외
const SORT_PROPERTIES = {
    timestamp: 'timestamp',
    logProcessName: 'logProcessName',
    failRuleName: 'failInfo.failRuleName',
};

const toSortParam = ({ key, direction }) => {
    const property = SORT_PROPERTIES[key];
    return property ? `${property},${direction}` : undefined;
};

const LogManagement = ({ onMenuClick }) => {
    const [successList, setSuccessList] = useState([]);
    const [failFilterList, setFailFilterList] = useState([]);
    const [failDedupList, setFailDedupList] = useState([]);

    const [successPage, setSuccessPage] = useState(0);
    const [failFilterPage, setFailFilterPage] = useState(0);
    const [failDedupPage, setFailDedupPage] = useState(0);

    const [successTotalPages, setSuccessTotalPages] = useState(0);
    const [failFilterTotalPages, setFailFilterTotalPages] = useState(0);
    const [failDedupTotalPages, setFailDedupTotalPages] = useState(0);

    const [expandedSuccessRowId, setExpandedSuccessRowId] = useState(null);
    const [expandedFailFilterRowId, setExpandedFailFilterRowId] = useState(null);
    const [expandedFailDedupRowId, setExpandedFailDedupRowId] = useState(null);

    const [successDetails, setSuccessDetails] = useState({});
    const [failFilterDetails, setFailFilterDetails] = useState({});
    const [failDedupDetails, setFailDedupDetails] = useState({});

    const [successSortConfig, setSuccessSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
    const [failFilterSortConfig, setFailFilterSortConfig] = useState({ key: 'timestamp', direction: 'desc' });
    const [failDedupSortConfig, setFailDedupSortConfig] = useState({ key: 'timestamp', direction: 'desc' });

    const loadList = async (params, setList, setTotalPages, errorMessage) => {
        try {
            const { data } = await getHistories({ ...params, size: PAGE_SIZE });
            setList(data.result.content);
            setTotalPages(data.result.totalPages);
        } catch {
            toast.error(errorMessage);
        }
    };

    useEffect(() => {
        loadList({ status: 'SUCCESS', page: successPage, sort: toSortParam(successSortConfig) },
            setSuccessList, setSuccessTotalPages, "성공 기록을 불러오지 못했습니다.");
    }, [successPage, successSortConfig]);

    useEffect(() => {
        loadList({ status: 'FAIL', stage: 'FILTER', page: failFilterPage, sort: toSortParam(failFilterSortConfig) },
            setFailFilterList, setFailFilterTotalPages, "필터 실패 기록을 불러오지 못했습니다.");
    }, [failFilterPage, failFilterSortConfig]);

    useEffect(() => {
        loadList({ status: 'FAIL', stage: 'DEDUP', page: failDedupPage, sort: toSortParam(failDedupSortConfig) },
            setFailDedupList, setFailDedupTotalPages, "중복제거 실패 기록을 불러오지 못했습니다.");
    }, [failDedupPage, failDedupSortConfig]);

    const loadDetail = async (historyId, cache, setCache) => {
        if (cache[historyId]) return;
        try {
            const { data } = await getHistory(historyId);
            setCache(prev => ({ ...prev, [historyId]: { logData: data.result.logData } }));
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

    // 페이지 이동 시 펼쳐진 상세를 접는다 (다른 페이지의 행이 남아 보이는 것 방지)
    const handleSuccessPageChange = (p) => { setSuccessPage(p); setExpandedSuccessRowId(null); };
    const handleFailFilterPageChange = (p) => { setFailFilterPage(p); setExpandedFailFilterRowId(null); };
    const handleFailDedupPageChange = (p) => { setFailDedupPage(p); setExpandedFailDedupRowId(null); };

    // 정렬 변경은 서버 재조회 — 1페이지로 리셋하고 펼쳐진 상세를 접는다
    const handleSuccessSortChange = (config) => { setSuccessSortConfig(config); handleSuccessPageChange(0); };
    const handleFailFilterSortChange = (config) => { setFailFilterSortConfig(config); handleFailFilterPageChange(0); };
    const handleFailDedupSortChange = (config) => { setFailDedupSortConfig(config); handleFailDedupPageChange(0); };

    // historyId는 ES 자동 생성 랜덤 id라 정렬 제외 (SORT_PROPERTIES 참조)
    const columnsSuccess = [
        { key: 'historyId', label: 'History ID', width: '20%' },
        { key: 'logProcessName', label: 'Process', width: '20%', sortable: true },
        { key: 'timestamp', label: '생성 시간', sortable: true },
    ];

    const columnsFailFilter = [
        { key: 'historyId', label: 'History ID', width: '15%' },
        { key: 'logProcessName', label: 'Process', width: '15%', sortable: true },
        { key: 'failRuleName', label: '실패 원인', width: '20%', sortable: true },
        { key: 'timestamp', label: '생성 시간', sortable: true },
    ];

    const columnsFailDedup = [
        { key: 'historyId', label: 'History ID', width: '15%' },
        { key: 'logProcessName', label: 'Process', width: '15%', sortable: true },
        { key: 'failRuleName', label: '실패 원인', width: '20%', sortable: true },
        { key: 'timestamp', label: '생성 시간', sortable: true },
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
                        setSortConfig={handleSuccessSortChange}
                        columns={columnsSuccess}
                        details={successDetails}
                        color="primary"
                        page={successPage}
                        totalPages={successTotalPages}
                        onPageChange={handleSuccessPageChange}
                    />
                </div>
                <div className="col-12 mb-4">
                    <LogTable
                        title="필터 실패"
                        data={failFilterList}
                        expandedRowId={expandedFailFilterRowId}
                        setExpandedRowId={setExpandedFailFilterRowId}
                        sortConfig={failFilterSortConfig}
                        setSortConfig={handleFailFilterSortChange}
                        columns={columnsFailFilter}
                        details={failFilterDetails}
                        color="danger"
                        page={failFilterPage}
                        totalPages={failFilterTotalPages}
                        onPageChange={handleFailFilterPageChange}
                    />
                </div>
                <div className="col-12 mb-4">
                    <LogTable
                        title="중복제거 실패"
                        data={failDedupList}
                        expandedRowId={expandedFailDedupRowId}
                        setExpandedRowId={setExpandedFailDedupRowId}
                        sortConfig={failDedupSortConfig}
                        setSortConfig={handleFailDedupSortChange}
                        columns={columnsFailDedup}
                        details={failDedupDetails}
                        color="warning"
                        page={failDedupPage}
                        totalPages={failDedupTotalPages}
                        onPageChange={handleFailDedupPageChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default LogManagement;
