


import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import InputFormat from './InputFormat';
import DetailFormat from './DetailFormat';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Navbar from '../../../common/Navbar';

const FormatManagement = () => {
    const [params] = useSearchParams();
    const [processId, setProcessId] = useState(params.get('processId'));
    const [formatList, setFormatList] = useState([]);
    const [inputComp, setInputComp] = useState(false);
    const [detailComp, setDetailComp] = useState(0);

    // ✅ mock 데이터 삽입
    useEffect(() => {
        const mockData = [
            {
                id: 1186539,
                name: '[한국투자증권AI] 뉴욕증권거래소 종목',
                createdTime: '2025년 5월 19일',
                updatedTime: '2025년 5월 20일'
            },
            {
                id: 1187022,
                name: '[임시] 카드데이터',
                createdTime: '2025년 5월 15일',
                updatedTime: '2025년 5월 16일'
            }
        ];
        setFormatList(mockData);
    }, []);

    const handleInputComp = () => setInputComp(false);
    const handleDetailComp = () => setDetailComp(0);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Header */}
            <Navbar />

            {/* Main content */}
            <div style={{ flex: 1, marginTop: '70px', padding: '20px' }}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4>포맷 목록</h4>
                    <div>
                        <button className="btn btn-primary me-2" onClick={() => setInputComp(true)}>
                            포맷 추가
                        </button>
                        <Link to={`/log/filter?processId=${processId}`} className="btn btn-secondary">
                            필터링 관리
                        </Link>
                    </div>
                </div>

                {/* 입력 컴포넌트 */}
                {inputComp && (
                    <div className="mb-4">
                        <InputFormat onClose={handleInputComp} processId={processId} />
                    </div>
                )}

                {/* 포맷 테이블 */}
                <div className="table-responsive">
                    <table className="table table-bordered table-hover align-middle text-center">
                        <thead className="table-light">
                            <tr>
                                <th scope="col">ID</th>
                                <th scope="col">이름</th>
                                <th scope="col">생성 날짜</th>
                                <th scope="col">수정 날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formatList.length === 0 ? (
                                <tr>
                                    <td colSpan="4">포맷이 존재하지 않습니다.</td>
                                </tr>
                            ) : (
                                formatList.map((format) => (
                                    <React.Fragment key={format.id}>
                                        <tr>
                                            <td>{format.id}</td>
                                            <td>
                                                <span
                                                    className="text-primary text-decoration-underline"
                                                    role="button"
                                                    onClick={() => setDetailComp(format.id)}
                                                >
                                                    {format.name}
                                                </span>
                                            </td>
                                            <td>{format.createdTime}</td>
                                            <td>{format.updatedTime}</td>
                                        </tr>
                                        {detailComp === format.id && (
                                            <tr>
                                                <td colSpan="4">
                                                    <DetailFormat
                                                        onClose={handleDetailComp}
                                                        formatId={format.id}
                                                    />
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Footer */}
            <div className="container mb-3">
                <p className="float-end mb-1">
                    <a type="button" href="/component/admnpage">관리자 페이지</a>
                </p>
            </div>
        </div>
    );
};

export default FormatManagement;
