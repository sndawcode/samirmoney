import { expect, test } from "@playwright/test";

test.describe("home experience", () => {
  test("the 3D ecosystem scene renders after first paint", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator("canvas.ecosystem-canvas");
    await expect(canvas).toHaveAttribute("aria-hidden", "true");
    await expect(canvas).toHaveAttribute("data-ready", "", { timeout: 10_000 });
  });

  test("every animated element ends visible once scrolled through", async ({ page }) => {
    await page.goto("/");
    await page.waitForFunction(
      () => document.querySelector("[data-gsap='rise']")?.getAttribute("style") !== null,
      null,
      { timeout: 10_000 },
    );
    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= height; y += 500) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1500);
    const hidden = await page.$$eval(
      "[data-gsap='rise']",
      (els) =>
        els.filter(
          (el) =>
            getComputedStyle(el).visibility === "hidden" ||
            Number(getComputedStyle(el).opacity) < 0.99,
        ).length,
    );
    expect(hidden).toBe(0);
  });

  test("with reduced motion nothing is hidden by the choreography", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.waitForTimeout(1500);
    const hidden = await page.$$eval(
      "[data-gsap]",
      (els) =>
        els.filter(
          (el) =>
            getComputedStyle(el).visibility === "hidden" || getComputedStyle(el).opacity === "0",
        ).length,
    );
    expect(hidden).toBe(0);
  });

  test("the hero fills the first screen and names all six solutions", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize();
    const hero = await page.locator("[data-hero]").boundingBox();
    expect(hero?.height).toBeGreaterThanOrEqual((viewport?.height ?? 0) - 1);
    const rail = page.getByRole("navigation", { name: "Nos solutions" });
    await expect(rail.getByRole("link")).toHaveCount(6);
    // The rail sits inside the first screen (it scrolls sideways on phones).
    const box = await rail.boundingBox();
    expect((box?.y ?? Infinity) + (box?.height ?? 0)).toBeLessThanOrEqual(viewport?.height ?? 0);
  });
});
