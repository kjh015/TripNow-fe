import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/index.css';

import PageRouter from './common/PageRouter';
import { ToastContainer } from 'react-toastify';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <PageRouter />
        <ToastContainer />
      </div>
    </ErrorBoundary>
  );
}

export default App;
