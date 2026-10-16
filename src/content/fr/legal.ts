import { site } from "@/content/fr/site";
import { trust } from "@/content/fr/trust";

export type LegalBlock =
  { type: "h2" | "h3" | "h4" | "p"; text: string } | { type: "ul"; items: readonly string[] };

/** A legal fact: `null` until the client supplies it (rendered as a dev/preview placeholder). */
export type LegalFact = { label: string; value: string | null };

export const legalNotice = {
  title: "Mentions légales",
  // TODO(client): raison sociale confirmée, forme, capital, RCCM, NINEA, directeur de la publication, hébergeur (Appendix D #23)
  facts: [
    { label: "Raison sociale", value: site.legalName },
    { label: "Forme juridique", value: "Société anonyme (SA)" },
    { label: "Capital social", value: null },
    {
      label: "Siège social",
      value: `${site.address.street}, ${site.address.district}, ${site.address.city}, ${site.address.country}`,
    },
    { label: "RCCM", value: null },
    { label: "NINEA", value: null },
    { label: "Agrément", value: `${trust.bceao.label} — ${trust.bceao.reference}` },
    { label: "Directeur de la publication", value: null },
    { label: "Téléphone", value: site.phone.display },
    { label: "E-mail", value: site.email },
    { label: "Hébergeur", value: null },
  ] satisfies LegalFact[],
} as const;

export const privacyPage = {
  title: "Politique de confidentialité",
  contactByEmail: "Par e-mail :",
  // [Proposition] — legal to validate (§15.2). States only what the website actually does.
  website: {
    title: "Site web",
    blocks: [
      { type: "p", text: "Cette section s’applique au site samirmoney.com." },
      { type: "h3", text: "Formulaires" },
      {
        type: "p",
        text: "Les informations saisies dans nos formulaires (contact, demande de suppression de compte) sont transmises à nos équipes par e-mail pour traiter votre demande. Le site web ne les conserve pas.",
      },
      { type: "h3", text: "Mesure d’audience" },
      {
        type: "p",
        text: "Nous mesurons la fréquentation du site avec Plausible Analytics, un outil qui n’utilise pas de cookies et ne collecte aucune donnée personnelle permettant de vous identifier.",
      },
      { type: "h3", text: "Cookies" },
      {
        type: "p",
        text: "Le site ne dépose aucun cookie publicitaire ni de mesure d’audience. La protection anti-spam des formulaires (Cloudflare Turnstile) peut utiliser des données techniques strictement nécessaires à son fonctionnement.",
      },
    ] satisfies LegalBlock[],
  },
} as const;

export const termsPage = {
  title: "Conditions générales d’utilisation",
  // TODO(client): CGU text (Appendix D #24)
  body: null as string | null,
  pending: "Conditions générales d’utilisation (texte à fournir)",
} as const;

export const accountDeletion = {
  title: "Suppression de compte",
  lead: "Vous pouvez demander la suppression de votre compte Samir Money à tout moment, sans être connecté.",
  // [Legacy] form fields from the former samirmoney.com/suppression-de-compte page
  form: {
    firstName: "Prénom",
    lastName: "Nom",
    phone: "Numéro de téléphone associé au compte",
    confirm:
      "Je comprends que la suppression de mon compte est permanente et ne peut pas être annulée.",
    submit: "Soumettre la demande",
    success:
      "Votre demande de suppression a bien été envoyée. Notre équipe la traite et vous recontacte si besoin.",
  },
  // [Proposition] — grounded in the privacy policy ("Supprimez vos données personnelles")
  retention: {
    title: "Ce qui peut être conservé",
    text: "Certaines informations peuvent être conservées lorsque nous avons une obligation légale ou une base légale de le faire, notamment au titre de la réglementation applicable aux établissements de paiement.",
  },
  // TODO(client): in-app deletion path, if the app offers one (Appendix D #24)
  inAppPath: null as string | null,
} as const;
