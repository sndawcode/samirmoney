// src/content/fr/trust.ts — SINGLE SOURCE OF TRUTH for compliance wording
export const trust = {
  eyebrow: "Sécurité, agrément et certifications",
  title: "La confiance au cœur de chaque transaction.",
  bceao: {
    label: "Établissement de paiement agréé par la BCEAO",
    text: "Samir Money SA est agréé sous la référence EP.SN.005/2025.",
    reference: "EP.SN.005/2025",
    // BCEAO list of approved institutions — Sénégal (updated 29/06/2026). The file name changes yearly: re-check before launch.
    verifyUrl:
      "https://www.bceao.int/sites/default/files/inline-files/7%20-%20Liste%20S%C3%A9n%C3%A9gal_2026.pdf",
    // [Proposition] — needs client validation (Appendix D #15)
    verifyLabel: "Vérifier sur la liste officielle de la BCEAO",
    verifyFormat: "PDF",
  },
  pciDss: {
    label: "Certification PCI DSS",
    text: "Une certification attestant de notre conformité aux exigences de sécurité applicables à notre périmètre certifié pour la protection des données de cartes de paiement.",
  },
  complianceLine:
    "Samir Money SA — Établissement de paiement agréé par la BCEAO sous la référence EP.SN.005/2025.",
} as const;
