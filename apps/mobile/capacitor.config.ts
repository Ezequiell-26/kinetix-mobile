import { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor — KinetixFitt móvil (Android/iOS).
 * La app nativa consume el mismo backend web dinámico en producción.
 */
const config: CapacitorConfig = {
  appId: "com.kinetixfitt.app",
  appName: "KinetixFitt",
  webDir: "public",
  server: {
    url: process.env.CAPACITOR_SERVER_URL || "https://kinetixfitt-world-ia.vercel.app",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
