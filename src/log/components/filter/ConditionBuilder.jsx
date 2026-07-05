import React, { useCallback, useEffect, useState } from 'react';
import FilterApiClient from '../../service/FilterApiClient';

const operatorOptions = ['>', '<', '>=', '<=', '==', '!=', 'Equals'];

const ConditionBuilder = ({ onClose, processId, showOutAlert }) => {
    const [fieldList, setFieldList] = useState([]);
    const [name, setName] = useState('');
    const [active, setActive] = useState(false);
    const [tokens, setTokens] = useState([
        { type: 'condition', field: '', operator: '>', value: '', groupId: 0 }
    ]);

    // alert 상태
    const [alert, setAlert] = useState(null);

    const showAlert = useCallback(({ type, message }) => {
        setAlert({ type, message });
    }, []);


    useEffect(() => {
        FilterApiClient.getFormatKeys(processId)
            .then(res => res.json())
            .then(data => setFieldList(data));
    }, [processId]);

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
            showAlert({ message: "❌ 괄호 짝이 맞지 않습니다.", type: 'danger' });
            return;
        }

        const hasInvalid = tokens.some(token =>
            token.type === 'condition' &&
            (token.field === '' || token.operator === '' || token.value === '')
        );
        if (hasInvalid) {
            showAlert({ message: '❌ 조건에 빈 값이 있습니다. 모든 필드, 연산자, 값을 입력해주세요.', type: 'danger' });
            return;
        }

        const tokensWithType = tokens.map(token => {
            if (token.type === 'condition') {
                return {
                    ...token,
                    valueType: inferValueType(token.value, token.operator)
                };
            }
            return token;
        });

        const expr = buildExpression();
        console.log('전송 문자열:', expr);

        FilterApiClient.addFilter(processId, name, active, expr, tokensWithType)
            .then(res => {
                if (res.ok) {
                    showOutAlert({ message: '필터 추가 성공', type: 'success' });
                    onClose();
                } else {
                    showAlert({ message: '실패', type: 'danger' });
                }
            })
            .catch(err => {
                showAlert({ message: '에러가 발생했습니다.', type: 'danger' });
            });
    };

    return (
        <div className="container mt-4 text-center" style={{ maxWidth: '400px', margin: '0 auto' }}>
            {/* Alert 메시지 */}
            {alert && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}

                </div>
            )}

            <h5>필터 추가</h5>
            <div className="mb-3">
                <label className="form-label">필터 이름</label>
                <input type="text" className="form-control" placeholder="필터 이름" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="mt-3">
                <label>추가:  </label>
                <button className="btn btn-secondary me-2" onClick={addParenAndConditionWithAnd}>(</button>
                <button className="btn btn-secondary me-2" onClick={addRightParen}>)</button>
                <button className="btn btn-success me-2" onClick={addCondition}>조건</button>
            </div>

            <div className="mt-4">
                <strong>현재 표현식: </strong>
                <div style={{ marginTop: '10px' }}></div>
                <code>{buildExpression()}</code>
            </div>

            {getGroups(tokens).map((group, idx) => {
                const groupId = group[0].groupId;
                return (
                    <div className="d-flex justify-content-center mb-3" key={groupId}>
                        <div className="d-flex flex-column align-items-start">
                            {group.map((t, i) => {
                                const tokenIndex = tokens.findIndex(tok => tok === t);

                                if (t.type === 'operator') {
                                    return (
                                        <div className="w-100 text-center mb-2" key={i}>
                                            <button
                                                className="btn btn-outline-primary"
                                                onClick={() =>
                                                    updateToken(tokenIndex, 'value', t.value === '&&' ? '||' : '&&')
                                                }
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
                                            <div className="d-flex align-items-center" key={i}>
                                                <h2 className="me-2">(</h2>
                                                <select className="form-select me-2" style={{ width: '120px' }}
                                                    value={nextToken.field}
                                                    onChange={(e) => updateToken(condIndex, 'field', e.target.value)}>
                                                    <option value="">필드 선택</option>
                                                    {fieldList.map((f) => <option key={f} value={f}>{f}</option>)}
                                                </select>
                                                <select className="form-select me-2" style={{ width: '80px' }}
                                                    value={nextToken.operator}
                                                    onChange={(e) => updateToken(condIndex, 'operator', e.target.value)}>
                                                    {operatorOptions.map((op) => <option key={op} value={op}>{op}</option>)}
                                                </select>
                                                <input type="text" className="form-control me-2" style={{ width: '100px' }}
                                                    value={nextToken.value}
                                                    onChange={(e) => updateToken(condIndex, 'value', e.target.value)} />
                                                {groupId !== 0 && (
                                                    <>
                                                        <button className="btn btn-danger btn-sm me-2" onClick={() => deleteGroup(groupId)}>X</button>
                                                        <button className="btn btn-outline-dark btn-sm me-1" onClick={() => moveGroup(groupId, 'up')}>⬆</button>
                                                        <button className="btn btn-outline-dark btn-sm" onClick={() => moveGroup(groupId, 'down')}>⬇</button>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    }
                                }

                                if (t.type === 'condition' && group[i - 1]?.type !== 'left-paren') {
                                    return (
                                        <div className="d-flex align-items-center" key={i}>
                                            <select className="form-select me-2" style={{ width: '120px' }}
                                                value={t.field}
                                                onChange={(e) => updateToken(tokenIndex, 'field', e.target.value)}>
                                                <option value="">필드 선택</option>
                                                {fieldList.map((f) => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                            <select className="form-select me-2" style={{ width: '80px' }}
                                                value={t.operator}
                                                onChange={(e) => updateToken(tokenIndex, 'operator', e.target.value)}>
                                                {operatorOptions.map((op) => <option key={op} value={op}>{op}</option>)}
                                            </select>
                                            <input type="text" className="form-control me-2" style={{ width: '100px' }}
                                                value={t.value}
                                                onChange={(e) => updateToken(tokenIndex, 'value', e.target.value)} />
                                            {groupId !== 0 && (
                                                <>
                                                    <button className="btn btn-danger btn-sm me-2" onClick={() => deleteGroup(groupId)}>X</button>
                                                    <button className="btn btn-outline-dark btn-sm me-1" onClick={() => moveGroup(groupId, 'up')}>⬆</button>
                                                    <button className="btn btn-outline-dark btn-sm" onClick={() => moveGroup(groupId, 'down')}>⬇</button>
                                                </>
                                            )}
                                        </div>
                                    );
                                }

                                if (t.type === 'right-paren') {
                                    return (
                                        <div className="d-flex align-items-center" key={i}>
                                            <h2 className="me-2">)</h2>
                                            {groupId !== 0 && (
                                                <>
                                                    <button className="btn btn-danger btn-sm me-2" onClick={() => deleteGroup(groupId)}>X</button>
                                                    <button className="btn btn-outline-dark btn-sm me-1" onClick={() => moveGroup(groupId, 'up')}>⬆</button>
                                                    <button className="btn btn-outline-dark btn-sm" onClick={() => moveGroup(groupId, 'down')}>⬇</button>
                                                </>
                                            )}
                                        </div>
                                    );
                                }

                                return null;
                            })}
                        </div>
                    </div>
                );
            })}
            <button
                className={`btn btn-sm ${active ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setActive(!active)}
                type="button"
            >
                활성화: {active ? "On" : "Off"}
            </button>
            <button className="btn btn-primary me-2" onClick={handleSubmit}>추가</button>
            <button className="btn btn-danger" onClick={onClose}>닫기</button>
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

function inferValueType(value, operator) {
    if (operator === 'Equals') {
        return 'String';
    }
    if (value === 'true' || value === 'false') {
        return 'boolean';
    }
    if (/^-?\d+$/.test(value)) {
        return 'int';
    }
    if (/^-?\d*\.\d+$/.test(value)) {
        return 'double';
    }
    return 'String';
}

export default ConditionBuilder;
