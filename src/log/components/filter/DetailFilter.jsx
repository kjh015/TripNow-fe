import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getFilterRule, updateFilterRule, deleteFilterRule } from '../../../api/log/filterApi';
import { getActiveFormatRuleFields } from '../../../api/log/formatApi';
import { toApiConditions } from './ConditionBuilder';

const operatorOptions = ['>', '<', '>=', '<=', '==', '!=', 'Equals'];

const DetailFilter = ({ onClose, processId, filterId }) => {
    const [fieldList, setFieldList] = useState([]);
    const [name, setName] = useState('');
    const [active, setActive] = useState(false);
    const [tokens, setTokens] = useState([]);

    const viewFilter = async () => {
        try {
            const { data } = await getFilterRule(filterId);
            const result = data.result;
            setTokens(result.conditions);
            setName(result.name);
            setActive(result.isActive);
        } catch {
            toast.error('필터 정보를 불러오지 못했습니다.');
        }
    };

    const getFieldList = async () => {
        try {
            const { data } = await getActiveFormatRuleFields(processId);
            setFieldList(data.result.fields);
        } catch {
            // 에러 시 목록 유지
        }
    };

    const removeFilter = async () => {
        try {
            await deleteFilterRule(filterId);
            toast.success('필터가 삭제되었습니다.');
            onClose();
        } catch {
            toast.error('필터 삭제에 실패했습니다.');
        }
    };

    useEffect(() => {
        viewFilter();
        getFieldList();
    }, []);

    const addCondition = () => {
        const groupId = Date.now();
        setTokens([
            ...tokens,
            { type: 'operator', value: '&&', groupId },
            { type: 'condition', field: fieldList[0], operator: '>', value: '', groupId }
        ]);
    };

    const addParenAndConditionWithAnd = () => {
        const groupId = Date.now();
        setTokens([
            ...tokens,
            { type: 'operator', value: '&&', groupId },
            { type: 'left-paren', groupId },
            { type: 'condition', field: fieldList[0], operator: '>', value: '', groupId }
        ]);
    };

    const addRightParen = () => {
        const groupId = Date.now();
        setTokens([
            ...tokens,
            { type: 'right-paren', groupId }
        ]);
    };

    const deleteGroup = (groupId) => {
        setTokens(tokens.filter(token => token.groupId !== groupId));
    };

    const updateToken = (index, key, value) => {
        const updated = { ...tokens[index], [key]: value };
        const newTokens = [...tokens];
        newTokens[index] = updated;
        setTokens(newTokens);
    };

    const moveGroup = (groupId, direction) => {
        const groups = getGroups(tokens);
        const idx = groups.findIndex(g => g[0].groupId === groupId);
        if (idx < 0) return;

        const newGroups = [...groups];
        if (direction === 'up' && idx > 1) {
            [newGroups[idx - 1], newGroups[idx]] = [newGroups[idx], newGroups[idx - 1]];
        } else if (direction === 'down' && idx < newGroups.length - 1) {
            [newGroups[idx + 1], newGroups[idx]] = [newGroups[idx], newGroups[idx + 1]];
        }

        setTokens(newGroups.flat());
    };

    const buildExpression = () => {
        return tokens
            .map((token) => {
                switch (token.type) {
                    case 'condition':
                        if (token.operator === 'Equals') {
                            return `${token.field}.equalsIgnoreCase("${token.value}")`;
                        }
                        return `${token.field} ${token.operator} ${token.value}`;
                    case 'operator':
                        return ` ${token.value} `;
                    case 'left-paren':
                        return '(';
                    case 'right-paren':
                        return ')';
                    default:
                        return '';
                }
            })
            .join('');
    };

    const validateParentheses = () => {
        let balance = 0;
        for (const token of tokens) {
            if (token.type === 'left-paren') balance++;
            if (token.type === 'right-paren') balance--;
            if (balance < 0) return false;
        }
        return balance === 0;
    };

    const handleSubmit = async (e) => {

        if (!validateParentheses()) {
            toast.error('❌ 괄호 짝이 맞지 않습니다.');
            return;
        }

        const hasInvalid = tokens.some(token =>
            token.type === 'condition' &&
            (token.field === '' || token.operator === '' || token.value === '')
        );
        if (hasInvalid) {
            toast.error('❌ 조건에 빈 값이 있습니다. 모든 필드, 연산자, 값을 입력해주세요.');
            return;
        }
        const conditions = toApiConditions(tokens);

        try {
            await updateFilterRule(filterId, { name, conditions, isActive: active });
            toast.success('저장되었습니다.');
            onClose();
        } catch {
            toast.error('에러가 발생했습니다.');
        }
    };

    return (
        <div className="container mt-5 log-filter-detail-container">
            <div className="mb-2">
                <h4 className="admin-detail-title">필터 수정</h4>
                <hr />
            </div>


            {/* 현재 표현식 */}
            <div className="bg-light rounded-4 shadow-sm p-3 mb-4 log-expression-box">
                <strong className="me-2">현재 표현식:</strong>
                <code className="text-break log-expression-code">
                    {buildExpression()}
                </code>
            </div>
            <div className="row gx-5">
                {/* 좌측: 설정 및 컨트롤 */}
                <div className="col-lg-4 mb-4">
                    <div className="card shadow-sm rounded-4 p-4 mb-4 border-0">
                        <div className="mb-4">
                            <label className="form-label fw-semibold">필터 이름</label>
                            <input
                                type="text"
                                className="form-control rounded-3"
                                placeholder="filter name"
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label fw-semibold">조건 추가</label>
                            <div className="d-flex gap-2">
                                <button type="button" className="btn admin-btn admin-btn-outline admin-btn-sm" onClick={addParenAndConditionWithAnd}>
                                    ( + 조건
                                </button>
                                <button type="button" className="btn admin-btn admin-btn-outline admin-btn-sm" onClick={addRightParen}>)</button>
                                <button type="button" className="btn admin-btn admin-btn-outline admin-btn-sm" onClick={addCondition}>조건</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 우측: 조건식 구성 */}
                <div className="col-lg-8">
                    <div className="card shadow-sm rounded-4 p-4">
                        <div className="mb-2 d-flex align-items-center">
                            <i className="bi bi-funnel fs-5 me-2 text-primary"></i>
                            <span className="fw-semibold">조건 목록</span>
                        </div>
                        <div>
                            {getGroups(tokens).length === 0 && (
                                <div className="text-secondary text-center py-5">
                                    <i className="bi bi-sliders"></i> 조건을 추가해 주세요.
                                </div>
                            )}
                            {getGroups(tokens).map((group, idx) => {
                                const groupId = group[0].groupId;
                                return (
                                    <div key={groupId}>
                                        {group.map((t, i) => {
                                            const tokenIndex = tokens.findIndex(tok => tok === t);

                                            if (t.type === 'operator') {
                                                return (
                                                    <div className="d-flex justify-content-center mb-2" key={i}>
                                                        <button
                                                            className="btn admin-btn admin-btn-outline px-4"
                                                            onClick={() => updateToken(tokenIndex, 'value', t.value === '&&' ? '||' : '&&')}
                                                        >
                                                            {t.value === '&&' ? 'AND' : 'OR'}
                                                        </button>
                                                    </div>
                                                );
                                            }

                                            if (t.type === 'left-paren') {
                                                const nextToken = group[i + 1];
                                                if (nextToken?.type === 'condition') {
                                                    const condIndex = tokens.findIndex(tok => tok === nextToken);
                                                    return (
                                                        <div className="d-flex align-items-center justify-content-center py-2 border-bottom log-condition-row" key={i}>
                                                            <span className="fs-4 fw-bold text-primary me-2">(</span>
                                                            <select className="form-select me-2 log-select-field-lg"
                                                                value={nextToken.field}
                                                                onChange={(e) => updateToken(condIndex, 'field', e.target.value)}>
                                                                <option value="">필드 선택</option>
                                                                {fieldList.map((f) => <option key={f} value={f}>{f}</option>)}
                                                            </select>
                                                            <select className="form-select me-2 log-select-operator-lg"
                                                                value={nextToken.operator}
                                                                onChange={(e) => updateToken(condIndex, 'operator', e.target.value)}>
                                                                {operatorOptions.map((op) => <option key={op} value={op}>{op}</option>)}
                                                            </select>
                                                            <input
                                                                type="text"
                                                                className="form-control me-2 log-input-value-lg"
                                                                value={nextToken.value}
                                                                onChange={(e) => updateToken(condIndex, 'value', e.target.value)}
                                                            />
                                                            {groupId !== 0 && (
                                                                <>
                                                                    <button className="btn admin-btn-icon admin-btn-danger me-1" onClick={() => deleteGroup(groupId)} title="삭제">
                                                                        <i className="bi bi-x-lg"></i>
                                                                    </button>
                                                                    <button className="btn admin-btn-icon admin-btn-ghost me-1" onClick={() => moveGroup(groupId, 'up')} title="위로">⬆</button>
                                                                    <button className="btn admin-btn-icon admin-btn-ghost" onClick={() => moveGroup(groupId, 'down')} title="아래로">⬇</button>
                                                                </>
                                                            )}
                                                        </div>
                                                    );
                                                }
                                            }

                                            if (t.type === 'condition' && group[i - 1]?.type !== 'left-paren') {
                                                return (
                                                    <div className="d-flex align-items-center justify-content-center py-2 border-bottom log-condition-row" key={i}>
                                                        <select className="form-select me-2 log-select-field-lg"
                                                            value={t.field}
                                                            onChange={(e) => updateToken(tokenIndex, 'field', e.target.value)}>
                                                            <option value="">필드 선택</option>
                                                            {fieldList.map((f) => <option key={f} value={f}>{f}</option>)}
                                                        </select>
                                                        <select className="form-select me-2 log-select-operator-lg"
                                                            value={t.operator}
                                                            onChange={(e) => updateToken(tokenIndex, 'operator', e.target.value)}>
                                                            {operatorOptions.map((op) => <option key={op} value={op}>{op}</option>)}
                                                        </select>
                                                        <input type="text" className="form-control me-2 log-input-value-lg"
                                                            value={t.value}
                                                            onChange={(e) => updateToken(tokenIndex, 'value', e.target.value)} />
                                                        {groupId !== 0 && (
                                                            <>
                                                                <button className="btn admin-btn-icon admin-btn-danger me-1" onClick={() => deleteGroup(groupId)} title="삭제">
                                                                    <i className="bi bi-x-lg"></i>
                                                                </button>
                                                                <button className="btn admin-btn-icon admin-btn-ghost me-1" onClick={() => moveGroup(groupId, 'up')} title="위로">⬆</button>
                                                                <button className="btn admin-btn-icon admin-btn-ghost" onClick={() => moveGroup(groupId, 'down')} title="아래로">⬇</button>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            if (t.type === 'right-paren') {
                                                return (
                                                    <div className="d-flex align-items-center justify-content-center py-2 border-bottom log-condition-row" key={i}>
                                                        <span className="fs-4 fw-bold text-primary me-2">)</span>
                                                        {groupId !== 0 && (
                                                            <>
                                                                <button className="btn admin-btn-icon admin-btn-danger me-1" onClick={() => deleteGroup(groupId)} title="삭제">
                                                                    <i className="bi bi-x-lg"></i>
                                                                </button>
                                                                <button className="btn admin-btn-icon admin-btn-ghost me-1" onClick={() => moveGroup(groupId, 'up')} title="위로">⬆</button>
                                                                <button className="btn admin-btn-icon admin-btn-ghost" onClick={() => moveGroup(groupId, 'down')} title="아래로">⬇</button>
                                                            </>
                                                        )}
                                                    </div>
                                                );
                                            }

                                            return null;
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <div className="admin-form-footer">
                <button
                    className={`btn btn-sm admin-toggle ${active ? "admin-toggle-on" : "admin-toggle-off"}`}
                    onClick={() => setActive(!active)}
                    type="button"
                >
                    활성화: {active ? "ON" : "OFF"}
                </button>
                <div className="admin-form-footer-actions">
                    <button type="button" className="btn admin-btn admin-btn-primary" onClick={handleSubmit}>수정</button>
                    <button type="button" className="btn admin-btn admin-btn-danger" onClick={removeFilter}>삭제</button>
                    <button type="button" className="btn admin-btn admin-btn-outline" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

function getGroups(tokens) {
    const groups = [];
    let current = [];
    tokens.forEach((t) => {
        if (current.length === 0 || t.groupId === current[0].groupId) {
            current.push(t);
        } else {
            groups.push(current);
            current = [t];
        }
    });
    if (current.length) groups.push(current);
    return groups;
}

export default DetailFilter;
