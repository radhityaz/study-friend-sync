
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.859d3d98f47943ec92b6f3266442bed5',
  appName: 'study-friend-sync',
  webDir: 'dist',
  server: {
    url: 'https://859d3d98-f479-43ec-92b6-f3266442bed5.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keyPassword: undefined,
      releaseType: "AAB",
    }
  }
};

export default config;
