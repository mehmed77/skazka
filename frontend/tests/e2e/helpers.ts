import { expect, type Page } from "@playwright/test";

// Bola sessiyasi: register → profil → enter → /forest.
// speechSynthesis stub (audio-birinchi spy): window.__spoke = aytilgan matnlar.
export async function enterChild(
  page: Page,
  opts: { childName?: string; ageBand?: string } = {},
) {
  const childName = opts.childName ?? "Olim";
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
  if (opts.ageBand) {
    await page.getByRole("button", { name: opts.ageBand, exact: true }).click();
  }
  await page.getByRole("button", { name: "Yaratish" }).click();
  await page.getByRole("button", { name: new RegExp(childName) }).click();
  await expect(page).toHaveURL(/\/forest/);
}

// Bola-kontekst token bilan curriculum'dan mavzu darsiga TO'G'RIDAN o'tish (qulflangan bo'lsa ham —
// lesson endpoint lineer emas, faqat age tekshiradi). Harf/so'z_qur darslarini sinash uchun.
export async function gotoLessonByTheme(page: Page, themeKey: string, order = 1) {
  const token = await page.evaluate(() => localStorage.getItem("skazka_child_access"));
  const res = await page.request.get("http://localhost:8080/api/v1/curriculum/", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  let lessonId: string | undefined;
  for (const level of data.levels ?? []) {
    for (const theme of level.themes ?? []) {
      if (theme.key === themeKey) lessonId = theme.lessons?.[order - 1]?.id;
    }
  }
  if (!lessonId) throw new Error(`lesson topilmadi: ${themeKey}#${order}`);
  await page.goto(`/lesson/${lessonId}`);
}

// Joriy mexanikani avtomatik o'ynab natijaga yetkazadi (barcha mexanika turlari).
export async function autoPlayLesson(page: Page) {
  for (let guard = 0; guard < 120; guard++) {
    if (await page.locator('[data-phase="result"]').count()) return;

    if (await page.locator('[data-phase="intro"]').count()) {
      await page.getByLabel("Boshlash").click();
      await page.waitForTimeout(150);
      continue;
    }

    // Tanlov mexanikalari (audio/tovush → to'g'ri variant): data-option == data-target
    const pick = page.locator(
      '[data-game="eshit_va_bos"], [data-game="topib_ber"], [data-game="harf_ovi"], [data-game="qaysi_tovush"], [data-game="takrorlash"]',
    );
    if (await pick.count()) {
      const target = await pick.first().getAttribute("data-target");
      await page.locator(`[data-option="${target}"]`).first().click();
      await page.waitForTimeout(1450);
      continue;
    }

    // sehrli_ertak: narration → "Davom etish"; comprehension gate → to'g'ri so'z (data-target)
    if (await page.locator('[data-game="sehrli_ertak"]').count()) {
      const target = await page.locator('[data-game="sehrli_ertak"]').first().getAttribute("data-target");
      if (target) {
        await page.locator(`[data-option="${target}"]`).first().click();
        await page.waitForTimeout(1450);
      } else {
        await page.getByLabel("Davom etish").click();
        await page.waitForTimeout(300);
      }
      continue;
    }

    // qoshiq: passiv tinglash → "Tugatish" (✓)
    if (await page.locator('[data-game="qoshiq"]').count()) {
      await page.getByLabel("Tugatish").click();
      await page.waitForTimeout(400);
      continue;
    }

    // harf_chiz: kontur ustida chizish (bir nechta shtrix → yetarli qoplanish)
    if (await page.locator('[data-game="harf_chiz"]').count()) {
      const box = await page.locator("[data-trace-canvas]").first().boundingBox();
      if (box) {
        for (let row = 1; row <= 6; row++) {
          const y = box.y + (box.height * row) / 7;
          await page.mouse.move(box.x + 12, y);
          await page.mouse.down();
          await page.mouse.move(box.x + box.width - 12, y, { steps: 8 });
          await page.mouse.up();
        }
      }
      await page.waitForTimeout(1450);
      continue;
    }

    // soz_qur: harflarni so'z tartibida bosish
    if (await page.locator('[data-game="soz_qur"]').count()) {
      const target =
        (await page.locator('[data-game="soz_qur"]').first().getAttribute("data-target")) || "";
      for (const ch of target.split("")) {
        await page.locator(`[data-tile="${ch}"]:not([disabled])`).first().click();
        await page.waitForTimeout(220);
      }
      await page.waitForTimeout(1500);
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
          await page.waitForTimeout(350);
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
