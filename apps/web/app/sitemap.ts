import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_WEB_URL || 'https://kinetixfitt.com';
  const now = new Date();

  const routes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    // i18n landing alternates
    { url: `${base}/es`, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/en`, lastModified: now, changeFrequency: 'weekly', priority: 1, alternates: { languages: { es: `${base}/es`, en: `${base}/en` } } as any },
    { url: `${base}/legal/privacidad`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/legal/terminos`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/legal/cookies`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/licencia`, lastModified: now, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${base}/auth/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/auth/register`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/dashboard`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ];

  return routes;
}
