import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './css/index.css';
import Navbar from './common/Navbar';

import PageRouter from './common/PageRouter';
import { useNavigate } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

function App() {

  return (
    <div className="App">   
     
      
      <PageRouter />
      <ToastContainer />
      
    </div>
  );
}

export default App;
