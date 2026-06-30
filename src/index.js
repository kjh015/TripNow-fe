import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/index.css';

import App from './App';
import { getUserIdForMatomo } from './utils/tokenUtils';

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
        g.async=true; g.src='${process.env.REACT_APP_MATOMO_URL || 'http://localhost:9080'}/js/container_5uzHzMcX.js'; s.parentNode.insertBefore(g,s);

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




