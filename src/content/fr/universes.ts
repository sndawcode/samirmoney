import type { MediaSlot } from "@/content/types";

// Home section right below the hero (client decision, 17 Oct 2026): the two brand universes, each device
// with its services orbiting around it. Section copy is [Proposition].

/** Pictogram shown in a service label (lucide icon name). */
export type ServiceIcon =
  | "CreditCard"
  | "Store"
  | "LayoutDashboard"
  | "Braces"
  | "Layers"
  | "HandCoins"
  | "Users"
  | "Link2"
  | "ArrowLeftRight"
  | "Receipt"
  | "Smartphone"
  | "QrCode"
  | "KeyRound"
  | "Zap"
  | "Gift"
  | "Wallet"
  | "PiggyBank"
  | "BadgePercent"
  | "ShieldCheck"
  | "Fuel"
  | "RefreshCw"
  | "ShoppingBag";

export type OrbitService = { label: string; href: string; icon: ServiceIcon };

export type Universe = {
  id: "samirpay" | "samir-money";
  index: string;
  /** Card identity: deep ink (professionals) or light mint (consumers). */
  tone: "ink" | "mint";
  name: string;
  subtitle: string;
  media: MediaSlot;
  cta: { label: string; href: string };
  /** Two rings: inner then outer. */
  rings: readonly [readonly OrbitService[], readonly OrbitService[]];
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
    index: "01",
    tone: "ink",
    name: "SamirPay",
    subtitle: "Pour les professionnels",
    media: "universe-samirpay",
    cta: { label: "Découvrir SamirPay", href: "/professionnels" },
    rings: [
      [
        { label: "SamirPay TPE", href: "/professionnels#tpe", icon: "CreditCard" },
        { label: "SamirPay Business", href: "/professionnels#business", icon: "Store" },
        { label: "Web Admin", href: "/professionnels#web-admin", icon: "LayoutDashboard" },
        { label: "API SamirPay", href: "/developpeurs", icon: "Braces" },
      ],
      [
        {
          label: "Encaissement multicanal",
          href: "/services#encaissement-multicanal",
          icon: "Layers",
        },
        { label: "Collecte", href: "/services#collecte", icon: "HandCoins" },
        { label: "Paiement de masse", href: "/services#paiement-de-masse", icon: "Users" },
        { label: "Lien de paiement", href: "/services#lien-de-paiement", icon: "Link2" },
      ],
    ],
  },
  {
    id: "samir-money",
    index: "02",
    tone: "mint",
    name: "Samir Money",
    subtitle: "Pour les particuliers",
    media: "universe-samirmoney",
    cta: { label: "Découvrir Samir Money", href: "/particuliers" },
    rings: [
      [
        { label: "Transferts", href: PARTICULIERS, icon: "ArrowLeftRight" },
        { label: "Factures", href: PARTICULIERS, icon: "Receipt" },
        { label: "Rechargements", href: PARTICULIERS, icon: "Smartphone" },
        { label: "Paiement marchand", href: PARTICULIERS, icon: "QrCode" },
        { label: "RAPS", href: "/raps", icon: "KeyRound" },
        { label: "PI-SPI", href: PARTICULIERS, icon: "Zap" }, // client decision 17 Oct 2026 (Appendix D #25)
        { label: "Bons d’achat", href: PARTICULIERS, icon: "Gift" },
      ],
      [
        { label: "Gestion financière", href: PARTICULIERS, icon: "Wallet" },
        { label: "Cagnottes", href: PARTICULIERS, icon: "PiggyBank" },
        // Shown in the app's home screen; added at the client's request (17 Oct 2026). No dedicated page yet.
        // TODO(client): one-line descriptions for Crédit, Assurance, Carburant, Change, Marketplace (Appendix D #19)
        { label: "Crédit", href: PARTICULIERS, icon: "BadgePercent" },
        { label: "Assurance", href: PARTICULIERS, icon: "ShieldCheck" },
        { label: "Carburant", href: PARTICULIERS, icon: "Fuel" },
        { label: "Change", href: PARTICULIERS, icon: "RefreshCw" },
        { label: "Marketplace", href: PARTICULIERS, icon: "ShoppingBag" },
      ],
    ],
  },
];
