// §9.8 + §11.1. Field labels and messages [Proposition] unless marked otherwise.

export const profils = [
  "particulier",
  "commercant",
  "entreprise",
  "institution",
  "developpeur",
  "partenaire",
] as const;
export type Profil = (typeof profils)[number];

export const sujets = [
  "compte",
  "tpe",
  "business",
  "web-admin",
  "raps",
  "api",
  "partenariat",
  "support",
  "autre",
] as const;
export type Sujet = (typeof sujets)[number];

export const profilLabels: Record<Profil, string> = {
  particulier: "Particulier",
  commercant: "Commerçant",
  entreprise: "Entreprise",
  institution: "Institution",
  developpeur: "Développeur",
  partenaire: "Partenaire",
};

export const sujetLabels: Record<Sujet, string> = {
  compte: "Ouvrir un compte Samir Money",
  tpe: "Demander un TPE",
  business: "SamirPay Business",
  "web-admin": "SamirPay Web Admin",
  raps: "RAPS",
  api: "API & intégrations",
  partenariat: "Devenir partenaire",
  support: "Support",
  autre: "Autre",
};

/** Subjects offered for each profile (§11.1 "options filtered by profil"). */
export const sujetsByProfil: Record<Profil, readonly Sujet[]> = {
  particulier: ["compte", "raps", "support", "autre"],
  commercant: ["tpe", "business", "web-admin", "raps", "api", "support", "autre"],
  entreprise: ["tpe", "business", "web-admin", "raps", "api", "partenariat", "support", "autre"],
  institution: ["web-admin", "raps", "api", "partenariat", "support", "autre"],
  developpeur: ["api", "partenariat", "support", "autre"],
  partenaire: ["partenariat", "autre"],
};

export const MESSAGE_MIN = 20;
export const MESSAGE_MAX = 2000;

export const contactPage = {
  breadcrumb: "Contact",
  title: "La solution qu’il vous faut commence ici.", // [Brief S6]
  lead: "Vous êtes commerçant, entreprise, institution ou développeur ? Échangeons sur vos besoins.", // [Brief S6]
  supportNote:
    "Déjà client ? Pour toute question sur une transaction, contactez notre support immédiatement après l’opération.", // [Legacy FAQ, adapted]
  details: {
    title: "Nos coordonnées",
    phone: "Téléphone",
    whatsapp: "WhatsApp",
    email: "E-mail",
    address: "Adresse",
    hours: "Horaires",
    directions: "Itinéraire",
    mapAlt: "Plan du quartier Point E à Dakar, avec l’emplacement du siège de Samir Money",
    mapAttribution: "© OpenStreetMap contributors",
  },
  whatsappPrefill: "Bonjour Samir Money, je souhaite échanger sur mes besoins.",
} as const;

export const contactForm = {
  legend: "Votre demande",
  required: "obligatoire",
  requiredNote: "Tous les champs sont obligatoires, sauf mention contraire.",
  profil: { label: "Vous êtes" },
  sujet: { label: "Sujet", placeholder: "Choisissez un sujet" },
  firstName: { label: "Prénom" },
  lastName: { label: "Nom" },
  email: { label: "E-mail" },
  phone: { label: "Téléphone", hint: "Avec l’indicatif pays, par exemple +221 77 000 00 00." },
  organization: { label: "Entreprise / organisation" },
  message: { label: "Message", hint: `Entre ${MESSAGE_MIN} et ${MESSAGE_MAX} caractères.` },
  consent: {
    // [Proposition — legal to validate]
    before:
      "J’accepte que mes données soient utilisées pour traiter ma demande, conformément à la ",
    link: "politique de confidentialité",
    after: ".",
  },
  honeypot: "Ne remplissez pas ce champ",
  submit: "Envoyer ma demande",
  submitting: "Envoi en cours…",
  success: "Merci, votre demande a bien été envoyée. Notre équipe vous recontacte rapidement.", // [Proposition]
  errors: {
    profil: "Indiquez votre profil.",
    sujet: "Choisissez un sujet.",
    firstName: "Indiquez votre prénom.",
    lastName: "Indiquez votre nom.",
    email: "Indiquez une adresse e-mail valide, par exemple nom@domaine.sn.",
    phone: "Indiquez un numéro valide avec l’indicatif pays, par exemple +221 77 000 00 00.",
    organization: "Indiquez le nom de votre entreprise ou organisation.",
    messageShort: `Votre message doit contenir au moins ${MESSAGE_MIN} caractères.`,
    messageLong: `Votre message ne doit pas dépasser ${MESSAGE_MAX} caractères.`,
    consent: "Vous devez accepter le traitement de vos données pour envoyer la demande.",
    captcha: "La vérification anti-spam a échoué. Rechargez la page puis réessayez.",
    rateLimited:
      "Vous avez envoyé plusieurs demandes en peu de temps. Réessayez dans quelques minutes.",
    server:
      "L’envoi a échoué de notre côté. Réessayez dans un instant ou contactez-nous par téléphone.",
    summary: "Le formulaire contient des erreurs. Corrigez les champs signalés.",
  },
} as const;
