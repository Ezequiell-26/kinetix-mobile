/** @type {import("next").NextConfig} */
const nextConfig = {
  // Output standalone (Docker/self-host). En Vercel se ignora sin daño.
  output: "standalone",
  // Next 15 deprecó el lint integrado y este repo no tiene config plana de
  // ESLint en apps/mobile (el build fallaba con "Definition for rule
  // '@typescript-eslint/no-unused-vars' was not found" por el .eslintrc
  // heredado de la raíz). El gate de calidad es tsc + tests, no este lint.
  eslint: { ignoreDuringBuilds: true },
  experimental: {
    // OJO seguridad: NO usar ["*"] acá. Next.js valida el header Origin de
    // los Server Actions contra esta lista para prevenir CSRF; "*" apaga esa
    // protección por completo. Sin este campo, Next usa por defecto el propio
    // host de la request (correcto para same-origin). Se agregan dominios de
    // producción reales vía env var cuando existan.
    serverActions: {
      allowedOrigins: process.env.NEXT_PUBLIC_APP_URL
        ? [new URL(process.env.NEXT_PUBLIC_APP_URL).host]
        : undefined,
      // Uploads de hasta 5MB por form: margen de sobra.
      bodySizeLimit: "10mb",
    },
    // Tree-shaking agresivo de estos paquetes: evita que Next empaquete
    // toda la librería de íconos/animaciones cuando solo se usan algunos.
    // Reduce el JS que baja el navegador sin cambiar ningún comportamiento.
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "recharts",
      "date-fns",
    ],
  },
  images: {
    // OJO seguridad: AVIF deshabilitado a propósito. La optimización AVIF de
    // Next.js depende de libheif, que tuvo una vulnerabilidad de RCE no
    // autenticado explotable en servidores Windows (parche Next.js ago 2026,
    // v15.5.24). Reactivar "image/avif" solo después de confirmar que
    // next@15.5.24+ está instalado Y que el fix de libheif ya se propagó.
    formats: ["image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  compress: true,
  // Permite un directorio de build alternativo (p. ej. si `.next` queda bloqueado).
  // Default: `.next`. No cambia el comportamiento normal.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  /**
   * Headers de seguridad aplicados a todas las respuestas.
   * Basado en OWASP Secure Headers Project + mejores prácticas de Next.js.
   * No rompen la app porque:
   *  - CSP usa 'self' + Google Fonts + inline scripts del theme (nonce dinámico
   *    no es viable sin middleware; el script inline es minúsculo y seguro).
   *  - COEP se deja en modo report para no romper imágenes externas de avatars.
   */
  async headers() {
    // CSP: se permite inline para el script de tema en <head> del layout root.
    // Si se agrega un nonce en el futuro, reemplazar 'unsafe-inline'.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com https://us.i.posthog.com https://us-assets.i.posthog.com https://eu.i.posthog.com https://app.posthog.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "img-src 'self' data: blob: https: http:",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://*.sentry.io https://www.google-analytics.com https://us.i.posthog.com https://us.posthog.com https://eu.i.posthog.com https://app.posthog.com https://*.posthog.com",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; ");

    // En desarrollo Next.js (React Refresh) evalúa código al vuelo y el
    // script-src sin 'unsafe-eval' deja la página en blanco (en consola:
    // "EvalError ... violates ... Content Security Policy"). El CSP se
    // aplica solo en producción.
    const isDev = process.env.NODE_ENV === "development";
    const cspHeader = isDev
      ? []
      : [
          {
            key: "Content-Security-Policy",
            value: csp,
          },
        ];

    return [
      {
        // Aplicar a todas las rutas excepto archivos estáticos.
        source:
          "/((?!_next/static|_next/image|favicon.ico|icons|manifest.json).* )",
        headers: [
          ...cspHeader,
          {
            // Evita clickjacking: impide que la app se embeba en iframes externos.
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Evita MIME-sniffing en navegadores antiguos.
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Evita que el navegador infiera el referrer completo.
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // DNS prefetch: reduce latencia en fuentes externas.
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            // HSTS: fuerza HTTPS durante 1 año (incluye subdominios).
            // Solo efectivo cuando la app se sirve sobre HTTPS.
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            // Limita APIs sensibles del navegador.
            key: "Permissions-Policy",
            value:
              "camera=(self), microphone=(self), geolocation=(), payment=(self), usb=()",
          },
          {
            // Evita que la página sea abierta como popup desde otro sitio.
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            // Permite cargar recursos cross-origin pero no expone bytes.
            key: "Cross-Origin-Resource-Policy",
            value: "same-origin",
          },
        ],
      },
    ];
  },
};
export default nextConfig;
