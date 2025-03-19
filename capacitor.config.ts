
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.859d3d98f47943ec92b6f3266442bed5',
  appName: 'Jadwalinæ',
  webDir: 'dist',
  server: {
    url: 'https://859d3d98-f479-43ec-92b6-f3266442bed5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Add device optimizations
  ios: {
    contentInset: 'automatic',
    allowsLinkPreview: true,
    scrollEnabled: true,
    usesFontScaling: true,
  },
  android: {
    allowMixedContent: true,
    captureInput: true,
    webViewUserAgent: null
  },
};

export default config;
