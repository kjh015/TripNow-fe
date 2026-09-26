import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { updateLogProcess, deleteLogProcess } from '../../../api/log/logProcessApi';
import { LOG_PROCESS_NAME_GUIDE, isValidLogProcessName } from '../../../constants/logProcess';

const EditProcess = ({ onClose, processId, _name }) => {
    const [name, setName] = useState(_name);
    const trimmed = (name ?? "").trim();
    const valid = isValidLogProcessName(trimmed);

    const updateProcess = async () => {
        try {
            await updateLogProcess(processId, { name: trimmed });
            toast.success("수정 성공!");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "프로세스 수정 실패!");
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
                className={`form-control ${trimmed && !valid ? 'is-invalid' : ''}`}
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="프로세스 이름 (예: View)"
            />
            <div className={trimmed && !valid ? "invalid-feedback" : "form-text"}>{LOG_PROCESS_NAME_GUIDE}</div>
            <div className="admin-form-footer justify-content-end">
                <div className="admin-form-footer-actions">
                    <button type="button" className="btn admin-btn admin-btn-primary" onClick={updateProcess} disabled={!valid}>수정</button>
                    <button type="button" className="btn admin-btn admin-btn-danger" onClick={removeProcess}>삭제</button>
                    <button type="button" className="btn admin-btn admin-btn-outline" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>

    );
};

export default EditProcess;
