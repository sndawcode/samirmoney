import type { Cta } from "@/content/types";

export type NavItem = { label: string; href: string; menu?: "professionnels" | "services" };

export const nav = {
  primary: [
    { label: "Particuliers", href: "/particuliers" },
    { label: "Professionnels", href: "/professionnels", menu: "professionnels" },
    { label: "RAPS", href: "/raps" },
    { label: "Services", href: "/services", menu: "services" },
    { label: "Développeurs", href: "/developpeurs" },
    { label: "À propos", href: "/a-propos" },
  ] satisfies NavItem[],
  cta: { label: "Nous contacter", href: "/contact" } satisfies Cta, // [Brief]
  download: { label: "Télécharger l’app", href: "/particuliers#telecharger" } satisfies Cta,
  // [Proposition]
  professionnelsOverview: { label: "Découvrir SamirPay", href: "/professionnels" } satisfies Cta,
  servicesOverview: { label: "Tous nos services", href: "/services" } satisfies Cta,
} as const;
