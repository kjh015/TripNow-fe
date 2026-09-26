import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createLogProcess } from '../../../api/log/logProcessApi';
import { LOG_PROCESS_NAME_GUIDE, isValidLogProcessName } from '../../../constants/logProcess';

const InputProcess = ({ onClose }) => {
    const [name, setName] = useState("");
    const trimmed = name.trim();
    const valid = isValidLogProcessName(trimmed);

    const addProcess = async () => {
        try {
            await createLogProcess({ name: trimmed });
            toast.success("프로세스가 추가되었습니다!");
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || "프로세스 추가 실패");
        }
    };

    return (
        <div>
            <label className="form-label fw-semibold">프로세스 이름</label>
            <input
                type='text'
                className={`form-control ${trimmed && !valid ? 'is-invalid' : ''}`}
                placeholder="프로세스 이름 입력 (예: View)"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <div className={trimmed && !valid ? "invalid-feedback" : "form-text"}>{LOG_PROCESS_NAME_GUIDE}</div>
            <div className="admin-form-footer justify-content-end">
                <div className="admin-form-footer-actions">
                    <button type="button" className="btn admin-btn admin-btn-outline" onClick={onClose}>닫기</button>
                    <button
                        type="button"
                        className="btn admin-btn admin-btn-primary"
                        onClick={addProcess}
                        disabled={!valid} // 형식에 맞지 않으면 비활성화
                    >
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputProcess;
