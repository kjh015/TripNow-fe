import React from 'react';

const LogTable = ({
    title, data, expandedRowId, setExpandedRowId,
    sortConfig, setSortConfig, columns, color, details
}) => {
    const handleSort = (key) => {
        const newConfig = sortConfig.key === key
            ? { key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' }
            : { key, direction: 'asc' };
        setSortConfig(newConfig);
    };

    const getSortedList = () => {
        const { key, direction } = sortConfig;
        if (!key) return data;
        return [...data].sort((a, b) => {
            let aValue = a[key];
            let bValue = b[key];
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        });
    };

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return (
            <span className="log-table-sort-icon">
                {sortConfig.direction === 'asc' ? '▲' : '▼'}
            </span>
        );
    };

    const formatDate = (isoString) => {
        if (!isoString) return "-";
        return isoString.substring(0, 16).replace("T", " ");
    };


    const sortedList = getSortedList();

    return (
        <div>
            <h3 className="mb-3">{title}</h3>
            <div className="table-responsive log-table-scroll">
                <table className={`table table-bordered table-hover align-middle`}>
                    <thead className={`text-center table-${color}`}>
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
                        {sortedList.length === 0 ? (
                            <tr><td colSpan={columns.length} className="text-muted">데이터가 없습니다.</td></tr>
                        ) : (
                            sortedList.flatMap(row => [
                                <tr key={row.historyId} className="log-table-row-clickable" onClick={() => setExpandedRowId(expandedRowId === row.historyId ? null : row.historyId)}>
                                    {columns.map(col => (
                                        <td key={col.key}>
                                            {col.render ? col.render(row) : (
                                                col.key === 'createdAt'
                                                    ? formatDate(row[col.key])
                                                    : row[col.key]
                                            )}
                                        </td>
                                    ))}
                                </tr>,
                                expandedRowId === row.historyId && (
                                    <tr key={`${row.historyId}-expanded`}>
                                        <td colSpan={columns.length} className="text-start bg-light">
                                            <strong>Log Data:</strong>
                                            <pre
                                                className="mb-0 mt-2 log-table-detail-pre"
                                            >
                                                {details?.[row.historyId] ? JSON.stringify(details[row.historyId], null, 2) : '불러오는 중...'}
                                            </pre>
                                        </td>
                                    </tr>
                                )
                            ])
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogTable;
