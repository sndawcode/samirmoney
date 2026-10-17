import type { MediaSlot } from "@/content/types";

export type Audience = "particulier" | "commercant" | "entreprise" | "institution" | "developpeur";

export type ProductId = "samir-money" | "tpe" | "business" | "web-admin" | "raps" | "api";

export type Product = {
  id: ProductId;
  index: string;
  name: string;
  tagline: string;
  href: string;
  audiences: readonly Audience[];
  media: MediaSlot | null; // slot id in media.json, or null → <Placeholder>
  /** Home tile photo (client's "ASSETS SECTION3", 17 Oct 2026); null → the product visual. */
  photo: MediaSlot | null;
};

export const productsSection = { eyebrow: "Nos solutions", cta: "Découvrir" } as const;

export const products: readonly Product[] = [
  {
    id: "samir-money",
    index: "01",
    name: "Samir Money",
    tagline: "Votre application de paiement et de gestion financière au quotidien.",
    href: "/particuliers",
    audiences: ["particulier"],
    media: "tile-samir-money",
    photo: "tile-photo-samir-money",
  },
  {
    id: "tpe",
    index: "02",
    name: "SamirPay TPE",
    tagline: "Encaissez plusieurs moyens de paiement sur un seul terminal.",
    href: "/professionnels#tpe",
    audiences: ["commercant", "entreprise"],
    media: "tile-tpe",
    photo: "tile-photo-tpe",
  },
  {
    id: "business",
    index: "03",
    name: "SamirPay Business",
    tagline: "Encaissez et suivez votre activité depuis votre smartphone.",
    href: "/professionnels#business",
    audiences: ["commercant", "entreprise"],
    media: "screen-business-encaissement",
    photo: "tile-photo-business",
  },
  {
    id: "web-admin",
    index: "04",
    name: "SamirPay Web Admin",
    tagline: "Centralisez et pilotez vos opérations professionnelles.",
    href: "/professionnels#web-admin",
    audiences: ["entreprise", "institution"],
    media: "tile-web-admin",
    photo: "tile-photo-web-admin",
  },
  // TODO(client): RAPS keychain cut-out for the product pages (Shoot RAPS / TPE 2026) — Appendix A.8
  {
    id: "raps",
    index: "05",
    name: "RAPS",
    tagline: "Payez sans contact grâce à la technologie NFC.",
    href: "/raps",
    audiences: ["particulier", "commercant", "entreprise", "institution"],
    media: null,
    photo: "tile-photo-raps",
  },
  {
    id: "api",
    index: "06",
    name: "API SamirPay",
    tagline: "Intégrez nos solutions de paiement à vos applications et plateformes.",
    href: "/developpeurs",
    audiences: ["developpeur", "entreprise"],
    media: null /* code-card composition, no photo */,
    photo: null,
  },
];

export function productById(id: ProductId): Product {
  const product = products.find((p) => p.id === id);
  if (!product) throw new Error(`Unknown product "${id}"`);
  return product;
}

/** Visitor-facing audience labels (AudienceFilter, contact form). [Proposition] */
export const audienceLabels: Record<Audience, string> = {
  particulier: "Particulier",
  commercant: "Commerçant",
  entreprise: "Entreprise",
  institution: "Institution",
  developpeur: "Développeur",
};
