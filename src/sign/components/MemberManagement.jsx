import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { getAdminMembers, updateMemberRole } from '../../api/memberApi';
import { FaUserShield } from 'react-icons/fa';
import AdminPageHeader from '../../admin/AdminPageHeader';
import AdminPagination from '../../admin/AdminPagination';
import { genderLabels } from '../../constants/colorMaps';
import { formatDate } from '../../utils/dateUtils';

const PAGE_SIZE = 10;

const INITIAL_SEARCH = {
    keyword: '',
    provider: '',
    role: '',
    deleted: '',
    joinedFrom: '',
    joinedTo: '',
    sort: 'createdAt,desc',
};

const PROVIDER_OPTIONS = [
    { value: '', label: '가입 경로 전체' },
    { value: 'KAKAO', label: '카카오' },
];

const ROLE_OPTIONS = [
    { value: '', label: '권한 전체' },
    { value: 'ROLE_USER', label: '회원' },
    { value: 'ROLE_ADMIN', label: '관리자' },
];

const DELETED_OPTIONS = [
    { value: '', label: '탈퇴 여부 전체' },
    { value: 'false', label: '활성' },
    { value: 'true', label: '탈퇴' },
];

const SORT_OPTIONS = [
    { value: 'createdAt,desc', label: '최근 가입순' },
    { value: 'createdAt,asc', label: '오래된 가입순' },
    { value: 'loginId,asc', label: '아이디순' },
    { value: 'nickname,asc', label: '닉네임순' },
    { value: 'email,asc', label: '이메일순' },
];

// 빈 입력은 조건으로 보내지 않는다
const toSearchParams = (search) => ({
    keyword: search.keyword.trim() || undefined,
    provider: search.provider || undefined,
    role: search.role || undefined,
    deleted: search.deleted || undefined,
    joinedFrom: search.joinedFrom || undefined,
    joinedTo: search.joinedTo || undefined,
    sort: search.sort,
});

const MemberManagement = () => {
    const [memberList, setMemberList] = useState([]);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    // 입력 중인 값(form)과 실제 조회에 쓰는 값(search)을 나눠, 페이지를 넘겨도 검색 버튼을 누른 조건이 유지되게 한다
    const [form, setForm] = useState(INITIAL_SEARCH);
    const [search, setSearch] = useState(INITIAL_SEARCH);
    const [page, setPage] = useState(0);
    const latestRequest = useRef(0);

    const getMemberList = async (searchArg, pageArg) => {
        const requestId = ++latestRequest.current;
        setLoading(true);
        try {
            const { data } = await getAdminMembers({
                ...toSearchParams(searchArg),
                page: pageArg,
                size: PAGE_SIZE,
            });
            // 조건을 빠르게 바꾸면 늦게 온 이전 응답이 최신 결과를 덮어쓰지 않게 한다
            if (requestId !== latestRequest.current) return;
            setMemberList(data.result.content);
            setTotalElements(data.result.totalElements);
        } catch {
            if (requestId === latestRequest.current) toast.error("회원 조회 오류");
        } finally {
            if (requestId === latestRequest.current) setLoading(false);
        }
    };

    const delegateAdmin = async ({ memberId }) => {
        try {
            await updateMemberRole(memberId);
            toast.success("관리자 권한이 부여되었습니다.");
            getMemberList(search, page);
        } catch (error) {
            toast.error(error.response?.data?.message || "오류가 발생했습니다.");
        }
    };

    useEffect(() => {
        getMemberList(search, page);
    }, [search, page]);

    const handleFormChange = ({ target: { name, value } }) => {
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (form.joinedFrom && form.joinedTo && form.joinedFrom > form.joinedTo) {
            toast.warn("가입일 시작은 끝보다 늦을 수 없습니다.");
            return;
        }
        setSearch({ ...form });
        setPage(0);
    };

    const handleReset = () => {
        setForm(INITIAL_SEARCH);
        setSearch(INITIAL_SEARCH);
        setPage(0);
    };

    const renderSelect = (name, label, options) => (
        <select className="form-select form-select-sm" name={name} aria-label={label}
            value={form[name]} onChange={handleFormChange}>
            {options.map(({ value, label: optionLabel }) => (
                <option key={value} value={value}>{optionLabel}</option>
            ))}
        </select>
    );

    return (
        <div className="container sign-page-spacer">
            <AdminPageHeader title="회원 관리" />
            <form className="row g-2 align-items-center mb-3" onSubmit={handleSubmit}>
                <div className="col-12 col-lg-6">
                    <input className="form-control form-control-sm" name="keyword" aria-label="검색어"
                        placeholder="아이디·닉네임·이메일 앞부분"
                        value={form.keyword} onChange={handleFormChange} />
                </div>
                <div className="col-6 col-lg-3">
                    <input type="date" className="form-control form-control-sm" name="joinedFrom"
                        aria-label="가입일 시작" value={form.joinedFrom} onChange={handleFormChange} />
                </div>
                <div className="col-6 col-lg-3">
                    <input type="date" className="form-control form-control-sm" name="joinedTo"
                        aria-label="가입일 끝" value={form.joinedTo} onChange={handleFormChange} />
                </div>
                <div className="col-6 col-lg-2">{renderSelect("provider", "가입 경로", PROVIDER_OPTIONS)}</div>
                <div className="col-6 col-lg-2">{renderSelect("role", "권한", ROLE_OPTIONS)}</div>
                <div className="col-6 col-lg-2">{renderSelect("deleted", "탈퇴 여부", DELETED_OPTIONS)}</div>
                <div className="col-6 col-lg-2">{renderSelect("sort", "정렬", SORT_OPTIONS)}</div>
                <div className="col-12 col-lg-4 d-flex align-items-center gap-2">
                    <button type="submit" className="btn admin-btn admin-btn-sm admin-btn-primary">검색</button>
                    <button type="button" className="btn admin-btn admin-btn-sm admin-btn-outline"
                        onClick={handleReset}>초기화</button>
                    <span className="ms-auto text-secondary small">총 {totalElements}건</span>
                </div>
            </form>
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
                        {loading && (
                            <tr>
                                <td colSpan={8} className="text-center py-4">
                                    <div className="spinner-border text-primary me-2" role="status"></div>로딩 중...
                                </td>
                            </tr>
                        )}
                        {!loading && memberList.length === 0 && (
                            <tr>
                                <td colSpan={8} className="text-center text-secondary py-4">
                                    회원 정보가 없습니다.
                                </td>
                            </tr>
                        )}
                        {!loading && memberList
                            .filter(member => member.memberId !== 10)
                            .map((member, idx) => (
                                <tr key={member.memberId}>
                                    <td>{page * PAGE_SIZE + idx + 1}</td>
                                    <td>{member.loginId}</td>
                                    <td>{member.nickname}</td>
                                    <td>{member.email}</td>
                                    <td>{genderLabels[member.gender] || member.gender}</td>
                                    <td>{formatDate(member.createdAt) || "-"}</td>
                                    <td>{member.roles?.includes("ROLE_ADMIN") ? "관리자" : "회원"}</td>
                                    <td className='text-center'>
                                        <button
                                            className="btn admin-btn-icon admin-btn-outline"
                                            title="관리자 위임"
                                            onClick={() => delegateAdmin({ memberId: member.memberId })}
                                            disabled={member.roles?.includes("ROLE_ADMIN") || search.deleted === "true"}
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
            <AdminPagination total={totalElements} page={page} onChange={setPage} pageSize={PAGE_SIZE} />
        </div>
    );
};

export default MemberManagement;
