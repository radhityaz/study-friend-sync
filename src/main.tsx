
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './styles/responsive.css'

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    import('virtual:pwa-register').then(({ registerSW }) => {
      registerSW({ immediate: true })
        .then((registration) => {
          console.log('Service Worker registered: ', registration);
        })
        .catch(error => {
          console.error('Service Worker registration failed: ', error);
        });
    });
  });
}

// React 19 doesn't need React.StrictMode wrapper anymore
createRoot(document.getElementById('root')!).render(<App />)
