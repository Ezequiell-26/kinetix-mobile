// Capacitor configuration - types imported dynamically to avoid build issues
// import { CapacitorConfig } from '@capacitor/cli';

const config = {
  appId: 'com.kinetixfitt.app',
  appName: 'KinetiX',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    // SINCRONIZACIÓN WEB ↔ APP NATIVA (una sola cuenta en todos lados):
    // con `url` la app nativa carga la MISMA web servida por tu backend, así
    // el login (cookie ec_token), datos y chat son los mismos que en el
    // navegador. Sin `url`, Capacitor empaquetaría un `out/` estático donde
    // NO funcionan login, API ni middleware.
    //   Dev (misma red): CAPACITOR_SERVER_URL=http://192.168.x.x:3001
    //   Prod:            CAPACITOR_SERVER_URL=https://tu-dominio.com
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    // En dev local (http) permitir cleartext; en prod siempre HTTPS.
    cleartext: !process.env.CAPACITOR_SERVER_URL?.startsWith('https'),
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
