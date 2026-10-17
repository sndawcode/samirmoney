import type { Cta } from "@/content/types";

export const homeHero = {
  // Hero calls to action: "Nous contacter" [Brief]; "Voir nos solutions" [Proposition] scrolls to the bento.
  primary: { label: "Nous contacter", href: "/contact" } satisfies Cta,
  secondary: { label: "Voir nos solutions", href: "#solutions" } satisfies Cta,
  scrollCue: "Défiler", // [Proposition]
  // [Brief] — the H1, rendered on four lines (client, 17 Oct 2026); `highlight` gets the accent underline.
  titleLines: ["Tous vos", "paiements.", "Un seul", "écosystème."],
  highlight: "écosystème",
  lead: "Samir Money accompagne les particuliers, commerçants, entreprises et institutions avec des solutions de paiement simples, sécurisées et connectées.", // [Brief]
} as const;

// [Proposition]
export const audienceFilter = {
  label: "Je suis :",
  all: "Tous",
  announce: (count: number, audience: string | null) =>
    audience === null
      ? `Les ${count} solutions sont affichées.`
      : `${count} solution${count > 1 ? "s" : ""} pour : ${audience}. Les autres restent accessibles.`,
} as const;

// Generic labels for the S2 mini-scenes. [Proposition] — illustrative, no operator names.
// Methods are limited to those visible in the SamirPay Business screens (accepted methods: Appendix D #11).
export const serviceScenes = {
  methods: ["Mobile money", "QR code", "Espèces", "Lien"],
  terminal: "Paiement reçu",
  dashboardTotal: "Total collecté",
  collected: "Collecté",
  fanOut: "1 → n",
  linkMessage: "Voici votre lien de paiement",
  linkUrl: "lien/•••",
  linkPaid: "Payé",
  receipt: "Reçu",
  apiBlocks: ["Votre site", "API", "SamirPay"],
  nfc: "Sans contact",
} as const;

// Tile 06 code-card composition: generic steps, no real endpoint or payload. [Proposition]
export const apiCard = {
  lines: ["Votre plateforme", "→ API SamirPay", "→ Moyen de paiement", "Paiement confirmé"],
  status: "Statut : confirmé",
} as const;

// S3 flow diagram. Node names from the brief's DESIGN note; status ticks [Proposition].
export const apiFlow = {
  nodes: {
    ecommerce: "Plateforme e-commerce",
    app: "Application",
    core: "Infrastructure SamirPay",
  },
  checkout: "Paiement",
  statuses: ["Paiement initié", "Paiement confirmé"],
  caption: "Illustration — flux de paiement entre vos plateformes et SamirPay",
} as const;

export const partnersSection = {
  eyebrow: "Nos partenaires", // [Brief]
  title: "Ils nous font confiance.", // [Brief]
} as const;

export const contactBand = {
  title: "La solution qu’il vous faut commence ici.", // [Brief]
  lead: "Vous êtes commerçant, entreprise, institution ou développeur ? Échangeons sur vos besoins.", // [Brief]
  primary: { label: "Nous contacter", href: "/contact" } satisfies Cta, // [Brief]
  secondary: { label: "Devenir partenaire", href: "/contact?sujet=partenariat" } satisfies Cta, // [Brief]
} as const;

// Home 3D scene: the Samir Money mark at the centre of the globe (client file icone/samir.png → `pnpm icons`).
export const ecosystemScene = {
  coreLogo: "/media/icons/samir-core.webp",
} as const;
