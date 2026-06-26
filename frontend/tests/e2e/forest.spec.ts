import { expect, test, type Page } from "@playwright/test";

// Bola: register → profil → enter → o'rmon xaritasi (REAL curriculum). Audio/Mishka/stub.

async function enterChild(page: Page) {
  const phone = "+99892" + Date.now().toString().slice(-7);
  // speechSynthesis stub (audio-birinchi spy)
  await page.addInitScript(() => {
    (window as any).__spoke = [];
    // window.speechSynthesis read-only — defineProperty kerak
    Object.defineProperty(window, "speechSynthesis", {
      configurable: true,
      value: {
        speak: (u: any) => (window as any).__spoke.push(u && u.text),
        cancel: () => {},
        getVoices: () => [],
      },
    });
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      configurable: true,
      writable: true,
      value: function (this: any, t: string) {
        this.text = t;
      },
    });
  });
  await page.goto("/register");
  await page.getByPlaceholder("Ismingiz").fill("Ota-ona");
  await page.getByPlaceholder("Telefon", { exact: true }).fill(phone);
  await page.getByPlaceholder("Parol").fill("Str0ngPass9");
  await page.getByRole("button", { name: "Ro'yxatdan o'tish" }).click();
  await expect(page).toHaveURL(/\/profiles/);
  await page.getByRole("button", { name: "Yangi profil" }).click();
  await page.getByPlaceholder("Ism").fill("Olim");
  await page.getByRole("button", { name: "Yaratish" }).click();
  await page.getByRole("button", { name: /Olim/ }).click();
  await expect(page).toHaveURL(/\/forest/);
}

test("o'rmon xaritasi REAL curriculum'dan quriladi + Mishka idle", async ({ page }) => {
  await enterChild(page);
  // Seed mavzulari (Faza 2 seed_content) ko'rinadi — mock emas
  await expect(page.getByRole("button", { name: /Hayvonlar/ })).toBeVisible();
  await expect(page.getByRole("button", { name: /Ranglar/ })).toBeVisible();
  await expect(page.locator('[data-mishka-state="idle"]')).toBeVisible();
});

test("Theme bosilsa → stub ekran + audio chaqiriladi (audio-birinchi)", async ({ page }) => {
  await enterChild(page);
  await page.getByRole("button", { name: /Hayvonlar/ }).click();
  await expect(page).toHaveURL(/\/forest\/[0-9a-f-]+/);
  await expect(page.getByText("Tez orada Mishka bilan o'ynaymiz!")).toBeVisible();
  await expect(page.locator('[data-mishka-state="celebrate"]')).toBeVisible();
  // useAudio: element bosilganda ovoz chaqirilgan
  const spoke = await page.evaluate(() => (window as any).__spoke || []);
  expect(spoke.length).toBeGreaterThan(0);
  // orqaga → o'rmon
  await page.getByRole("button", { name: "Orqaga" }).click();
  await expect(page).toHaveURL(/\/forest$/);
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
