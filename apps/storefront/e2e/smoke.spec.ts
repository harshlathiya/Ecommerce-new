import { test, expect } from "@playwright/test";

test("home loads or shows store setup", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: /products|choose your store/i })
  ).toBeVisible({ timeout: 15000 });
});
