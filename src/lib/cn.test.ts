import { describe, expect, it } from "vitest";
import { cn } from "./cn";

describe("cn", () => {
  it("keeps a custom text size next to a text colour", () => {
    expect(cn("text-eyebrow text-graphite")).toBe("text-eyebrow text-graphite");
    expect(cn("text-lead", "text-smoke")).toBe("text-lead text-smoke");
  });

  it("still resolves conflicting sizes", () => {
    expect(cn("text-h2", "text-h3")).toBe("text-h3");
  });

  it("keeps texture utilities next to a background colour", () => {
    expect(cn("bg-ink-950", "hairlines grain")).toBe("bg-ink-950 hairlines grain");
  });
});
