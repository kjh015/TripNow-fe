import React from 'react';
import PropTypes from 'prop-types';

const STEPS = [
    { key: 'format', label: '포맷 관리' },
    { key: 'filter', label: '필터 관리' },
    { key: 'deduplication', label: '중복제거 관리' },
];

const AdminPipelineNav = ({ active, onNavigate }) => (
    <ul className="nav nav-pills admin-pipeline-nav mb-3">
        {STEPS.map(step => (
            <li className="nav-item" key={step.key}>
                <button
                    type="button"
                    className={`nav-link admin-pipeline-nav-link${active === step.key ? ' active' : ''}`}
                    onClick={() => onNavigate(step.key)}
                >
                    {step.label}
                </button>
            </li>
        ))}
    </ul>
);

AdminPipelineNav.propTypes = {
    active: PropTypes.oneOf(['format', 'filter', 'deduplication']).isRequired,
    onNavigate: PropTypes.func.isRequired,
};

export default AdminPipelineNav;
