import { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor — KINETIXFITT móvil (Android/iOS).
 *
 * WebView contra producción (misma sesión, misma Supabase). No hay export
 * estático: la app es dinámica (middleware + API + Prisma), así que el
 * nativo es un wrapper online, igual que Electron en desktop.
 */
const config: CapacitorConfig = {
  appId: "com.kinetixfitt.app",
  appName: "KINETIXFITT",
  webDir: "public",
  server: {
    url: "https://kinetixfitt-world-ia.vercel.app",
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
