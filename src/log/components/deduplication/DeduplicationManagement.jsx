import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import InputDeduplication from './InputDeduplication';
import { getDedupRules } from '../../../api/log/deduplicationApi';
import { formatDate } from '../../../utils/dateUtils';
import AdminPageHeader from '../../../admin/AdminPageHeader';
import AdminPipelineNav from '../../../admin/AdminPipelineNav';
import DetailDeduplication from './DetailDeduplication';

const DeduplicationManagement = ({ processId, onMenuClick }) => {
  const [ddpList, setDdpList] = useState([]);
  const [showInput, setShowInput] = useState(false);
  const [showDetail, setShowDetail] = useState(0);

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

  useEffect(() => {
    getDeduplicationList();
    // eslint-disable-next-line
  }, [showDetail, showInput]);

  return (
    <div className="log-page-spacer">
      <AdminPageHeader title="중복 제거 관리">
        <button className="btn admin-btn admin-btn-primary" onClick={() => setShowInput(true)}>+ 중복 제거 추가</button>
      </AdminPageHeader>

      <AdminPipelineNav active="deduplication" onNavigate={onMenuClick} />

      <div className="admin-table-card mb-4">
      <table className="table admin-table text-center align-middle mb-0">
        <thead>
          <tr>
            <th className="log-col-10">ID</th>
            <th className="text-start log-col-30">이름</th>
            <th>생성 날짜</th>
            <th>수정 날짜</th>
            <th className="log-col-10">활성화</th>
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
                      className={`btn btn-sm admin-toggle ${ddp.isActive ? "admin-toggle-on" : "admin-toggle-off"}`}
                      onClick={() => handleToggleActive(ddp.dedupRuleId, ddp.isActive)}
                    >
                      {ddp.isActive ? "ON" : "OFF"}
                    </button>
                  </td>
                </tr>
                {showDetail === ddp.dedupRuleId && (
                  <tr className="admin-table-detail-row">
                    <td colSpan="5" className="text-center">
                      <DetailDeduplication
                        processId={processId}
                        id={ddp.dedupRuleId}
                        onClose={handleDetailClose}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))
          )}
        </tbody>
      </table>
      </div>

      <Modal show={showInput} onHide={() => handleInputClose(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>중복 제거 추가</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputDeduplication processId={processId} onClose={handleInputClose} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DeduplicationManagement;
