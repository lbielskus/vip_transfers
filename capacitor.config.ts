import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vippervezimai.app',
  appName: 'VIP Pervežimai',
  webDir: 'out',
  server: {
    url: 'https://vip-transfers.vercel.app',
    cleartext: true
  }
};

export default config;
