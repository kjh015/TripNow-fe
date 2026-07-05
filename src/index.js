import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/index.css';


import App from './App';

// 1. 익명 사용자용 UUID 생성/획득 함수
function getOrCreateAnonymousId() {
  let id = localStorage.getItem('anonymousId');
  if (!id) {
    // crypto.randomUUID()는 최신 브라우저 지원. 구버전은 uuid 라이브러리 사용
    id = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
      );
    localStorage.setItem('anonymousId', id);
  }
  return id;
}

// 2. userId 결정 함수 (회원이면 JWT에서, 아니면 anonymousId)
function getUserIdForMatomo() {
  const token = localStorage.getItem("accessToken");
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.sub || payload.loginId || null;
    } catch (e) {
      // JWT 파싱 실패 시 익명 ID 사용
      return getOrCreateAnonymousId();
    }
  }
  // 토큰 없으면 익명 ID
  return getOrCreateAnonymousId();
}

// 3. Matomo Tag Manager 스크립트 삽입 + 데이터레이어에 userId 전달
function insertMatomoScript() {
  if (!document.getElementById('matomo-container-script')) {
    // userId 결정
    const userId = getUserIdForMatomo();

    // 데이터레이어에 userId 전달
    window._mtm = window._mtm || [];
    window._mtm.push({ userId, age: -1, role: "user" });

    // Matomo Tag Manager 스크립트 삽입
    const script = document.createElement('script');
    script.id = 'matomo-container-script';
    script.innerHTML = `
      _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
      (function() {
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='http://14.63.178.161:9080/js/container_5uzHzMcX.js'; s.parentNode.insertBefore(g,s);

      })();
    `;
    document.body.appendChild(script);
  }
}


// index.js에서 최초 1회만 실행!
insertMatomoScript();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




