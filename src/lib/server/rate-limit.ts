import "server-only";

export const RATE_LIMIT = { max: 5, windowMs: 10 * 60 * 1000 } as const;

/**
 * Fixed-window limiter per key (5 requests per 10 minutes, §11.1). In-memory: it holds per server
 * instance, which is enough to stop a burst from one client; Turnstile is the main spam barrier.
 */
export function createRateLimiter(
  { max, windowMs }: { max: number; windowMs: number },
  now: () => number = Date.now,
) {
  const hits = new Map<string, number[]>();
  return function allow(key: string): boolean {
    const t = now();
    const recent = (hits.get(key) ?? []).filter((at) => t - at < windowMs);
    if (recent.length >= max) {
      hits.set(key, recent);
      return false;
    }
    recent.push(t);
    hits.set(key, recent);
    return true;
  };
}
