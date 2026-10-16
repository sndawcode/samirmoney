import type { Cta } from "@/content/types";

export type ApiProduct = { name: string; text: string; linkKey?: "wooPluginUrl" };

export const developpeursPage = {
  hero: {
    eyebrow: "Développeurs · API SamirPay",
    title: "Votre plateforme. Notre technologie.", // [Brief]
    lead: "Intégrez les solutions de paiement SamirPay directement à votre environnement digital.", // [Brief]
    docs: "Accéder à la documentation", // shown only when site.docsUrl is set
    expert: {
      label: "Parler à un expert",
      href: "/contact?profil=developpeur&sujet=api",
    } satisfies Cta,
  },
  catalogue: {
    eyebrow: "Catalogue",
    title: "Ce que vous pouvez intégrer.", // [Proposition]
    // Names [Brief], lines [Proposition]
    items: [
      {
        name: "API d’encaissement",
        text: "Acceptez les paiements de vos clients dans votre application ou votre site.",
      },
      {
        name: "API de paiement de masse",
        text: "Automatisez vos versements groupés depuis votre système d’information.",
      },
      // TODO(client): validate "wallets et cartes bancaires" before mentioning accepted methods
      { name: "Intégrations e-commerce", text: "Connectez SamirPay à votre boutique en ligne." },
      {
        name: "Plugin WooCommerce",
        text: "Activez SamirPay sur votre boutique WooCommerce.",
        linkKey: "wooPluginUrl",
      },
      {
        name: "Solutions d’intégration adaptées aux besoins des entreprises",
        text: "Une intégration pensée pour vos contraintes métier.",
      },
    ] satisfies ApiProduct[],
    pluginLink: "Télécharger le plugin",
  },
  how: {
    eyebrow: "Comment ça marche",
    title: "Du paiement à la confirmation.", // [Proposition]
    steps: [
      "Votre client",
      "Votre plateforme",
      "API SamirPay",
      "Moyen de paiement",
      "Confirmation",
    ],
  },
  // TODO(client): what the docs actually offer (sandbox, clés, webhooks, SDK, support…) — block hidden until confirmed (Appendix D #8)
  benefits: [] as readonly string[],
  security: { eyebrow: "Sécurité", title: "Une infrastructure agréée et certifiée." }, // [Proposition]
} as const;
