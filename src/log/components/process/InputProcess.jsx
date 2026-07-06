import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createLogProcess } from '../../../api/log/logProcessApi';

const InputProcess = ({ onClose }) => {
    const [name, setName] = useState("");

    const addProcess = async () => {
        try {
            await createLogProcess({ name });
            toast.success("프로세스가 추가되었습니다!");
            onClose();
        } catch {
            toast.error("프로세스 추가 실패");
        }
    };

    return (
        <div>
            <label className="form-label fw-semibold">프로세스 이름</label>
            <input
                type='text'
                className="form-control"
                placeholder="프로세스 이름 입력"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <div className="admin-form-footer justify-content-end">
                <div className="admin-form-footer-actions">
                    <button type="button" className="btn admin-btn admin-btn-outline" onClick={onClose}>닫기</button>
                    <button
                        type="button"
                        className="btn admin-btn admin-btn-primary"
                        onClick={addProcess}
                        disabled={!name.trim()} // 이름 없으면 비활성화(UX 개선)
                    >
                        추가
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InputProcess;
