import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_WEB_URL || "https://kinetixfitt.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
