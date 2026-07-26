import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { getAdminMembers, updateMemberRole } from '../../api/memberApi';
import { FaTrash, FaUserShield } from 'react-icons/fa';
import AdminPageHeader from '../../admin/AdminPageHeader';
import { genderLabels } from '../../constants/colorMaps';

const MemberManagement = () => {
    const [memberList, setMemberList] = useState([]);

    const getMemberList = async () => {
        try {
            const { data } = await getAdminMembers();
            setMemberList(data.result.content);
        } catch {
            toast.error("회원 조회 오류");
        }
    };

    const delegateAdmin = async ({ memberId }) => {
        try {
            await updateMemberRole(memberId);
            toast.success("관리자 권한이 부여되었습니다.");
            getMemberList();
        } catch (error) {
            toast.error(error.response?.data || "오류가 발생했습니다.");
        }
    };
    useEffect(() => {
        getMemberList();
    }, []);

    return (
        <div className="container sign-page-spacer">
            <AdminPageHeader title="회원 관리" />
            <div className="admin-table-card">
                <div className="table-responsive">
                <table className="table admin-table align-middle mb-0">
                    <thead>
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
                                    <td>{genderLabels[member.gender] || member.gender}</td>
                                    <td>-</td>
                                    <td>{member.roles?.includes("ROLE_ADMIN") ? "관리자" : "회원"}</td>
                                    <td className='text-center'>
                                        <button
                                            className="btn admin-btn-icon admin-btn-outline"
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

        </div>
    );
};

export default MemberManagement;
