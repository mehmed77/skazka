import { expect, test } from "@playwright/test";

import { autoPlayLesson, enterChild, gotoLessonByTheme } from "./helpers";

// Faza 9 — sehrli ertak + qo'shiq (Hayvonlar mavzusi ICHIDA) + dars-tanlovchi.

test("sehrli ertak: narration + comprehension gate (§4.4) → keyingi sahna → natija", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await enterChild(page, { childName: "Aziz", ageBand: "6-7" });
  await gotoLessonByTheme(page, "animals_home", 2); // ertak darsi (Hayvonlar order 2)
  await expect(page.locator('[data-game="sehrli_ertak"]')).toBeVisible();
  await autoPlayLesson(page); // narration→davom, gate→to'g'ri so'z
  await expect(page.locator('[data-phase="result"]')).toBeVisible();
});

test("qo'shiq: lyrics highlight + exposure → tugatish → natija", async ({ page }) => {
  test.setTimeout(60_000);
  await enterChild(page, { childName: "Aziz", ageBand: "6-7" });
  await gotoLessonByTheme(page, "animals_home", 3); // qo'shiq darsi (Hayvonlar order 3)
  await expect(page.locator('[data-game="qoshiq"]')).toBeVisible();
  await expect(page.locator("[data-lyrics]")).toBeVisible();
  await page.getByLabel("Tugatish").click(); // passiv tinglash → istalgan vaqtda tugatish
  await expect(page.locator('[data-phase="result"]')).toBeVisible();
});

test("dars-tanlovchi: Hayvonlar (>1 dars) → so'z + ertak + qo'shiq ikonalari", async ({ page }) => {
  await enterChild(page, { childName: "Aziz", ageBand: "6-7" });
  await page.getByRole("button", { name: /Hayvonlar/ }).click();
  // >1 dars → dars-tanlovchi (BottomSheet) — Faza 9
  await expect(page.locator('[data-lesson-kind="word"]')).toBeVisible();
  await expect(page.locator('[data-lesson-kind="story"]')).toBeVisible();
  await expect(page.locator('[data-lesson-kind="song"]')).toBeVisible();
  await page.locator('[data-lesson-kind="story"]').click();
  await expect(page).toHaveURL(/\/lesson\//);
  await expect(page.locator('[data-game="sehrli_ertak"]')).toBeVisible();
});
