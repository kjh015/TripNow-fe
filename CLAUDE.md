# React Travel Project — Matomo 트래킹 개선 시스템 프롬프트

## 프로젝트 개요

여행 커뮤니티 + 로그 관리 시스템을 결합한 React 애플리케이션.

- **완료된 작업**
  - API 정합성 리팩토링 (Phase A~D) — 모든 Endpoint/Request/Response 필드명이 백엔드 Swagger 명세와 일치. develop 머지 완료.
  - 스타일 구조 리팩토링 (Phase 1~4) — 인라인 스타일 제거, `tokens.css` 디자인 토큰 도입, JSX `<style>` 태그 제거, bootstrap import 통합(`index.js` 1곳), 컴포넌트 통합 완료. develop 머지 완료.
  - 디자인 버그 수정 + 관리자 페이지 리디자인 (이슈 A~D, #56~#68) — 푸터/랭킹 카드/날짜 NaN 수정, 관리자 화면 toast·formatDate·Modal 패턴 통일. develop 머지 완료.
- **현재 목표**: Matomo 분석 트래킹 코드 정비 (아래 이슈 M0~M4)
  - 핵심 방향: **이벤트를 조정·유지보수하기 쉬운 구조**. 어떤 이벤트가 어느 페이지·어느 코드에서 발화되는지 한눈에 파악되고, 이벤트에 수집 데이터를 추가하는 작업이 파일 1곳 수정으로 끝나야 한다.

---

## 핵심 원칙

1. **기능 불변** — 트래킹 정비가 목적이다. 상태 관리, API 호출, 라우팅, UI는 건드리지 않는다. 기존에 발화되던 이벤트는 (스키마를 고치더라도) 발화 자체를 없애지 않는다.
2. **분석 코드 단일 레이어** — `window._mtm` / `window.dataLayer` 직접 접근은 `src/analytics/` 안에서만 허용. 컴포넌트는 이벤트별 트래커 함수만 호출한다. (아래 "Matomo 분석 아키텍처" 참조)
3. **API 레이어 불변** — `src/api/` 및 API 필드명 바인딩은 수정하지 않는다. 트래킹 페이로드에 필요한 값은 화면이 이미 들고 있는 상태에서 꺼내 쓴다.
4. **단계적 작업** — 이슈 생성 → 브랜치 생성 → 커밋/푸시 → PR 생성. 이슈 단위로 PR을 쪼갠다.
5. **스타일 규칙 준수** — Phase 1~4에서 확립한 스타일 아키텍처(아래)를 새 코드에도 그대로 적용한다. (이번 작업에서 UI 변경은 원칙적으로 없음)

---

## Matomo 분석 아키텍처 (목표 구조)

### 파일 구조

```
src/analytics/
├── analytics.js   # 데이터 레이어 접근 유일 창구: pushEvent, setUserAttributes, resetUser
│                  # 공통 필드(isLoggedIn, userId 등) 자동 주입도 이 파일에서만
└── events.js      # 이벤트 카탈로그: 이벤트별 트래커 함수 + 이벤트명 상수
                   # 함수마다 JSDoc으로 [발화 시점 / 호출 위치 / 페이로드 필드] 명시
```

### 유지보수성 규칙 (이 작업의 존재 이유 — 반드시 준수)

- **트래커 함수는 이벤트당 1개** — `trackDetailPageview(post)`, `trackSearch({...})` 형태. 호출부는 항상 1줄이고, 페이로드 조립은 전부 `events.js` 안에서 한다.
  - → 이벤트에 새 데이터를 추가할 때 **`events.js`의 함수 1개만 수정**하면 되고, 호출부는 손대지 않아도 되는 구조가 목표.
- **JSDoc 필수** — 모든 트래커 함수에 아래 3가지를 주석으로 명시한다. 호출 위치가 바뀌면 주석도 갱신한다.
  ```js
  /**
   * 게시글 상세 진입 시 1회 발화.
   * 호출 위치: src/post/pages/PostDetailPage.jsx
   * 페이로드: postId(number), category, region, title
   */
  export const trackDetailPageview = (post) => { ... };
  ```
- **이벤트명은 상수로만** — 문자열 리터럴로 이벤트명을 쓰지 않는다. `events.js` 상단에 `EVENT_NAMES` 객체로 모은다.
- **공통 필드는 헬퍼가 주입** — `isLoggedIn`, `userId` 등 모든 이벤트에 실리는 필드는 `analytics.js`의 `pushEvent`가 자동으로 붙인다. 화면 코드에서 반복 조립 금지.
- **페이로드 필드 규칙** — 게시글 ID는 항상 `postId`(number). `boardId` 금지. 값이 없으면 `"없음"` 같은 매직 문자열 대신 `null`. Matomo가 기본 수집하는 값(referrer, 방문 시각)은 페이로드에 넣지 않는다.
- **CLAUDE.md 이벤트 카탈로그 동기화** — 이벤트를 추가/변경/삭제하면 아래 "이벤트 카탈로그" 표를 같은 PR에서 갱신한다.

### 이벤트 추가/수정 절차 (3단계)

```
1. src/analytics/events.js 에 트래커 함수 추가 또는 수정 (JSDoc 포함)
2. 호출할 화면에서 함수 1줄 호출 (기존 이벤트에 필드만 추가하는 경우 이 단계 생략)
3. CLAUDE.md 이벤트 카탈로그 표 갱신
```

---

## 이벤트 카탈로그

### 유저 식별/속성 (M1에서 `analytics.js`의 `setUserAttributes` 경유로 이관, M2에서 userId 갱신/리셋 연결, M3에서 부팅 push 정리 완료)

| 데이터 | 시점 | 호출 위치 | 필드 |
|---|---|---|---|
| userId (토큰 sub 또는 익명 UUID) — `initAnalytics` 내부 | 앱 부팅 1회 (컨테이너 삽입 직전) | `src/analytics/analytics.js` (호출: `src/index.js`) | userId만 — gender/ageGroup/role은 부팅 시점에 알 수 없어 미전송 (M3에서 age -1·role "user" 매직 값 제거) |
| 로그인 유저 속성 (`setLoggedInUserAttributes`) | 로그인 성공 | `src/sign/components/SignInPage.jsx` | userId(토큰 식별자로 전환), gender, ageGroup(연령대 구간, 예: "20대"), role — **개인정보 방침(M2 결정): nickname·age 원값 미전송** |
| 유저 속성 리셋 (`resetUser`) | 로그아웃 | `src/common/Navbar.jsx` | userId(익명 UUID로 복귀), gender/ageGroup null, role "user" |

### 현재 이벤트 (M1에서 `events.js` 트래커 → `_mtm` push로 이관 완료, 이슈 #73)

| 이벤트 | 발화 시점 | 트래커 함수 (`src/analytics/events.js`) / 호출 위치 | 페이로드 | 남은 문제 |
|---|---|---|---|---|
| `travel_main_view` | 메인 페이지 진입 | `trackMainView` / `src/main/pages/MainPage.jsx` | (공통 필드만) | — |
| `travel_search_click` | 검색 버튼 클릭 | `trackSearchClick` / `src/post/components/PostSearch.jsx` | category, region (빈 값 null) | keyword 미수집 (M4) |
| `travel_detail_pageview` | 상세 데이터 로드 후 (postId당 1회 가드) | `trackDetailPageview` / `src/post/pages/PostDetailPage.jsx` | postId(number), category, region, title | — (M2에서 중복 발화 수정) |
| `travel_detail_exit` | 상세 이탈 (effect cleanup + `pagehide` 보완) | `trackDetailExit` / `src/post/pages/PostDetailPage.jsx` | postId(number), staySeconds, title | — (M2에서 과다 발화·staySeconds 왜곡 수정) |
| `travel_favorite_add` / `_remove` | 찜 토글 | `trackFavoriteAdd` / `trackFavoriteRemove` / `src/post/pages/PostDetailPage.jsx` | postId(number), category, region, title | — |
| `travel_comment_add` / `_remove` | 댓글 등록/삭제 | `trackCommentAdd` / `trackCommentRemove` / `src/comment/components/CommentPage.jsx` | postId(number), category, region, title | star(별점) 미수집 (M4) |

### 신규 이벤트 (이슈 M4에서 추가)

| 이벤트 | 발화 시점 | 호출 위치(예정) | 페이로드 | 목적 |
|---|---|---|---|---|
| `travel_signup_complete` | 회원가입 성공 | `src/sign/components/SignUpPage.jsx` | gender, age | 가입 퍼널 |
| `travel_login` / `travel_login_fail` | 로그인 성공/실패 | `src/sign/components/SignInPage.jsx` | (성공 시 role) | 로그인 퍼널 |
| `travel_post_add` / `_update` / `_remove` | 게시글 CRUD 성공 | post 작성/수정 화면 | postId, category, region | 콘텐츠 생산 지표 |
| `travel_search_click` (확장) | 검색 | `src/post/components/PostSearch.jsx` | + keyword | 검색어 분석 |
| `travel_search_result` | 검색 결과 로드 | `src/post/pages/PostListPage.jsx` | keyword, category, region, resultCount | **0건 검색 = 콘텐츠 갭** |
| `travel_list_item_click` | 리스트→상세 클릭 | 리스트 화면 | postId, position(순번), keyword | 검색 CTR |
| `travel_ranking_click` | 메인 랭킹 카드 클릭 | `MainPageCard` 계열 | rankType(region/category/post), rank, label | 랭킹 기능 효용 검증 |
| `travel_comment_add` (확장) | 댓글 등록 | `src/comment/components/CommentPage.jsx` | + star | 지역/카테고리 만족도 |
| `travel_error` | ErrorBoundary·API 실패 | `src/components/ErrorBoundary.jsx` 등 | errorType, message, path | 사용자 체감 장애 |

> 공통 필드(`isLoggedIn`, `userId`)는 `pushEvent`가 모든 이벤트에 자동 주입하므로 표에서 생략.

---

## 작업 이슈 목록 (2026-07-07 진단 결과)

### 이슈 M0 — 데이터 레이어 이원화 확인 (선행 조사, 🐛) — ✅ 완료 (이슈 #72)

> 결과: 컨테이너는 `_mtm`만 상시 수신 → push 대상 `_mtm` 통일 확정. 컨테이너 ID는 `container_2yv5mH8U.js`로 교체됨. 컨테이너는 아직 태그/트리거 미구성·미게시 상태로, 사용자가 MTM에서 travel_* Custom Event 트리거 + History Change 트리거 구성 후 게시 필요.

**진단**
- 초기화·로그인은 `window._mtm`, 이벤트 5곳은 `window.dataLayer`에 push. MTM(Matomo Tag Manager)의 기본 데이터 레이어는 `_mtm`이므로, 컨테이너에 커스텀 설정이 없다면 `dataLayer` 이벤트는 Matomo에 도달하지 않을 수 있음.

**해결 방향**
- Matomo 대시보드(또는 MTM 프리뷰 모드)에서 `travel_*` 이벤트 수신 여부 확인이 1순위. 컨테이너 트리거 설정(History Change 트리거 포함 — SPA 라우트 pageview)도 함께 확인.
- 확인 결과에 따라 M1에서 push 대상을 한쪽으로 통일. 코드만으로 판단 불가하므로 **작업 시작 전 사용자에게 확인 결과를 물어볼 것**.

### 이슈 M1 — `src/analytics/` 모듈 도입 + 기존 이벤트 이관 (중형, ♻️) — ✅ 완료 (이슈 #73)

**진단**
- `window.dataLayer = window.dataLayer || []; push(...)` 보일러플레이트가 5개 파일에 복붙됨.
- 페이로드 스키마 불일치: `boardId` vs `postId`, postId 문자열/숫자 혼재, `"없음"` 매직 문자열, Matomo 기본 수집값 중복(visit_time, referrer).

**해결 방향**
- 위 "Matomo 분석 아키텍처" 구조대로 `analytics.js` + `events.js` 생성, 기존 발화 지점 5곳을 트래커 함수 호출로 교체.
- 이 과정에서 스키마 통일(boardId→postId, Number 캐스팅, null 처리, 중복 필드 제거).
- `getUserIdForMatomo` 등 분석 전용 로직은 `tokenUtils.js`에서 `analytics.js`로 이동 검토 (토큰 디코딩 자체는 tokenUtils에 유지).

### 이슈 M2 — 트래킹 버그 수정 (소형, 🐛) — ✅ 완료 (이슈 #75)

> 결과: exit 추적을 `no`만 의존하는 별도 effect로 분리(+`pagehide`/`pageshow` 보완), pageview는 ref로 postId당 1회 가드. 로그인 시 `setLoggedInUserAttributes`(userId 포함), 로그아웃 시 `resetUser` 연결. 개인정보 방침 결정: nickname 미전송, age는 `ageGroup` 연령대 구간("20대" 등)으로 변환 전송. Heartbeat Timer는 컨테이너 설정 이슈로 미포함.

**진단**
- `travel_detail_exit`: `PostDetailPage.jsx` useEffect deps가 `[no, liked, commentFlag]` → 찜 토글/댓글마다 cleanup 실행되어 이탈이 아닌데 발화, `enterTime`도 리셋되어 staySeconds가 "마지막 상호작용 후 경과 시간"이 됨. 체류시간 데이터 신뢰 불가.
- `travel_detail_pageview`: deps에 `post` 객체 → loadPost 재실행마다 새 객체로 재발화. 상호작용 많은 글일수록 조회 집계 부풀려짐.
- userId 미갱신: 익명→로그인 시 userId push 없음(익명 UUID로 계속 집계), 로그아웃(`Navbar.jsx` handleLogout) 시 유저 속성 리셋 없음.

**해결 방향**
- exit 추적을 `no`만 의존하는 별도 effect로 분리. 탭 닫기 미포착 보완은 `pagehide` 리스너 또는 Matomo Heartbeat Timer 활성화로 검토(후자는 컨테이너 설정 이슈로 분리 가능).
- pageview는 postId 기준 1회 발화 가드(ref로 마지막 발화 postId 기억).
- 로그인 성공 시 `setUserAttributes`(userId 포함), 로그아웃 시 `resetUser` 호출. nickname·gender·age 원값 전송은 개인정보 관점에서 재검토(연령대 구간화 등) 후 결정.

### 이슈 M3 — 하드코딩 제거 + 스크립트 삽입 정리 (소형, 📦) — ✅ 완료 (이슈 #79)

> 결과: 컨테이너 삽입 로직을 `analytics.js`의 `initAnalytics()`로 이동(`index.js`는 1줄 호출), `innerHTML` 주입 → `script.src` 직접 설정으로 전환. `REACT_APP_MATOMO_CONTAINER_ID` env 도입, fallback URL 제거(env 미설정 시 삽입 스킵 + console.error). 부팅 push의 `age: -1`·`role: "user"` 매직 값 제거(userId만 전송).

**진단**
- `index.js`에 컨테이너 파일명 `container_5uzHzMcX.js`과 fallback `http://localhost:9080` 하드코딩. 스크립트를 `innerHTML` 문자열로 주입(불필요한 간접 실행).
- `index.js`의 `age: -1`, `role: "user"` 매직 값.

**해결 방향**
- `REACT_APP_MATOMO_CONTAINER_ID` 환경변수 추가(.env.example 갱신), fallback URL 제거 또는 env 필수화.
- `innerHTML` 대신 index.js에서 동일 로직 직접 실행. 삽입 로직 자체를 `analytics.js`의 `initAnalytics()`로 이동.

### 이슈 M4 — 신규 이벤트 추가 (중형, ✨)

- 위 "신규 이벤트" 표 참조. 전환·생산 퍼널(가입/로그인/게시글 CRUD) → 검색 품질(keyword, resultCount, list click) → 랭킹 클릭 → 에러/기타 순으로 우선순위.
- Web Vitals(패키지 이미 의존성에 있음, 미사용)를 Matomo 이벤트로 보내는 것은 선택 항목 — 별도 이슈로 분리 가능.
- 이벤트마다 카탈로그 표 갱신 필수.

### 작업 순서

```
M0 (확인) → M1 (모듈 도입, 이후 작업의 토대) → M2 (버그) → M3 (하드코딩) → M4 (신규 이벤트, 표의 우선순위 순)
```

---

## 스타일 아키텍처 (Phase 1~4 확립, 준수 필수)

### CSS 파일 구조
```
src/css/
├── tokens.css      # CSS 변수: 색상, 그라디언트, shadow, radius, z-index, 폰트
├── index.css       # 리셋 + body 기본
├── common.css      # Navbar, Footer, 공통 카드/뱃지/페이지 헤더 패턴
├── post.css        # post 도메인 화면
├── main.css        # 메인(main) 화면, 랭킹 카드
├── sign.css        # 로그인/회원가입/마이페이지
├── comment.css     # 댓글
└── log.css         # 로그 관리 Admin 화면
```

### 스타일 작성 규칙
- **JSX 내 `<style>` 태그 금지** — hover/transition/미디어쿼리는 CSS 파일의 클래스로 작성
- **인라인 style은 런타임 계산 값만 허용** (예: rank별 색상, 동적 width). 정적 스타일은 전부 클래스로
- 클래스 네이밍: 케밥 케이스 + 도메인 접두사 (`post-card`, `main-rank-badge`, `admin-page-header`)
- 색상/그라디언트/shadow/radius는 반드시 `var(--토큰명)` 참조, hex 직접 입력 금지 (신규 값 필요 시 tokens.css에 토큰 추가 후 사용)
- 레이아웃(간격, flex, 정렬)은 Bootstrap 유틸리티 클래스 우선 사용
- `bootstrap.min.css`, `bootstrap.bundle.min.js`, `bootstrap-icons` import는 **`src/index.js` 1곳에서만**
- `constants/colorMaps.js`(Bootstrap variant 매핑)는 그대로 유지

---

## GitHub 워크플로우

### 작업 순서
```
1. GitHub 이슈 생성 (이슈 M0~M4 단위)
2. 이슈 번호 기반 브랜치 생성
3. 작업 단위로 커밋 및 푸시
4. PR 생성 (이슈 연결, base: develop)
```

### 브랜치 네이밍
```
feat/#<이슈번호>-<작업명>       예) feat/#1-post-component
refactor/#<이슈번호>-<작업명>   예) refactor/#2-css-tokens
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
> M1은 `♻️ Refactor:`, M2 버그 수정은 `🐛 Fix:`, M3은 `📦 Chore:`, M4 신규 이벤트는 `✨ Feat:` 사용.

### PR 본문 형식
```markdown
## 관련 이슈
closes #<이슈번호>

## 변경 사항
- 변경 내용 요약

## 작업 방법
- 구현 방법 설명

## 테스트
- 테스트한 기능 목록 (트래킹 변경은 MTM 프리뷰/브라우저 콘솔에서 push 페이로드 캡처 첨부)
```

---

## API 참고 (수정 금지 영역)

- API 통신은 Swagger 정합 완료 상태. 기준 문서: `http://localhost:8000/swagger-ui/index.html`
- 응답 접근 패턴: `response.data.result` / `response.data.result.content` (공통 래퍼 `{ success, code, message, result }`)
- API 필드명, Endpoint, 데이터 바인딩 로직을 변경하지 않는다. 트래킹 페이로드용 필드명은 Swagger 필드명을 그대로 따른다 (단, 카탈로그에서 정한 `postId` 통일은 예외).

---

## 환경변수 (.env)

```env
# API
REACT_APP_API_BASE_URL=http://localhost:8000

# 이미지 (S3/CDN)
REACT_APP_IMAGE_BASE_URL=<이미지 베이스 URL>

# Matomo
REACT_APP_MATOMO_URL=http://localhost:9080
REACT_APP_MATOMO_CONTAINER_ID=<MTM 컨테이너 ID>   # 예) container_2yv5mH8U — 미설정 시 컨테이너 삽입 스킵 (M3에서 도입, fallback 없음)

# 앱
REACT_APP_APP_NAME=TripNow
```

- `.env`는 `.gitignore`에 포함, `.env.example`로 변수 목록 문서화
- 하드코딩된 서버 URL/포트/컨테이너 ID 발견 시 환경변수로 대체

---

## 코드 작성 규칙

### 공통
- `console.log`는 개발용으로만 허용, `console.error`는 에러 처리 시 사용
- 매직 넘버/문자열은 `src/constants/`에 상수로 정의 (이벤트명은 예외적으로 `src/analytics/events.js`에 위치)
- Promise 체이닝(`.then().then()`) 금지, async/await + try/catch로 통일
- 날짜 포맷은 `src/utils/dateUtils.js`의 공용 함수만 사용

### 분석(Analytics)
- `window._mtm` / `window.dataLayer` 직접 접근은 `src/analytics/` 내부에서만 — 컴포넌트는 트래커 함수만 호출
- 트래커 함수는 이벤트당 1개, JSDoc(발화 시점/호출 위치/페이로드) 필수
- 트래킹 실패가 기능을 깨면 안 됨 — `pushEvent`는 내부에서 예외를 삼키고 `console.error`만 남긴다
- 이벤트 추가/변경 시 CLAUDE.md 이벤트 카탈로그 표 동기화

### 컴포넌트
- 단일 책임 원칙: 한 컴포넌트는 하나의 역할만 수행
- props에 PropTypes 정의
- API 응답 필드명은 Swagger 기준 필드명 그대로 사용 (변경 금지)
- 알림은 `react-toastify`로 통일 (화면별 자체 alert 구현 금지)

---

## 주의사항

- **기존 이벤트 발화 제거 금지** — 이관·스키마 수정은 가능하나, 어떤 시점에 발화되던 이벤트를 없애지 않는다 (M2에서 "잘못 추가 발화되던 것"을 막는 것은 버그 수정이므로 예외).
- **M0 확인 전에 M1 이후 작업 착수 금지** — push 대상(`_mtm` vs `dataLayer`)이 정해져야 헬퍼 구현이 확정된다.
- SSE (`src/sse/`, `rankingApi.js`)는 실시간 연결 — 랭킹 카드 클릭 이벤트(M4) 추가 시 연결 동작 확인.
- 트래킹 변경 검증: 브라우저 콘솔에서 `window._mtm`/`window.dataLayer` 내용 확인 + MTM 프리뷰 모드. 페이로드 캡처를 PR에 첨부.
- 이벤트 스키마 변경(boardId→postId 등)은 Matomo 쪽 대시보드/세그먼트 설정에 영향 — 변경 목록을 PR 본문에 명시해 백엔드/분석 담당이 후속 조치할 수 있게 한다.
