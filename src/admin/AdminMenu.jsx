// AdminMenu.jsx
import React from 'react';
import PropTypes from 'prop-types';
import { FaMapMarkedAlt, FaUsers, FaCogs, FaDatabase, FaChartLine } from 'react-icons/fa';

const MENU_ITEMS = [
    { key: 'post', label: '여행지 관리', icon: <FaMapMarkedAlt /> },
    { key: 'member', label: '회원 관리', icon: <FaUsers /> },
    { key: 'process', label: '프로세스 관리', icon: <FaCogs /> },
    { key: 'log', label: '로그 DB', icon: <FaDatabase /> },
    { key: 'monitoring', label: 'Monitoring', icon: <FaChartLine /> },
];

const AdminMenu = ({ onMenuClick, activeMenu }) => {
    return (
        <div className="list-group admin-menu">
            <h4 className="admin-menu-title">관리자 메뉴</h4>
            {MENU_ITEMS.map(item => (
                <button
                    key={item.key}
                    className={`list-group-item list-group-item-action admin-menu-item${activeMenu === item.key ? ' active' : ''}`}
                    onClick={() => onMenuClick(item.key)}
                >
                    <span className="admin-menu-item-icon">{item.icon}</span>
                    {item.label}
                </button>
            ))}
            {/* <button className="list-group-item list-group-item-action" onClick={() => window.open(process.env.REACT_APP_MATOMO_URL)}>
                Matomo
            </button>
            <button className="list-group-item list-group-item-action" onClick={() => window.open('http://14.63.178.160:8085')}>
                Kibana
            </button> */}
        </div>
    );
};

AdminMenu.propTypes = {
    onMenuClick: PropTypes.func.isRequired,
    activeMenu: PropTypes.string,
};

export default AdminMenu;
