import type { FaqItem } from "@/content/types";

type PublishableFaq = FaqItem & { published: boolean };

// B.3 — SamirPay FAQ [Legacy, cleaned]. Items 4 and 6 stay hidden until validated (Appendix D #17).
const samirPayFaqAll: readonly PublishableFaq[] = [
  {
    question: "Qu’est-ce que SamirPay ?",
    answer:
      "SamirPay est une plateforme qui regroupe les grands opérateurs de mobile money du Sénégal et vous permet de gérer toutes vos opérations financières en un seul endroit, de manière simple et sécurisée.",
    published: true,
  },
  {
    question: "Comment m’inscrire à SamirPay ?",
    answer:
      "Rendez-vous sur notre site web ou téléchargez notre application mobile, puis suivez les instructions pour créer un compte en fournissant les informations et les documents requis.",
    published: true,
  },
  {
    question: "Quels sont les documents requis pour s’inscrire ?",
    answer:
      "Pour les entreprises : NINEA, registre de commerce, justificatif d’adresse et carte d’identité du gérant. Pour les particuliers : carte nationale d’identité.",
    published: true,
  },
  {
    question: "Quels sont les plafonds de transaction ?",
    answer:
      "Les opérateurs de mobile money appliquent un plafond de 2 000 000 FCFA par jour et 10 000 000 FCFA par mois.",
    published: false, // TODO(client): validate ceilings (Appendix D #17)
  },
  {
    question: "Puis-je utiliser SamirPay sur plusieurs appareils ?",
    answer:
      "Pour des raisons de sécurité, SamirPay est conçu pour être utilisé sur un seul appareil à la fois.",
    published: true,
  },
  {
    question: "Quels sont les délais de remboursement ?",
    answer:
      "Les remboursements via mobile money prennent généralement J+1, et les virements bancaires J+3 après validation par l’équipe de Samir Money.",
    published: false, // TODO(client): validate refund delays (Appendix D #17)
  },
  {
    question: "Puis-je annuler une transaction ?",
    answer:
      "Les transactions effectuées sur SamirPay sont généralement définitives. Si vous avez besoin d’assistance, contactez notre support client immédiatement après la transaction.",
    published: true,
  },
  {
    question: "Comment consulter mon solde et mes transactions ?",
    answer:
      "Rendez-vous sur votre tableau de bord pour consulter votre solde global et le détail des transactions par opérateur. Vous pouvez également exporter des rapports de vos transactions.",
    published: true,
  },
];

export const samirPayFaq: readonly FaqItem[] = samirPayFaqAll.filter((item) => item.published);

// TODO(client): RAPS FAQ — perte ou vol, recharge et plafond, terminaux compatibles, où obtenir un porte-clés (Appendix D #12). Empty → section hidden.
export const rapsFaq: readonly FaqItem[] = [];
