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

  test("the hero fills the first screen and leads to the solutions", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize();
    const height = viewport?.height ?? 0;
    const hero = await page.locator("[data-hero]").boundingBox();
    expect(hero?.height).toBeGreaterThanOrEqual(height - 1);
    // Headline and both calls to action sit inside the first screen.
    for (const name of ["Nous contacter", "Voir nos solutions"]) {
      const cta = page.locator("[data-hero]").getByRole("link", { name, exact: false }).first();
      const box = await cta.boundingBox();
      expect((box?.y ?? Infinity) + (box?.height ?? 0)).toBeLessThanOrEqual(height);
    }
    await expect(
      page.locator("[data-hero]").getByRole("link", { name: "Voir nos solutions" }),
    ).toHaveAttribute("href", "#solutions");
    await expect(page.locator("#solutions [data-tile]")).toHaveCount(6);
  });
});

test.describe("home experience after client-side navigation", () => {
  test("the 3D scene renders again when coming back to the home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("canvas.ecosystem-canvas")).toHaveAttribute("data-ready", "", {
      timeout: 10_000,
    });

    // Leave through a client-side link, then come back the same way.
    await page.locator("footer").getByRole("link", { name: "RAPS" }).first().click();
    await expect(page).toHaveURL(/\/raps$/);
    await page.locator("header").getByRole("link", { name: "Samir Money — accueil" }).click();
    await expect(page).toHaveURL(/\/$/);

    // The visible home canvas must have a live WebGL context and be drawn again.
    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const canvas = [
              ...document.querySelectorAll<HTMLCanvasElement>("canvas.ecosystem-canvas"),
            ].find((c) => c.offsetParent !== null);
            if (!canvas || !canvas.hasAttribute("data-ready")) return "not-ready";
            const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
            return gl && !gl.isContextLost() ? "live" : "lost";
          }),
        { timeout: 10_000 },
      )
      .toBe("live");
  });
});

test.describe("home experience after browser back", () => {
  test("Back restores the scene and the choreography still reveals every section", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.locator("canvas.ecosystem-canvas")).toHaveAttribute("data-ready", "", {
      timeout: 10_000,
    });
    await page.locator("footer").getByRole("link", { name: "RAPS" }).first().click();
    await expect(page).toHaveURL(/\/raps$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/$/);

    await expect
      .poll(
        () =>
          page.evaluate(() => {
            const canvas = [
              ...document.querySelectorAll<HTMLCanvasElement>("canvas.ecosystem-canvas"),
            ].find((c) => c.offsetParent !== null);
            const gl = canvas?.getContext("webgl2") ?? canvas?.getContext("webgl");
            return canvas?.hasAttribute("data-ready") && gl && !gl.isContextLost()
              ? "live"
              : "not-live";
          }),
        { timeout: 10_000 },
      )
      .toBe("live");

    const height = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y <= height; y += 500) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(80);
    }
    await page.waitForTimeout(1500);
    const hidden = await page.$$eval(
      "[data-gsap='rise']",
      (els) =>
        // $$eval yields HTMLElement | SVGElement; only HTML elements have offsetParent.
        els.filter(
          (el) =>
            el instanceof HTMLElement &&
            el.offsetParent !== null &&
            getComputedStyle(el).visibility === "hidden",
        ).length,
    );
    expect(hidden).toBe(0);
  });
});
