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
import { initAnalytics } from './analytics/analytics';

initAnalytics();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);




