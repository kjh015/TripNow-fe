import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './css/tokens.css';
import './css/index.css';
import './css/common.css';
import './css/post.css';
import './css/main.css';
import './css/sign.css';
import './css/comment.css';
import './css/log.css';

import App from './App';
import { setUserAttributes, getUserIdForMatomo } from './analytics/analytics';

// 3. Matomo Tag Manager 스크립트 삽입 + 데이터레이어에 userId 전달
function insertMatomoScript() {
  if (!document.getElementById('matomo-container-script')) {
    // 데이터레이어에 userId 전달
    setUserAttributes({ userId: getUserIdForMatomo(), age: -1, role: "user" });

    // Matomo Tag Manager 스크립트 삽입
    const script = document.createElement('script');
    script.id = 'matomo-container-script';
    script.innerHTML = `
      _mtm.push({'mtm.startTime': (new Date().getTime()), 'event': 'mtm.Start'});
      (function() {
        var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
        g.async=true; g.src='${process.env.REACT_APP_MATOMO_URL || 'http://localhost:9080'}/js/container_2yv5mH8U.js'; s.parentNode.insertBefore(g,s);

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




