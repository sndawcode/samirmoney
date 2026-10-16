import type { ProductId } from "@/content/fr/products";

export const servicesSection = {
  eyebrow: "Nos services",
  title: "Des solutions pour chaque besoin.",
} as const;

export type ServiceId =
  | "encaissement-multicanal"
  | "collecte"
  | "paiement-de-masse"
  | "lien-de-paiement"
  | "api-integrations"
  | "paiement-nfc";

export type Service = {
  id: ServiceId;
  name: string;
  line: string;
  href: string;
  products: readonly ProductId[];
};

export const services: readonly Service[] = [
  {
    id: "encaissement-multicanal",
    name: "Encaissement multicanal",
    line: "Acceptez différents moyens de paiement depuis une seule solution.",
    href: "/services#encaissement-multicanal",
    products: ["tpe", "business", "api"],
  },
  {
    id: "collecte",
    name: "Collecte",
    line: "Collectez les paiements de vos clients, adhérents ou usagers et centralisez leur suivi.",
    href: "/services#collecte",
    products: ["business", "web-admin", "api"],
  },
  {
    id: "paiement-de-masse",
    name: "Paiement de masse",
    line: "Effectuez vos versements groupés : salaires, commissions, prestataires et autres bénéficiaires éligibles.",
    href: "/services#paiement-de-masse",
    products: ["web-admin", "api"],
  },
  {
    id: "lien-de-paiement",
    name: "Lien de paiement",
    line: "Encaissez à distance grâce à un lien partagé par WhatsApp, SMS ou e-mail.",
    href: "/services#lien-de-paiement",
    products: ["business"],
  },
  {
    id: "api-integrations",
    name: "API & intégrations",
    line: "Connectez nos solutions à vos applications, sites e-commerce et systèmes d’information.",
    href: "/developpeurs",
    products: ["api"],
  },
  {
    id: "paiement-nfc",
    name: "Paiement NFC",
    line: "Simplifiez les transactions du quotidien avec RAPS.",
    href: "/raps",
    products: ["raps"],
  },
];

export const apiSection = {
  eyebrow: "Nos API",
  title: "Votre plateforme. Notre technologie.",
  lead: "Intégrez les solutions de paiement SamirPay directement à votre environnement digital.",
  items: [
    "API d’encaissement.",
    "API de paiement de masse.",
    "Intégrations e-commerce.",
    "Plugin WooCommerce.",
    "Solutions d’intégration adaptées aux besoins des entreprises.",
  ],
  cta: "Découvrir nos API",
} as const;
