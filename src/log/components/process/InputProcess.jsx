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
            <h4 className="mb-3">프로세스 이름</h4>
            <input
                type='text'
                className="form-control mb-3"
                placeholder="프로세스 이름 입력"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <div className="d-flex justify-content-between">
                <button
                    className="btn btn-primary"
                    onClick={addProcess}
                    disabled={!name.trim()} // 이름 없으면 비활성화(UX 개선)
                >
                    추가
                </button>
                <button className="btn btn-outline-secondary" onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default InputProcess;
