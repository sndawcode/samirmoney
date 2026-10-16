import { describe, expect, it } from "vitest";
import { accountDeletion } from "@/content/fr/legal";
import { deletionSchema } from "./deletion-schema";

describe("deletionSchema", () => {
  it("accepts a confirmed request with an international number", () => {
    expect(
      deletionSchema.parse({
        firstName: "Awa",
        lastName: "Ndiaye",
        phone: "+221 77 000 00 00",
        confirm: true,
      }).phone,
    ).toBe("+221770000000");
  });

  it("requires the explicit confirmation", () => {
    const result = deletionSchema.safeParse({
      firstName: "Awa",
      lastName: "Ndiaye",
      phone: "+221770000000",
      confirm: false,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(accountDeletion.form.errors.confirm);
  });
});
