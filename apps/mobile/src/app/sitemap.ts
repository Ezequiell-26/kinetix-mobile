import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://kinetixfitt-world-ia.vercel.app";
  const routes = ["/", "/funciones", "/planes", "/descargar", "/install"];

  return routes.map((route) => ({
    url: `${baseUrl.replace(/\/$/, "")}${route}`,
    changeFrequency: route === "/" ? "weekly" : "monthly",
    priority: route === "/" ? 1 : 0.7,
  }));
}
