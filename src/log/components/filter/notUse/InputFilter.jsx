// InputFilter.jsx
import React, { useEffect, useState } from 'react';
import FilterApiClient from '../../../service/FilterApiClient';
import 'bootstrap/dist/css/bootstrap.min.css';

const InputFilter = ({ onClose, processId }) => {
    const [fieldList, setFieldList] = useState([]);
    const [filterTree, setFilterTree] = useState({
        type: 'group',
        operator: 'AND',
        conditions: [],
        groups: []
    });
    const [name, setName] = useState('');
    const [active, setActive] = useState(false);

    useEffect(() => {
        FilterApiClient.getFormatKeys(processId)
            .then(res => res.json())
            .then(data => setFieldList(data));
    }, []);

    const getNodeAtPath = (tree, path) => {
        let node = tree;
        for (let i = 0; i < path.length; i++) {
            const key = path[i];
            node = node[key];
        }
        return node;
    };

    const updateNode = (path, key, value) => {
        const newTree = structuredClone(filterTree);
        const node = getNodeAtPath(newTree, path);
        node[key] = value;
        setFilterTree(newTree);
    };

    const addCondition = (path) => {
        const newTree = structuredClone(filterTree);
        const node = getNodeAtPath(newTree, path);
        if (!node.conditions) node.conditions = [];
        node.conditions.push({ type: 'condition', field: '', operator: '>', value: '' });
        setFilterTree(newTree);
    };

    const addGroup = (path) => {
        const newTree = structuredClone(filterTree);
        const node = getNodeAtPath(newTree, path);
        if (!node.groups) node.groups = [];
        node.groups.push({ type: 'group', operator: 'AND', conditions: [], groups: [] });
        setFilterTree(newTree);
    };

    const removeGroup = (path) => {
        const newTree = structuredClone(filterTree);
        const parentPath = path.slice(0, -2);
        const parentKey = path[path.length - 2];
        const index = path[path.length - 1];
        const parent = getNodeAtPath(newTree, parentPath);
        if (Array.isArray(parent[parentKey])) {
            parent[parentKey].splice(index, 1);
        }
        setFilterTree(newTree);
    };

    const toggleGroupOperator = (path) => {
        const newTree = structuredClone(filterTree);
        const node = getNodeAtPath(newTree, path);
        node.operator = node.operator === 'AND' ? 'OR' : 'AND';
        setFilterTree(newTree);
    };

    const removeCondition = (path, index) => {
        const newTree = structuredClone(filterTree);
        const node = getNodeAtPath(newTree, path);
        node.splice(index, 1);
        setFilterTree(newTree);
    };

    const renderGroup = (group, path = []) => {
        return (
            <div className=" p-3 mb-3" key={path.join('-')}>
                <div className="mb-2 d-flex align-items-center gap-2">
                    <button className="btn btn-sm btn-secondary" onClick={() => toggleGroupOperator(path)}>
                        {group.operator === 'AND' ? 'OR' : 'AND'}
                    </button>
                    <button className="btn btn-sm btn-success" onClick={() => addCondition(path)}>조건추가</button>
                    <button className="btn btn-sm btn-primary" onClick={() => addGroup(path)}>그룹추가</button>
                    {path.length > 0 && (
                        <button className="btn btn-sm btn-outline-danger" onClick={() => removeGroup(path)}>그룹삭제</button>
                    )}
                </div>
                <div className="ms-3">
                    {group.conditions?.map((cond, i) => (
                        <div className="row mb-2" key={[...path, 'conditions', i].join('-')}>
                            <div className="col-1">
                                <select className="form-select" value={cond.field} onChange={e => updateNode([...path, 'conditions', i], 'field', e.target.value)}>
                                    <option value="">필드 선택</option>
                                    {fieldList.map(f => <option key={f} value={f}>{f}</option>)}
                                </select>
                            </div>
                            <div className="col-1">
                                <select className="form-select" value={cond.operator} onChange={e => updateNode([...path, 'conditions', i], 'operator', e.target.value)}>
                                    {['>', '<', '=', '>=', '<=', '!='].map(op => <option key={op} value={op}>{op}</option>)}
                                </select>
                            </div>
                            <div className="col-1">
                                <input className="form-control" type="number" value={cond.value} onChange={e => updateNode([...path, 'conditions', i], 'value', e.target.value)} />
                            </div>
                            <div className="col-1">
                                <button className="btn btn-outline-danger" onClick={() => removeCondition([...path, 'conditions'], i)}>x</button>
                            </div>
                        </div>
                    ))}
                    {group.groups?.map((g, i) => renderGroup(g, [...path, 'groups', i]))}
                </div>
            </div>
        );
    };

    const handleSubmit = () => {
        FilterApiClient.addFilter(processId, name, active, filterTree)
            .then(res => res.ok ? alert("전송 성공") : alert("실패"))
            .catch(err => console.error(err));
    };

    return (
        <div className="container mt-3 bg-body-tertiary">
            <div className="mb-3">
                <label className="form-label">Filter Name</label>
                <input type="text" className="form-control" value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="mb-3">
                <label className="form-label">조건 구성</label>
                {renderGroup(filterTree)}
            </div>

            <div className="mb-3">
                <button className="btn btn-secondary me-2" onClick={() => setActive(!active)}>
                    활성화: {active ? "On" : "Off"}
                </button>
                <button className="btn btn-success me-2" onClick={handleSubmit}>전송</button>
                <button className="btn btn-outline-dark" onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default InputFilter;
