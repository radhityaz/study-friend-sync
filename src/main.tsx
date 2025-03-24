
import React, { lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import App from './App';
import './index.css';
import './styles/responsive.css';
import { LoadingSpinner } from './components/common/LoadingSpinner';

// Initialize service worker for PWA
const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm('Update tersedia. Reload untuk update?')) {
      updateSW();
    }
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.Suspense fallback={<LoadingSpinner />}>
    <App />
  </React.Suspense>
);
