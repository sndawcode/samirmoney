// §12 metadata [Proposition]. Keys are route paths.
export type SeoEntry = { title: string; description: string };

export const seo = {
  "/": {
    title: "Samir Money — Tous vos paiements. Un seul écosystème.",
    description:
      "Application, TPE, encaissement, paiement de masse, NFC et API : les solutions de paiement de Samir Money pour particuliers, commerçants, entreprises et institutions.",
  },
  "/particuliers": {
    title: "Samir Money — L’application de paiement du quotidien",
    description:
      "Transferts, factures, rechargements, paiement marchand et RAPS : gérez vos paiements du quotidien avec l’application Samir Money.",
  },
  "/professionnels": {
    title: "SamirPay — TPE, application Business et Web Admin",
    description:
      "Encaissez plusieurs moyens de paiement, suivez votre activité et pilotez vos opérations avec SamirPay TPE, SamirPay Business et le Web Admin.",
  },
  "/raps": {
    title: "RAPS — Le paiement sans contact NFC par Samir Money",
    description:
      "Le porte-clés NFC RAPS pour payer sans contact : cantines, commerces, entreprises et autres environnements compatibles.",
  },
  "/services": {
    title: "Encaissement, collecte, paiement de masse, lien de paiement",
    description:
      "Les services de paiement Samir Money : encaissement multicanal, collecte, paiement de masse et lien de paiement.",
  },
  "/developpeurs": {
    title: "API SamirPay — Intégrez le paiement à vos plateformes",
    description:
      "API d’encaissement, API de paiement de masse, intégrations e-commerce et plugin WooCommerce.",
  },
  "/a-propos": {
    title: "À propos de Samir Money — Établissement de paiement agréé",
    description:
      "Samir Money SA, établissement de paiement agréé par la BCEAO (EP.SN.005/2025) : agrément, certification PCI DSS, engagements et partenaires.",
  },
  "/contact": {
    title: "Contacter Samir Money",
    description: "Commerçant, entreprise, institution ou développeur : échangeons sur vos besoins.",
  },
  "/mentions-legales": {
    title: "Mentions légales — Samir Money",
    description:
      "Informations légales sur Samir Money SA, établissement de paiement agréé par la BCEAO.",
  },
  "/confidentialite": {
    title: "Politique de confidentialité — Samir Money",
    description: "Comment Samir Money collecte, utilise et protège vos données personnelles.",
  },
  "/cgu": {
    title: "Conditions générales d’utilisation — Samir Money",
    description: "Conditions générales d’utilisation des services Samir Money.",
  },
  "/suppression-de-compte": {
    title: "Suppression de compte — Samir Money",
    description: "Demandez la suppression de votre compte Samir Money.",
  },
} satisfies Record<string, SeoEntry>;

export type SeoRoute = keyof typeof seo;

/** Mono eyebrow on each route's Open Graph image. */
export const ogEyebrows: Partial<Record<SeoRoute, string>> = {
  "/": "Samir Money",
  "/particuliers": "Samir Money · Particuliers",
  "/professionnels": "SamirPay · Professionnels",
  "/raps": "RAPS · Paiement NFC",
  "/services": "Nos services",
  "/developpeurs": "Développeurs · API SamirPay",
  "/a-propos": "À propos",
  "/contact": "Contact",
};
