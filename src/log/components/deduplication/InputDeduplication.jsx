import React, { useState } from 'react';
import { toast } from 'react-toastify';
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

const InputDeduplication = ({ processId, onClose }) => {
    const [rows, setRows] = useState([initialRow]);
    const [name, setName] = useState('');
    const [active, setActive] = useState(false);

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
            toast.success('중복 제거가 추가되었습니다.');
            onClose();
        } catch {
            toast.error('에러 발생');
        }
    };

    return (
        <div className="dedup-input-container">
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
                    className={`btn btn-sm admin-toggle ${active ? 'admin-toggle-on' : 'admin-toggle-off'}`}
                    onClick={() => setActive(!active)}
                    type="button"
                >
                    활성화: {active ? "ON" : "OFF"}
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
                <button className="btn admin-btn admin-btn-outline" onClick={handleAddRow}>
                    + 규칙 추가
                </button>
                <button className="btn admin-btn admin-btn-primary" onClick={handleSubmit}>
                    추가
                </button>
            </div>
        </div>
    );
};

export default InputDeduplication;
