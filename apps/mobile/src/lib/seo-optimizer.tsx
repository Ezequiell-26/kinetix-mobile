/**
 * Sistema de Optimización SEO y Performance
 * Mejora la visibilidad en buscadores y la velocidad de carga
 */

import type { Metadata } from 'next';

// Configuración base para metadatos
export const seoConfig = {
  title: 'KINETIXFITT | Entrenamiento Personalizado Online',
  description: 'Programa de entrenamiento personalizado, seguimiento real y contacto directo con tu coach. Todo desde tu celular, sin vueltas.',
  keywords: [
    'entrenamiento personalizado',
    'coach online',
    'fitness',
    'gimnasio',
    'nutrición',
    'ejercicios',
    'rutina personalizada',
    'entrenador personal',
    'app fitness',
    'seguimiento deportivo',
  ],
  author: 'KinetixFitt',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://kinetixfitt.com',
    siteName: 'KINETIXFITT',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'KINETIXFITT - Tu mejor versión, cada día',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KINETIXFITT | Entrenamiento Personalizado Online',
    description: 'Programa de entrenamiento personalizado, seguimiento real y contacto directo con tu coach.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Generar metadatos dinámicos
export function generatePageMetadata(options: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
}): Metadata {
  return {
    title: options.title 
      ? `${options.title} | KINETIXFITT` 
      : seoConfig.title,
    description: options.description || seoConfig.description,
    keywords: options.keywords 
      ? [...seoConfig.keywords, ...options.keywords] 
      : seoConfig.keywords,
    authors: [{ name: seoConfig.author }],
    creator: seoConfig.author,
    publisher: seoConfig.author,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL('https://kinetixfitt.com'),
    alternates: {
      canonical: options.canonical,
      languages: {
        'es': '/es',
        'en': '/en',
        'pt': '/pt',
      },
    },
    openGraph: {
      ...seoConfig.openGraph,
      title: options.title || seoConfig.title,
      description: options.description || seoConfig.description,
      ...(options.image && {
        images: [{
          url: options.image,
          width: 1200,
          height: 630,
          alt: options.title || 'KINETIXFITT',
        }],
      }),
    },
    twitter: {
      ...seoConfig.twitter,
      title: options.title || seoConfig.twitter.title,
      description: options.description || seoConfig.twitter.description,
      ...(options.image && {
        images: [options.image],
      }),
    },
    verification: {
      google: 'your-google-verification-code',
      yandex: 'your-yandex-verification-code',
    },
  };
}

// Structured Data (JSON-LD) para SEO
export function generateStructuredData(type: 'Organization' | 'WebSite' | 'Product' | 'Article', data: any) {
  const structuredData: any = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'Organization':
      structuredData['@type'] = 'Organization';
      structuredData.name = 'KINETIXFITT';
      structuredData.url = 'https://kinetixfitt.com';
      structuredData.logo = 'https://kinetixfitt.com/logo.png';
      structuredData.sameAs = [
        'https://instagram.com/kinetixfitt',
        'https://facebook.com/kinetixfitt',
        'https://youtube.com/kinetixfitt',
      ];
      structuredData.contactPoint = {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'English', 'Portuguese'],
      };
      break;

    case 'WebSite':
      structuredData['@type'] = 'WebSite';
      structuredData.name = 'KINETIXFITT';
      structuredData.url = 'https://kinetixfitt.com';
      structuredData.potentialAction = {
        '@type': 'SearchAction',
        target: 'https://kinetixfitt.com/search?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      };
      break;

    case 'Product':
      structuredData['@type'] = 'Product';
      structuredData.name = data.name || 'Programa de Entrenamiento Personalizado';
      structuredData.description = data.description || seoConfig.description;
      structuredData.image = data.image || '/og-image.jpg';
      structuredData.brand = {
        '@type': 'Brand',
        name: 'KINETIXFITT',
      };
      structuredData.offers = {
        '@type': 'Offer',
        url: 'https://kinetixfitt.com/planes',
        priceCurrency: 'ARS',
        price: data.price || '12000',
        availability: 'https://schema.org/InStock',
        seller: {
          '@type': 'Organization',
          name: 'KINETIXFITT',
        },
      };
      structuredData.aggregateRating = {
        '@type': 'AggregateRating',
        ratingValue: data.ratingValue || '4.9',
        reviewCount: data.reviewCount || '150',
      };
      break;

    case 'Article':
      structuredData['@type'] = 'Article';
      structuredData.headline = data.headline;
      structuredData.description = data.description;
      structuredData.image = data.image;
      structuredData.author = {
        '@type': 'Person',
        name: 'KinetixFitt',
        url: 'https://kinetixfitt.com',
      };
      structuredData.publisher = {
        '@type': 'Organization',
        name: 'KINETIXFITT',
        logo: {
          '@type': 'ImageObject',
          url: 'https://kinetixfitt.com/logo.png',
        },
      };
      structuredData.datePublished = data.datePublished;
      structuredData.dateModified = data.dateModified;
      break;
  }

  return structuredData;
}

// Componente JSON-LD para insertar en el head — escapa </script> para evitar breakout XSS
// JSON.stringify no escapa </script> ni <!-- ; un headline malicioso podría cerrar el tag
export function JsonLdScript({ data, nonce }: { data: any; nonce?: string }) {
  const json = JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/-->/g, "--\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

/**
 * Helper: escapa JSON-LD string ya serializado (por si se usa fuera del componente)
 */
export function escapeJsonLd(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/-->/g, "--\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

// Optimizaciones de performance
export const performanceConfig = {
  // Lazy loading para imágenes
  lazyLoading: {
    threshold: 0.1,
    rootMargin: '200px',
  },
  
  // Precarga de recursos críticos
  preload: {
    fonts: [
      '/fonts/inter-var.woff2',
      '/fonts/geist-sans.woff2',
    ],
    images: [
      '/og-image.jpg',
      '/icons/icon-192.png',
    ],
  },
  
  // Prefetch para navegación común
  prefetch: [
    '/client/dashboard',
    '/trainer/dashboard',
    '/login',
    '/register',
  ],
  
  // Compresión
  compression: {
    gzip: true,
    brotli: true,
  },
  
  // Cache headers
  cacheHeaders: {
    static: 'public, max-age=31536000, immutable',
    html: 'no-cache, no-store, must-revalidate',
    api: 'private, max-age=0',
  },
};

// Generar sitemap.xml dinámico
export function generateSitemap(pages: string[]): string {
  const baseUrl = 'https://kinetixfitt.com';
  const today = new Date().toISOString().split('T')[0];
  
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  
  pages.forEach(page => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${page}</loc>\n`;
    sitemap += `    <lastmod>${today}</lastmod>\n`;
    sitemap += '    <changefreq>weekly</changefreq>\n';
    sitemap += '    <priority>0.8</priority>\n';
    sitemap += '  </url>\n';
  });
  
  sitemap += '</urlset>';
  return sitemap;
}

// Generar robots.txt
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /client/
Disallow: /trainer/
Disallow: /admin/

Sitemap: https://kinetixfitt.com/sitemap.xml

# Google-specific
User-agent: Googlebot
Allow: /
Allow: /funciones
Allow: /planes
Allow: /descargar

# Social media crawlers
User-agent: FacebookBot
Allow: /

User-agent: Twitterbot
Allow: /

# Block bad bots
User-agent: AhrefsBot
Disallow: /

User-agent: SemrushBot
Disallow: /
`;
}

// Optimización de Core Web Vitals
export const coreWebVitalsTargets = {
  LCP: 2.5, // Largest Contentful Paint < 2.5s
  FID: 100, // First Input Delay < 100ms
  CLS: 0.1, // Cumulative Layout Shift < 0.1
  INP: 200, // Interaction to Next Paint < 200ms
  TTFB: 600, // Time to First Byte < 600ms
  FCP: 1.8, // First Contentful Paint < 1.8s
};

// Función para medir Core Web Vitals
export function reportWebVitals(metric: any) {
  const body = {
    metric: metric.name,
    value: metric.value,
    delta: metric.delta,
    rating: metric.rating,
    id: metric.id,
    navigationType: metric.navigationType,
  };

  // Enviar a analytics
  if (typeof window !== 'undefined' && navigator.sendBeacon) {
    const blob = new Blob([JSON.stringify(body)], { type: 'application/json' });
    navigator.sendBeacon('/api/analytics/web-vitals', blob);
  }
}

// Preconnect a dominios externos
export const externalPreconnects = [
  'https://fonts.googleapis.com',
  'https://fonts.gstatic.com',
  'https://api.kinetixfitt.com',
  'https://storage.kinetixfitt.com',
];

// DNS Prefetch para dominios de terceros
export const dnsPrefetches = [
  'https://www.google-analytics.com',
  'https://www.googletagmanager.com',
  'https://connect.facebook.net',
];
