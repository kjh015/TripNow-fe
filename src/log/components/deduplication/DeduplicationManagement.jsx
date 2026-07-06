import React, { useEffect, useState, useCallback } from 'react';
import InputDeduplication from './InputDeduplication';
import { getDedupRules } from '../../../api/log/deduplicationApi';
import DetailDeduplication from './DetailDeduplication';

const DeduplicationManagement = ({ processId, onMenuClick }) => {
  const [ddpList, setDdpList] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [showDetail, setShowDetail] = useState(0);
  const [alert, setAlert] = useState(null);

  const showAlert = useCallback(({ type, message, duration = 2000 }) => {
    setAlert({ type, message });
    if (duration > 0) setTimeout(() => setAlert(null), duration);
  }, []);

  const getDeduplicationList = async () => {
    try {
        const { data } = await getDedupRules(processId, { size: 100 });
        setDdpList(data.result.content);
    } catch {
        // 에러 시 목록 유지
    }
  };

  // 입력창/상세창 닫기 콜백
  const handleInputClose = (refresh = false) => {
    setShowInput(false);
    if (refresh) getDeduplicationList();
  };
  const handleDetailClose = (refresh = false) => {
    setShowDetail(0);
    if (refresh) getDeduplicationList();
  }

  // 활성화 토글
  const handleToggleActive = (id, current) => {
    // DeduplicationApiClient.updateActive(id, !current)
    //   .then(res => {
    //     if (res.ok) getDeduplicationList();
    //     else alert('활성화 변경 실패');
    //   });
  };

  // 날짜 포맷
  const formatDate = (isoString) => {
    if (!isoString) return "-";
    return isoString.substring(0, 16).replace("T", " ");
  };


  useEffect(() => {
    getDeduplicationList();
    // eslint-disable-next-line
  }, [showDetail, showInput]);

  return (
    <div style={{ marginTop: '80px' }}>
      <h2 className="fw-bold mb-4">중복 제거 관리</h2>

      {/* 중앙 상단 고정 경고창 */}
      {alert && (
        <div
          className={`alert alert-${alert.type} fw-semibold py-2 px-3 mb-0 d-inline-block text-center custom-alert-center`}
        >
          {alert.message}
        </div>
      )}



      {/* 상단 버튼 영역 */}
      <div className="d-flex justify-content-end mb-3">
        <button className="btn btn-primary me-2" onClick={() => setShowInput(true)}>
          중복 제거 추가
        </button>
        <button className="btn btn-secondary" onClick={() => onMenuClick('filter')}>
          ⬅ 필터 관리
        </button>
      </div>

      <table className="table table-bordered text-center align-middle">
        <thead className="table-light">
          <tr>
            <th style={{ width: '10%' }}>ID</th>
            <th className="text-start" style={{ width: '30%' }}>이름</th>
            <th>생성 날짜</th>
            <th>수정 날짜</th>
            <th style={{ width: '10%' }}>활성화</th>
          </tr>
        </thead>
        <tbody>
          {ddpList.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-muted">중복 제거 설정이 없습니다.</td>
            </tr>
          ) : (
            ddpList.map(ddp => (
              <React.Fragment key={ddp.dedupRuleId}>
                <tr>
                  <td>{ddp.dedupRuleId}</td>
                  <td className="text-start">
                    <span
                      className="dedup-name-hover"
                      role="button"
                      onClick={() => setShowDetail(showDetail === ddp.dedupRuleId ? 0 : ddp.dedupRuleId)}
                      title={ddp.name}
                    >
                      {ddp.name}
                    </span>
                  </td>
                  <td>{formatDate(ddp.createdAt)}</td>
                  <td>{formatDate(ddp.updatedAt)}</td>
                  <td>

                    <button
                      className={`btn btn-sm ${ddp.isActive ? "btn-success" : "btn-outline-secondary"}`}
                      onClick={() => handleToggleActive(ddp.dedupRuleId, ddp.isActive)}
                    >
                      {ddp.isActive ? "ON" : "OFF"}
                    </button>
                  </td>
                </tr>
                {showDetail === ddp.dedupRuleId && (
                  <tr>
                    <td colSpan="5" className="text-center bg-light">
                      <DetailDeduplication
                        processId={processId}
                        id={ddp.dedupRuleId}
                        onClose={handleDetailClose}
                        showOutAlert={showAlert}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>

      {/* 추가 입력 모달 */}
      {showInput && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-lg" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">중복 제거 추가</h5>
                <button type="button" className="btn-close" aria-label="Close"
                  onClick={() => handleInputClose(false)}></button>
              </div>
              <div className="modal-body">
                <InputDeduplication processId={processId} onClose={handleInputClose}
                  showOutAlert={showAlert}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeduplicationManagement;
