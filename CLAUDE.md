# React Travel Project — 디자인 개선 시스템 프롬프트

## 프로젝트 개요

여행 커뮤니티 + 로그 관리 시스템을 결합한 React 애플리케이션.

- **완료된 작업**
  - API 정합성 리팩토링 (Phase A~D) — 모든 Endpoint/Request/Response 필드명이 백엔드 Swagger 명세와 일치. develop 머지 완료.
  - 스타일 구조 리팩토링 (Phase 1~4) — 인라인 스타일 제거, `tokens.css` 디자인 토큰 도입, JSX `<style>` 태그 제거, bootstrap import 통합(`index.js` 1곳), `MainPageCard`/`MainPageCardsLayout` 컴포넌트 통합 완료. develop 머지 완료.
- **현재 목표**: 디자인 버그 수정 + 관리자 페이지 전면 리디자인 (아래 이슈 A~D)

---

## 핵심 원칙

1. **기능 불변** — 이번 작업은 시각/UX 개선이 목적이다. 상태 관리, API 호출, 라우팅 등 기능 로직은 유지한다. 관리자 리디자인도 기존 기능을 전부 보존한 채 UI만 교체한다.
2. **스택 유지** — Bootstrap 5 + react-bootstrap 기반. Tailwind, styled-components, emotion 등 새 스타일링 라이브러리 도입 금지. 방향은 **CSS 변수(디자인 토큰) + 도메인별 CSS 파일 + Bootstrap 유틸리티**.
3. **API 레이어 불변** — `src/api/` 및 API 필드명 바인딩은 Swagger 정합 완료 상태이므로 수정하지 않는다. 백엔드 응답 형식 문제(예: 날짜 직렬화)를 발견하면 프론트에서 방어적으로 처리하고, 백엔드 수정은 별도 이슈로 분리한다.
4. **단계적 작업** — 이슈 생성 → 브랜치 생성 → 커밋/푸시 → PR 생성. 이슈 단위로 PR을 쪼갠다.
5. **스타일 규칙 준수** — Phase 1~4에서 확립한 스타일 아키텍처(아래)를 새 코드에도 그대로 적용한다.

---

## 작업 이슈 목록 (2026-07 진단 결과)

### 이슈 A — 푸터 중복 + 하단 흰 여백 (소형, 🐛)

**진단**
- `src/css/common.css`의 `.app-footer`가 내용 없이 `margin-top: 100px` + `padding: 64px 0 32px`을 가져 모든 페이지 하단에 ~200px 흰 띠 발생.
- `RootLayout.jsx`가 모든 페이지에 `<Footers />`를 붙이는데, `MainPage.jsx`도 자체 렌더링 → 메인 페이지는 푸터 2개(구분선 2줄).
- 페이지 배경색(`#F5F6FF`)이 `.mainpage-root`에만 적용되어 RootLayout 쪽 푸터는 흰 body 위에 그려짐.

**해결 방향**
- `MainPage.jsx`의 중복 `<Footers />` 제거 → 푸터는 RootLayout 한 곳에서만.
- 빈 푸터는 여백 축소 또는 실제 콘텐츠(카피라이트 등) 추가.
- 페이지 배경색은 페이지 루트 div가 아니라 body 또는 RootLayout 래퍼(`min-height: 100vh` flex column, sticky footer 패턴) 레벨로 이동.

### 이슈 B — 랭킹 카드 5개 조건 + 반응형 (소형, 🐛+💄)

**진단**
- `MainPageCardsLayout.jsx` / `MainPageCardsLayout2.jsx`에 `length < 5`이면 로딩 스피너만 표시하는 하드코딩 → 데이터가 1~4개면 영원히 로딩.
- `main.css`의 `.mainpage-layout2-card`가 고정 240px + `flex-shrink: 0`, 행은 `justify-content: center` + `overflow-x: auto` 조합 → 화면이 좁으면 좌측이 잘린 채 가로로 튀어나옴.
- 섹션 제목("실시간 인기 지역" 등)이 고정 `padding-left: 19rem`이라 카드 시작 위치와 어긋남.

**해결 방향**
- 로딩 조건을 "빈 배열일 때만"으로 변경, 1개 이상이면 있는 만큼 렌더링. 게시물 레이아웃은 `top5Posts[0]` 존재만 확인 (2~5위는 `slice(1, 5).map`이라 안전).
- 카드 행을 CSS Grid `repeat(auto-fit, minmax(180px, 1fr))`로 교체해 화면 폭에 따라 열 수가 줄도록.
- 제목과 카드 행을 같은 `max-width` 컨테이너(`max-width: 1400px; margin: 0 auto`)로 감싸고 고정 padding 제거.

### 이슈 C — 게시물 리스트 날짜 "NaN-NaN-NaN NaN:NaN" (소형, 🐛)

**진단**
- `src/utils/dateUtils.js`의 `formatDate`가 `post.updatedAt` 파싱 실패 → Invalid Date. 값이 없으면 빈 문자열 처리되므로, **값은 오는데 ISO 문자열이 아닌 형식**.
- 유력 원인: Jackson이 `LocalDateTime`을 `[2026,7,6,...]` 배열로 직렬화하는 케이스 (배열에 `+ "+09:00"` 문자열 연결 시 정확히 이 NaN 출력이 재현됨). 로그 관리 API의 날짜는 정상이므로 post 검색 API만 형식이 다를 가능성.

**해결 방향**
- 작업 전 실제 응답 payload 확인이 1순위.
- `formatDate`를 방어적으로 보강: 배열/비ISO 형식 처리, 파싱 실패 시 빈 문자열 반환. (`utils/`는 API 레이어가 아니므로 수정 가능)
- 백엔드 직렬화 설정 문제로 확인되면 백엔드 ISO 통일은 별도 이슈로 분리.

### 이슈 D — 관리자 페이지 전면 리디자인 (대형, 💄)

**진단 (통일성 없음의 실체)**
- 알림(alert) 구현이 화면마다 별도 정의 — `showAlert` 시그니처마저 `(type, message)` vs `({type, message})`로 상이. 프로젝트에 이미 있는 `react-toastify`와 이원화.
- 날짜 포맷 함수를 화면마다 복붙 정의 (`utils/dateUtils.js` 미사용).
- 상세/수정/추가 UX 제각각: 인라인 행 확장 vs 모달(`ConditionBuilder`는 body overflow 직접 조작).
- 화면 간 이동이 `⬅ 포맷 관리` / `중복제거 관리 ➡` 이모지 버튼.
- 전체적으로 브랜드 토큰 미적용으로 밋밋함.

**리디자인 방향 (기능 유지, UI만 교체)**
1. **공통 레이어 먼저**: `AdminPageHeader`(타이틀 + 우측 액션 버튼 슬롯), 공통 테이블 스타일, 알림은 `react-toastify`로 통일, 날짜는 `utils/dateUtils.js` 공용 사용.
2. **상세/추가/수정 패턴 통일**: 추가/수정은 react-bootstrap `Modal`(또는 `Offcanvas`), 상세 조회는 인라인 확장 유지 — 결정한 패턴을 전 화면에 동일 적용.
3. **파이프라인 네비게이션**: 포맷→필터→중복제거 이동을 이모지 버튼 대신 상단 스텝퍼/탭 UI로. `AdmnMenu` 사이드바에 활성 메뉴 하이라이트 추가.
4. **톤 맞추기**: 커뮤니티 쪽 브랜드 토큰(`--brand-gradient`, 카드 그림자)을 관리자 헤더/카드에 적용.

**PR 분할**: 공통 컴포넌트 PR → 화면별 적용 PR (포맷/필터/중복제거/프로세스/로그/회원 관리).

### 작업 순서

```
이슈 A → B → C (버그성, 소형) → 이슈 D (리디자인, 공통 컴포넌트 설계안 먼저 확인)
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
├── main.css        # 메인(board) 화면, 랭킹 카드
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
1. GitHub 이슈 생성 (이슈 A~D 단위, D는 하위 작업 단위)
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
> 이슈 A~C 버그 수정은 `🐛 Fix:`, 관리자 리디자인 등 의도적 디자인 변경은 `💄 Style:` 사용.

### PR 본문 형식
```markdown
## 관련 이슈
closes #<이슈번호>

## 변경 사항
- 변경 내용 요약

## 작업 방법
- 구현 방법 설명

## 테스트
- 테스트한 기능 목록 (변경 전후 스크린샷 비교 포함)
```

---

## API 참고 (수정 금지 영역)

- API 통신은 Swagger 정합 완료 상태. 기준 문서: `http://localhost:8000/swagger-ui/index.html`
- 응답 접근 패턴: `response.data.result` / `response.data.result.content` (공통 래퍼 `{ success, code, message, result }`)
- API 필드명, Endpoint, 데이터 바인딩 로직을 변경하지 않는다. 바인딩/직렬화 버그를 발견하면 프론트에서 방어 처리하고 백엔드 수정은 별도 이슈로 분리한다.

---

## 환경변수 (.env)

```env
# API
REACT_APP_API_BASE_URL=http://localhost:8000

# 이미지 (S3/CDN)
REACT_APP_IMAGE_BASE_URL=<이미지 베이스 URL>

# 앱
REACT_APP_APP_NAME=Travel Project
```

- `.env`는 `.gitignore`에 포함, `.env.example`로 변수 목록 문서화
- 하드코딩된 서버 URL/포트 발견 시 환경변수로 대체

---

## 코드 작성 규칙

### 공통
- `console.log`는 개발용으로만 허용, `console.error`는 에러 처리 시 사용
- 매직 넘버/문자열은 `src/constants/`에 상수로 정의
- Promise 체이닝(`.then().then()`) 금지, async/await + try/catch로 통일
- 날짜 포맷은 `src/utils/dateUtils.js`의 공용 함수만 사용 (화면별 재정의 금지)

### 컴포넌트
- 단일 책임 원칙: 한 컴포넌트는 하나의 역할만 수행
- props에 PropTypes 정의
- API 응답 필드명은 Swagger 기준 필드명 그대로 사용 (변경 금지)
- 알림은 `react-toastify`로 통일 (화면별 자체 alert 구현 금지)

---

## 주의사항

- **Matomo 분석 트래킹 코드(`window.dataLayer`)는 위치 변경 가능하나 제거 금지**
- SSE (`src/sse/`, `rankingApi.js`)는 실시간 연결이므로 랭킹 화면 수정 시 연결 동작 확인 (이슈 B가 이 영역을 직접 건드림)
- react-bootstrap 컴포넌트(`Button`, `Badge`, `Modal`, `Offcanvas` 등)는 유지 — 커스텀 스타일만 클래스로 이동
- 관리자 리디자인(이슈 D)은 화면별 PR마다 기존 기능 동작 확인 목록을 PR 본문에 포함 (CRUD, 활성/비활성 토글, 화면 간 이동, 상세 확장)
- 이슈 A~C는 수정 전후 스크린샷 비교로 검증
