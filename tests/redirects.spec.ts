import { expect, test } from "@playwright/test";

// Redirects are host-dependent: request them without following (§8.4, §17).
const LEGACY = [
  ["/about-app", "/a-propos"],
  ["/contacts", "/contact"],
  ["/privacy", "/confidentialite"],
  ["/home/anything", "/"],
] as const;

test.describe("legacy redirects", () => {
  for (const [from, to] of LEGACY) {
    test(`${from} → ${to} (308)`, async ({ request }) => {
      const response = await request.get(from, { maxRedirects: 0 });
      expect(response.status()).toBe(308);
      expect(new URL(response.headers().location, "http://x").pathname).toBe(to);
    });
  }

  for (const host of ["samirpay.com", "www.samirpay.com"]) {
    test(`${host} redirects to /professionnels and the privacy policy`, async ({ request }) => {
      const home = await request.get("/", { headers: { host }, maxRedirects: 0 });
      expect(home.status()).toBe(308);
      expect(home.headers().location).toMatch(/\/professionnels$/);
      const privacy = await request.get("/politique-de-confidentialite", {
        headers: { host },
        maxRedirects: 0,
      });
      expect(privacy.headers().location).toMatch(/\/confidentialite$/);
    });
  }

  for (const path of ["/wp-login.php", "/wp-admin", "/wp-admin/edit.php", "/xmlrpc.php"]) {
    test(`${path} is gone (410)`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status()).toBe(410);
    });
  }

  test("legacy samirpay.com #contact anchor lands on the contact form", async ({ page }) => {
    await page.goto("/professionnels#contact");
    await expect(page).toHaveURL(/\/contact\?profil=commercant/);
  });
});
