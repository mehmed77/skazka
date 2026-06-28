import { expect, test } from "@playwright/test";

import { autoPlayLesson, enterChild, gotoLessonByTheme } from "./helpers";

// Faza 8 — geymifikatsiya (o'rmonni jonlantirish) + ota-ona paneli (REAL SRS).

test("mukofot o'rmonni boyitadi + ota-ona paneli REAL SRS rivojini ko'rsatadi", async ({
  page,
}) => {
  test.setTimeout(200_000);
  await enterChild(page, { childName: "Olim", ageBand: "6-7" });

  // Hayvonlar SO'Z darsini to'liq o'ynash → so'zlar o'zlashtiriladi → mukofot ochiladi
  await gotoLessonByTheme(page, "animals_home", 1);
  await autoPlayLesson(page);
  await expect(page.locator('[data-phase="result"]')).toBeVisible();

  // Natija ekrani — Mishka celebrate (yangi do'st bo'lishi mumkin, timing'ga bog'liq)
  await page.getByLabel("Uyga").click();
  await expect(page).toHaveURL(/\/forest/);

  // Event'lar sync bo'lib ulgursin → o'rmon dunyosi (ochilgan bezaklar) ko'rinadi
  await page.waitForTimeout(1200);
  await page.reload();
  await expect(page.locator("[data-forest-world]")).toBeVisible();

  // ── Ota-ona paneli (parent zona — parent JWT, REAL SRS) ──
  await page.goto("/profiles");
  await page.getByRole("link", { name: /Rivoj/ }).first().click();
  await expect(page).toHaveURL(/\/children\//);
  await expect(page.getByText("So'zlar")).toBeVisible(); // parent.words
  await expect(page.getByText("Mavzular")).toBeVisible(); // parent.themes
  // REAL SRS: Hayvonlar mavzusi "tugadi" (autoPlay o'zlashtirdi)
  await expect(page.getByText("tugadi").first()).toBeVisible();
});
