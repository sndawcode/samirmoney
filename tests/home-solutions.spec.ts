import { expect, test } from "@playwright/test";

test("solution tiles 01–05 open on the client's photos; the API tile keeps its code card", async ({
  page,
}) => {
  await page.goto("/");
  const tiles = page.locator("#solutions [data-tile]");
  await expect(tiles).toHaveCount(6);
  for (const id of ["samir-money", "tpe", "business", "web-admin", "raps"]) {
    const img = page.locator(`[data-tile][data-product="${id}"] img[src*="tile-photo-${id}"]`);
    await img.scrollIntoViewIfNeeded();
    await expect(img).toBeVisible();
  }
  await expect(page.locator('[data-tile][data-product="api"] img')).toHaveCount(0);
});
