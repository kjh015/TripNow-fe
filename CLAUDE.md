# React Travel Project — API 정합성 리팩토링 시스템 프롬프트

## 프로젝트 개요

여행 커뮤니티 + 로그 관리 시스템을 결합한 React 애플리케이션.
**현재 리팩토링 목표**: 프론트엔드 API 통신 Endpoint 및 Request/Response 필드명을 백엔드 Swagger 명세에 완전히 일치시킨다.

---

## 핵심 원칙

1. **Swagger 절대 우선** — 모든 API Endpoint, HTTP Method, Request 필드명, Response 필드명은 Swagger를 유일한 기준으로 삼는다. 기존 프론트 코드가 다르면 무조건 Swagger에 맞춰 수정한다.
2. **파생 문제 전부 수정** — API 변경으로 발생하는 컴포넌트 데이터 바인딩 불일치(필드명, 구조 차이 등)는 모두 백엔드 스펙에 맞게 수정한다.
3. **기능 동일성 보장** — 리팩토링 전후 사용자가 경험하는 기능은 반드시 동일해야 한다.
4. **환경변수 사용** — 하드코딩된 값(서버 URL, 포트 등)은 모두 `.env`로 분리한다.
5. **단계적 작업** — 작업 순서: 이슈 생성 → 브랜치 생성 → 커밋/푸시 → PR 생성.
6. **필요한 것만 변경** — API 정합성 범위 외의 기능은 건드리지 않는다.

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

## Swagger 명세 정보

- **API 문서 JSON**: `http://localhost:8000/api/v1/web-api/v3/api-docs/web-api-service`
- **Swagger UI**: `http://localhost:8000/swagger-ui/index.html`
- 작업 전 반드시 Swagger에서 해당 Endpoint 확인 후 진행
- Request/Response 스펙이 기존 코드와 다를 경우 **무조건 Swagger 기준으로 수정**

---

## 전체 API Endpoint 목록 (Swagger 기준)

### Auth API
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/v1/auth/login` | 일반 로그인 |
| POST | `/api/v1/auth/logout` | 로그아웃 |
| POST | `/api/v1/auth/tokens/refresh` | 토큰 재발급 |
| POST | `/api/v1/auth/oauth2/tokens` | 소셜 로그인 토큰 발급 |

### Member API
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/v1/members` | 회원 가입 |
| GET | `/api/v1/members/me` | 내 프로필 조회 |
| PATCH | `/api/v1/members/me` | 내 정보 수정 |
| DELETE | `/api/v1/members/me` | 회원 탈퇴 |
| PATCH | `/api/v1/members/me/password` | 비밀번호 변경 |
| GET | `/api/v1/members/availability/nickname` | 닉네임 중복 확인 |
| GET | `/api/v1/members/availability/login-id` | 로그인 ID 중복 확인 |
| GET | `/api/v1/members/availability/email` | 이메일 중복 확인 |

### Post API (CUD)
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/v1/posts` | 게시글 생성 |
| PATCH | `/api/v1/posts/{postId}` | 게시글 수정 |
| DELETE | `/api/v1/posts/{postId}` | 게시글 삭제 |
| GET | `/api/v1/posts/images/presigned-url` | 이미지 업로드용 Presigned URL 발급 |

### Post Search API (Read)
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/v1/search/posts` | 게시글 통합 검색 |
| GET | `/api/v1/search/posts/{postId}` | 게시글 상세 조회 |
| GET | `/api/v1/search/posts/me` | 내 게시글 검색 |
| GET | `/api/v1/search/posts/autocomplete` | 검색어 자동완성 |

### Comment API
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/v1/comments` | 댓글 작성 |
| PATCH | `/api/v1/comments/{commentId}` | 댓글 수정 |
| DELETE | `/api/v1/comments/{commentId}` | 댓글 삭제 |
| GET | `/api/v1/search/comments` | 게시글별 댓글 조회 |
| GET | `/api/v1/search/comments/me` | 내가 쓴 댓글 조회 |

### Like API
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/v1/likes` | 좋아요 등록 |
| DELETE | `/api/v1/likes` | 좋아요 취소 |
| GET | `/api/v1/search/likes/me` | 내가 좋아요 한 게시글 목록 |

### Ranking API (SSE)
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/v1/rankings/live` | 실시간 랭킹 스트림 구독 |

### Admin API
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/v1/admin/members` | 전체 회원 목록 조회 |
| GET | `/api/v1/admin/members/{memberId}` | 회원 상세 정보 조회 |
| PATCH | `/api/v1/admin/members/{memberId}/role` | 관리자 권한 부여 |
| DELETE | `/api/v1/admin/members/{memberId}` | 회원 강제 탈퇴 |

### Log Process Admin API
| Method | Path | 설명 |
|--------|------|------|
| GET | `/api/v1/admin/log-processes` | 로그 프로세스 목록 |
| POST | `/api/v1/admin/log-processes` | 로그 프로세스 생성 |
| PATCH | `/api/v1/admin/log-processes/{logProcessId}` | 로그 프로세스 수정 |
| DELETE | `/api/v1/admin/log-processes/{logProcessId}` | 로그 프로세스 삭제 |
| GET | `/api/v1/admin/log-processes/{logProcessId}/format-rules` | 포맷 규칙 목록 |
| POST | `/api/v1/admin/log-processes/{logProcessId}/format-rules` | 포맷 규칙 생성 |
| GET | `/api/v1/admin/log-processes/{logProcessId}/format-rules/fields` | 활성 포맷 규칙 필드 |
| GET | `/api/v1/admin/log-processes/{logProcessId}/filter-rules` | 필터 규칙 목록 |
| POST | `/api/v1/admin/log-processes/{logProcessId}/filter-rules` | 필터 규칙 생성 |
| GET | `/api/v1/admin/log-processes/{logProcessId}/dedup-rules` | 중복제거 규칙 목록 |
| POST | `/api/v1/admin/log-processes/{logProcessId}/dedup-rules` | 중복제거 규칙 생성 |
| GET | `/api/v1/admin/format-rules/{formatRuleId}` | 포맷 규칙 상세 |
| PATCH | `/api/v1/admin/format-rules/{formatRuleId}` | 포맷 규칙 수정 |
| DELETE | `/api/v1/admin/format-rules/{formatRuleId}` | 포맷 규칙 삭제 |
| GET | `/api/v1/admin/filter-rules/{filterRuleId}` | 필터 규칙 상세 |
| PATCH | `/api/v1/admin/filter-rules/{filterRuleId}` | 필터 규칙 수정 |
| DELETE | `/api/v1/admin/filter-rules/{filterRuleId}` | 필터 규칙 삭제 |
| GET | `/api/v1/admin/dedup-rules/{dedupRuleId}` | 중복제거 규칙 상세 |
| PATCH | `/api/v1/admin/dedup-rules/{dedupRuleId}` | 중복제거 규칙 수정 |
| DELETE | `/api/v1/admin/dedup-rules/{dedupRuleId}` | 중복제거 규칙 삭제 |
| GET | `/api/v1/admin/histories` | 처리 기록 목록 |
| GET | `/api/v1/admin/histories/{historyId}` | 처리 기록 상세 |

---

## Request / Response 필드 명세 (Swagger 기준)

> 프론트 코드의 필드명이 아래와 다르면 **아래 기준으로 수정**한다.
> `*` 표시는 required 필드.

### Auth

**POST `/api/v1/auth/login`** Request
```json
{ "loginId": "string*", "password": "string*" }
```

**POST `/api/v1/auth/login`** Response (`result`)
```json
{ "memberId": integer, "nickname": "string" }
```

**POST `/api/v1/auth/oauth2/tokens`** Request
```json
{ "code": "string*" }
```

### Member

**POST `/api/v1/members`** Request (회원가입)
```json
{
  "loginId": "string*",
  "password": "string*",
  "email": "string*",
  "nickname": "string*",
  "gender": "string*",
  "birthDate": "string*"
}
```

**GET `/api/v1/members/me`** Response (`result`)
```json
{
  "memberId": integer,
  "loginId": "string",
  "email": "string",
  "nickname": "string",
  "gender": "string",
  "birthDate": "string",
  "age": integer,
  "roles": ["string"]
}
```

**PATCH `/api/v1/members/me`** Request
```json
{ "nickname": "string*" }
```

**PATCH `/api/v1/members/me/password`** Request
```json
{ "curPassword": "string*", "newPassword": "string*" }
```

### Post

**POST `/api/v1/posts`** / **PATCH `/api/v1/posts/{postId}`** Request
```json
{
  "title": "string*",
  "content": "string*",
  "travelPlace": "string*",
  "address": "string*",
  "category": "string*",
  "region": "string*",
  "images": [{ "imageKey": "string", "sortOrder": integer }]
}
```

**GET `/api/v1/search/posts`** Query Parameters
```
keyword, category, region, sort, direction, page (integer), size (integer)
```

**GET `/api/v1/search/posts`** / **`/me`** / **`/search/likes/me`** Response (`result.content[]`)
```json
{
  "postId": integer,
  "memberId": integer,
  "memberNickname": "string",
  "title": "string",
  "category": "string",
  "region": "string",
  "starAvg": number,
  "viewCount": integer,
  "likeCount": integer,
  "commentCount": integer,
  "popularityScore": integer,
  "updatedAt": "string"
}
```

**GET `/api/v1/search/posts/{postId}`** Response (`result`)
```json
{
  "postId": integer,
  "memberId": integer,
  "memberNickname": "string",
  "title": "string",
  "content": "string",
  "travelPlace": "string",
  "address": "string",
  "category": "string",
  "region": "string",
  "starAvg": number,
  "viewCount": integer,
  "likeCount": integer,
  "commentCount": integer,
  "updatedAt": "string",
  "images": [{ "imageKey": "string", "sortOrder": integer }]
}
```

**GET `/api/v1/posts/images/presigned-url`** Response (`result`)
```json
{ "url": "string", "imageKey": "string" }
```

### Comment

**POST `/api/v1/comments`** Request
```json
{ "postId": integer*, "content": "string*", "star": integer* }
```

**PATCH `/api/v1/comments/{commentId}`** Request
```json
{ "content": "string*", "star": integer* }
```

**GET `/api/v1/search/comments`** Query Parameters
```
postId (integer, required), page, size, sort
```

**GET `/api/v1/search/comments`** / **`/me`** Response (`result.content[]`)
```json
{
  "commentId": integer,
  "postId": integer,
  "memberId": integer,
  "memberNickname": "string",
  "content": "string",
  "star": integer
}
```

### Like

**POST `/api/v1/likes`** Request
```json
{ "postId": integer* }
```

**DELETE `/api/v1/likes`** Request
```json
{ "postId": integer* }
```

### 공통 Response Wrapper 구조

모든 API는 아래 구조로 응답한다:
```json
{
  "success": boolean,
  "code": "string",
  "message": "string",
  "result": { ... }
}
```

페이지네이션 응답 (`result` 내부):
```json
{
  "content": [...],
  "currentPage": integer,
  "size": integer,
  "totalElements": integer,
  "totalPages": integer,
  "isFirst": boolean,
  "isLast": boolean
}
```

---

## API 통신 규칙

### axios 클라이언트 구조
- `src/api/client.js`에 axios 인스턴스를 생성하고 인터셉터로 토큰 처리
- 기존 `AuthFetch.js`의 토큰 갱신 로직을 axios 인터셉터로 마이그레이션
- 모든 API 모듈은 이 클라이언트를 사용

```javascript
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
- 각 도메인별 API 함수를 `src/api/` 파일 단위로 분리
- 클래스 대신 함수형으로 작성
- 모든 API 함수는 async/await 사용 (Promise 체이닝 `.then().then()` 금지)
- 에러는 인터셉터에서 1차 처리, 컴포넌트에서 try/catch로 2차 처리
- API 응답에서 데이터 접근 시 `response.data.result` 또는 `response.data.result.content` 패턴 사용

---

## 환경변수 (.env)

```env
# API
REACT_APP_API_BASE_URL=http://localhost:8000

# 앱
REACT_APP_APP_NAME=Travel Project
```

- `.env`는 `.gitignore`에 포함
- `.env.example` 파일로 필요한 변수 목록 문서화

---

## 디렉토리 구조 (목표)

```
src/
├── api/
│   ├── client.js               # axios 인스턴스 + 인터셉터
│   ├── postApi.js              # Post CUD + Presigned URL
│   ├── postSearchApi.js        # Post Search (Read)
│   ├── commentApi.js           # Comment CUD + Search
│   ├── likeApi.js              # Like 등록/취소/조회
│   ├── authApi.js              # 로그인/로그아웃/토큰
│   ├── memberApi.js            # 회원 CRUD + 중복확인
│   ├── rankingApi.js           # SSE 랭킹
│   └── log/
│       ├── logProcessApi.js
│       ├── formatApi.js
│       ├── filterApi.js
│       ├── deduplicationApi.js
│       └── historyApi.js
│
├── constants/
│   ├── colorMaps.js
│   ├── sizes.js
│   └── routes.js
│
├── hooks/
│   ├── useAlert.js
│   ├── usePost.js
│   ├── useAuth.js
│   └── usePagination.js
│
├── utils/
│   ├── dateUtils.js
│   └── tokenUtils.js
│
├── components/
│   ├── LoadingSpinner.jsx
│   ├── AlertMessage.jsx
│   ├── PrivateRoute.jsx
│   ├── ErrorBoundary.jsx
│   └── layout/
│       ├── RootLayout.jsx
│       └── AdminLayout.jsx
│
├── post/
│   ├── components/
│   │   ├── PostListCard.jsx
│   │   ├── PostFilter.jsx
│   │   └── PostForm.jsx
│   └── pages/
│       ├── PostListPage.jsx
│       ├── PostDetailPage.jsx
│       ├── PostWritePage.jsx
│       └── PostEditPage.jsx
│
├── comment/
├── sign/
├── log/
├── sse/
│
├── common/
│   ├── Navbar.jsx
│   ├── Footers.jsx
│   ├── GlobalNavigator.jsx
│   ├── MyPage.jsx
│   ├── LikeListPage.jsx
│   ├── CheckMyArt.jsx
│   ├── ChckMyCom.jsx
│   └── PageRouter.jsx
│
├── css/
├── App.js
└── index.js
```

---

## 코드 작성 규칙

### 공통
- 하드코딩된 서버 URL, 포트 번호는 모두 환경변수로 대체
- `console.log`는 개발용으로만 허용, `console.error`는 에러 처리 시 사용
- 매직 넘버/문자열은 `src/constants/`에 상수로 정의

### 컴포넌트
- 단일 책임 원칙: 한 컴포넌트는 하나의 역할만 수행
- API 응답 필드명을 컴포넌트에서 직접 참조할 때 Swagger 기준 필드명 사용
- props에 PropTypes 정의

### async/await
- Promise 체이닝(`.then().then()`) 사용 금지, async/await로 통일
- 모든 API 호출에 try/catch 필수

---

## 주요 작업 목록

### Phase A — API Endpoint 수정
- [ ] `src/api/client.js` baseURL 및 인터셉터 정비
- [ ] `authApi.js`: `/api/v1/auth/login`, `/logout`, `/tokens/refresh` 로 수정
- [ ] `memberApi.js`: `/api/v1/members/**` 로 수정, 필드명 정합
- [ ] `postApi.js`: CUD → `/api/v1/posts/**`, Read → `/api/v1/search/posts/**`
- [ ] `commentApi.js`: CUD → `/api/v1/comments/**`, Read → `/api/v1/search/comments/**`
- [ ] `likeApi.js`: `/api/v1/likes` (POST/DELETE), `/api/v1/search/likes/me` (GET)
- [ ] `rankingApi.js`: SSE → `/api/v1/rankings/live`

### Phase B — Request 필드명 수정
- [ ] 로그인: `username` → `loginId` (있는 경우)
- [ ] 게시글: 기존 필드명 → `title, content, travelPlace, address, category, region, images`
- [ ] 댓글: 기존 필드명 → `postId, content, star`
- [ ] 비밀번호 변경: → `curPassword, newPassword`

### Phase C — Response 필드명 수정 (컴포넌트 바인딩)
- [ ] 게시글 목록: `postId, memberNickname, starAvg, viewCount, likeCount, commentCount, popularityScore, updatedAt`
- [ ] 게시글 상세: + `travelPlace, address, content, images[].imageKey, images[].sortOrder`
- [ ] 댓글: `commentId, postId, memberId, memberNickname, content, star`
- [ ] 내 프로필: `memberId, loginId, email, nickname, gender, birthDate, age, roles`
- [ ] 페이지네이션: `result.content`, `result.currentPage`, `result.totalPages`, `result.totalElements`, `result.isFirst`, `result.isLast`
- [ ] 공통 응답 래퍼: `response.data.result` 로 데이터 접근

### Phase D — 기존 리팩토링 완료 항목 유지
- [x] `src/api/client.js` axios 인스턴스 생성
- [x] `src/constants/colorMaps.js`
- [x] `src/utils/dateUtils.js`, `tokenUtils.js`
- [x] `src/components/LoadingSpinner.jsx`
- [x] `src/hooks/useAlert.js`
- [x] Board → Post 네이밍 전환
- [x] 컴포넌트 분리 (Phase 5)
- [x] 스타일/UX 개선 (Phase 6)

---

## 주의사항

- `src/log/` 하위 로그 관리 Admin API는 `/api/v1/admin/log-processes/**` 기준으로 수정
- SSE (`src/sse/`, `rankingApi.js`) 기능은 `/api/v1/rankings/live` 로 변경, 실시간 연결이므로 신중하게 테스트
- 댓글 `star` 필드: 별점 기능이 현재 UI에 없으면 백엔드 required이므로 기본값(예: 0) 처리 필요
- 이미지 업로드: Presigned URL 발급(`GET /api/v1/posts/images/presigned-url`) → S3 업로드 → `imageKey`를 Post 요청에 포함하는 플로우
- 좋아요 취소(DELETE `/api/v1/likes`)는 body에 `{ "postId": integer }` 를 포함
- Matomo 분석 트래킹 코드(`window.dataLayer`)는 위치 변경 가능하나 제거 금지
