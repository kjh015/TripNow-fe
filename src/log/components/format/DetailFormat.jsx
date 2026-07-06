import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getFormatRule, updateFormatRule, deleteFormatRule } from '../../../api/log/formatApi';

const
    DetailFormat = ({ onClose, formatId }) => {
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

        // 포맷 상세 가져오기
        const viewFormat = async () => {
            try {
                const { data } = await getFormatRule(formatId);
                const result = data.result;
                setFormatEntry(Object.entries(result.fieldMappings || {}).map(([key, value]) => ({ key, value })));
                setDefaultEntry(Object.entries(result.defaultValues || {}).map(([key, value]) => ({ key, value })));
                setName(result.name);
                setActive(result.isActive);
            } catch {
                toast.error("포맷 정보를 불러오지 못했습니다.");
            }
        };

        // 삭제
        const removeFormat = async () => {
            try {
                await deleteFormatRule(formatId);
                toast.success("포맷 삭제 성공!");
                onClose();
            } catch {
                toast.error("포맷 삭제 실패");
            }
        };

        // 수정(저장)
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
                await updateFormatRule(formatId, { name, isActive: active, defaultValues, fieldMappings });
                toast.success("포맷 수정 성공!");
                onClose();
            } catch {
                toast.error("포맷 수정 실패");
            }
        };

        useEffect(() => {
            viewFormat();
            // eslint-disable-next-line
        }, []);

        return (
            <div className="log-format-detail-container">
                <h4 className="mb-4 admin-detail-title">포맷 상세</h4>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4 text-center">
                        <label className="fw-bold mb-2 d-block">포맷 이름</label>
                        <input
                            type="text"
                            className="form-control log-format-detail-name-input mx-auto"
                            placeholder="format name"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    {/* 나란히 배치 */}
                    <div className="row">
                        {/* Default Entry */}
                        <div className="col-md-6 mb-3">
                            <div className="admin-section-box p-3 h-100">
                                <h5 className="mb-3">기본 정보</h5>
                                {defaultEntry.map((entry, index) => (
                                    <div key={`default-${index}`} className="d-flex align-items-center mb-2">
                                        <input
                                            type="text"
                                            placeholder="Key"
                                            value={entry.key}
                                            onChange={e =>
                                                handleEntryChange(setDefaultEntry, defaultEntry, index, 'key', e.target.value)
                                            }
                                            className="form-control me-2 log-format-flex-1"
                                        />
                                        <input
                                            type="text"
                                            placeholder="Value"
                                            value={entry.value}
                                            onChange={e =>
                                                handleEntryChange(setDefaultEntry, defaultEntry, index, 'value', e.target.value)
                                            }
                                            className="form-control me-2 log-format-flex-2"
                                        />
                                        <button
                                            type="button"
                                            className="btn admin-btn-icon admin-btn-danger"
                                            onClick={() => removeEntry(setDefaultEntry, defaultEntry, index)}
                                        >✕</button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addEntry(setDefaultEntry, defaultEntry)}
                                    className="btn admin-btn admin-btn-outline admin-btn-sm mt-2"
                                >+ 항목 추가</button>
                            </div>
                        </div>
                        {/* Format Entry */}
                        <div className="col-md-6 mb-3">
                            <div className="admin-section-box p-3 h-100">
                                <h5 className="mb-3">포맷 정보</h5>
                                {formatEntry.map((entry, index) => (
                                    <div key={`format-${index}`} className="d-flex align-items-center mb-2">
                                        <input
                                            type="text"
                                            placeholder="Key"
                                            value={entry.key}
                                            onChange={e =>
                                                handleEntryChange(setFormatEntry, formatEntry, index, 'key', e.target.value)
                                            }
                                            className="form-control me-2 log-format-flex-1"
                                        />
                                        <span className="mx-1">⬅</span>
                                        <input
                                            type="text"
                                            placeholder="Value"
                                            value={entry.value}
                                            onChange={e =>
                                                handleEntryChange(setFormatEntry, formatEntry, index, 'value', e.target.value)
                                            }
                                            className="form-control me-2 log-format-flex-2"
                                        />
                                        <button
                                            type="button"
                                            className="btn admin-btn-icon admin-btn-danger"
                                            onClick={() => removeEntry(setFormatEntry, formatEntry, index)}
                                        >✕</button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => addEntry(setFormatEntry, formatEntry)}
                                    className="btn admin-btn admin-btn-outline admin-btn-sm mt-2"
                                >+ 항목 추가</button>
                            </div>
                        </div>
                    </div>
                    {/* 하단 버튼 */}
                    <div className="mt-4 d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                            <button
                                className={`btn btn-sm admin-toggle ${active ? 'admin-toggle-on' : 'admin-toggle-off'}`}
                                onClick={() => setActive(!active)}
                                type="button"
                            >
                                활성화: {active ? "ON" : "OFF"}
                            </button>
                        </div>
                        <div className="d-flex gap-2">
                            <button type="submit" className="btn admin-btn admin-btn-primary">수정</button>
                            <button type="button" onClick={removeFormat} className="btn admin-btn admin-btn-danger">삭제</button>
                            <button type="button" onClick={onClose} className="btn admin-btn admin-btn-outline">닫기</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    };

export default DetailFormat;
