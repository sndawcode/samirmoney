import type { FaqItem } from "@/content/types";
import { site } from "@/content/fr/site";

type JsonLdObject = Record<string, unknown>;

const absolute = (path: string) => new URL(path, site.url).toString();

/** Confirmed social profiles only (§12). */
const sameAs = () => Object.values(site.social).filter((url): url is string => url !== null);

export function organizationJsonLd(logoPath: string): JsonLdObject {
  const { street, district, city, country, geo } = site.address;
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "FinancialService"],
    "@id": absolute("/#organization"),
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absolute(logoPath),
    image: absolute(logoPath),
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      addressLocality: `${district}, ${city}`,
      addressCountry: country === "Sénégal" ? "SN" : country,
    },
    geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
    // TODO(client): telephone is added once the main number is confirmed (Appendix D #2)
    ...(sameAs().length > 0 && { sameAs: sameAs() }),
  };
}

export function websiteJsonLd(): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    inLanguage: "fr-SN",
    publisher: { "@id": absolute("/#organization") },
  };
}

export function mobileAppJsonLd(app: {
  name: string;
  ios: string | null;
  android: string | null;
}): JsonLdObject {
  const operatingSystem = [app.ios && "iOS", app.android && "Android"].filter(Boolean).join(", ");
  return {
    "@context": "https://schema.org",
    "@type": "MobileApplication",
    name: app.name,
    applicationCategory: "FinanceApplication",
    operatingSystem,
    installUrl: [app.ios, app.android].filter(Boolean),
    offers: { "@type": "Offer", price: 0, priceCurrency: "XOF" },
    publisher: { "@id": absolute("/#organization") },
  };
}

export function faqJsonLd(items: readonly FaqItem[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function breadcrumbJsonLd(trail: readonly { name: string; path: string }[]): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absolute(item.path),
    })),
  };
}

/** Structured data script; `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
