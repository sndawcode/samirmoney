import { expect, test } from "@playwright/test";

test.describe("contact form", () => {
  test("prefills from the query string", async ({ page }) => {
    await page.goto("/contact?profil=entreprise&sujet=web-admin");
    await expect(page.getByRole("radio", { name: "Entreprise" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await expect(page.locator("#sujet")).toHaveValue("web-admin");
  });

  test("shows French errors tied to each field", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(
      page.getByText("Le formulaire contient des erreurs.", { exact: false }),
    ).toBeVisible();
    await expect(page.locator("#email")).toHaveAttribute("aria-invalid", "true");
    await expect(page.locator("#email")).toHaveAttribute("aria-describedby", "email-error");
  });

  test("filters subjects by profile", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("radio", { name: "Particulier" }).click();
    const options = await page.locator("#sujet option:not([disabled])").allTextContents();
    expect(options).toEqual(["Ouvrir un compte Samir Money", "RAPS", "Support", "Autre"]);
    await expect(page.locator("#organization")).toHaveCount(0);
  });

  test("sends a valid request (dry run without Resend keys)", async ({ page }) => {
    await page.goto("/contact");
    await page.getByRole("radio", { name: "Commerçant" }).click();
    await page.locator("#sujet").selectOption("tpe");
    await page.fill("#firstName", "Awa");
    await page.fill("#lastName", "Ndiaye");
    await page.fill("#email", "awa@example.sn");
    await page.fill("#phone", "+221 77 000 00 00");
    await page.fill("#organization", "Boutique Awa");
    await page.fill("#message", "Bonjour, je souhaite un terminal pour ma boutique.");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Envoyer ma demande" }).click();
    await expect(page.getByRole("status")).toContainText(
      "Merci, votre demande a bien été envoyée.",
    );
  });
});
