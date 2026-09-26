import React from 'react';
import PropTypes from 'prop-types';

const AdminPageHeader = ({ title, badge, children }) => (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 admin-page-header">
        <div className="d-flex align-items-center gap-2">
            <h2 className="fw-bold admin-page-header-title">{title}</h2>
            {badge && <span className="admin-page-header-badge">{badge}</span>}
        </div>
        {children && <div className="d-flex gap-2 admin-page-header-actions">{children}</div>}
    </div>
);

AdminPageHeader.propTypes = {
    title: PropTypes.node.isRequired,
    badge: PropTypes.node,
    children: PropTypes.node,
};

export default AdminPageHeader;
