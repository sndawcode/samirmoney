import "server-only";
import { isProductionStage } from "@/lib/stage";
import { log } from "@/lib/server/log";

const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TIMEOUT_MS = 8000;

/**
 * Verifies a Cloudflare Turnstile token. Without a secret key, dev/preview skip the check (logged);
 * production fails closed.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string | undefined,
  requestId: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    if (isProductionStage) {
      log("error", "turnstile.missing_secret", { requestId });
      return false;
    }
    log("warn", "turnstile.skipped", { requestId, reason: "no secret outside production" });
    return true;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, idempotency_key: requestId });
    if (ip) body.set("remoteip", ip);
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      body,
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data.success)
      log("warn", "turnstile.rejected", { requestId, codes: data["error-codes"]?.join(",") });
    return data.success === true;
  } catch (error) {
    log("error", "turnstile.unreachable", {
      requestId,
      error: error instanceof Error ? error.name : "unknown",
    });
    return false;
  }
}
