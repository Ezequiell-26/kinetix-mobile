// Capacitor configuration - types imported dynamically to avoid build issues
// import { CapacitorConfig } from '@capacitor/cli';

const config = {
  appId: 'com.kinetixfitt.app',
  appName: 'KinetixFitt',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#09090B',
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
