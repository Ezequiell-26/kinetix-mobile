/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output standalone para Docker
  output: "standalone",
  
  // Habilitar experimental features
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  
  // Headers de seguridad para producción
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block"
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()"
          }
        ]
      },
      {
        // Content Security Policy - Estricto para producción
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://sdk.mercadopago.com;
              style-src 'self' 'unsafe-inline';
              img-src 'self' data: blob: https:;
              font-src 'self' data:;
              connect-src 'self' https://api.stripe.com https://api.mercadopago.com https://sentry.io;
              frame-src 'self' https://js.stripe.com https://www.mercadopago.com;
              object-src 'none';
              base-uri 'self';
              form-action 'self';
              upgrade-insecure-requests;
            `.replace(/\s+/g, " ").trim()
          }
        ]
      }
    ];
  },
  
  // Imágenes remotas permitidas
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    unoptimized: process.env.NODE_ENV === "development",
  },
  
  // Transpile shared packages
  transpilePackages: ["@repo/shared"],
  
  // Webpack config para producción
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
