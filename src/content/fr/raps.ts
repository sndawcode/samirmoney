import type { Cta, MissingVisual, Step } from "@/content/types";

export type UseCase = { title: string; text: string; visual: MissingVisual };

export const rapsPage = {
  hero: {
    eyebrow: "RAPS · Paiement NFC",
    title: "RAPS",
    lead: "Payez sans contact grâce à la technologie NFC.", // [Brief]
    // TODO(client): keychain macro from Shoot RAPS / TPE 2026 (Appendix A.0)
    visual: {
      placeholder: "Visuel RAPS — porte-clés (photo à fournir)",
      ratio: "4/5",
    } satisfies MissingVisual,
    primary: { label: "Équiper mon établissement", href: "/contact?sujet=raps" } satisfies Cta,
    secondary: {
      label: "Gérer mon porte-clés dans Samir Money",
      href: "/particuliers",
    } satisfies Cta,
  },
  how: {
    eyebrow: "Comment ça marche",
    title: "Un geste, et c’est payé.", // [Proposition]
    // [Proposition — validate]; step 1 grounded in the store listing
    steps: [
      {
        title: "Rechargez",
        text: "Rechargez votre porte-clés RAPS depuis l’application Samir Money.",
      },
      { title: "Approchez", text: "Présentez le porte-clés devant un terminal compatible." },
      { title: "C’est payé", text: "Le paiement est validé en un instant." },
    ] satisfies Step[],
    sceneLabels: { keychain: "RAPS", terminal: "Terminal", paid: "Payé" },
  },
  useCases: {
    eyebrow: "Cas d’usage",
    title: "Là où chaque seconde compte.", // [Proposition]
    // Categories [Brief], lines [Proposition]. Cantine photos: consent rules §1.7.
    items: [
      {
        title: "Cantines",
        text: "Fluidifiez le passage en caisse des élèves et du personnel.",
        visual: { placeholder: "Cantine — mains et porte-clés (photo à fournir)", ratio: "4/3" },
      },
      {
        title: "Commerces",
        text: "Encaissez les petits montants en un geste.",
        visual: { placeholder: "Commerce — paiement RAPS (photo à fournir)", ratio: "4/3" },
      },
      {
        title: "Entreprises",
        text: "Simplifiez les paiements du quotidien sur site : restauration, boutiques et services internes.",
        visual: {
          placeholder: "Entreprise — restauration sur site (photo à fournir)",
          ratio: "4/3",
        },
      },
      {
        title: "Autres environnements compatibles",
        text: "Vous avez un autre usage en tête ? Parlons de votre projet.",
        visual: { placeholder: "Autre usage RAPS (photo à fournir)", ratio: "4/3" },
      },
    ] satisfies UseCase[],
    otherCta: { label: "Parlons de votre projet", href: "/contact?sujet=raps" } satisfies Cta,
  },
  faq: { eyebrow: "FAQ", title: "Questions fréquentes" },
  whatsappPrefill: "Bonjour Samir Money, je souhaite des informations sur RAPS.",
} as const;
