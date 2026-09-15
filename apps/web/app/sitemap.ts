import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_WEB_URL || "https://kinetixfitt.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/es`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/en`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];
}
