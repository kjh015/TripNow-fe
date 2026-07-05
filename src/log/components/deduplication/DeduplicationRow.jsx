import React, { useEffect, useState } from 'react';
import DeduplicationApiClient from '../../service/DeduplicationApiClient';

// DeduplicationRow는 "포맷-데이터 쌍을 여러 개 입력"할 수 있도록 바뀜
const DeduplicationRow = ({ processId, index, data, onChange, onRemove }) => {
    const [formatList, setFormatList] = useState([]);

    useEffect(() => {
        DeduplicationApiClient.getFormatKeys(processId)
            .then(res => res.json().then(data => setFormatList(data)));
    }, [processId]);

    // 조건(포맷-데이터) 한 줄의 기본값
    const initialCondition = { format: '', value: '' };

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

    // 스타일 유틸
    const inputBoxStyle = { width: 90, textAlign: 'right', display: 'inline-block' };
    const labelStyle = { minWidth: 28, textAlign: 'center', display: 'inline-block' };

    return (
        <div
            className="border rounded bg-white p-3 mb-3"
            style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.03)', position: 'relative' }}
        >
            <div className="row align-items-center mb-3">
                <label className="form-label d-flex mb-1 fw-bold justify-content-center">포맷/데이터 조건</label>
                <div className="col-12">
                    {data.conditions.map((cond, condIdx) => (
                        <div className="d-flex gap-2 mb-2 align-items-center justify-content-center" key={condIdx}>
                            <select
                                name="format"
                                className="form-select"
                                style={{ maxWidth: 200 }}
                                value={cond.format}
                                onChange={e => handleConditionChange(condIdx, "format", e.target.value)}
                            >
                                <option value="">선택</option>
                                {formatList.map(f => (
                                    <option key={f} value={f}>{f}</option>
                                ))}
                            </select>
                            <input
                                name="value"
                                type="text"
                                className="form-control"
                                placeholder="문자열 입력"
                                style={{ maxWidth: 200 }}
                                value={cond.value}
                                onChange={e => handleConditionChange(condIdx, "value", e.target.value)}
                            />
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
            {/* 
             제거 시간 (2줄 3칸씩) */}
            <label className="form-label d-flex mb-1 fw-bold justify-content-center">중복 제거 시간</label>
            <div className="mb-2 text-center">
                <div className="p-3 border rounded bg-light d-inline-block">
                    <div className="d-flex flex-row mb-2 justify-content-center gap-3">
                        <div className="d-flex align-items-center gap-1">
                            <input name="year" type="number" min="0" className="form-control" style={inputBoxStyle} value={data.year} onChange={handleTimeChange} />
                            <span style={labelStyle}>년</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <input name="month" type="number" min="0" className="form-control" style={inputBoxStyle} value={data.month} onChange={handleTimeChange} />
                            <span style={labelStyle}>월</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <input name="day" type="number" min="0" className="form-control" style={inputBoxStyle} value={data.day} onChange={handleTimeChange} />
                            <span style={labelStyle}>일</span>
                        </div>
                    </div>
                    <div className="d-flex flex-row justify-content-center gap-3">
                        <div className="d-flex align-items-center gap-1">
                            <input name="hour" type="number" min="0" className="form-control" style={inputBoxStyle} value={data.hour} onChange={handleTimeChange} />
                            <span style={labelStyle}>시</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <input name="minute" type="number" min="0" className="form-control" style={inputBoxStyle} value={data.minute} onChange={handleTimeChange} />
                            <span style={labelStyle}>분</span>
                        </div>
                        <div className="d-flex align-items-center gap-1">
                            <input name="second" type="number" min="0" className="form-control" style={inputBoxStyle} value={data.second} onChange={handleTimeChange} />
                            <span style={labelStyle}>초</span>
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
