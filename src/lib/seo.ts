import type { Metadata } from "next";
import { seo, type SeoRoute } from "@/content/fr/seo";
import { site } from "@/content/fr/site";

export const baseMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: seo["/"].title, template: "%s" },
  description: seo["/"].description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    locale: "fr_SN",
    siteName: site.name,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false },
};

/** Per-route title, description, canonical and Open Graph text (§12). */
export function pageMetadata(route: SeoRoute): Metadata {
  const { title, description } = seo[route];
  return {
    title,
    description,
    alternates: { canonical: route },
    openGraph: {
      title,
      description,
      url: route,
      locale: "fr_SN",
      siteName: site.name,
      type: "website",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}
