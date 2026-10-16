// Shared interface strings (buttons, badges, accessibility labels). [Proposition] unless marked otherwise.
export const ui = {
  skipLink: "Aller au contenu",
  homeLink: "Samir Money — accueil",
  menuOpen: "Menu",
  menuClose: "Fermer le menu",
  menuTitle: "Navigation principale",
  footerNav: "Plan du site",
  newTab: "nouvel onglet",
  discover: "Découvrir", // [Brief]
  nextProduct: "Produit suivant",
  storeBadges: {
    ios: "Télécharger dans l’App Store",
    android: "Disponible sur Google Play",
  },
  whatsapp: "Écrire sur WhatsApp",
  call: "Appeler",
  email: "Écrire un e-mail",
  pdf: "PDF",
  playVideo: "Lire la vidéo",
  transcript: "Transcription",
  hotspotsList: "Points clés de l’interface",
  localNavLabel: "Sur cette page",
  breadcrumbHome: "Accueil",
  placeholderPrefix: "À fournir",
} as const;

export const notFoundPage = {
  code: "404",
  receipt: {
    title: "Reçu",
    rows: [
      { label: "Page demandée", value: "introuvable" },
      { label: "Montant", value: "0 FCFA" },
    ],
    status: "Statut : page introuvable",
  },
  title: "Cette page n’existe pas.",
  lead: "Le lien est peut-être ancien. Retrouvez nos solutions ci-dessous.",
  home: "Retour à l’accueil",
} as const;
