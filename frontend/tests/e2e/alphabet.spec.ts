import { expect, test } from "@playwright/test";

import { autoPlayLesson, enterChild, gotoLessonByTheme } from "./helpers";

// Faza 7 — Trek A: kirill alifbo/fonetika mexanikalari (harf_ovi, qaysi_tovush, harf_chiz, soz_qur).

test("harf darsi to'liq o'ynaladi: harf_ovi + qaysi_tovush + harf_chiz → natija", async ({
  page,
}) => {
  test.setTimeout(200_000);
  await enterChild(page, { childName: "Aziz", ageBand: "6-7" });
  await gotoLessonByTheme(page, "alphabet", 1); // 1-dars: harf mexanikalari
  await expect(page.locator('[data-phase="intro"]')).toBeVisible();
  // intro harflari (matnsiz — katta char)
  await expect(page.locator("[data-intro-item]").first()).toBeVisible();
  // autoPlay: harf_ovi/qaysi_tovush (tanlov) + harf_chiz (chizish — yumshoq qoplanish)
  await autoPlayLesson(page);
  await expect(page.locator('[data-phase="result"]')).toBeVisible();
  await expect(page.locator('[data-mishka-state="celebrate"]')).toBeVisible();
});

test("so'z qurish (soz_qur, ekspressiv): harflarni tartibga solib so'z quradi", async ({ page }) => {
  test.setTimeout(120_000);
  await enterChild(page, { childName: "Aziz", ageBand: "6-7" });
  await gotoLessonByTheme(page, "alphabet", 2); // 2-dars: so'z qurish
  await expect(page.locator('[data-phase="intro"]')).toBeVisible();
  await page.getByLabel("Boshlash").click();

  const game = page.locator('[data-game="soz_qur"]');
  await expect(game).toBeVisible();
  const target = (await game.getAttribute("data-target")) || "";
  expect(target.length).toBeGreaterThan(0);
  // harflarni so'z tartibida joylashtirish
  for (const ch of target.split("")) {
    await page.locator(`[data-tile="${ch}"]:not([disabled])`).first().click();
    await page.waitForTimeout(220);
  }
  // to'g'ri yig'ildi → konfetti (Mishka cheer)
  await expect(page.locator("[data-confetti]")).toBeVisible();
});

test("harf_chiz: kontur qoplanmasa qabul qilinmaydi (yumshoq, lekin bo'sh emas)", async ({
  page,
}) => {
  test.setTimeout(120_000);
  await enterChild(page, { childName: "Aziz", ageBand: "6-7" });
  await gotoLessonByTheme(page, "alphabet", 1);
  await page.getByLabel("Boshlash").click();
  // harf_chiz'gacha tanlov mexanikalarini avtomatik o'tamiz
  for (let i = 0; i < 40; i++) {
    if (await page.locator('[data-game="harf_chiz"]').count()) break;
    const pick = page.locator('[data-game="harf_ovi"], [data-game="qaysi_tovush"]');
    if (await pick.count()) {
      const t = await pick.first().getAttribute("data-target");
      await page.locator(`[data-option="${t}"]`).first().click();
      await page.waitForTimeout(1450);
    } else {
      await page.waitForTimeout(250);
    }
  }
  const chiz = page.locator('[data-game="harf_chiz"]').first();
  await expect(chiz).toBeVisible();
  // hech narsa chizmasdan — keyingi harfga o'tmaydi (target o'zgarmaydi)
  const before = await chiz.getAttribute("data-target");
  await page.waitForTimeout(800);
  await expect(page.locator('[data-game="harf_chiz"]').first()).toHaveAttribute(
    "data-target",
    before!,
  );
});
