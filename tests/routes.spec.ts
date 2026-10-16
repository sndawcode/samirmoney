import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/particuliers",
  "/professionnels",
  "/raps",
  "/services",
  "/developpeurs",
  "/a-propos",
  "/contact",
  "/mentions-legales",
  "/confidentialite",
  "/cgu",
  "/suppression-de-compte",
];

for (const route of ROUTES) {
  test(`${route} renders with one H1, French lang and no horizontal scroll`, async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "fr");
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
    expect(errors).toEqual([]);
  });
}

test("unknown pages return the 404 receipt", async ({ page }) => {
  const response = await page.goto("/cette-page-n-existe-pas");
  expect(response?.status()).toBe(404);
  await expect(page.getByText("Statut", { exact: false })).toBeVisible();
});
