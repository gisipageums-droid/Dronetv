import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
 import { ToastContainer } from 'react-toastify';
import './index.css';
import { Provider } from 'react-redux';

import { adminFormStore } from './components/Admin/AdminForm/redux toolkit/store/index.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Provider store={adminFormStore}>
    <App />
  <ToastContainer
  position="top-right"
  autoClose={3000}
  style={{ zIndex: 9999999999, top: '5rem' }}
  toastStyle={{
    borderRadius: '20px',
    boxShadow: '0 8px 25px rgba(0,0,0,.08)',
    border: '1px solid #EFEFEF',
    fontFamily: 'Poppins, sans-serif',
    color: '#111111',
  }}
/>
    </Provider>

  </StrictMode>
);
 