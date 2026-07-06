import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getDedupRule, updateDedupRule, deleteDedupRule } from '../../../api/log/deduplicationApi';
import DeduplicationRow from './DeduplicationRow';

const initialRow = {
    conditions: [{ field: '', value: '', matchType: 'Exact' }],
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
};

const toUiRows = (rules) => (rules || []).map(rule => ({
    conditions: rule.conditions,
    days: rule.expirationTime?.days ?? 0,
    hours: rule.expirationTime?.hours ?? 0,
    minutes: rule.expirationTime?.minutes ?? 0,
    seconds: rule.expirationTime?.seconds ?? 0,
}));

const toApiRules = (rows) => rows.map(row => ({
    conditions: row.conditions,
    expirationTime: { days: row.days, hours: row.hours, minutes: row.minutes, seconds: row.seconds },
}));

const DetailDeduplication = ({ processId, id, onClose }) => {
    const [rows, setRows] = useState([]);
    const [name, setName] = useState('');
    const [active, setActive] = useState(false);

    const viewDeduplication = async () => {
        try {
            const { data } = await getDedupRule(id);
            const result = data.result;
            setRows(toUiRows(result.rules));
            setName(result.name);
            setActive(result.isActive);
        } catch {
            toast.error("중복 제거 정보를 불러오지 못했습니다.");
        }
    };

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
            await updateDedupRule(id, { name, isActive: active, rules: toApiRules(rows) });
            toast.success('수정되었습니다.');
            setTimeout(() => onClose(true));
        } catch {
            toast.error('에러 발생');
        }
    };

    const handleRemove = async () => {
        try {
            await deleteDedupRule(id);
            toast.success('삭제되었습니다.');
            setTimeout(() => onClose(true));
        } catch {
            toast.error('에러 발생');
        }
    };

    useEffect(() => {
        viewDeduplication();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="container mt-5">
            <h3 className="mb-4">중복 제거 설정 수정</h3>
            <div className="mb-3">
                <label className="form-label">중복 이름</label>
                <input type="text" className="form-control"
                    value={name} onChange={e => setName(e.target.value)} />
            </div>

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

            <div className="d-flex justify-content-between mt-3">
                <button className="btn btn-success" onClick={handleAddRow}>+ 조건 추가</button>
                <button
                    className={`btn btn-sm ${active ? 'btn-success' : 'btn-outline-success'}`}
                    onClick={() => setActive(!active)}
                    type="button"
                >
                    활성화: {active ? "On" : "Off"}
                </button>
                <div className="d-flex justify-content-end">
                    <button className="btn btn-primary" onClick={handleSubmit}>수정</button>
                    <button className="btn btn-danger" onClick={handleRemove}>삭제</button>
                </div>
            </div>
        </div>
    );
};

export default DetailDeduplication;












