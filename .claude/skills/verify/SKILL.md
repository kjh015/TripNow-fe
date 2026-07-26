---
name: verify
description: Matomo 트래킹 변경을 프로덕션 빌드 + Playwright로 E2E 검증하고 window._mtm 페이로드를 캡처하는 레시피
---

# 트래킹 변경 검증 레시피

빌드된 앱을 실제 브라우저로 구동해 `window._mtm` push 내용을 캡처한다. 유닛 테스트/typecheck가 아니라 런타임 관찰이 목적.

## 절차

```bash
npm run build                      # 프로덕션 빌드 (StrictMode 이중 effect 없음)
npx serve -s build -l 3999         # SPA fallback 포함 정적 서빙 (백그라운드)
# 스크래치패드 등 별도 디렉토리에 npm i playwright 후 node <캡처 스크립트>
```

## 캡처 스크립트 핵심 (Playwright)

- **API 목킹**: `page.route('**/api/**', ...)`로 전부 가로채고 공통 래퍼 `{success, code, message, result}`로 응답.
- **CORS 주의**: `src/api/client.js`가 `withCredentials: true`라서 와일드카드 `*` 불가. 목 응답에 반드시:
  `Access-Control-Allow-Origin: http://localhost:3999`, `Access-Control-Allow-Credentials: true`,
  `Allow-Headers: Authorization, Content-Type`, OPTIONS 프리플라이트 204 처리, 로그인 검증 시 `Access-Control-Expose-Headers: Authorization`.
- **로그인 상태**: 가짜 JWT(`alg:none`, base64url 헤더.페이로드.x, `sub` = userId)를 `addInitScript`로 localStorage `accessToken`에 주입. 로그인 플로우 검증은 `/api/v1/auth/login` 목이 `Authorization: Bearer <JWT>` 헤더로 응답.
- **MTM 컨테이너 스텁**: `page.route('**/js/container_*.js')`를 빈 JS로 fulfill → `_mtm`이 순수 배열로 남아 push 내용을 그대로 검사 가능. (localhost:9080에 실제 Matomo가 떠 있으면 스텁 없이는 push가 소비됨)
- **덤프**: `page.evaluate(() => window._mtm.filter(x => !x['mtm.startTime']))`
- **`page.goto`는 전체 리로드라 `_mtm`이 초기화됨** — 발화 횟수를 누적 검사하려면 SPA 내비게이션(`page.goBack()`, 링크/버튼 클릭)으로 이동할 것.
- **getMyLikes 목은 stateful하게** (`state.liked` 토글) — 아니면 찜 두 번째 클릭이 favorite_remove로 발화되지 않음.

## 주요 셀렉터/경로

- 상세: `/post/detail?no=<id>` (목: `/api/v1/search/posts/<id>`), 찜 버튼 `.favorite-btn`, 목록 이동 FAB `.post-detail-fab`
- 댓글: `#comment` textarea, 별점 `.comment-write-star >> nth=N`, `button:has-text("작성하기")`
- 로그인: `/sign/component/SignInPage`, `#loginId`/`#password`, 성공 시 `/`로 이동
- 로그아웃: 네비 토글 `.nav-toggler` → `로그아웃` 링크
- 참고 스크립트 원본: M2 PR(#76 근처) 본문 및 이전 세션 scratchpad `capture-mtm-m2.js`
