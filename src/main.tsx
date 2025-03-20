
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/responsive.css'

// Initialize Firebase Analytics
import { getAnalytics } from 'firebase/analytics';
import { firebase } from './integrations/firebase/client';

// Initialize Firebase Analytics
const analytics = getAnalytics(firebase);

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({ immediate: true })
        .then(res => {
          console.log('Service Worker registered: ', res);
        })
        .catch(error => {
          console.error('Service Worker registration failed: ', error);
        });
    });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
