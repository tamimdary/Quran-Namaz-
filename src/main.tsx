import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AdminProvider } from './AdminContext.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminProvider>
      <App />
    </AdminProvider>
  </StrictMode>,
);
