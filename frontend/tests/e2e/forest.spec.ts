import { expect, test } from "@playwright/test";

import { enterChild } from "./helpers";

// Bola: register → profil → enter → o'rmon xaritasi (REAL curriculum). Audio/Mishka/devor.

test("o'rmon xaritasi REAL curriculum'dan quriladi + Mishka idle", async ({ page }) => {
  await enterChild(page);
  // Seed mavzulari (Faza 2 seed_content) ko'rinadi — mock emas
  await expect(page.getByRole("button", { name: /Hayvonlar/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Ranglar/ })).toBeVisible();
  await expect(page.locator('[data-mishka-state="idle"]')).toBeVisible();
});

test("Theme → dars-tanlovchi → so'z darsi (intro) + audio (audio-birinchi)", async ({ page }) => {
  await enterChild(page);
  await page.getByRole("button", { name: /Hayvonlar/ }).click();
  // Hayvonlar >1 dars (so'z + qo'shiq) → dars-tanlovchi (Faza 9); so'z darsini tanlaymiz
  await page.locator('[data-lesson-kind="word"]').first().click();
  await expect(page).toHaveURL(/\/lesson\/[0-9a-f-]+/);
  // intro: yangi so'zlar (matnsiz, rasm/emoji) + Mishka
  await expect(page.locator('[data-phase="intro"]')).toBeVisible();
  await expect(page.locator("[data-intro-item]").first()).toBeVisible();
  // useAudio: element bosilganda ovoz chaqirilgan
  const spoke = await page.evaluate(() => (window as any).__spoke || []);
  expect(spoke.length).toBeGreaterThan(0);
});

test("reduced-motion rejimida ham xarita yuklanadi", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await enterChild(page);
  await expect(page.getByRole("button", { name: /Hayvonlar/ })).toBeVisible();
});

test("bola zonasi devor bilan o'ralgan: AppBar yo'q, 🏠→Parent Gate→chiqish", async ({ page }) => {
  await enterChild(page);
  // Ota-ona matnli AppBar YO'Q (devor bilan o'ralgan zona)
  await expect(page.getByRole("link", { name: "Sozlamalar" })).toHaveCount(0);

  // 🏠 → Parent Gate (matematik)
  await page.getByRole("button", { name: "Kattalar zonasi" }).click();
  await expect(page.getByText("Davom etish uchun misolni yeching")).toBeVisible();
  // Hali chiqish menyusi yo'q (gate yechilmagan — devor)
  await expect(page.getByRole("button", { name: "Profil almashtirish" })).toHaveCount(0);

  const q = (await page.getByText(/\d+\s*\+\s*\d+\s*=/).textContent()) || "";
  const m = q.match(/(\d+)\s*\+\s*(\d+)/)!;
  const sum = Number(m[1]) + Number(m[2]);

  // Noto'g'ri javob → chiqish menyusi CHIQMAYDI (chiqib keta olmaydi)
  await page.getByLabel("Javob").fill(String(sum + 1));
  await page.getByRole("button", { name: "Tasdiqlash" }).click();
  await expect(page.getByRole("button", { name: "Profil almashtirish" })).toHaveCount(0);

  // To'g'ri javob → kattalar menyusi
  await page.getByLabel("Javob").fill(String(sum));
  await page.getByRole("button", { name: "Tasdiqlash" }).click();
  await expect(page.getByRole("button", { name: "Profil almashtirish" })).toBeVisible();
});

test("PWA manifest mavjud", async ({ page }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href).toBeTruthy();
  const resp = await page.request.get(href!);
  expect(resp.status()).toBe(200);
  const m = await resp.json();
  expect(m.display).toBe("standalone");
});
