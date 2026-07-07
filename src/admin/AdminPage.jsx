import React, { useEffect, useState } from 'react';

import AdminMenu from './AdminMenu';
import CampaignPlan from './CampaignPlan';
import FormatManagement from '../log/components/format/FormatManagement';
import ProcessManagement from '../log/components/process/ProcessManagement';
import FilterManagement from '../log/components/filter/FilterManagement';
import LogManagement from '../log/components/db/LogManagement';
import DeduplicationManagement from '../log/components/deduplication/DeduplicationManagement';
import Kibana from '../log/components/monitoring/Kibana';
import MemberManagement from '../sign/components/MemberManagement';


import AdminPostManagement from './AdminPostManagement';
import { useNavigate } from 'react-router-dom';
import UserAuthentication from '../sign/service/UserAuthentication';
import { toast } from 'react-toastify';

const AdminPage = () => {
  const [activeMenu, setActiveMenu] = useState('post');
  const [processId, setProcessId] = useState(1);
  const navigate = useNavigate();

  // 렌더링할 컴포넌트 결정
  const renderContent = () => {
    switch (activeMenu) {
      case 'member':
        return <MemberManagement />;
      case 'process':
        return <ProcessManagement setPID={setProcessId} onMenuClick={setActiveMenu} />;
      case 'post':
        return <AdminPostManagement />;
      case 'format':
        return <FormatManagement processId={processId} onMenuClick={setActiveMenu} />
      case 'filter':
        return <FilterManagement processId={processId} onMenuClick={setActiveMenu} />
      case 'log':
        return <LogManagement onMenuClick={setActiveMenu} />
      case 'deduplication':
        return <DeduplicationManagement processId={processId} onMenuClick={setActiveMenu} />
      case 'monitoring':
        return <Kibana/>

      default:
        return <div>선택된 메뉴가 없습니다.</div>;
    }
  };

  useEffect(() => {
    if(!UserAuthentication.isAdmin()) {
      toast.error("관리자 권한이 아닙니다.");
      navigate("/");
    }
  }, []);

  return (
    <div className="container-fluid admin-page-root">
      <div className="row">
        {/* 왼쪽: 메뉴 (props로 onMenuClick 전달) */}
        <div className="col-lg-2 p-0 admin-sidebar min-vh-100" >
          <AdminMenu
            onMenuClick={setActiveMenu}
            activeMenu={['format', 'filter', 'deduplication'].includes(activeMenu) ? 'process' : activeMenu}
          />
        </div>

        {/* 오른쪽: 본문 */}
        <div className="col-md-9 col-lg-10 p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
