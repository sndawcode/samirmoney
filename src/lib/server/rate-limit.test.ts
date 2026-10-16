import { describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));
const { createRateLimiter } = await import("./rate-limit");

describe("createRateLimiter", () => {
  it("allows max requests per window, then blocks, then recovers", () => {
    let t = 0;
    const allow = createRateLimiter({ max: 2, windowMs: 1000 }, () => t);
    expect(allow("ip")).toBe(true);
    expect(allow("ip")).toBe(true);
    expect(allow("ip")).toBe(false);
    expect(allow("other")).toBe(true);
    t = 1000;
    expect(allow("ip")).toBe(true);
  });
});
