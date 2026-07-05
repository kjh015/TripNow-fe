// AdmnMenu.jsx
import React from 'react';

const AdmnMenu = ({ onMenuClick }) => {
    return (
        <div className="list-group text-center" >
            <h4 style={{paddingTop: 20}}>관리자 메뉴</h4>
            <button className="list-group-item list-group-item-action" onClick={() => onMenuClick('board')}>
                여행지 관리
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => onMenuClick('member')}>
                회원 관리
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => onMenuClick('process')}>
                프로세스 관리
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => onMenuClick('log')}>
                로그 DB
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => onMenuClick('monitoring')}>
                Monitoring
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => onMenuClick('dashboard')}>
                DashBoard
            </button>
            {/* <button className="list-group-item list-group-item-action" onClick={() => window.open('http://14.63.178.161:9080')}>
                Matomo
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => window.open('http://14.63.178.160:8085')}>
                Kibana
            </button> */}


        </div>
    );
};

export default AdmnMenu;
