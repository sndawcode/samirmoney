import { expect, test, type Page } from "@playwright/test";

// The client brief's site copy (Appendix B.1), kept here on purpose — not imported from src/content —
// so a content edit can never silently drop or reword it (§1.1, §17).
const BRIEF: Record<string, readonly string[]> = {
  "/": [
    "Tous vos paiements. Un seul écosystème.",
    "Samir Money accompagne les particuliers, commerçants, entreprises et institutions avec des solutions de paiement simples, sécurisées et connectées.",
    "Nos solutions",
    "Votre application de paiement et de gestion financière au quotidien.",
    "Encaissez plusieurs moyens de paiement sur un seul terminal.",
    "Encaissez et suivez votre activité depuis votre smartphone.",
    "Centralisez et pilotez vos opérations professionnelles.",
    "Payez sans contact grâce à la technologie NFC.",
    "Intégrez nos solutions de paiement à vos applications et plateformes.",
    "Découvrir",
    "Nos services",
    "Des solutions pour chaque besoin.",
    "Acceptez différents moyens de paiement depuis une seule solution.",
    "Collectez les paiements de vos clients, adhérents ou usagers et centralisez leur suivi.",
    "Effectuez vos versements groupés : salaires, commissions, prestataires et autres bénéficiaires éligibles.",
    "Encaissez à distance grâce à un lien partagé par WhatsApp, SMS ou e-mail.",
    "Connectez nos solutions à vos applications, sites e-commerce et systèmes d’information.",
    "Simplifiez les transactions du quotidien avec RAPS.",
    "Nos API",
    "Votre plateforme. Notre technologie.",
    "Intégrez les solutions de paiement SamirPay directement à votre environnement digital.",
    "API d’encaissement.",
    "API de paiement de masse.",
    "Intégrations e-commerce.",
    "Plugin WooCommerce.",
    "Solutions d’intégration adaptées aux besoins des entreprises.",
    "Découvrir nos API",
    "Sécurité, agrément et certifications",
    "La confiance au cœur de chaque transaction.",
    "Établissement de paiement agréé par la BCEAO",
    "Samir Money SA est agréé sous la référence EP.SN.005/2025.",
    "Certification PCI DSS",
    "Une certification attestant de notre conformité aux exigences de sécurité applicables à notre périmètre certifié pour la protection des données de cartes de paiement.",
    // S5 "Nos partenaires" / "Ils nous font confiance." is hidden until partners are validated (Appendix D #10).
    "La solution qu’il vous faut commence ici.",
    "Vous êtes commerçant, entreprise, institution ou développeur ? Échangeons sur vos besoins.",
    "Nous contacter",
    "Devenir partenaire",
  ],
  "/services": ["Des solutions pour chaque besoin."],
  "/developpeurs": [
    "Votre plateforme. Notre technologie.",
    "Intégrez les solutions de paiement SamirPay directement à votre environnement digital.",
  ],
  "/contact": [
    "La solution qu’il vous faut commence ici.",
    "Vous êtes commerçant, entreprise, institution ou développeur ? Échangeons sur vos besoins.",
  ],
  "/a-propos": [
    "Samir Money SA est agréé sous la référence EP.SN.005/2025.",
    "Une certification attestant de notre conformité aux exigences de sécurité applicables à notre périmètre certifié pour la protection des données de cartes de paiement.",
  ],
};

/** Compare case-insensitively after normalising narrow/no-break spaces and apostrophes (§17). */
const normalise = (text: string) =>
  text.replace(/[  ]/g, " ").replace(/’/g, "'").replace(/\s+/g, " ").toLowerCase();

async function pageText(page: Page) {
  return normalise((await page.locator("body").textContent()) ?? "");
}

for (const [route, lines] of Object.entries(BRIEF)) {
  test(`brief copy is on ${route}, verbatim`, async ({ page }) => {
    await page.goto(route);
    const text = await pageText(page);
    const missing = lines.filter((line) => !text.includes(normalise(line)));
    expect(missing).toEqual([]);
  });
}
