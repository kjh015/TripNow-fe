import React from 'react';
import PropTypes from 'prop-types';
import { formatDate } from '../../../utils/dateUtils';
import LogDetail from './LogDetail';

/** 최대 5개의 페이지 번호를 현재 페이지 중심으로 보여주는 페이지네이션 (page는 0부터) */
const LogPagination = ({ page, totalPages, onChange }) => {
    if (!totalPages || totalPages <= 1) return null;
    const WINDOW = 5;
    const start = Math.max(0, Math.min(page - Math.floor(WINDOW / 2), totalPages - WINDOW));
    const pages = Array.from({ length: Math.min(WINDOW, totalPages) }, (_, idx) => start + idx);
    return (
        <nav className="d-flex justify-content-center mt-3">
            <ul className="pagination pagination-sm mb-0">
                <li className={`page-item${page === 0 ? ' disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page - 1)} disabled={page === 0}>이전</button>
                </li>
                {pages.map((p) => (
                    <li key={p} className={`page-item${page === p ? ' active' : ''}`}>
                        <button className="page-link" onClick={() => onChange(p)}>{p + 1}</button>
                    </li>
                ))}
                <li className={`page-item${page === totalPages - 1 ? ' disabled' : ''}`}>
                    <button className="page-link" onClick={() => onChange(page + 1)} disabled={page === totalPages - 1}>다음</button>
                </li>
            </ul>
        </nav>
    );
};

LogPagination.propTypes = {
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired,
};

const LogTable = ({
    title, data, expandedRowId, setExpandedRowId,
    sortConfig, setSortConfig, columns, color, details,
    page, totalPages, onPageChange,
}) => {
    const handleSort = (key) => {
        const newConfig = sortConfig.key === key
            ? { key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' }
            : { key, direction: 'asc' };
        setSortConfig(newConfig);
    };

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return (
            <span className="log-table-sort-icon">
                {sortConfig.direction === 'asc' ? '▲' : '▼'}
            </span>
        );
    };

    return (
        <div>
            <h4 className="mb-3 fw-bold">
                <span className={`admin-log-table-dot bg-${color}`}></span>
                {title}
            </h4>
            <div className="admin-table-card">
                <div className="table-responsive log-table-scroll">
                <table className="table admin-table align-middle mb-0">
                    <thead className="text-center">
                        <tr>
                            {columns.map(col =>
                                <th
                                    key={col.key}
                                    className={col.sortable ? "log-table-sortable-th" : undefined}
                                    style={{ width: col.width || undefined }}
                                    onClick={col.sortable ? () => handleSort(col.key) : undefined}
                                >
                                    {col.label}{col.sortable && renderSortIcon(col.key)}
                                </th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {data.length === 0 ? (
                            <tr><td colSpan={columns.length} className="text-muted">데이터가 없습니다.</td></tr>
                        ) : (
                            data.flatMap(row => [
                                <tr key={row.historyId} className="log-table-row-clickable" onClick={() => setExpandedRowId(expandedRowId === row.historyId ? null : row.historyId)}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row) : (
                                                col.key === 'timestamp'
                                                    ? formatDate(row[col.key])
                                                    : row[col.key]
                                            )}
                                        </td>
                                    ))}
                                </tr>,
                                expandedRowId === row.historyId && (
                                    <tr key={`${row.historyId}-expanded`} className="admin-table-detail-row">
                                        <td colSpan={columns.length} className="text-start">
                                            <LogDetail detail={details?.[row.historyId]} />
                                        </td>
                                    </tr>
                                )
                            ])
                        )}
                    </tbody>
                </table>
                </div>
            </div>
            <LogPagination page={page} totalPages={totalPages} onChange={onPageChange} />
        </div>
    );
};

LogTable.propTypes = {
    title: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    expandedRowId: PropTypes.string,
    setExpandedRowId: PropTypes.func.isRequired,
    sortConfig: PropTypes.shape({
        key: PropTypes.string,
        direction: PropTypes.oneOf(['asc', 'desc']),
    }).isRequired,
    setSortConfig: PropTypes.func.isRequired,
    columns: PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        width: PropTypes.string,
        sortable: PropTypes.bool,
        render: PropTypes.func,
    })).isRequired,
    color: PropTypes.string.isRequired,
    details: PropTypes.object,
    page: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    onPageChange: PropTypes.func.isRequired,
};

export default LogTable;
