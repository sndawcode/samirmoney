import type { Cta, MissingVisual, Step } from "@/content/types";

export type Feature = {
  index: string;
  title: string;
  text: string;
  link?: Cta;
  /** Real screenshot of this feature. TODO(client): export from App Store Connect (Appendix A.8 #1). */
  screen: MissingVisual;
  /** false → hidden until the client validates it. */
  published: boolean;
};

const screen = (name: string): MissingVisual => ({
  placeholder: `Écran Samir Money — ${name}`,
  ratio: "9/19",
});

export const particuliersPage = {
  hero: {
    eyebrow: "Samir Money · Particuliers",
    title: "Samir Money",
    lead: "Votre application de paiement et de gestion financière au quotidien.", // [Brief]
  },
  localNav: {
    name: "Samir Money",
    links: [
      { label: "Fonctionnalités", href: "#fonctionnalites" },
      { label: "Démarrer", href: "#demarrer" },
      { label: "Sécurité", href: "#securite" },
    ],
    cta: { label: "Télécharger", href: "#telecharger" },
  },
  features: {
    eyebrow: "Fonctionnalités",
    title: "Tout ce que vous payez, au même endroit.", // [Proposition]
    items: [
      {
        index: "01",
        title: "Transferts",
        text: "Envoyez de l’argent à vos proches, rapidement et en toute sécurité.",
        screen: screen("transferts"),
        published: true,
      }, // [Legacy]
      // [Store] — hidden until PI-SPI is approved for publication (Appendix D #25)
      {
        index: "02",
        title: "Paiement instantané PI-SPI",
        text: "Envoyez et recevez de l’argent en quelques secondes, 24 h/24 et 7 j/7, vers toutes les banques et établissements de monnaie électronique de l’UEMOA.",
        screen: screen("PI-SPI"),
        published: false,
      },
      // [Legacy] — TODO(client): validate the biller list
      {
        index: "03",
        title: "Factures",
        text: "Réglez vos factures en quelques clics : Senelec, Sen’Eau, Woyofal, Rapido, Expresso et plus encore.",
        screen: screen("factures"),
        published: true,
      },
      {
        index: "04",
        title: "Rechargements",
        text: "Rechargez vos cartes et achetez du crédit téléphonique instantanément.",
        screen: screen("rechargements"),
        published: true,
      }, // [Legacy]
      {
        index: "05",
        title: "Paiement marchand",
        text: "Payez vos commerçants préférés en scannant leur QR code.",
        screen: screen("paiement marchand"),
        published: true,
      }, // [Legacy] + [Store]
      {
        index: "06",
        title: "Gestion financière",
        text: "Consultez votre solde et l’historique de vos opérations à tout moment.",
        screen: screen("solde et historique"),
        published: true,
      }, // [Proposition]
      // [Proposition] — TODO(client): confirm how cagnottes work (Appendix D #19)
      {
        index: "07",
        title: "Cagnottes",
        text: "Réunissez des fonds à plusieurs pour un projet commun.",
        screen: screen("cagnottes"),
        published: true,
      },
      {
        index: "08",
        title: "RAPS",
        text: "Rechargez et gérez vos porte-clés NFC pour payer sans contact.",
        link: { label: "Découvrir RAPS", href: "/raps" },
        screen: screen("RAPS"),
        published: true,
      }, // [Store]
      // [Store] — TODO(client): validate vouchers (Appendix D #19)
      {
        index: "09",
        title: "Bons d’achat",
        text: "Offrez et utilisez des bons d’achat digitaux.",
        screen: screen("bons d’achat"),
        published: true,
      },
    ] satisfies Feature[],
    more: {
      title: "Et plus encore",
      text: "Découvrez tous les services disponibles dans l’application.",
    }, // [Brief] "autres services disponibles"
  },
  start: {
    eyebrow: "Démarrer",
    title: "Votre compte en trois étapes.", // [Proposition]
    steps: [
      { title: "Créez votre compte", text: "Inscrivez-vous en quelques clics." },
      {
        title: "Validez votre compte",
        text: "Confirmez votre inscription pour accéder à toutes les fonctionnalités.",
      },
      {
        title: "Utilisez l’application",
        text: "Profitez de nos services et explorez les possibilités offertes.",
      },
    ] satisfies Step[], // [Legacy]
    note: "Pièce requise : carte nationale d’identité ou passeport.", // [Legacy FAQ + privacy policy]
  },
  security: {
    eyebrow: "Sécurité",
    title: "Vos paiements, protégés.", // [Proposition]
    text: "Code PIN, vérification d’identité à l’ouverture du compte, établissement agréé par la BCEAO.", // [Proposition, grounded in the app and privacy policy]
  },
  download: {
    title: "Téléchargez Samir Money.", // [Proposition]
  },
} as const;
