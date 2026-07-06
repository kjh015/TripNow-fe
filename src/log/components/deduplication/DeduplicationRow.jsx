import React, { useEffect, useState } from 'react';
import { getActiveFormatRuleFields } from '../../../api/log/formatApi';

// DeduplicationRow는 "포맷-데이터 쌍을 여러 개 입력"할 수 있도록 바뀜
const DeduplicationRow = ({ processId, index, data, onChange, onRemove }) => {
    const [formatList, setFormatList] = useState([]);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await getActiveFormatRuleFields(processId);
                setFormatList(data.result.fields);
            } catch {
                // 에러 시 빈 목록 유지
            }
        };
        load();
    }, [processId]);

    // 조건(필드-데이터) 한 줄의 기본값
    const initialCondition = { field: '', value: '', matchType: 'Exact' };

    // 조건 배열 조작 함수들
    const handleConditionChange = (condIdx, field, value) => {
        const newConditions = data.conditions.map((c, i) =>
            i === condIdx ? { ...c, [field]: value } : c
        );
        onChange(index, { ...data, conditions: newConditions });
    };

    const handleAddCondition = () => {
        onChange(index, { ...data, conditions: [...data.conditions, initialCondition] });
    };

    const handleRemoveCondition = (condIdx) => {
        if (data.conditions.length > 1) {
            const newConditions = data.conditions.filter((_, i) => i !== condIdx);
            onChange(index, { ...data, conditions: newConditions });
        }
    };

    // 중복시간 입력값 처리
    const handleTimeChange = (e) => {
        const { name, value } = e.target;
        onChange(index, { ...data, [name]: value });
    };

    return (
        <div
            className="border rounded bg-white p-3 mb-3 dedup-row-card"
        >
            <div className="row align-items-center mb-3">
                <label className="form-label d-flex mb-1 fw-bold justify-content-center">필드/데이터 조건</label>
                <div className="col-12">
                    {data.conditions.map((cond, condIdx) => (
                        <div className="d-flex gap-2 mb-2 align-items-center justify-content-center" key={condIdx}>
                            <select
                                name="field"
                                className="form-select dedup-field-select"
                                value={cond.field}
                                onChange={e => handleConditionChange(condIdx, "field", e.target.value)}
                            >
                                <option value="">선택</option>
                                {formatList.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                            <input
                                name="value"
                                type="text"
                                className="form-control dedup-field-select"
                                placeholder="문자열 입력"
                                value={cond.value}
                                onChange={e => handleConditionChange(condIdx, "value", e.target.value)}
                            />
                            <select
                                name="matchType"
                                className="form-select dedup-matchtype-select"
                                value={cond.matchType}
                                onChange={e => handleConditionChange(condIdx, "matchType", e.target.value)}
                            >
                                <option value="Exact">Exact</option>
                                <option value="Any">Any</option>
                            </select>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                type="button"
                                onClick={() => handleRemoveCondition(condIdx)}
                                disabled={data.conditions.length === 1}
                            >삭제</button>
                        </div>
                    ))}
                    <button className="btn btn-outline-success btn-sm mt-1" type="button" onClick={handleAddCondition}>
                        +
                    </button>
                </div>
            </div>
            {/* 제거 시간 */}
            <label className="form-label d-flex mb-1 fw-bold justify-content-center">중복 제거 시간</label>
            <div className="mb-2 text-center">
                <div className="p-3 border rounded bg-light d-inline-block">
                    <div className="d-flex flex-row justify-content-center gap-3">
                        <div className="d-flex align-items-center gap-1">
                            <input name="days" type="number" min="0" className="form-control dedup-time-input" value={data.days} onChange={handleTimeChange} />
                            <span className="dedup-time-label">일</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <input name="hours" type="number" min="0" className="form-control dedup-time-input" value={data.hours} onChange={handleTimeChange} />
                            <span className="dedup-time-label">시</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <input name="minutes" type="number" min="0" className="form-control dedup-time-input" value={data.minutes} onChange={handleTimeChange} />
                            <span className="dedup-time-label">분</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <input name="seconds" type="number" min="0" className="form-control dedup-time-input" value={data.seconds} onChange={handleTimeChange} />
                            <span className="dedup-time-label">초</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* 삭제 버튼 */}
            <div className="d-flex justify-content-end">
                <button className="btn btn-outline-danger mt-3" onClick={() => onRemove(index)} type="button" aria-label="삭제">X</button>
            </div>
        </div>
    );
};

export default DeduplicationRow;
