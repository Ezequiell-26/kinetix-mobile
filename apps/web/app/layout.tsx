import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { PostHogProvider } from '../components/posthog-provider';
import { BRAND } from '../lib/branding';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL(BRAND.app.url),
  title: {
    default: `${BRAND.name} - ${BRAND.tagline}`,
    template: `%s | ${BRAND.name}`
  },
  description: 'La plataforma todo-en-uno que combina ciencia del deporte, IA personalizada y comunidad para resultados que duran para siempre.',
  keywords: [
    'fitness',
    'entrenamiento',
    'nutrición',
    'salud',
    'gimnasio',
    'workout',
    'app fitness',
    'IA entrenador',
    'ejercicios en casa',
    'rutinas personalizadas',
    BRAND.name
  ],
  authors: [{ name: `${BRAND.name} Team`, url: BRAND.app.url }],
  creator: BRAND.name,
  publisher: `${BRAND.name} Inc.`,
  applicationName: BRAND.name,
  category: 'Health & Fitness',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: BRAND.app.url,
    languages: {
      'es': `${BRAND.app.url}/es`,
      'en': `${BRAND.app.url}/en`,
      'x-default': `${BRAND.app.url}/es`,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: BRAND.name,
  },
  openGraph: {
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: 'Únete a más de 12,000 atletas que ya están transformando sus vidas. 4.9★ en App Store.',
    type: 'website',
    locale: 'es_AR',
    alternateLocale: ['en_US'],
    url: BRAND.app.url,
    siteName: BRAND.name,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'KinetixFitt - Tu Entrenador Inteligente | 4.9★ 12k+ atletas'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${BRAND.name} - ${BRAND.tagline}`,
    description: 'La plataforma definitiva para transformar tu físico y mentalidad. 4.9★ 12k+ atletas.',
    images: ['/twitter-image'],
    creator: '@kinetixfitt',
    site: '@kinetixfitt',
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
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: BRAND.colors.dark },
    { media: '(prefers-color-scheme: dark)', color: BRAND.colors.dark },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'dark light',
};

// JSON-LD structured data — Organization + SoftwareApplication
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${BRAND.app.url}/#organization`,
      name: BRAND.name,
      url: BRAND.app.url,
      logo: {
        '@type': 'ImageObject',
        url: `${BRAND.app.url}/icons/icon-512x512.png`,
        width: 512,
        height: 512,
      },
      description:
        `${BRAND.name} es la plataforma todo-en-uno de fitness que combina ciencia del deporte, IA personalizada y comunidad para resultados que duran.`,
      foundingDate: '2024',
      slogan: BRAND.tagline,
      brand: BRAND.name,
      sameAs: [
        'https://www.instagram.com/kinetixfitt',
        'https://www.youtube.com/@kinetixfitt',
        'https://twitter.com/kinetixfitt',
        'https://github.com/kinetixfitt',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        email: 'ezequiel@kinetixfitt.com',
        contactType: 'customer support',
        availableLanguage: ['Spanish', 'English'],
      },
    },
    {
      '@type': 'SoftwareApplication',
      '@id': `${BRAND.app.url}/#software`,
      name: BRAND.name,
      operatingSystem: 'Web, iOS, Android',
      applicationCategory: 'HealthApplication',
      applicationSubCategory: 'FitnessApplication',
      description:
        'App de coaching fitness con IA: rutinas personalizadas, nutrición precisa, gamificación y seguimiento humano. 12k+ atletas activos.',
      url: BRAND.app.url,
      image: `${BRAND.app.url}/opengraph-image`,
      author: { '@id': `${BRAND.app.url}/#organization` },
      publisher: { '@id': `${BRAND.app.url}/#organization` },
      offers: [
        {
          '@type': 'Offer',
          name: 'Básico',
          price: '0',
          priceCurrency: 'USD',
          description: 'Gratis para siempre',
        },
        {
          '@type': 'Offer',
          name: 'Pro Athlete',
          price: '19',
          priceCurrency: 'USD',
          priceValidUntil: '2027-12-31',
          description: '7 días gratis, luego $19/mes',
        },
        {
          '@type': 'Offer',
          name: 'Elite Coach',
          price: '49',
          priceCurrency: 'USD',
          description: 'Coaching 1 a 1 con humano',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        ratingCount: '12000',
        reviewCount: '2400',
        bestRating: '5',
        worstRating: '1',
      },
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/UserInteraction',
        userInteractionCount: 12000,
      },
      featureList: [
        'Plan Personalizado con IA',
        'Cálculo Automático de Sobrecarga Progresiva',
        'Rangos & Gamificación',
        'Red Social Privada',
        'Nutrición Precisa',
        'Analítica Avanzada',
        'Check-ins Humanos',
        'Biblioteca 500+ Ejercicios',
      ],
      screenshot: `${BRAND.app.url}/opengraph-image`,
      softwareVersion: '1.0.0',
      datePublished: '2024-01-15',
      dateModified: new Date().toISOString().split('T')[0],
      inLanguage: 'es-AR',
      isAccessibleForFree: true,
    },
    {
      '@type': 'WebSite',
      '@id': `${BRAND.app.url}/#website`,
      name: BRAND.name,
      url: BRAND.app.url,
      description: 'Plataforma de coaching fitness con IA, nutrición y comunidad.',
      publisher: { '@id': `${BRAND.app.url}/#organization` },
      inLanguage: 'es-AR',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BRAND.app.url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

// Security headers
export const revalidate = 3600; // Revalidar cada hora

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark" suppressHydrationWarning>
      <head>
        {/* Security Headers via meta tags */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        <meta name="referrer" content="strict-origin-when-cross-origin" />

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={BRAND.colors.lime} />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* i18n: hreflang alternates */}
        <link rel="alternate" hrefLang="es" href={`${BRAND.app.url}/es`} />
        <link rel="alternate" hrefLang="en" href={`${BRAND.app.url}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${BRAND.app.url}/es`} />

        {/* Dynamic html lang based on pathname/cookie — client fallback for SEO crawlers that don't run middleware header */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var p=location.pathname;var m=p.match(/^\\/(en|es)(\\/|$)/);var c=document.cookie.match(/(?:^|; )NEXT_LOCALE=(en|es)/);var l=m?m[1]:c?c[1]:((navigator.language||'es').slice(0,2));if(l!=='en'&&l!=='es')l='es';document.documentElement.lang=l;document.documentElement.setAttribute('data-locale',l);}catch(e){}`,
          }}
        />

        {/* JSON-LD Structured Data — Organization + SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Preconnect a recursos críticos */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.kinetixfitt.com" />
      </head>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <PostHogProvider>{children}</PostHogProvider>

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                      console.log('[SW] Registered:', registration.scope);
                    })
                    .catch(error => {
                      console.log('[SW] Registration failed:', error);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
