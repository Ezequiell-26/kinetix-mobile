import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kinetixfitt-world-ia.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/funciones", "/planes", "/descargar", "/install"],
      disallow: ["/api/", "/client/", "/trainer/", "/login", "/register", "/forgot-password", "/reset-password"],
    },
    sitemap: `${baseUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
