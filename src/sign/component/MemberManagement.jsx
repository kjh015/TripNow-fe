import React, { useEffect, useState } from 'react';
import { getAdminMembers, updateMemberRole } from '../../api/memberApi';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaTrash, FaUserShield } from 'react-icons/fa';

const MemberManagement = () => {
    const [memberList, setMemberList] = useState([]);
    const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // alert 상태 추가

    const getMemberList = async () => {
        try {
            const { data } = await getAdminMembers();
            setMemberList(data.result.content);
        } catch {
            setAlert({ show: true, message: "회원 조회 오류", type: "danger" });
        }
    };

    const delegateAdmin = async ({ memberId }) => {
        try {
            await updateMemberRole(memberId);
            setAlert({ show: true, message: "관리자 권한이 부여되었습니다.", type: "success" });
            getMemberList();
        } catch (error) {
            const msg = error.response?.data || "오류가 발생했습니다.";
            setAlert({ show: true, message: msg, type: "danger" });
        }
    };
    useEffect(() => {
        getMemberList();
    }, []);

    return (
        <div className="container" style={{ marginTop: '80px' }}>
            {/* Alert 메시지 */}
            {alert.show && (
                <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                    {alert.message}
                    <button type="button" className="btn-close" aria-label="Close"
                        onClick={() => setAlert({ ...alert, show: false })}></button>
                </div>
            )}

            <h2 className="fw-bold" style={{ marginBottom: "3.5rem" }}>회원 관리</h2>
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>#</th>
                            <th>ID</th>
                            <th>닉네임</th>
                            <th>E-mail</th>
                            <th>성별</th>
                            <th>가입일</th>
                            <th>권한</th>
                            <th className='text-center'>관리자 위임</th>
                        </tr>
                    </thead>
                    <tbody>
                        {memberList.length === 0 && (
                            <tr>
                                <td colSpan={9} className="text-center text-secondary py-4">
                                    회원 정보가 없습니다.
                                </td>
                            </tr>
                        )}
                        {memberList
                            .filter(member => member.memberId !== 10)
                            .map((member, idx) => (
                                <tr key={member.memberId}>
                                    <td>{idx + 1}</td>
                                    <td>{member.loginId}</td>
                                    <td>{member.nickname}</td>
                                    <td>{member.email}</td>
                                    <td>{member.gender}</td>
                                    <td>-</td>
                                    <td>{member.roles?.includes("ROLE_ADMIN") ? "관리자" : "회원"}</td>
                                    <td className='text-center'>
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            title="관리자 위임"
                                            onClick={() => delegateAdmin({ memberId: member.memberId })}
                                            disabled={member.roles?.includes("ROLE_ADMIN")}
                                        >
                                            <FaUserShield />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default MemberManagement;
