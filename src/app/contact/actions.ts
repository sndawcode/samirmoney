"use server";

import { contactForm, profilLabels, sujetLabels } from "@/content/fr/contact";
import { contactSchema } from "@/lib/contact-schema";
import type { FormResult } from "@/lib/form-result";
import { log } from "@/lib/server/log";
import { postToCrm, sendInternalMail, singleLine } from "@/lib/server/mailer";
import { createRateLimiter, RATE_LIMIT } from "@/lib/server/rate-limit";
import { clientIp } from "@/lib/server/request";
import { verifyTurnstile } from "@/lib/server/turnstile";

const allow = createRateLimiter(RATE_LIMIT);

type Submission = { values: unknown; turnstileToken?: string; honeypot?: string };

/** Contact form (§11.1): validate → honeypot → rate limit → Turnstile → e-mail (+ optional CRM). */
export async function submitContact({
  values,
  turnstileToken,
  honeypot,
}: Submission): Promise<FormResult> {
  const requestId = crypto.randomUUID();
  const parsed = contactSchema.safeParse(values);
  if (!parsed.success) {
    const fieldErrors = Object.fromEntries(
      parsed.error.issues.map((issue) => [issue.path.join("."), issue.message]),
    );
    log("info", "contact.invalid", { requestId, fields: Object.keys(fieldErrors).join(",") });
    return { status: "error", message: contactForm.errors.summary, fieldErrors };
  }
  // Bots fill the hidden field: pretend success, send nothing.
  if (honeypot) {
    log("info", "contact.honeypot", { requestId });
    return { status: "success" };
  }
  const ip = await clientIp();
  if (!allow(ip ?? "unknown")) {
    log("warn", "contact.rate_limited", { requestId });
    return { status: "error", message: contactForm.errors.rateLimited };
  }
  if (!(await verifyTurnstile(turnstileToken, ip, requestId))) {
    return { status: "error", message: contactForm.errors.captcha };
  }

  const data = parsed.data;
  const name = `${data.firstName} ${data.lastName}`;
  const text = [
    `Profil : ${profilLabels[data.profil]}`,
    `Sujet : ${sujetLabels[data.sujet]}`,
    `Nom : ${name}`,
    `E-mail : ${data.email}`,
    `Téléphone : ${data.phone}`,
    data.organization ? `Organisation : ${data.organization}` : null,
    "",
    data.message,
    "",
    `Réf. ${requestId}`,
  ]
    .filter((line) => line !== null)
    .join("\n");

  const sent = await sendInternalMail(
    {
      subject: `[Site] ${sujetLabels[data.sujet]} — ${profilLabels[data.profil]} — ${singleLine(name)}`,
      text,
      replyTo: data.email,
    },
    requestId,
  );
  if (!sent) return { status: "error", message: contactForm.errors.server };

  await postToCrm({ requestId, ...data, consent: undefined }, requestId);
  log("info", "contact.submitted", { requestId, profil: data.profil, sujet: data.sujet });
  return { status: "success" };
}
