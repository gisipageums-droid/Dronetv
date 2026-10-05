import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
 import { ToastContainer } from 'react-toastify';
import './index.css';
import { toast } from 'react-toastify';
import { installSessionGuard } from './lib/sessionGuard';
import { Provider } from 'react-redux';

import { adminFormStore } from './components/Admin/AdminForm/redux toolkit/store/index.ts';

installSessionGuard();

try {
  const params = new URLSearchParams(window.location.search);
  if (params.get('expired') === '1') {
    params.delete('expired');
    const query = params.toString();
    window.history.replaceState(null, '', window.location.pathname + (query ? `?${query}` : '') + window.location.hash);
    window.setTimeout(() => toast.warn('Your session has expired. Please log in again.', { autoClose: 6000 }), 800);
  }
} catch { /* ignore */ }

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <Provider store={adminFormStore}>
    <App />
  <ToastContainer
  position="top-right"
  autoClose={3000}
  style={{ zIndex: 9999999999, top: '5rem' }}
/>
    </Provider>

  </StrictMode>
);
 