import { expect, test } from "@playwright/test";

import { autoPlayLesson, enterChild } from "./helpers";

// Faza 5 — o'yin dvigateli: oqim, §4.4 distraktor, option_count, feedback, onResult.

async function startHayvonlar(page: import("@playwright/test").Page) {
  await enterChild(page);
  await page.getByRole("button", { name: /Hayvonlar/ }).click();
  // Hayvonlar endi ko'p-darsli (so'z + qo'shiq) → dars-tanlovchi; so'z darsini tanlaymiz (Faza 9)
  await page.locator('[data-lesson-kind="word"]').first().click();
  await expect(page).toHaveURL(/\/lesson\/[0-9a-f-]+/);
  await expect(page.locator('[data-phase="intro"]')).toBeVisible();
  await page.getByLabel("Boshlash").click();
}

test("dars to'liq o'ynaladi: intro → 3 mexanika → mastery → natija (REAL kontent)", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await startHayvonlar(page);
  await autoPlayLesson(page);
  await expect(page.locator('[data-phase="result"]')).toBeVisible();
  await expect(page.locator('[data-mishka-state="celebrate"]')).toBeVisible();
  await expect(page.getByLabel("Yana")).toBeVisible(); // qayta o'ynash
  await expect(page.getByLabel("Uyga")).toBeVisible(); // xaritaga
});

test("eshit_va_bos: option_count age_band (3-4→2) + §4.4 confusable istisno (кошка↛коза)", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await startHayvonlar(page);
  const game = page.locator('[data-game="eshit_va_bos"]');
  await expect(game).toBeVisible();
  // option_count: 3-4 bola → 2 variant (schema [2,4] dan tanlanadi)
  await expect(page.locator("[data-option]")).toHaveCount(2);

  let sawKoshka = false;
  for (let i = 0; i < 8; i++) {
    if (!(await game.count())) break; // eshit_va_bos tugadi → keyingi mexanika
    const target = await game.first().getAttribute("data-target");
    if (target === "кошка") {
      sawKoshka = true;
      // §4.4: confusable juft (коза) distraktor sifatida CHIQMAYDI
      await expect(page.locator('[data-option="коза"]')).toHaveCount(0);
    }
    await page.locator(`[data-option="${target}"]`).first().click();
    await page.waitForTimeout(1450);
  }
  expect(sawKoshka).toBeTruthy(); // кошка round haqiqatan ko'rildi (assertion ishladi)
});

test("to'g'ri javob → konfetti + Mishka cheer (Faza 4 feedback)", async ({ page }) => {
  await startHayvonlar(page);
  const game = page.locator('[data-game="eshit_va_bos"]');
  await expect(game).toBeVisible();
  const target = await game.getAttribute("data-target");
  await page.locator(`[data-option="${target}"]`).click();
  await expect(page.locator("[data-confetti]")).toBeVisible();
  await expect(page.locator('[data-mishka-state="cheer"]')).toBeVisible();
});

test("xato javob → JAZO YO'Q, o'sha topshiriq qoladi (qayta imkon)", async ({ page }) => {
  await startHayvonlar(page);
  const game = page.locator('[data-game="eshit_va_bos"]');
  await expect(game).toBeVisible();
  const target = await game.getAttribute("data-target");
  await page.locator(`[data-option]:not([data-option="${target}"])`).first().click();
  await expect(page.locator('[data-mishka-state="think"]')).toBeVisible();
  // round o'zgarmaydi — qayta imkon (jazo yo'q)
  await expect(game).toHaveAttribute("data-target", target!);
});

test("onResult → POST /learning/event/ (idempotent outbox sync, Faza 6)", async ({ page }) => {
  await startHayvonlar(page);
  const game = page.locator('[data-game="eshit_va_bos"]');
  await expect(game).toBeVisible();
  const target = await game.getAttribute("data-target");
  // javob → event backend'ga yuboriladi (outbox sync)
  const [resp] = await Promise.all([
    page.waitForResponse(
      (r) => r.url().includes("/learning/event/") && r.request().method() === "POST"
    ),
    page.locator(`[data-option="${target}"]`).click(),
  ]);
  expect(resp.status()).toBe(200);
});
