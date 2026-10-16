import "server-only";
import { headers } from "next/headers";

/** Client IP for rate limiting and Turnstile (first X-Forwarded-For hop set by the host). */
export async function clientIp(): Promise<string | undefined> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;
}
