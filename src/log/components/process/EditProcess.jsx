import React, { useState } from 'react';
import { updateLogProcess, deleteLogProcess } from '../../../api/log/logProcessApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const EditProcess = ({ onClose, processId, _name, showAlert }) => {
    const [name, setName] = useState(_name);
    // ✅ 추가

    const updateProcess = async () => {
        try {
            await updateLogProcess(processId, { name });
            showAlert("success", "수정 성공!");
            onClose();
        } catch {
            showAlert("danger", "프로세스 수정 실패!");
        }
    };

    const removeProcess = async () => {
        try {
            await deleteLogProcess(processId);
            showAlert("danger", "삭제 성공!");
            onClose();
        } catch {
            showAlert("danger", "삭제 실패!");
        }
    };

    return (

        <div className="card mt-4 p-4 mx-auto" style={{ maxWidth: '400px' }}>
            <h4 className="mb-3">Process 수정</h4>




            <input
                type='text'
                className="form-control mb-3"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="프로세스 이름"
            />
            <div className="d-flex justify-content-between">
                <button className="btn btn-primary" onClick={updateProcess}>수정</button>
                <button className="btn btn-danger" onClick={removeProcess}>삭제</button>
                <button className="btn btn-outline-secondary" onClick={onClose}>닫기</button>
            </div>
        </div>

    );
};

export default EditProcess;
