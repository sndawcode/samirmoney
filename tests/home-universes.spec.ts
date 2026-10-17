import { expect, test } from "@playwright/test";

test.describe("home — Nos univers", () => {
  test("sits right below the hero with both universes and their services", async ({ page }) => {
    await page.goto("/");
    const order = await page.evaluate(() => {
      const hero = document.querySelector("[data-hero]")?.closest("section");
      return hero?.nextElementSibling?.hasAttribute("data-universes") ?? false;
    });
    expect(order).toBe(true);
    const section = page.locator("[data-universes]");
    // Columns reveal on scroll: bring each into view first.
    for (const article of await section.locator("article").all()) {
      await article.scrollIntoViewIfNeeded();
    }
    await expect(section.getByRole("heading", { level: 3, name: "SamirPay" })).toBeVisible();
    await expect(section.getByRole("heading", { level: 3, name: "Samir Money" })).toBeVisible();
    await expect(
      section.getByRole("list", { name: "Services SamirPay" }).getByRole("link"),
    ).toHaveCount(8);
    await expect(
      section.getByRole("list", { name: "Services Samir Money" }).getByRole("link"),
    ).toHaveCount(14);
    for (const label of ["Crédit", "Assurance", "Carburant", "Change", "Marketplace"]) {
      await expect(section.getByRole("link", { name: label, exact: true })).toHaveCount(1);
    }
  });

  test("each card offers its main action and the floating settles on its own (WCAG 2.2.2)", async ({
    page,
  }) => {
    await page.goto("/");
    const [pay, money] = await page.locator("[data-universe]").all();
    await pay.scrollIntoViewIfNeeded();
    await expect(pay.getByRole("link", { name: "Nous contacter" })).toHaveAttribute(
      "href",
      "/contact?profil=commercant",
    );
    await expect(pay.getByRole("button")).toHaveCount(0);
    await money.scrollIntoViewIfNeeded();
    await expect(money.getByRole("link", { name: /App Store/ })).toBeVisible();
    await expect(money.getByRole("link", { name: /Google Play/ })).toHaveAttribute(
      "href",
      "https://play.google.com/store/apps/details?id=sn.samirmoney.samirlink1",
    );
    // Finite entrance: two iterations, never "infinite" without user interaction.
    await page.mouse.move(0, 0);
    await expect(money.locator(".float-chip").first()).toHaveCSS("animation-iteration-count", "2");
  });
});
