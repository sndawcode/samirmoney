import type { ProductId } from "@/content/fr/products";
import type { ServiceId } from "@/content/fr/services";
import type { MissingVisual } from "@/content/types";

export type ServiceDetail = {
  id: Extract<
    ServiceId,
    "encaissement-multicanal" | "collecte" | "paiement-de-masse" | "lien-de-paiement"
  >;
  audience: string; // [Proposition]
  products: readonly ProductId[]; // [Proposition, from legacy]
  steps: readonly [string, string, string]; // [Proposition]
  note?: string; // [Legacy]
  photo: MissingVisual;
};

export const servicesPage = {
  hero: {
    eyebrow: "Nos services", // [Brief]
    title: "Des solutions pour chaque besoin.", // [Brief]
  },
  labels: { audience: "Pour qui", products: "Avec", how: "Comment ça marche" },
  details: [
    {
      id: "encaissement-multicanal",
      audience: "Commerçants, entreprises, institutions",
      products: ["tpe", "business", "api"],
      steps: [
        "Votre client choisit son moyen de paiement",
        "Vous encaissez depuis une seule solution",
        "L’opération apparaît dans votre historique",
      ],
      // TODO(client): accepted payment methods per product (Appendix D #11)
      photo: { placeholder: "Encaissement en boutique (photo à fournir)", ratio: "3/2" },
    },
    {
      id: "collecte",
      audience: "Entreprises (clients), associations (adhérents), institutions (usagers)",
      products: ["business", "web-admin", "api"],
      steps: [
        "Partagez vos moyens de paiement",
        "Vos clients paient",
        "Suivez tout depuis le Web Admin",
      ],
      photo: { placeholder: "Collecte — suivi des paiements (photo à fournir)", ratio: "3/2" },
    },
    {
      id: "paiement-de-masse",
      audience: "Entreprises, institutions",
      products: ["web-admin", "api"],
      steps: ["Importez vos bénéficiaires", "Validez le lot", "Les versements sont exécutés"],
      note: "Salaires, primes ou remboursements.",
      // TODO(client): décaissement video (Wolof) needs a French transcript and subtitles before it can be shown (Appendix D #26)
      photo: { placeholder: "Paiement de masse (photo à fournir)", ratio: "3/2" },
    },
    {
      id: "lien-de-paiement",
      audience: "Commerçants, indépendants, vente en ligne sans site",
      products: ["business"],
      steps: [
        "Créez un lien",
        "Partagez-le par WhatsApp, SMS ou e-mail",
        "Votre client paie en quelques clics",
      ],
      note: "Lien de paiement personnalisé ou permanent, depuis SamirPay Business.", // [Store]
      photo: { placeholder: "Lien de paiement — Shooting Resto (photo à fournir)", ratio: "3/2" },
    },
  ] satisfies ServiceDetail[],
  crossLinks: { title: "Aussi chez Samir Money" }, // [Proposition]
} as const;
