import { expect, test } from "@playwright/test";

// Skeleton smoke: asosiy sahifa ochiladi va SKAZKA brendi ko'rinadi.
test("bosh sahifa ochiladi", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "SKAZKA" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Boshlash" })).toBeVisible();
});
