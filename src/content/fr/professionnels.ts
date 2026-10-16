import type { Cta, MediaSlot, Step } from "@/content/types";

export type Hotspot = { label: string; x?: number; y?: number };

export const professionnelsPage = {
  hero: {
    eyebrow: "SamirPay · Professionnels",
    title: "Encaissez. Suivez. Pilotez.", // [Proposition — built from the three brief product lines]
    lead: "SamirPay réunit le TPE, l’application SamirPay Business et le Web Admin pour gérer vos encaissements, en boutique comme à distance.", // [Proposition]
    primary: { label: "Nous contacter", href: "/contact?profil=commercant" } satisfies Cta,
    secondary: { label: "Télécharger SamirPay Business", href: "#business" } satisfies Cta,
  },
  localNav: {
    name: "SamirPay",
    links: [
      { label: "TPE", href: "#tpe" },
      { label: "Business", href: "#business" },
      { label: "Web Admin", href: "#web-admin" },
      { label: "Démarrer", href: "#demarrer" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: { label: "Nous contacter", href: "/contact?profil=commercant" },
  },
  tpe: {
    eyebrow: "01 — SamirPay TPE",
    title: "Un seul terminal. Tous vos encaissements.", // [Proposition]
    lead: "Encaissez plusieurs moyens de paiement sur un seul terminal.", // [Brief]
    fact: "Le TPE accepte les paiements par mobile money.", // [Legacy]
    media: "pro-tpe-1" satisfies MediaSlot,
    // TODO(client): TPE technical sheet — SpecList hidden until supplied (Appendix D #13)
    specs: [] as readonly { label: string; value: string }[],
    cta: { label: "Demander un TPE", href: "/contact?profil=commercant&sujet=tpe" } satisfies Cta,
  },
  business: {
    eyebrow: "02 — SamirPay Business",
    title: "Tous les opérateurs. Une seule application.", // [Proposition, from the store listing]
    lead: "Encaissez et suivez votre activité depuis votre smartphone.", // [Brief]
    features: [
      "Compatible avec tous les opérateurs mobiles",
      "Interface intuitive et ergonomique pour une prise en main rapide",
      "Transactions rapides et sécurisées",
      "Gestion simplifiée de vos paiements au quotidien",
      "Lien de paiement personnalisé : envoyez à vos clients un lien direct pour régler leurs achats en quelques clics.",
    ], // [Store]
    screens: [
      { slot: "screen-business-connexion", caption: "Connexion par numéro et code PIN" },
      { slot: "screen-business-encaissement", caption: "Monnaie électronique ou espèces" },
      { slot: "screen-business-especes", caption: "Encaissement en espèces" },
      { slot: "screen-business-lien", caption: "Lien de paiement permanent" },
    ] satisfies { slot: MediaSlot; caption: string }[],
    video: {
      id: "samirpay-presentation",
      title: "Présentation de SamirPay Business",
      // TODO(client): French captions (.vtt) for the presentation video — player hidden until supplied (§14)
      captions: null as string | null,
    },
  },
  webAdmin: {
    eyebrow: "03 — SamirPay Web Admin",
    title: "Toutes vos opérations. Un seul tableau de bord.", // [Proposition]
    lead: "Centralisez et pilotez vos opérations professionnelles.", // [Brief]
    media: "tile-web-admin" satisfies MediaSlot,
    // Positions in % of the screenshot; an item without a position appears in the list only (no export button is visible).
    hotspots: [
      { label: "Solde global", x: 16, y: 22 },
      { label: "Transactions détaillées par opérateur", x: 61, y: 77 },
      { label: "Export de rapports" },
      {
        label:
          "Un compte centralisé pour toutes vos transactions en monnaie électronique, pour une réconciliation simplifiée.",
        x: 6,
        y: 30,
      },
    ] satisfies Hotspot[], // [Legacy]
    access: "Accéder au Web Admin", // shown only when site.webAdminUrl is set
    demo: {
      label: "Demander une démo",
      href: "/contact?profil=entreprise&sujet=web-admin",
    } satisfies Cta,
  },
  start: {
    eyebrow: "Démarrer",
    title: "Démarrez avec SamirPay.", // [Proposition]
    checklistTitle: "Documents à préparer",
    checklist: [
      "Pour les entreprises : NINEA, registre de commerce, justificatif d’adresse et carte d’identité du gérant.",
    ], // [Legacy FAQ]
    steps: [
      {
        title: "Contactez nos équipes",
        text: "Présentez votre activité et vos besoins d’encaissement.",
      },
      { title: "Transmettez vos documents", text: "Nous vérifions votre dossier." },
      {
        title: "Commencez à encaisser",
        text: "En boutique, à distance ou depuis votre tableau de bord.",
      },
    ] satisfies Step[], // [Proposition]
  },
  faq: { eyebrow: "FAQ", title: "Questions fréquentes" }, // [Proposition]
} as const;
