import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';

const LogIn = () => {
    return (
        <div className='LogIn'>
            <a className="btn btn-secondary" href="/">Travel React</a>
            <div style={{ flex: 1, marginTop: '20px', padding: '20px' }}></div>
            {/* 아이디 */}
            <div className="col-12">
                <label htmlFor="username" className="form-label">아이디</label>
                <div className="input-group has-validation">
                    <input type="text" className="form-control" id="username" placeholder="아이디 입력" required />
                    <div className="invalid-feedback">아이디를 입력해주세요.</div>
                </div>
            </div>

            {/* 비밀번호 */}
            <div className="col-12">
                <label htmlFor="password" className="form-label">
                    이메일 <span className="text-body-secondary">(선택)</span>
                </label>
                <input type="password" className="form-control" id="password" placeholder="비밀번호 입력" />
                <div className="invalid-feedback">비밀번호를 입력해주세요.</div>
            </div>
            <a className="btn btn-primary" href="/">로그인</a>
        </div>
    );
}

export default LogIn;