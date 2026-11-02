import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { toast } from 'react-toastify';
import MemberManagement from './MemberManagement';
import { getAdminMembers } from '../../api/memberApi';

jest.mock('../../api/memberApi', () => ({
    getAdminMembers: jest.fn(),
    updateMemberRole: jest.fn(),
}));
jest.mock('react-toastify', () => ({
    toast: { error: jest.fn(), success: jest.fn(), warn: jest.fn() },
}));
jest.mock('../../admin/AdminPageHeader', () => () => null);

const page = (content, totalElements) => ({ data: { result: { content, totalElements } } });
const member = {
    memberId: 1,
    loginId: 'traveler',
    nickname: '여행자',
    email: 'traveler@example.com',
    gender: 'MALE',
    roles: ['ROLE_USER'],
    createdAt: '2026-10-01T01:00:00Z',
};

describe('MemberManagement', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getAdminMembers.mockResolvedValue(page([member], 25));
    });

    it('처음에는 조건 없이 최근 가입순 첫 페이지를 조회한다', async () => {
        render(<MemberManagement />);

        expect(await screen.findByText('traveler')).toBeInTheDocument();
        expect(getAdminMembers).toHaveBeenCalledTimes(1);
        expect(getAdminMembers).toHaveBeenCalledWith({
            keyword: undefined,
            provider: undefined,
            role: undefined,
            deleted: undefined,
            joinedFrom: undefined,
            joinedTo: undefined,
            sort: 'createdAt,desc',
            page: 0,
            size: 10,
        });
        expect(screen.getByText('총 25건')).toBeInTheDocument();
    });

    it('검색 버튼을 눌러야 입력한 조건으로 첫 페이지를 조회한다', async () => {
        render(<MemberManagement />);
        await screen.findByText('traveler');

        fireEvent.change(screen.getByLabelText('검색어'), { target: { value: '  tra ' } });
        fireEvent.change(screen.getByLabelText('권한'), { target: { value: 'ROLE_ADMIN' } });
        expect(getAdminMembers).toHaveBeenCalledTimes(1);

        fireEvent.click(screen.getByRole('button', { name: '검색' }));

        await waitFor(() => expect(getAdminMembers).toHaveBeenCalledTimes(2));
        expect(getAdminMembers).toHaveBeenLastCalledWith(
            expect.objectContaining({ keyword: 'tra', role: 'ROLE_ADMIN', page: 0 }),
        );
    });

    it('페이지를 넘겨도 검색한 조건을 유지하고 입력만 바꾼 값은 쓰지 않는다', async () => {
        render(<MemberManagement />);
        await screen.findByText('traveler');
        fireEvent.change(screen.getByLabelText('검색어'), { target: { value: 'tra' } });
        fireEvent.click(screen.getByRole('button', { name: '검색' }));
        await waitFor(() => expect(getAdminMembers).toHaveBeenCalledTimes(2));
        await screen.findByText('traveler');

        fireEvent.change(screen.getByLabelText('검색어'), { target: { value: 'other' } });
        fireEvent.click(screen.getByRole('button', { name: '2' }));

        await waitFor(() => expect(getAdminMembers).toHaveBeenCalledTimes(3));
        expect(getAdminMembers).toHaveBeenLastCalledWith(expect.objectContaining({ keyword: 'tra', page: 1 }));
    });

    it('가입일 시작이 끝보다 늦으면 조회하지 않고 알린다', async () => {
        render(<MemberManagement />);
        await screen.findByText('traveler');

        fireEvent.change(screen.getByLabelText('가입일 시작'), { target: { value: '2026-10-31' } });
        fireEvent.change(screen.getByLabelText('가입일 끝'), { target: { value: '2026-10-01' } });
        fireEvent.click(screen.getByRole('button', { name: '검색' }));

        expect(toast.warn).toHaveBeenCalled();
        expect(getAdminMembers).toHaveBeenCalledTimes(1);
    });

    it('늦게 도착한 이전 응답은 최신 결과를 덮어쓰지 않는다', async () => {
        render(<MemberManagement />);
        await screen.findByText('traveler');

        let resolveOld;
        getAdminMembers.mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve; }));
        fireEvent.click(screen.getByRole('button', { name: '검색' }));
        await waitFor(() => expect(getAdminMembers).toHaveBeenCalledTimes(2));

        getAdminMembers.mockResolvedValueOnce(page([{ ...member, memberId: 3, loginId: 'newest' }], 1));
        fireEvent.click(screen.getByRole('button', { name: '초기화' }));
        expect(await screen.findByText('newest')).toBeInTheDocument();

        resolveOld(page([{ ...member, memberId: 2, loginId: 'stale' }], 1));
        await waitFor(() => expect(screen.queryByText('stale')).not.toBeInTheDocument());
        expect(screen.getByText('newest')).toBeInTheDocument();
    });
});
