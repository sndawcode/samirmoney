import { expect, test } from "@playwright/test";

test.describe("mobile menu", () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test("opens on first tap, traps focus, closes with Esc and returns focus", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Menu" });
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Navigation principale" });
    await expect(dialog).toBeVisible();
    await expect(dialog.getByRole("link", { name: /Particuliers/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("closes after navigating", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Menu" }).click();
    await page.getByRole("dialog").getByRole("link", { name: /RAPS/ }).click();
    await expect(page).toHaveURL(/\/raps$/);
    await expect(page.getByRole("dialog")).toBeHidden();
  });
});

test.describe("desktop navigation", () => {
  test.skip(({ isMobile }) => isMobile, "the mega menu is desktop-only");
  test.use({ viewport: { width: 1440, height: 900 } });

  test("mega menu opens with the keyboard and lists the SamirPay products", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "Professionnels" });
    await trigger.focus();
    await page.keyboard.press("Enter");
    const menu = page.getByRole("navigation", { name: "Navigation principale" });
    await expect(menu.getByRole("link", { name: /SamirPay Web Admin/ })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(menu.getByRole("link", { name: /SamirPay Web Admin/ })).toBeHidden();
  });
});
