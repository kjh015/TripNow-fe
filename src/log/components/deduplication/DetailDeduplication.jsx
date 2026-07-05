import React, { useEffect, useState } from 'react';
import DeduplicationApiClient from '../../service/DeduplicationApiClient';
import DeduplicationRow from './DeduplicationRow';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const initialRow = {
    conditions: [{ format: '', value: '' }],
    year: 0,
    month: 0,
    day: 0,
    hour: 0,
    minute: 0,
    second: 0,
};

const DetailDeduplication = ({ processId, id, onClose, showOutAlert }) => {
    const [rows, setRows] = useState([]);
    const [name, setName] = useState('');
    const [active, setActive] = useState(false);

    const viewDeduplication = () => {
        DeduplicationApiClient.viewDeduplication(id)
            .then(res => res.json()
                .then(data => {
                    if (res.ok) {
                        setRows(data.rows);
                        setName(data.name);
                        setActive(data.active);
                    } else {
                        showOutAlert({ message: "view error", type: "danger" });
                    }
                })
            )
            .catch(() => showOutAlert({ message: "API 오류", type: "danger" }));
    }

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

    const handleSubmit = () => {
        try {
            DeduplicationApiClient.updateDeduplication({
                id: id,
                name: name,
                active: active,
                rows: rows
            }).then(res => res.text()
                .then(message => {
                    if (res.ok) {
                        showOutAlert({ message, type: "success" });
                        setTimeout(() => {
                            onClose(true);
                        }
                        );
                    } else {
                        showOutAlert({ message, type: "danger" });
                    }
                })
            )
        } catch (error) {
            showOutAlert({ message: '에러 발생', type: 'danger' });
        }
    };

    const handleRemove = () => {
        try {
            DeduplicationApiClient.removeDeduplication(id)
                .then(res => res.text()
                    .then(message => {
                        if (res.ok) {
                            showOutAlert({ message, type: "danger" });
                            setTimeout(() => {
                                onClose(true);
                            });
                        } else {
                            showOutAlert({ message, type: "danger" });
                        }
                    }))
        } catch (error) {
            showOutAlert({ message: '에러 발생', type: 'danger' });
        }
    }

    useEffect(() => {
        viewDeduplication();
        // eslint-disable-next-line
    }, []);

    return (
        <div className="container mt-5">
            {/* alert 없음 */}

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












