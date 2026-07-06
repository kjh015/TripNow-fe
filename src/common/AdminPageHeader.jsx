import React from 'react';
import PropTypes from 'prop-types';

const AdminPageHeader = ({ title, children }) => (
    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 admin-page-header">
        <h2 className="fw-bold admin-page-header-title">{title}</h2>
        {children && <div className="d-flex gap-2 admin-page-header-actions">{children}</div>}
    </div>
);

AdminPageHeader.propTypes = {
    title: PropTypes.node.isRequired,
    children: PropTypes.node,
};

export default AdminPageHeader;
