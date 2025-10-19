import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vippervezimai.app',
  appName: 'VIP Pervežimai',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  }
};

export default config;
