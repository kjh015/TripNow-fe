import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostListPage from './PostListPage';
import { getPostFeed } from '../../api/postSearchApi';

// CRA의 jest는 react-router 7의 exports 경로를 찾지 못해 필요한 훅만 대체한다
jest.mock(
  'react-router-dom',
  () => ({
    useLocation: () => ({ search: '?sort=modifiedDate&direction=desc' }),
    useNavigate: () => jest.fn(),
  }),
  { virtual: true }
);
jest.mock('../../api/postSearchApi', () => ({ getPostFeed: jest.fn() }));
jest.mock('../../analytics/events', () => ({
  trackSearchResult: jest.fn(),
  trackListItemClick: jest.fn(),
  trackError: jest.fn(),
}));
jest.mock('../components/PostSearch', () => () => null);
jest.mock('../components/PostListCard', () => ({ post }) => <div>{post.title}</div>);

const feed = (titles, nextCursor) => ({
  data: {
    result: {
      content: titles.map((title) => ({ postId: title, title })),
      nextCursor,
      hasNext: Boolean(nextCursor),
    },
  },
});

let observers;

const scrollToEnd = async () => {
  await act(async () => {
    observers.at(-1).callback([{ isIntersecting: true }]);
  });
};

const renderPage = () => render(<PostListPage />);

describe('PostListPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    observers = [];
    window.IntersectionObserver = class {
      constructor(callback) {
        this.callback = callback;
        observers.push(this);
      }
      observe() {}
      disconnect() {}
    };
  });

  it('첫 조회는 cursor 없이 검색 조건을 보낸다', async () => {
    getPostFeed.mockResolvedValue(feed(['첫 글']));

    renderPage();

    expect(await screen.findByText('첫 글')).toBeInTheDocument();
    expect(getPostFeed).toHaveBeenCalledTimes(1);
    expect(getPostFeed).toHaveBeenCalledWith(
      expect.objectContaining({ sort: 'modifiedDate', direction: 'desc', cursor: undefined, size: 10 })
    );
  });

  it('목록 끝에 닿으면 nextCursor로 다음 건을 읽어 뒤에 붙인다', async () => {
    getPostFeed.mockResolvedValueOnce(feed(['첫 글'], 'c1')).mockResolvedValueOnce(feed(['둘째 글']));

    renderPage();
    await screen.findByText('첫 글');
    await scrollToEnd();

    expect(await screen.findByText('둘째 글')).toBeInTheDocument();
    expect(screen.getByText('첫 글')).toBeInTheDocument();
    expect(getPostFeed).toHaveBeenLastCalledWith(expect.objectContaining({ cursor: 'c1' }));
  });

  it('다음 응답에 이미 받은 글이 다시 오면 한 번만 보여 준다', async () => {
    getPostFeed
      .mockResolvedValueOnce(feed(['첫 글', '둘째 글'], 'c1'))
      .mockResolvedValueOnce(feed(['둘째 글', '셋째 글']));

    renderPage();
    await screen.findByText('첫 글');
    await scrollToEnd();

    expect(await screen.findByText('셋째 글')).toBeInTheDocument();
    expect(screen.getAllByText('둘째 글')).toHaveLength(1);
  });

  it('다음 건이 없으면 스크롤 감지를 걸지 않는다', async () => {
    getPostFeed.mockResolvedValue(feed(['첫 글']));

    renderPage();
    await screen.findByText('첫 글');

    expect(observers).toHaveLength(0);
  });

  it('추가 로드에 실패해도 읽어 둔 목록은 유지한다', async () => {
    getPostFeed
      .mockResolvedValueOnce(feed(['첫 글'], 'c1'))
      .mockRejectedValueOnce(new Error('네트워크 오류'));

    renderPage();
    await screen.findByText('첫 글');
    await scrollToEnd();

    expect(await screen.findByText(/네트워크 오류/)).toBeInTheDocument();
    expect(screen.getByText('첫 글')).toBeInTheDocument();
  });

  it('결과가 없으면 안내 문구를 보여 준다', async () => {
    getPostFeed.mockResolvedValue(feed([]));

    renderPage();

    await waitFor(() => expect(screen.getByText(/게시글이 없습니다/)).toBeInTheDocument());
  });
});
