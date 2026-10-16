import type { MetadataRoute } from "next";
import { site } from "@/content/fr/site";
import { isProductionStage } from "@/lib/stage";

export default function robots(): MetadataRoute.Robots {
  // Previews are never indexed; the live site allows everything but /api/ (§12).
  if (!isProductionStage) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: new URL("/sitemap.xml", site.url).toString(),
  };
}
