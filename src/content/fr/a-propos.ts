export const aProposPage = {
  hero: {
    eyebrow: "À propos",
    title: "Des paiements simples, sécurisés et connectés.", // [Proposition, from the brief S1 lead]
  },
  mission: {
    eyebrow: "Notre mission",
    // [Legacy, cleaned]
    paragraphs: [
      "Fort de l’expérience et du savoir-faire de ses fondateurs, Samir Money a choisi d’investir dans le marché du mobile money et des services financiers au Sénégal et en Afrique de l’Ouest.",
      "Samir Money propose des solutions de paiement électronique innovantes, adaptées aux besoins des utilisateurs, et contribue au développement de l’inclusion financière.",
    ],
  },
  values: {
    eyebrow: "Nos valeurs",
    title: "Ce qui guide chacune de nos solutions.", // [Proposition]
    // [Legacy SamirPay], shortened to ≤ 20 words — needs client validation
    items: [
      {
        title: "Simplicité",
        text: "Des transactions simples et transparentes, pour que vous vous concentriez sur l’essentiel.",
      },
      {
        title: "Accessibilité",
        text: "Des services financiers fiables pour tous, quel que soit le lieu ou le niveau de maîtrise technologique.",
      },
      {
        title: "Modernité",
        text: "Les dernières innovations technologiques au service de paiements modernes et performants.",
      },
      {
        title: "Innovation",
        text: "Nous développons sans cesse de nouvelles solutions pour améliorer votre expérience de paiement.",
      },
      {
        title: "Responsabilité",
        text: "Transparence totale et sécurité de chaque transaction : nous prenons notre responsabilité très au sérieux.",
      },
      {
        title: "Collaboration",
        text: "Nous co-construisons avec nos clients et partenaires des solutions adaptées à leurs besoins.",
      },
    ],
  },
  trust: { eyebrow: "Agrément et sécurité" },
  commitments: {
    eyebrow: "Nos engagements",
    title: "Aux côtés des entreprises.", // [Proposition]
    // [Legacy] — TODO(client): validate wording (B.2)
    items: [
      {
        title: "Inclusion financière",
        text: "Samir Money accompagne et forme les entreprises pour tirer le meilleur parti du mobile money et renforcer l’inclusion financière.",
      },
      {
        title: "Support dédié aux entreprises",
        text: "Un service client dédié aux entreprises utilisant notre plateforme.",
      },
      {
        title: "Accompagnement et formation",
        text: "Samir Money sait répondre aux besoins spécifiques de ses partenaires.",
      },
      {
        title: "Tarification transparente",
        text: "Une structure tarifaire transparente et compétitive.",
      },
    ],
  },
  // Hidden until validated with date and source (Appendix D #25)
  milestones: [] as readonly { title: string; text: string }[],
  identity: {
    eyebrow: "Identité",
    headquarters: "Siège",
    legalLink: "Mentions légales",
  },
} as const;
