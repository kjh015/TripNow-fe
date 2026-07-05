// ViewItem.jsx
import React, { useEffect, useRef } from 'react';
import ItemApiClient from '../service/ItemApiClient';

const ViewItem = ({ query, onClose }) => {
    const overlayRef = useRef(null);

    // 바깥 클릭 감지
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (overlayRef.current && e.target === overlayRef.current) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // query 파싱
    const params = new URLSearchParams(query);
    const parsed = {};
    for (const [key, value] of params.entries()) {
        parsed[key] = value;
    }
    const handleSend = () => {
        ItemApiClient.sendItem(parsed).then(
            res => {
                if(res.ok){
                    console.log(res);
                }
                else{
                    console.log("Error");
                }
            }
        )
    }

    return (
        <div ref={overlayRef} style={overlayStyle}>
            <div style={modalStyle}>

                <h3>쿼리 파라미터</h3>
                {Object.entries(parsed).map(([k, v]) => (
                    <p key={k}><strong>{k}:</strong> {v}</p>
                ))}
                <button onClick={onClose}>닫기</button>
                <button onClick={handleSend}>Send</button>
            </div>
        </div>
    );
};

// 스타일
const overlayStyle = {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
};

const modalStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(0px)',
    opacity: 1,
    animation: 'fadeIn 0.3s ease-out',
};



export default ViewItem;
