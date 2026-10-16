import { describe, expect, it } from "vitest";
import { contactForm } from "@/content/fr/contact";
import { contactSchema, parsePrefill } from "./contact-schema";

const valid = {
  profil: "commercant",
  sujet: "tpe",
  firstName: "Awa",
  lastName: "Ndiaye",
  email: "awa@example.sn",
  phone: "+221 77 000 00 00",
  organization: "Boutique Awa",
  message: "Bonjour, je souhaite un terminal pour ma boutique.",
  consent: true,
};

const errorsOf = (input: unknown) => {
  const result = contactSchema.safeParse(input);
  return result.success
    ? {}
    : Object.fromEntries(result.error.issues.map((i) => [i.path.join("."), i.message]));
};

describe("contactSchema", () => {
  it("accepts a complete request and normalises the phone number to E.164", () => {
    const result = contactSchema.parse(valid);
    expect(result.phone).toBe("+221770000000");
  });

  it("requires an organisation for every profile except particulier", () => {
    expect(errorsOf({ ...valid, organization: "" })).toEqual({
      organization: contactForm.errors.organization,
    });
    expect(
      errorsOf({ ...valid, profil: "particulier", sujet: "compte", organization: "" }),
    ).toEqual({});
  });

  it("rejects a subject that does not belong to the profile", () => {
    expect(errorsOf({ ...valid, profil: "particulier", sujet: "tpe" })).toEqual({
      sujet: contactForm.errors.sujet,
    });
  });

  it("enforces the 20–2000 character message length", () => {
    expect(errorsOf({ ...valid, message: "Trop court" })).toEqual({
      message: contactForm.errors.messageShort,
    });
    expect(errorsOf({ ...valid, message: "a".repeat(2001) })).toEqual({
      message: contactForm.errors.messageLong,
    });
  });

  it("rejects numbers without a country code", () => {
    expect(errorsOf({ ...valid, phone: "77 000 00 00" })).toEqual({
      phone: contactForm.errors.phone,
    });
  });

  it("requires consent", () => {
    expect(errorsOf({ ...valid, consent: false })).toEqual({ consent: contactForm.errors.consent });
  });

  it("returns French messages for missing fields", () => {
    const errors = errorsOf({ consent: true });
    expect(errors.firstName).toBe(contactForm.errors.firstName);
    expect(errors.email).toBe(contactForm.errors.email);
  });
});

describe("parsePrefill", () => {
  it("reads known profil and sujet values", () => {
    expect(parsePrefill("?profil=entreprise&sujet=web-admin")).toEqual({
      profil: "entreprise",
      sujet: "web-admin",
    });
  });

  it("ignores unknown values", () => {
    expect(parsePrefill("?profil=pirate&sujet=<script>")).toEqual({});
  });

  it("turns a partnership request without a profile into the partenaire profile", () => {
    expect(parsePrefill("?sujet=partenariat")).toEqual({
      profil: "partenaire",
      sujet: "partenariat",
    });
  });

  it("drops a subject the profile cannot choose", () => {
    expect(parsePrefill("?profil=particulier&sujet=api")).toEqual({ profil: "particulier" });
  });
});
