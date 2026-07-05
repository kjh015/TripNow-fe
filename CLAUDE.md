# React Travel Project — 디자인 리팩토링 시스템 프롬프트

## 프로젝트 개요

여행 커뮤니티 + 로그 관리 시스템을 결합한 React 애플리케이션.

- **완료된 작업**: API 정합성 리팩토링 (Phase A~D) — 모든 Endpoint/Request/Response 필드명이 백엔드 Swagger 명세와 일치함. develop 브랜치에 머지 완료.
- **현재 리팩토링 목표**: 스타일링 구조 리팩토링 — 인라인 스타일 제거, 디자인 토큰 도입, 중복 컴포넌트 통합. **기능과 시각적 결과는 리팩토링 전후 동일해야 한다.**

---

## 핵심 원칙

1. **시각적 동일성 보장** — Phase 1~3은 픽셀 변화가 없는 순수 리팩토링이다. 의도적인 디자인 개선은 별도 이슈로 분리하고, 리팩토링 PR에 섞지 않는다.
2. **스택 유지** — Bootstrap 5 + react-bootstrap 기반을 유지한다. Tailwind, styled-components, emotion 등 새 스타일링 라이브러리 도입 금지. 방향은 **CSS 변수(디자인 토큰) + 도메인별 CSS 파일 + Bootstrap 유틸리티**.
3. **API 레이어 불변** — `src/api/` 및 API 필드명 바인딩은 Swagger 정합 완료 상태이므로 절대 수정하지 않는다. 디자인 리팩토링 중 필드명을 건드리지 않는다.
4. **단계적 작업** — 작업 순서: 이슈 생성 → 브랜치 생성 → 커밋/푸시 → PR 생성. Phase/화면 단위로 PR을 쪼갠다.
5. **필요한 것만 변경** — 스타일링 범위 외의 로직(상태 관리, API 호출, 라우팅)은 건드리지 않는다.

---

## 현재 문제점 (2026-07 분석 결과)

| # | 문제 | 규모 |
|---|------|------|
| 1 | 인라인 `style={{...}}` 남용 | 54개 파일, 284곳 |
| 2 | JSX 내 `<style>{...}` 문자열 태그 (hover/미디어쿼리 우회용) | 13개 파일 |
| 3 | hex 색상 하드코딩 | JSX에만 68곳+ |
| 4 | `linear-gradient` 복붙 (브랜드 그라디언트 포함) | 16개 파일, 23곳 |
| 5 | `bootstrap.min.css` / `bundle.min.js` 중복 import | 36개 파일 |
| 6 | 중복 컴포넌트: `MainPageCard`↔`MainPageCard2`, `MainPageCardsLayout`↔`Layout2` | 데이터 로딩 로직까지 동일 |
| 7 | 폰트/radius/shadow 값 불일치, 미로드 웹폰트(`Montserrat`, `Gowun Dodum`) 인라인 지정 | 전역 |
| 8 | `constants/sizes.js`·`colorMaps.js` 토큰이 있으나 미사용 하드코딩 혼재 (예: Navbar `zIndex: 1030`) | 부분적 |
| 9 | CRA 기본 템플릿 잔재 (`App.css`의 App-logo 회전 등 미사용 규칙) | `src/css/` |
| 10 | 인라인 고정 px로 인한 반응형 취약 | 전역 |

---

## 목표 스타일 아키텍처

### CSS 파일 구조
```
src/css/
├── tokens.css      # CSS 변수: 색상, 그라디언트, shadow, radius, z-index, 폰트
├── index.css       # 리셋 + body 기본 (기존 유지)
├── common.css      # Navbar, Footer, 공통 카드/뱃지/페이지 헤더 패턴
├── post.css        # post 도메인 화면
├── main.css        # 메인(board) 화면, 랭킹 카드
├── sign.css        # 로그인/회원가입/마이페이지
├── comment.css     # 댓글
└── log.css         # 로그 관리 Admin 화면
```

### 디자인 토큰 (tokens.css)
```css
:root {
  /* 브랜드 */
  --brand-gradient: linear-gradient(90deg, #5C6BC0 0%, #283593 100%);
  --brand-badge-gradient: linear-gradient(90deg, #B794F4 40%, #90CDF4 100%);

  /* 서피스 */
  --card-bg: #fff;
  --card-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.04);
  --card-shadow-lg: 0 8px 32px rgba(60, 60, 100, 0.14);

  /* 라운딩 */
  --radius-card: 18px;
  --radius-pill: 2rem;
  --radius-nav: 0 0 24px 24px;

  /* z-index */
  --z-navbar: 1030;
  --z-alert: 2000;
  --z-form-alert: 3000;
  --z-floating: 9999;
}
```
- 기존 `constants/sizes.js`의 값은 tokens.css로 이관하되, **JS 로직에서 필요한 값**(예: Alert 위치 계산)만 JS 상수로 남긴다.
- `constants/colorMaps.js`(Bootstrap variant 매핑)는 그대로 유지한다.

### 스타일 작성 규칙
- **JSX 내 `<style>` 태그 금지** — hover/transition/미디어쿼리는 CSS 파일의 클래스로 작성
- **인라인 style은 런타임 계산 값만 허용** (예: rank별 색상, 동적 width). 정적 스타일은 전부 클래스로
- 클래스 네이밍: 케밥 케이스 + 도메인 접두사 (`post-card`, `main-rank-badge`, `nav-brand`)
- 색상/그라디언트/shadow/radius는 반드시 `var(--토큰명)` 참조, hex 직접 입력 금지
- 레이아웃(간격, flex, 정렬)은 Bootstrap 유틸리티 클래스 우선 사용
- `bootstrap.min.css`, `bootstrap.bundle.min.js`, `bootstrap-icons` import는 **`src/index.js` 1곳에서만**

---

## 작업 Phase 목록

### Phase 1 — 기반 정리 (저위험, 시각 변화 없음)
- [ ] bootstrap css/js/icons import를 `index.js`로 통합, 36개 파일에서 제거
- [ ] `src/css/App.css` CRA 잔재 제거
- [ ] `src/css/tokens.css` 신설 (위 토큰 정의) 및 `index.js`에서 로드
- [ ] `constants/sizes.js` ↔ tokens.css 역할 정리

### Phase 2 — 공통 패턴 클래스화 (시각 변화 없음)
- [ ] 공통 카드(흰 배경+그림자+rounded), 뱃지, 페이지 헤더 그라디언트를 `common.css` 클래스로 추출
- [ ] JSX 내 `<style>` 태그 13곳을 CSS 파일로 이동
- [ ] Navbar/Footer/NavMenu 인라인 스타일 → `common.css`

### Phase 3 — 화면 단위 인라인 스타일 제거 (화면당 1 PR)
- [ ] post 화면 (`src/post/`) → `post.css`
- [ ] 메인/랭킹 화면 (`src/board/`) → `main.css`
- [ ] sign/마이페이지 (`src/sign/`, `src/common/MyPage` 등) → `sign.css`
- [ ] 댓글 (`src/comment/`) → `comment.css`
- [ ] 로그 관리 (`src/log/`) → `log.css`

### Phase 4 — 중복 제거 + 반응형/일관성 (시각 변화 가능, 별도 검증)
- [ ] `MainPageCard`/`MainPageCard2` → variant prop 하나로 통합, `MainPageCardsLayout`/`Layout2` 통합
- [ ] 폰트 스택 통일 — 웹폰트(`Gowun Dodum` 등) 사용 시 명시적 로드, 아니면 인라인 폰트 지정 제거
- [ ] 고정 px 값 모바일 동작 점검, 필요한 곳 미디어쿼리 적용
- [ ] radius/shadow 값 토큰으로 수렴

---

## GitHub 워크플로우

### 작업 순서
```
1. GitHub 이슈 생성 (Phase/화면 단위)
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
> 시각 변화 없는 스타일 구조 리팩토링은 `♻️ Refactor:`, 의도적 디자인 변경은 `💄 Style:` 사용.

### PR 본문 형식
```markdown
## 관련 이슈
closes #<이슈번호>

## 변경 사항
- 변경 내용 요약

## 작업 방법
- 구현 방법 설명

## 테스트
- 테스트한 기능 목록 (시각 동일성 확인 화면 포함)
```

---

## API 참고 (수정 금지 영역)

- API 통신은 Swagger 정합 완료 상태. 기준 문서: `http://localhost:8000/swagger-ui/index.html`
- 응답 접근 패턴: `response.data.result` / `response.data.result.content` (공통 래퍼 `{ success, code, message, result }`)
- 디자인 리팩토링 중 API 필드명, Endpoint, 데이터 바인딩 로직을 변경하지 않는다. 바인딩 버그를 발견하면 별도 이슈로 분리한다.

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

### 컴포넌트
- 단일 책임 원칙: 한 컴포넌트는 하나의 역할만 수행
- props에 PropTypes 정의
- API 응답 필드명은 Swagger 기준 필드명 그대로 사용 (변경 금지)

---

## 주의사항

- **Matomo 분석 트래킹 코드(`window.dataLayer`)는 위치 변경 가능하나 제거 금지**
- SSE (`src/sse/`, `rankingApi.js`)는 실시간 연결이므로 해당 화면 스타일 변경 시 연결 동작 확인
- react-bootstrap 컴포넌트(`Button`, `Badge`, `Offcanvas` 등)는 유지 — 커스텀 스타일만 클래스로 이동
- `bootstrap.bundle.min.js` 제거 시 Offcanvas/Modal 등 JS 의존 컴포넌트 동작 확인 (react-bootstrap은 자체 구현이므로 대부분 불필요하지만 순수 bootstrap 클래스 사용처 확인 필요)
- 화면 단위 PR마다 리팩토링 전후 스크린샷 비교로 시각 동일성 검증
