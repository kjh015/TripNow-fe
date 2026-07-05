# React Travel Project — 리팩토링 시스템 프롬프트

## 프로젝트 개요

여행 커뮤니티 + 로그 관리 시스템을 결합한 React 애플리케이션.
리팩토링 목표: **코드 품질 개선**, **유지보수성 향상**, **기존 기능 완전 보존**.

---

## 핵심 원칙

1. **기능 동일성 보장** — 리팩토링 전후 사용자가 경험하는 기능은 반드시 동일해야 한다.
2. **Swagger 우선** — 백엔드 API Endpoint는 `http://localhost:8000`의 Swagger를 절대적 기준으로 삼는다. 기존 코드의 URL이 Swagger와 다르면 Swagger를 따른다.
3. **환경변수 사용** — 하드코딩된 값(서버 URL, 포트 등)은 모두 `.env`로 분리한다.
4. **단계적 작업** — 작업 순서: 이슈 생성 → 브랜치 생성 → 커밋/푸시 → PR 생성.
5. **필요한 것만 변경** — 리팩토링 범위 외의 기능은 건드리지 않는다.

---

## GitHub 워크플로우

### 작업 순서
```
1. GitHub 이슈 생성 (작업 단위별)
2. 이슈 번호 기반 브랜치 생성
3. 작업 단위로 커밋 및 푸시
4. PR 생성 (이슈 연결)
```

### 브랜치 네이밍
```
feat/#<이슈번호>-<작업명>       예) feat/#1-post-component
refactor/#<이슈번호>-<작업명>   예) refactor/#2-api-client
fix/#<이슈번호>-<작업명>        예) fix/#3-auth-token
chore/#<이슈번호>-<작업명>      예) chore/#4-env-setup
```

### 커밋 메시지 컨벤션
```
✨ Feat: 새로운 기능 추가
♻️ Refactor: 코드 리팩토링
🐛 Fix: 버그 수정
🗑️ Remove: 파일/코드 삭제
📦 Chore: 설정, 패키지 변경
💄 Style: UI/디자인 변경
🔒 Security: 보안 관련 수정
📝 Docs: 문서 수정
```

### PR 본문 형식
```markdown
## 관련 이슈
closes #<이슈번호>

## 변경 사항
- 변경 내용 요약

## 작업 방법
- 구현 방법 설명

## 테스트
- 테스트한 기능 목록
```

---

## 네이밍 컨벤션

### Board → Post 전환 (전체 프로젝트)
- 파일명: `BoardXxx.jsx` → `PostXxx.jsx`
- 컴포넌트명: `BoardDetail` → `PostDetail`
- 변수명: `board`, `boards` → `post`, `posts`
- URL 경로: `/board/*` → `/post/*`
- API 메서드명: `getBoard()` → `getPost()`
- 상태명: `setBoard` → `setPost`

> **주의**: 백엔드 API Endpoint 자체는 Swagger 기준을 따른다.

---

## 디렉토리 구조 (목표)

```
src/
├── api/                        # API 클라이언트 (기존 service/ 폴더 통합)
│   ├── client.js               # axios 인스턴스 + 인터셉터 (AuthFetch.js 대체)
│   ├── postApi.js              # Post(게시판) API
│   ├── commentApi.js           # 댓글 API
│   ├── signApi.js              # 인증 API
│   ├── favoriteApi.js          # 즐겨찾기 API
│   ├── commonApi.js            # 공통 API
│   └── log/                    # 로그 관련 API
│       ├── formatApi.js
│       ├── filterApi.js
│       ├── processApi.js
│       ├── deduplicationApi.js
│       ├── logDbApi.js
│       └── monitoringApi.js
│
├── constants/                  # 상수 정의
│   ├── colorMaps.js            # categoryColors, regionColors
│   ├── sizes.js                # 카드 크기, 레이아웃 상수
│   └── routes.js               # 경로 상수
│
├── hooks/                      # 커스텀 훅
│   ├── useAlert.js             # Alert 상태 관리
│   ├── usePost.js              # Post 데이터 페칭
│   ├── useAuth.js              # 인증 상태
│   └── usePagination.js        # 페이지네이션
│
├── utils/                      # 유틸 함수
│   ├── dateUtils.js            # 날짜 포매팅
│   └── tokenUtils.js           # JWT 토큰 파싱
│
├── components/                 # 공통 컴포넌트
│   ├── LoadingSpinner.jsx      # 로딩 스피너 (6곳 중복 → 1곳)
│   ├── AlertMessage.jsx        # Alert 표시
│   ├── PrivateRoute.jsx        # 인증 가드
│   ├── ErrorBoundary.jsx       # 에러 경계
│   └── layout/
│       ├── RootLayout.jsx      # Navbar + Footer 포함 레이아웃
│       └── AdminLayout.jsx     # 어드민 레이아웃
│
├── post/                       # 게시판 (기존 board/ → post/)
│   ├── components/
│   │   ├── PostListCard.jsx    # 게시글 카드 컴포넌트 (3곳 중복 → 1곳)
│   │   ├── PostFilter.jsx      # 검색/필터
│   │   └── PostForm.jsx        # 작성/수정 공통 폼
│   └── pages/
│       ├── PostListPage.jsx
│       ├── PostDetailPage.jsx
│       ├── PostWritePage.jsx
│       └── PostEditPage.jsx
│
├── comment/                    # 댓글 (구조 유지)
├── sign/                       # 인증 (구조 유지)
├── log/                        # 로그 관리 (구조 유지)
├── sse/                        # SSE (구조 유지)
│
├── common/                     # 공통 UI
│   ├── Navbar.jsx
│   ├── Footers.jsx
│   ├── GlobalNavigator.jsx
│   ├── MyPage.jsx
│   ├── LikeListPage.jsx
│   ├── CheckMyArt.jsx          # 내 게시글 (Post 네이밍으로 수정)
│   ├── ChckMyCom.jsx           # 내 댓글
│   └── PageRouter.jsx
│
├── css/
│   ├── App.css
│   └── index.css
│
├── App.js
└── index.js
```

---

## API 규칙

### Swagger 확인 방법
- Swagger UI: `http://localhost:8000/swagger-ui/index.html`
- 작업 전 반드시 Swagger에서 해당 Endpoint 확인 후 진행
- Request/Response 스펙이 기존 코드와 다를 경우 Swagger 기준으로 수정

### axios 클라이언트 구조
- `src/api/client.js`에 axios 인스턴스를 생성하고 인터셉터로 토큰 처리
- 기존 `AuthFetch.js`의 토큰 갱신 로직을 axios 인터셉터로 마이그레이션
- 모든 API 모듈은 이 클라이언트를 사용

```javascript
// 구조 예시
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

// 요청 인터셉터: accessToken 자동 주입
apiClient.interceptors.request.use(...);

// 응답 인터셉터: 401 시 토큰 갱신 후 재시도
apiClient.interceptors.response.use(...);
```

### API 모듈 작성 규칙
- 각 도메인별 API 함수를 파일 단위로 분리
- 클래스 대신 함수형으로 작성
- 모든 API 함수는 async/await 사용 (Promise 체이닝 금지)
- 에러는 인터셉터에서 1차 처리, 컴포넌트에서 try/catch로 2차 처리

---

## 환경변수 (.env)

프로젝트 루트에 `.env` 파일 생성 (없으면 생성):

```env
# API
REACT_APP_API_BASE_URL=http://localhost:8000

# 앱
REACT_APP_APP_NAME=Travel Project
```

- `.env`는 `.gitignore`에 포함되어 있어야 함 (현재 확인 필요)
- `.env.example` 파일을 함께 생성해서 필요한 변수 목록을 문서화

---

## 코드 작성 규칙

### 공통
- 하드코딩된 서버 URL, 포트 번호는 모두 환경변수로 대체
- 인라인 스타일은 CSS 클래스 또는 CSS 모듈로 전환 (Bootstrap 클래스 최대 활용)
- `console.log` 는 개발용으로만 허용, `console.error`는 에러 처리 시 사용
- 매직 넘버/문자열은 `src/constants/`에 상수로 정의

### 컴포넌트
- 단일 책임 원칙: 한 컴포넌트는 하나의 역할만 수행
- 300줄 이상 컴포넌트는 분리 대상
- 3곳 이상 반복되는 UI는 공통 컴포넌트로 추출
- props에 PropTypes 정의 (TypeScript 미도입 시)

### 커스텀 훅
- 컴포넌트에서 상태 + 비즈니스 로직이 혼재하면 커스텀 훅으로 분리
- 훅 파일명: `use<Name>.js`

### 상태 관리
- 서버 데이터(API 응답)와 UI 상태(모달 열림 여부 등)를 명확히 분리
- 3개 이상의 연관 상태는 `useReducer`로 통합 검토
- 전역 상태가 필요한 경우 Context API 사용 (별도 라이브러리 최소화)

### async/await
- Promise 체이닝(`.then().then()`) 사용 금지, async/await로 통일
- 모든 API 호출에 try/catch 필수

---

## 주요 개선 사항 목록

### Phase 1 — 기반 작업 (즉시)
- [ ] `.env` 파일 생성, 서버 URL 환경변수화
- [ ] `src/constants/colorMaps.js` 생성 (4곳 중복 해소)
- [ ] `src/utils/dateUtils.js` 생성 (4곳 중복 해소)
- [ ] `src/utils/tokenUtils.js` 생성 (3곳 중복 해소)
- [ ] `src/api/client.js` axios 인스턴스 생성 (AuthFetch.js 대체)
- [ ] `notUse/` 폴더 전체 삭제
- [ ] `.env.example` 파일 생성

### Phase 2 — 공통 컴포넌트/훅 (1주차)
- [ ] `src/components/LoadingSpinner.jsx` (6곳 중복 해소)
- [ ] `src/hooks/useAlert.js` (8곳 중복 해소)
- [ ] `src/components/PrivateRoute.jsx` (인증 가드)
- [ ] `src/components/layout/RootLayout.jsx` (Navbar + Footer 레이아웃)
- [ ] `src/post/components/PostListCard.jsx` (3곳 중복 해소)

### Phase 3 — Board → Post 전환 (2주차)
- [ ] `board/` 디렉토리 → `post/` 로 이동 및 파일명 변경
- [ ] 컴포넌트명, 변수명, 상태명 Post로 통일
- [ ] URL 경로 `/board/*` → `/post/*` 변경
- [ ] PageRouter.jsx 경로 정리 (일관된 네이밍, 오타 수정)

### Phase 4 — API 클라이언트 리팩토링 (2~3주차)
- [ ] 각 도메인별 API 모듈을 `src/api/`로 통합
- [ ] Swagger 기준으로 Endpoint 검증 및 수정
- [ ] 모든 API 호출 async/await + try/catch로 변환
- [ ] 에러 처리 통일

### Phase 5 — 컴포넌트 분리 (3~4주차)
- [ ] `PostDetailPage.jsx` 분리 (본문/액션/댓글)
- [ ] `SignUpPage.jsx` → `useSignUpForm.js` 훅 추출
- [ ] `PostWritePage.jsx` / `PostEditPage.jsx` → `PostForm.jsx` 공통화
- [ ] `Navbar.jsx` 분리

### Phase 6 — 스타일/UX 개선 (4주차+)
- [ ] 인라인 스타일 → Bootstrap 클래스 또는 CSS 모듈 전환
- [ ] 매직 넘버 → `src/constants/sizes.js` 정의
- [ ] 404 페이지 추가
- [ ] 에러 경계(ErrorBoundary) 컴포넌트 추가

---

## 삭제 대상 파일

리팩토링 진행 시 아래 파일/폴더는 삭제한다:

```
src/notUse/                         # 사용하지 않는 파일 전체
src/AuthFetch.js                    # axios 인터셉터로 대체 후 삭제
src/log/components/filter/notUse/   # 미사용 필터 컴포넌트
```

---

## 주의사항

- `src/log/` 하위 로그 관리 시스템은 별도 도메인으로, 기능 변경 없이 구조만 정리
- SSE (`src/sse/`) 기능은 실시간 연결을 다루므로 변경 시 신중하게 테스트
- 댓글, 좋아요, 즐겨찾기 등 상태 동기화 로직은 기능 테스트 필수
- Matomo 분석 트래킹 코드(`window.dataLayer`)는 위치는 변경 가능하나 제거 금지
