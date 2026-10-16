import { describe, expect, it } from "vitest";
import { frTypo } from "./fr-typography";

const NNBSP = " ";

describe("frTypo", () => {
  it("puts a narrow no-break space before the colon of the brief's S2 line", () => {
    expect(
      frTypo(
        "Effectuez vos versements groupés : salaires, commissions, prestataires et autres bénéficiaires éligibles.",
      ),
    ).toBe(
      `Effectuez vos versements groupés${NNBSP}: salaires, commissions, prestataires et autres bénéficiaires éligibles.`,
    );
  });

  it("puts a narrow no-break space before the question mark of the brief's S6 lead", () => {
    expect(
      frTypo(
        "Vous êtes commerçant, entreprise, institution ou développeur ? Échangeons sur vos besoins.",
      ),
    ).toBe(
      `Vous êtes commerçant, entreprise, institution ou développeur${NNBSP}? Échangeons sur vos besoins.`,
    );
  });

  it("spaces French quotation marks", () => {
    expect(frTypo("« Découvrir »")).toBe(`«${NNBSP}Découvrir${NNBSP}»`);
  });

  it("uses the typographic apostrophe and spaces the exclamation mark", () => {
    expect(frTypo("C'est payé !")).toBe(`C’est payé${NNBSP}!`);
  });

  it("groups amounts and never splits them from their currency", () => {
    expect(frTypo("2 000 000 FCFA")).toBe(`2${NNBSP}000${NNBSP}000${NNBSP}FCFA`);
    expect(frTypo("500 FCFA")).toBe(`500${NNBSP}FCFA`);
  });

  it.each([
    "https://samirmoney.com/contact?profil=commercant",
    "9:00",
    "+221 33 824 24 33",
    "EP.SN.005/2025",
  ])("leaves %s untouched", (value) => {
    expect(frTypo(value)).toBe(value);
  });

  it("is idempotent", () => {
    const samples = [
      "C'est payé !",
      "« Découvrir »",
      "Effectuez vos versements groupés : salaires",
      "2 000 000 FCFA",
    ];
    for (const s of samples) expect(frTypo(frTypo(s))).toBe(frTypo(s));
  });
});
