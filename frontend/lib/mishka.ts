// Mishka maskot — ASSET SLOT manifesti (KOD ≠ ASSET).
// Hozir: placeholder emoji + animatsiya. Kelajakda haqiqiy Pixar-vari render
// (Lottie/sprite/video) shu manifestga `lottie`/`sprite`/`video` qo'shilib tushadi —
// Mishka komponenti KODI o'zgarmaydi.

export type MishkaState = "idle" | "cheer" | "think" | "celebrate";

export type MishkaAsset = {
  placeholder: string; // emoji (vaqtinchalik)
  badge: string; // placeholder bezak (haqiqiy render tushganda yo'qoladi)
  anim: string; // tailwind animatsiya klassi (placeholder uchun)
  label: string; // a11y + audio nomi
  // ── Kelajak asset slotlari (to'ldirilsa, placeholder o'rniga ishlatiladi) ──
  lottie?: string;
  sprite?: string;
  video?: string;
};

export const MISHKA_MANIFEST: Record<MishkaState, MishkaAsset> = {
  idle: { placeholder: "🐻", badge: "", anim: "animate-float", label: "Mishka" },
  cheer: { placeholder: "🐻", badge: "✨", anim: "animate-bounce-soft", label: "Mishka quvonmoqda" },
  think: { placeholder: "🐻", badge: "💭", anim: "", label: "Mishka o'ylamoqda" },
  celebrate: { placeholder: "🐻", badge: "🎉", anim: "animate-wiggle", label: "Mishka bayram qilmoqda" },
};

// Asset tayyormi? (kelajak render tushsa true bo'ladi — komponent shunga qarab tanlaydi)
export const hasRealAsset = (s: MishkaState): boolean => {
  const a = MISHKA_MANIFEST[s];
  return Boolean(a.lottie || a.sprite || a.video);
};
