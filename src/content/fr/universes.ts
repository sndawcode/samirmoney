import type { MediaSlot } from "@/content/types";

// Home section right below the hero (client decision, 17 Oct 2026): the two brand universes, each device
// with its services floating around it. Section copy is [Proposition].

export type FloatingService = { label: string; href: string };

export type Universe = {
  id: "samirpay" | "samir-money";
  /** Card identity: deep ink (professionals) or light mint (consumers). */
  tone: "ink" | "mint";
  name: string;
  media: MediaSlot;
  cta: { label: string; href: string };
  /** Services floating around the image, in reading order. */
  services: readonly FloatingService[];
};

export const universesSection = {
  eyebrow: "Nos univers",
  title: "Deux univers. Un seul écosystème.",
  lead: "Professionnels ou particuliers : chaque univers réunit ses services autour d’une seule application.",
  pause: "Mettre en pause l’animation",
  play: "Relancer l’animation",
  servicesOf: (name: string) => `Services ${name}`,
} as const;

const PARTICULIERS = "/particuliers#fonctionnalites";

export const universes: readonly Universe[] = [
  {
    id: "samirpay",
    tone: "ink",
    name: "SamirPay",
    media: "universe-samirpay",
    cta: { label: "Découvrir SamirPay", href: "/professionnels" },
    services: [
      { label: "SamirPay TPE", href: "/professionnels#tpe" },
      { label: "SamirPay Business", href: "/professionnels#business" },
      { label: "Web Admin", href: "/professionnels#web-admin" },
      { label: "API SamirPay", href: "/developpeurs" },
      {
        label: "Encaissement multicanal",
        href: "/services#encaissement-multicanal",
      },
      { label: "Collecte", href: "/services#collecte" },
      { label: "Paiement de masse", href: "/services#paiement-de-masse" },
      { label: "Lien de paiement", href: "/services#lien-de-paiement" },
    ],
  },
  {
    id: "samir-money",
    tone: "mint",
    name: "Samir Money",
    media: "universe-samirmoney",
    cta: { label: "Découvrir Samir Money", href: "/particuliers" },
    services: [
      { label: "Transferts", href: PARTICULIERS },
      { label: "Factures", href: PARTICULIERS },
      { label: "Rechargements", href: PARTICULIERS },
      { label: "Paiement marchand", href: PARTICULIERS },
      { label: "RAPS", href: "/raps" },
      { label: "PI-SPI", href: PARTICULIERS }, // client decision 17 Oct 2026 (Appendix D #25)
      { label: "Bons d’achat", href: PARTICULIERS },
      { label: "Gestion financière", href: PARTICULIERS },
      { label: "Cagnottes", href: PARTICULIERS },
      // Shown in the app's home screen; added at the client's request (17 Oct 2026). No dedicated page yet.
      // TODO(client): one-line descriptions for Crédit, Assurance, Carburant, Change, Marketplace (Appendix D #19)
      { label: "Crédit", href: PARTICULIERS },
      { label: "Assurance", href: PARTICULIERS },
      { label: "Carburant", href: PARTICULIERS },
      { label: "Change", href: PARTICULIERS },
      { label: "Marketplace", href: PARTICULIERS },
    ],
  },
];
