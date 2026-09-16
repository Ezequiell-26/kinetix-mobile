import { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor — KINETIXFITT móvil (Android/iOS).
 *
 * La app nativa es un wrapper online contra la app móvil desplegada. La URL
 * se inyecta en build para evitar depender de un preview de Vercel hardcodeado.
 */
const serverUrl = process.env.CAPACITOR_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: "com.kinetixfitt.app",
  appName: "KINETIXFITT",
  webDir: "public",
  ...(serverUrl
    ? {
        server: {
          url: serverUrl,
          cleartext: false,
        },
      }
    : {}),
  android: {
    allowMixedContent: false,
  },
};

export default config;
