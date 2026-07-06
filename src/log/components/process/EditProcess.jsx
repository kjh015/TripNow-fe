import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateLogProcess, deleteLogProcess } from '../../../api/log/logProcessApi';

const EditProcess = ({ onClose, processId, _name }) => {
    const [name, setName] = useState(_name);

    const updateProcess = async () => {
        try {
            await updateLogProcess(processId, { name });
            toast.success("수정 성공!");
            onClose();
        } catch {
            toast.error("프로세스 수정 실패!");
        }
    };

    const removeProcess = async () => {
        try {
            await deleteLogProcess(processId);
            toast.success("삭제 성공!");
            onClose();
        } catch {
            toast.error("삭제 실패!");
        }
    };

    return (
        <div className="card mt-4 p-4 mx-auto log-process-card admin-section-box border-0 shadow-sm">
            <h4 className="mb-3 admin-detail-title">프로세스 수정</h4>
            <label className="form-label fw-semibold">프로세스 이름</label>
            <input
                type='text'
                className="form-control"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="프로세스 이름"
            />
            <div className="admin-form-footer justify-content-end">
                <div className="admin-form-footer-actions">
                    <button type="button" className="btn admin-btn admin-btn-primary" onClick={updateProcess}>수정</button>
                    <button type="button" className="btn admin-btn admin-btn-danger" onClick={removeProcess}>삭제</button>
                    <button type="button" className="btn admin-btn admin-btn-outline" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>

    );
};

export default EditProcess;
