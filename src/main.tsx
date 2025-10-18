import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
 import { ToastContainer } from 'react-toastify';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  <ToastContainer
  position="top-right"
  autoClose={1000}
  style={{ zIndex: 9999999999 }}
/>
  </StrictMode>
);
