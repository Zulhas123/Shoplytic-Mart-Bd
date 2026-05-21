import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`;
  const now = new Date();

  const routes = ["/", "/products", "/manual"].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: path === "/products" ? "daily" : "weekly",
    priority: path === "/" ? 1 : 0.7
  })) satisfies MetadataRoute.Sitemap;

  return routes;
}

