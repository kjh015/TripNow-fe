import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createFormatRule } from '../../../api/log/formatApi';

const InputFormat = ({ onClose, processId }) => {
    const [defaultEntry, setDefaultEntry] = useState([{ key: '', value: '' }]);
    const [formatEntry, setFormatEntry] = useState([{ key: '', value: '' }]);
    const [name, setName] = useState('');
    const [active, setActive] = useState(false);

    const handleEntryChange = (setter, entries, index, field, value) => {
        const newEntries = [...entries];
        newEntries[index][field] = value;
        setter(newEntries);
    };

    const addEntry = (setter, entries) => {
        setter([...entries, { key: '', value: '' }]);
    };

    const removeEntry = (setter, entries, index) => {
        const newEntries = entries.filter((_, i) => i !== index);
        setter(newEntries);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const toObject = (entries) => {
            const obj = {};
            entries.forEach(entry => {
                if (entry.key) obj[entry.key] = entry.value;
            });
            return obj;
        };

        const fieldMappings = toObject(formatEntry);
        const defaultValues = toObject(defaultEntry);

        try {
            await createFormatRule(processId, { name, isActive: active, defaultValues, fieldMappings });
            toast.success("포맷 추가 성공!");
            onClose();
        } catch {
            toast.error("포맷 추가 실패!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4 text-start">
                <label className="form-label fw-semibold">포맷 이름</label>
                <input
                    type="text"
                    className="form-control log-format-detail-name-input"
                    placeholder="format name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>

            <div className="row">
                <div className="col-md-6 mb-3">
                    <div className="admin-section-box p-3 h-100">
                        <h5 className="mb-3">기본 정보</h5>
                        {defaultEntry.map((entry, index) => (
                            <div key={`default-${index}`} className="d-flex align-items-center mb-2">
                                <input type="text" className="form-control me-2 log-format-flex-1" placeholder="Key"
                                    value={entry.key}
                                    onChange={e => handleEntryChange(setDefaultEntry, defaultEntry, index, 'key', e.target.value)} />
                                <input type="text" className="form-control me-2 log-format-flex-2" placeholder="Value"
                                    value={entry.value}
                                    onChange={e => handleEntryChange(setDefaultEntry, defaultEntry, index, 'value', e.target.value)} />
                                <button type="button" className="btn admin-btn-icon admin-btn-danger"
                                    onClick={() => removeEntry(setDefaultEntry, defaultEntry, index)}>✕</button>
                            </div>
                        ))}
                        <button type="button" className="btn admin-btn admin-btn-outline admin-btn-sm mt-2"
                            onClick={() => addEntry(setDefaultEntry, defaultEntry)}>+ 항목 추가</button>
                    </div>
                </div>
                <div className="col-md-6 mb-3">
                    <div className="admin-section-box p-3 h-100">
                        <h5 className="mb-3">포맷 정보</h5>
                        {formatEntry.map((entry, index) => (
                            <div key={`format-${index}`} className="d-flex align-items-center mb-2">
                                <input type="text" className="form-control me-2 log-format-flex-1" placeholder="Key"
                                    value={entry.key}
                                    onChange={e => handleEntryChange(setFormatEntry, formatEntry, index, 'key', e.target.value)} />
                                <span className="mx-1">⬅</span>
                                <input type="text" className="form-control me-2 log-format-flex-2" placeholder="Value"
                                    value={entry.value}
                                    onChange={e => handleEntryChange(setFormatEntry, formatEntry, index, 'value', e.target.value)} />
                                <button type="button" className="btn admin-btn-icon admin-btn-danger"
                                    onClick={() => removeEntry(setFormatEntry, formatEntry, index)}>✕</button>
                            </div>
                        ))}
                        <button type="button" className="btn admin-btn admin-btn-outline admin-btn-sm mt-2"
                            onClick={() => addEntry(setFormatEntry, formatEntry)}>+ 항목 추가</button>
                    </div>
                </div>
            </div>

            <div className="admin-form-footer">
                <button type="button" className={`btn btn-sm admin-toggle ${active ? 'admin-toggle-on' : 'admin-toggle-off'}`}
                    onClick={() => setActive(prev => !prev)}>
                    활성화: {active ? "ON" : "OFF"}
                </button>
                <div className="admin-form-footer-actions">
                    <button type="button" className="btn admin-btn admin-btn-outline" onClick={onClose}>닫기</button>
                    <button type="submit" className="btn admin-btn admin-btn-primary">추가</button>
                </div>
            </div>
        </form>
    );
};

export default InputFormat;
