import type { MetadataRoute } from "next";
import { seo } from "@/content/fr/seo";
import { site } from "@/content/fr/site";

const PRIORITY: Partial<Record<keyof typeof seo, number>> = { "/": 1, "/contact": 0.8 };

export default function sitemap(): MetadataRoute.Sitemap {
  return (Object.keys(seo) as (keyof typeof seo)[]).map((route) => ({
    url: new URL(route, site.url).toString(),
    changeFrequency: "monthly",
    priority: PRIORITY[route] ?? 0.6,
  }));
}
