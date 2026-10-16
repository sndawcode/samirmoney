import "server-only";
import { Resend } from "resend";
import { isProductionStage } from "@/lib/stage";
import { log } from "@/lib/server/log";

const TIMEOUT_MS = 10_000;

export type Mail = { subject: string; text: string; replyTo?: string };

/** Header values never carry line breaks (header injection). */
export const singleLine = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

/**
 * Sends an internal notification to CONTACT_TO_EMAIL through Resend.
 * Outside production, a missing configuration is a logged dry run so previews stay testable.
 */
export async function sendInternalMail(mail: Mail, requestId: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    if (isProductionStage) {
      log("error", "mail.missing_config", { requestId });
      return false;
    }
    log("warn", "mail.dry_run", { requestId, reason: "Resend not configured outside production" });
    return true;
  }
  try {
    const resend = new Resend(apiKey);
    const send = resend.emails.send(
      { from, to, subject: singleLine(mail.subject), text: mail.text, replyTo: mail.replyTo },
      { idempotencyKey: requestId },
    );
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS),
    );
    const { error } = await Promise.race([send, timeout]);
    if (error) {
      log("error", "mail.rejected", { requestId, name: error.name });
      return false;
    }
    log("info", "mail.sent", { requestId });
    return true;
  } catch (error) {
    log("error", "mail.failed", {
      requestId,
      error: error instanceof Error ? error.message : "unknown",
    });
    return false;
  }
}

/** Optional CRM webhook (§11.1). Failures are logged, never block the visitor. */
export async function postToCrm(
  payload: Record<string, unknown>,
  requestId: string,
): Promise<void> {
  const url = process.env.CRM_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json", "idempotency-key": requestId },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!res.ok) log("warn", "crm.rejected", { requestId, status: res.status });
  } catch (error) {
    log("warn", "crm.failed", {
      requestId,
      error: error instanceof Error ? error.name : "unknown",
    });
  }
}
