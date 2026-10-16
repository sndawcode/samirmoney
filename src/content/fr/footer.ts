import { products } from "@/content/fr/products";
import { services } from "@/content/fr/services";
import { site } from "@/content/fr/site";

export type FooterLink = { label: string; href: string };

export const footer = {
  columns: [
    { title: "Solutions", links: products.map((p) => ({ label: p.name, href: p.href })) },
    { title: "Services", links: services.map((s) => ({ label: s.name, href: s.href })) },
    {
      title: "Entreprise",
      links: [
        { label: "À propos", href: "/a-propos" },
        { label: "Contact", href: "/contact" },
        { label: "Devenir partenaire", href: "/contact?sujet=partenariat" },
      ],
    },
    {
      title: "Développeurs",
      links: [
        ...(site.docsUrl ? [{ label: "Documentation", href: site.docsUrl }] : []),
        { label: "API", href: "/developpeurs" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Mentions légales", href: "/mentions-legales" },
        { label: "Confidentialité", href: "/confidentialite" },
        { label: "CGU", href: "/cgu" },
        { label: "Suppression de compte", href: "/suppression-de-compte" },
      ],
    },
  ] satisfies { title: string; links: FooterLink[] }[],
  contactTitle: "Nous joindre",
  copyright: (year: number) => `© ${year} ${site.legalName}`,
  // [Store, validate] — Wolof sign-off hidden until validated (Appendix D #26)
  signOff: null as string | null,
} as const;
