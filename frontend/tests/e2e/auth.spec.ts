import { expect, test } from "@playwright/test";

// Happy path: ota-ona ro'yxat → (avto-login) → profil yaratish → profilga kirish.
test("ota-ona ro'yxatdan o'tadi, profil yaratadi va kiradi", async ({ page }) => {
  const phone = "+99890" + Date.now().toString().slice(-7);

  await page.goto("/register");
  await page.getByPlaceholder("Ismingiz").fill("Test Ota-ona");
  await page.getByPlaceholder("Telefon", { exact: true }).fill(phone);
  await page.getByPlaceholder("Parol").fill("secret12");
  await page.getByRole("button", { name: "Ro'yxatdan o'tish" }).click();

  // /profiles ga o'tdi
  await expect(page).toHaveURL(/\/profiles/);
  await expect(page.getByText("Kim o'ynaydi?")).toBeVisible();

  // Yangi profil yaratish
  await page.getByRole("button", { name: "Yangi profil" }).click();
  await page.getByPlaceholder("Ism").fill("Olim");
  await page.getByRole("button", { name: "Yaratish" }).click();

  // Kartochka paydo bo'ldi → bosib kiramiz (PINsiz → to'g'ridan-to'g'ri /play)
  const card = page.getByRole("button", { name: /Olim/ });
  await expect(card).toBeVisible();
  await card.click();

  await expect(page).toHaveURL(/\/play/);
});
