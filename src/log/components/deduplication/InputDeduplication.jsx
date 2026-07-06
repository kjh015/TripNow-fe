import React, { useState, useCallback } from 'react';
import DeduplicationRow from './DeduplicationRow';
import { createDedupRule } from '../../../api/log/deduplicationApi';

const initialRow = {
    conditions: [{ field: '', value: '', matchType: 'Exact' }],
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
};

const toApiRules = (rows) => rows.map(row => ({
    conditions: row.conditions,
    expirationTime: { days: row.days, hours: row.hours, minutes: row.minutes, seconds: row.seconds },
}));

const InputDeduplication = ({ processId, onClose,  showOutAlert}) => {
    const [rows, setRows] = useState([initialRow]);
    const [name, setName] = useState('');
    const [active, setActive] = useState(false);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' });

    const showAlert = useCallback(({ type, message }) => {
        setAlert({ show: true, type, message });
    }, []);

    const handleChange = (index, updatedRow) => {
        const newRows = [...rows];
        newRows[index] = updatedRow;
        setRows(newRows);
    };

    const handleAddRow = () => {
        setRows([...rows, { ...initialRow }]);
    };

    const handleRemoveRow = (index) => {
        if (rows.length > 1) {
            const newRows = [...rows];
            newRows.splice(index, 1);
            setRows(newRows);
        }
    };

    const handleSubmit = async () => {
        try {
            await createDedupRule(processId, { name, isActive: active, rules: toApiRules(rows) });
            showOutAlert({ message: '중복 제거가 추가되었습니다.', type: "success" });
            onClose();
        } catch {
            showAlert({ message: '에러 발생', type: "danger" });
        }
    };

    return (
        <div className="dedup-input-container">
            {/* Modal 안에만 표시되는 alert */}
            {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" aria-label="Close"
                        onClick={() => setAlert({ ...alert, show: false })}></button>
                </div>
            )}

            <div className="mb-3">
                <label className="form-label fw-bold">중복 이름</label>
                <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    autoFocus
                />
            </div>

            <div className="mb-3 d-flex justify-content-end">
                <button
                    className={`btn btn-sm ${active ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setActive(!active)}
                    type="button"
                >
                    활성화: {active ? "On" : "Off"}
                </button>
            </div>

            <div>
                {rows.map((row, idx) => (
                    <DeduplicationRow
                        key={idx}
                        processId={processId}
                        index={idx}
                        data={row}
                        onChange={handleChange}
                        onRemove={handleRemoveRow}
                    />
                ))}
            </div>

            <div className="d-flex justify-content-between align-items-center mt-3">
                <button className="btn btn-success" onClick={handleAddRow}>
                    + 조건 추가
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    추가
                </button>
            </div>
        </div>
    );
};

export default InputDeduplication;
