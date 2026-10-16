import { z } from "@/lib/zod-config";
import {
  contactForm,
  MESSAGE_MAX,
  MESSAGE_MIN,
  profils,
  sujets,
  sujetsByProfil,
  type Profil,
  type Sujet,
} from "@/content/fr/contact";

const { errors } = contactForm;
const E164 = /^\+[1-9]\d{7,14}$/;
const NAME_MAX = 100;
const FIELD_MAX = 200;

/** Shared by the client form and the server action (§11.1). */
export const contactSchema = z
  .object({
    profil: z.enum(profils, { error: errors.profil }),
    sujet: z.enum(sujets, { error: errors.sujet }),
    firstName: z.string({ error: errors.firstName }).trim().min(1, errors.firstName).max(NAME_MAX),
    lastName: z.string({ error: errors.lastName }).trim().min(1, errors.lastName).max(NAME_MAX),
    email: z.email({ error: errors.email }).max(FIELD_MAX, errors.email),
    phone: z
      .string({ error: errors.phone })
      .transform((value) => value.replace(/[\s().-]/g, ""))
      .pipe(z.string().regex(E164, errors.phone)),
    organization: z.string().trim().max(FIELD_MAX).default(""),
    message: z
      .string({ error: errors.messageShort })
      .trim()
      .min(MESSAGE_MIN, errors.messageShort)
      .max(MESSAGE_MAX, errors.messageLong),
    consent: z.literal(true, { error: errors.consent }),
  })
  .superRefine((data, ctx) => {
    if (data.profil !== "particulier" && data.organization.length === 0) {
      ctx.addIssue({ code: "custom", path: ["organization"], message: errors.organization });
    }
    if (!sujetsByProfil[data.profil].includes(data.sujet)) {
      ctx.addIssue({ code: "custom", path: ["sujet"], message: errors.sujet });
    }
  });

export type ContactInput = z.input<typeof contactSchema>;
export type ContactRequest = z.output<typeof contactSchema>;

const isProfil = (value: string | null): value is Profil =>
  value !== null && (profils as readonly string[]).includes(value);
const isSujet = (value: string | null): value is Sujet =>
  value !== null && (sujets as readonly string[]).includes(value);

/** `?profil=` / `?sujet=` prefill (§8.2). Unknown or incompatible values are ignored. */
export function parsePrefill(search: string): { profil?: Profil; sujet?: Sujet } {
  const params = new URLSearchParams(search);
  const rawProfil = params.get("profil");
  const rawSujet = params.get("sujet");
  const sujet = isSujet(rawSujet) ? rawSujet : undefined;
  const profil = isProfil(rawProfil)
    ? rawProfil
    : sujet === "partenariat"
      ? "partenaire"
      : undefined;
  if (!profil) return sujet ? { sujet } : {};
  return sujet && sujetsByProfil[profil].includes(sujet) ? { profil, sujet } : { profil };
}
