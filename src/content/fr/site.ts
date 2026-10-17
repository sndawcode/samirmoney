// src/content/fr/site.ts — contact data and links (conflicts: Appendix C.1)
export const site = {
  name: "Samir Money",
  legalName: "Samir Money SA",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://samirmoney.com",
  locale: "fr-SN",
  address: {
    street: "Immeuble Khadija Rassoul, 6e étage, Rue 1x A, impasse face Fondation Kéba Mbaye",
    district: "Point E",
    city: "Dakar",
    country: "Sénégal",
    geo: { lat: 14.698458, lng: -17.465254 },
  },
  // TODO(client): confirm main phone — legacy also shows +221 33 889 72 72 and +221 77 300 25 23
  phone: { e164: "+221338242433", display: "+221 33 824 24 33" },
  whatsapp: null as string | null, // TODO(client) — WhatsApp UI hidden while null
  // TODO(client): confirm e-mail — samirpay.com used contact@samirservices.com
  email: "contact@samirmoney.com",
  apps: {
    samirMoney: {
      ios: "https://apps.apple.com/app/id6740030422",
      // Google Play listing "Samir Money" by SAMIR MONEY SA (verified 17 Oct 2026; package keeps the old "Samir Link" name).
      android: "https://play.google.com/store/apps/details?id=sn.samirmoney.samirlink1" as
        string | null,
    },
    samirPayBusiness: {
      ios: "https://apps.apple.com/app/id6743798245",
      android: "https://play.google.com/store/apps/details?id=sn.samirmoney.samirpaybusiness",
    },
  },
  webAdminUrl: null as string | null, // TODO(client)
  docsUrl: null as string | null, // TODO(client)
  wooPluginUrl: null as string | null, // TODO(client)
  social: { linkedin: null, facebook: null, instagram: null, x: null } as Record<
    string,
    string | null
  >, // TODO(client): legacy links were empty placeholders
  openingHours: null as string | null, // TODO(client): opening hours — hidden while null
} as const;

export type AppId = keyof typeof site.apps;
export type Store = "ios" | "android";
