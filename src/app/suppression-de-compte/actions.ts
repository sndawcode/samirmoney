"use server";

import { accountDeletion } from "@/content/fr/legal";
import { contactForm } from "@/content/fr/contact";
import { deletionSchema } from "@/lib/deletion-schema";
import type { FormResult } from "@/lib/form-result";
import { log } from "@/lib/server/log";
import { sendInternalMail, singleLine } from "@/lib/server/mailer";
import { createRateLimiter, RATE_LIMIT } from "@/lib/server/rate-limit";
import { clientIp } from "@/lib/server/request";
import { verifyTurnstile } from "@/lib/server/turnstile";

const allow = createRateLimiter(RATE_LIMIT);

type Submission = { values: unknown; turnstileToken?: string; honeypot?: string };

/** Account deletion request: same protections as the contact form; e-mails the team. */
export async function submitDeletion({
  values,
  turnstileToken,
  honeypot,
}: Submission): Promise<FormResult> {
  const requestId = crypto.randomUUID();
  const parsed = deletionSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      parsed.error.issues.map((issue) => [issue.path.join("."), issue.message]),
    );
    return { status: "error", message: contactForm.errors.summary, fieldErrors };
  }
  if (honeypot) {
    log("info", "deletion.honeypot", { requestId });
    return { status: "success" };
  }
  const ip = await clientIp();
  if (!allow(ip ?? "unknown")) return { status: "error", message: contactForm.errors.rateLimited };
  if (!(await verifyTurnstile(turnstileToken, ip, requestId)))
    return { status: "error", message: contactForm.errors.captcha };

  const { firstName, lastName, phone } = parsed.data;
  const sent = await sendInternalMail(
    {
      subject: `[Site] ${accountDeletion.title} — ${singleLine(`${firstName} ${lastName}`)}`,
      text: [
        `Prénom : ${firstName}`,
        `Nom : ${lastName}`,
        `Téléphone : ${phone}`,
        "",
        accountDeletion.form.confirm,
        "",
        `Réf. ${requestId}`,
      ].join("\n"),
    },
    requestId,
  );
  if (!sent) return { status: "error", message: contactForm.errors.server };
  log("info", "deletion.submitted", { requestId });
  return { status: "success" };
}
