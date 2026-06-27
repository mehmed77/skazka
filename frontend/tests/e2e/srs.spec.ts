import { expect, test } from "@playwright/test";

import { autoPlayLesson, enterChild } from "./helpers";

// Faza 6 — ko'rinmas SRS: lineer progress (xaritada mavzu ochilishi) + takrorlash sahifasi.

test("progress LINEER: boshida Ranglar qulf; Hayvonlar o'ynalsa 'done' va Ranglar ochiladi", async ({
  page,
}) => {
  test.setTimeout(150_000);
  await enterChild(page);

  // Boshida (lineer): 1-mavzu ochiq, 2-mavzu (Ranglar) QULF
  await expect(page.getByRole("button", { name: /Ranglar — locked/ })).toBeVisible();

  // Hayvonlar darsini to'liq o'ynash (autoPlay → barcha javob to'g'ri)
  await page.getByRole("button", { name: /Hayvonlar/ }).click();
  await expect(page).toHaveURL(/\/lesson\/[0-9a-f-]+/);
  await autoPlayLesson(page);
  await expect(page.locator('[data-phase="result"]')).toBeVisible();
  await page.getByLabel("Uyga").click();
  await expect(page).toHaveURL(/\/forest/);

  // outbox (fire-and-forget) sync bo'lib ulgursin, so'ng yangi curriculum fetch (reload)
  await page.waitForTimeout(1000);
  await page.reload();

  // REAL progress: Hayvonlar 'done', Ranglar endi 'available' (lineer ochildi)
  // (mavzu nomi "Hayvonlar (uy)" — .* bilan moslaymiz)
  await expect(page.getByRole("button", { name: /Hayvonlar.*— done/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Ranglar — available/ })).toBeVisible();
});

test("takrorlash sahifasi: due yo'q bola uchun bo'sh holat (Faza 6)", async ({ page }) => {
  await enterChild(page);
  await page.goto("/review");
  await expect(page.locator('[data-review="empty"]')).toBeVisible();
  await page.getByLabel("Uyga").click();
  await expect(page).toHaveURL(/\/forest/);
});
