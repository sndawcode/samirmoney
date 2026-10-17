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
      section.getByRole("group", { name: "Services SamirPay" }).getByRole("link"),
    ).toHaveCount(8);
    await expect(
      section.getByRole("group", { name: "Services Samir Money" }).getByRole("link"),
    ).toHaveCount(14);
    for (const label of ["Crédit", "Assurance", "Carburant", "Change", "Marketplace"]) {
      await expect(section.getByRole("link", { name: label, exact: true })).toHaveCount(1);
    }
  });

  test("the orbit can be paused and resumed (WCAG 2.2.2)", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("[data-universes]");
    await section.scrollIntoViewIfNeeded();
    await section.getByRole("button", { name: "Mettre en pause l’animation" }).click();
    await expect(section).toHaveAttribute("data-paused", "");
    await expect(section.locator(".orbit-item").first()).toHaveCSS(
      "animation-play-state",
      /paused/,
    );
    await section.getByRole("button", { name: "Relancer l’animation" }).click();
    await expect(section).not.toHaveAttribute("data-paused", "");
  });
});
