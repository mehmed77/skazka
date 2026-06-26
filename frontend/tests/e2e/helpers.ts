import { expect, type Page } from "@playwright/test";

// Bola sessiyasi: register → profil (default age_band 3-4) → enter → /forest.
// speechSynthesis stub (audio-birinchi spy): window.__spoke = aytilgan matnlar.
export async function enterChild(page: Page, childName = "Olim") {
  // Parallel worker'lar to'qnashmasin → tasodifiy 7 raqam (valid Beeline prefiks 90)
  const phone = "+99890" + Math.floor(Math.random() * 1e7).toString().padStart(7, "0");
  await page.addInitScript(() => {
    (window as any).__spoke = [];
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
  await page.getByPlaceholder("Ism").fill(childName);
  await page.getByRole("button", { name: "Yaratish" }).click();
  await page.getByRole("button", { name: new RegExp(childName) }).click();
  await expect(page).toHaveURL(/\/forest/);
}

// Joriy mexanikani avtomatik o'ynab natijaga yetkazadi (to'g'ri variantni bosadi).
export async function autoPlayLesson(page: Page) {
  for (let guard = 0; guard < 80; guard++) {
    if (await page.locator('[data-phase="result"]').count()) return;

    if (await page.locator('[data-phase="intro"]').count()) {
      await page.getByLabel("Boshlash").click();
      await page.waitForTimeout(150);
      continue;
    }

    const pick = page.locator('[data-game="eshit_va_bos"], [data-game="topib_ber"]');
    if (await pick.count()) {
      const target = await pick.first().getAttribute("data-target");
      await page.locator(`[data-option="${target}"]`).first().click();
      await page.waitForTimeout(1450);
      continue;
    }

    if (await page.locator('[data-game="juftla"]').count()) {
      const lemmas: string[] = await page
        .locator("[data-card]")
        .evaluateAll((els) => [...new Set(els.map((e) => e.getAttribute("data-card") || ""))]);
      for (const l of lemmas) {
        const img = page.locator(`[data-card="${l}"][data-kind="image"]`);
        const aud = page.locator(`[data-card="${l}"][data-kind="audio"]`);
        if ((await img.count()) && (await aud.count())) {
          await img.first().click();
          await page.waitForTimeout(350); // birinchi karta render bo'lsin (race oldini olish)
          await aud.first().click();
          await page.waitForTimeout(1250);
        }
      }
      continue;
    }
    await page.waitForTimeout(250);
  }
  throw new Error("autoPlayLesson: natijaga yetmadi");
}
