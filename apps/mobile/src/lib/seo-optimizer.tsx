/**
 * Helpers SEO y performance para KinetixFitt.
 * Los datos estructurados nunca inventan métricas comerciales.
 */

import type { Metadata } from "next";

export const seoConfig = {
  title: "KINETIXFITT | Entrenamiento Personalizado Online",
  description: "Programa de entrenamiento personalizado, seguimiento real y contacto directo con tu coach. Todo desde tu celular, sin vueltas.",
  keywords: [
    "entrenamiento personalizado",
    "coach online",
    "fitness",
    "gimnasio",
    "nutrición",
    "ejercicios",
    "rutina personalizada",
    "entrenador personal",
    "app fitness",
    "seguimiento deportivo",
  ],
  author: "KinetixFitt",
  openGraph: {
    type: "website" as const,
    locale: "es_AR",
    url: "https://kinetixfitt.com",
    siteName: "KINETIXFITT",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "KINETIXFITT" }],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "KINETIXFITT | Entrenamiento Personalizado Online",
    description: "Programa de entrenamiento personalizado, seguimiento real y contacto directo con tu coach.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large" as const, "max-snippet": -1 },
  },
};

export function generatePageMetadata(options: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
}): Metadata {
  return {
    title: options.title ? `${options.title} | KINETIXFITT` : seoConfig.title,
    description: options.description || seoConfig.description,
    keywords: options.keywords ? [...seoConfig.keywords, ...options.keywords] : seoConfig.keywords,
    authors: [{ name: seoConfig.author }],
    creator: seoConfig.author,
    publisher: seoConfig.author,
    formatDetection: { email: false, address: false, telephone: false },
    metadataBase: new URL(process.env.NEXT_PUBLIC_WEB_URL || "https://kinetixfitt.com"),
    alternates: {
      canonical: options.canonical,
      languages: { es: "/es", en: "/en" },
    },
    openGraph: {
      ...seoConfig.openGraph,
      title: options.title || seoConfig.title,
      description: options.description || seoConfig.description,
      ...(options.image ? { images: [{ url: options.image, width: 1200, height: 630, alt: options.title || "KINETIXFITT" }] } : {}),
    },
    twitter: {
      ...seoConfig.twitter,
      title: options.title || seoConfig.twitter.title,
      description: options.description || seoConfig.twitter.description,
      ...(options.image ? { images: [options.image] } : {}),
    },
  };
}

type StructuredDataInput = {
  name?: string;
  description?: string;
  image?: string;
  price?: number | string;
  ratingValue?: number | string;
  reviewCount?: number | string;
  headline?: string;
  datePublished?: string;
  dateModified?: string;
};

export function generateStructuredData(
  type: "Organization" | "WebSite" | "Product" | "Article",
  data: StructuredDataInput = {},
) {
  const structuredData: Record<string, unknown> = { "@context": "https://schema.org" };

  switch (type) {
    case "Organization": {
      structuredData["@type"] = "Organization";
      structuredData.name = "KINETIXFITT";
      structuredData.url = "https://kinetixfitt.com";
      structuredData.logo = "https://kinetixfitt.com/logo.png";
      const sameAs = [process.env.INSTAGRAM_URL, process.env.FACEBOOK_URL, process.env.YOUTUBE_URL].filter(Boolean);
      if (sameAs.length) structuredData.sameAs = sameAs;
      structuredData.contactPoint = {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["Spanish", "English"],
      };
      break;
    }
    case "WebSite":
      structuredData["@type"] = "WebSite";
      structuredData.name = "KINETIXFITT";
      structuredData.url = "https://kinetixfitt.com";
      break;
    case "Product": {
      structuredData["@type"] = "Product";
      structuredData.name = data.name || "Programa de Entrenamiento Personalizado";
      structuredData.description = data.description || seoConfig.description;
      if (data.image) structuredData.image = data.image;
      structuredData.brand = { "@type": "Brand", name: "KINETIXFITT" };

      const price = typeof data.price === "number" || (typeof data.price === "string" && data.price.trim() !== "" && Number.isFinite(Number(data.price)))
        ? Number(data.price)
        : null;
      if (price !== null && price >= 0) {
        structuredData.offers = {
          "@type": "Offer",
          url: "https://kinetixfitt.com/planes",
          priceCurrency: "ARS",
          price: price.toFixed(2),
          availability: "https://schema.org/InStock",
          seller: { "@type": "Organization", name: "KINETIXFITT" },
        };
      }

      const rating = Number(data.ratingValue);
      const reviews = Number(data.reviewCount);
      if (Number.isFinite(rating) && Number.isFinite(reviews) && rating >= 1 && rating <= 5 && reviews >= 1) {
        structuredData.aggregateRating = {
          "@type": "AggregateRating",
          ratingValue: rating.toFixed(1),
          reviewCount: Math.round(reviews),
        };
      }
      break;
    }
    case "Article":
      structuredData["@type"] = "Article";
      structuredData.headline = data.headline || "KINETIXFITT";
      structuredData.description = data.description || seoConfig.description;
      if (data.image) structuredData.image = data.image;
      structuredData.author = { "@type": "Organization", name: "KINETIXFITT", url: "https://kinetixfitt.com" };
      structuredData.publisher = { "@type": "Organization", name: "KINETIXFITT", logo: { "@type": "ImageObject", url: "https://kinetixfitt.com/logo.png" } };
      if (data.datePublished) structuredData.datePublished = data.datePublished;
      if (data.dateModified) structuredData.dateModified = data.dateModified;
      break;
  }

  return structuredData;
}

// Neutraliza caracteres que pueden romper el contexto <script> en JSON-LD.
export function escapeJsonLd(json: string): string {
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/-->/g, "--\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function JsonLdScript({ data, nonce }: { data: unknown; nonce?: string }) {
  const json = escapeJsonLd(JSON.stringify(data));
  return <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: json }} />;
}

export const performanceConfig = {
  lazyLoading: { threshold: 0.1, rootMargin: "200px" },
  preload: { fonts: ["/fonts/inter-var.woff2"], images: ["/og-image.jpg", "/icons/icon-192.png"] },
  prefetch: ["/login", "/register"],
  compression: { gzip: true, brotli: true },
  cacheHeaders: { static: "public, max-age=31536000, immutable", html: "no-cache, no-store, must-revalidate", api: "private, max-age=0" },
};

export function generateSitemap(pages: string[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://kinetixfitt.com";
  const today = new Date().toISOString().split("T")[0];
  const safePages = pages.filter((page) => /^\/[a-zA-Z0-9/_-]*$/.test(page));
  const urls = safePages.map((page) => `  <url><loc>${baseUrl}${page}</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>0.8</priority></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
}

export function generateRobotsTxt(): string {
  const baseUrl = process.env.NEXT_PUBLIC_WEB_URL || "https://kinetixfitt.com";
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /client/
Disallow: /trainer/
Disallow: /admin/

Sitemap: ${baseUrl}/sitemap.xml
`;
}

export const coreWebVitalsTargets = { LCP: 2.5, INP: 200, CLS: 0.1, TTFB: 600, FCP: 1.8 };

export function reportWebVitals(metric: { name: string; value: number; delta: number; rating?: string; id?: string; navigationType?: string }) {
  if (typeof window !== "undefined" && navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/web-vitals", new Blob([JSON.stringify({ metric: metric.name, value: metric.value, delta: metric.delta, rating: metric.rating, id: metric.id, navigationType: metric.navigationType })], { type: "application/json" }));
  }
}

export const externalPreconnects = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];
export const dnsPrefetches = ["https://www.google-analytics.com", "https://www.googletagmanager.com"];
