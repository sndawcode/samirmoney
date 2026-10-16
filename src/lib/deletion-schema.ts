import { z } from "@/lib/zod-config";
import { accountDeletion } from "@/content/fr/legal";

const { errors } = accountDeletion.form;
const E164 = /^\+[1-9]\d{7,14}$/;

/** Account deletion request (§9.9) — fields from the legacy form. */
export const deletionSchema = z.object({
  firstName: z.string({ error: errors.firstName }).trim().min(1, errors.firstName).max(100),
  lastName: z.string({ error: errors.lastName }).trim().min(1, errors.lastName).max(100),
  phone: z
    .string({ error: errors.phone })
    .transform((value) => value.replace(/[\s().-]/g, ""))
    .pipe(z.string().regex(E164, errors.phone)),
  confirm: z.literal(true, { error: errors.confirm }),
});

export type DeletionInput = z.input<typeof deletionSchema>;
export type DeletionRequest = z.output<typeof deletionSchema>;
