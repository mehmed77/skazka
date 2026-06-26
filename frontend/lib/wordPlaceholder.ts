// So'z vizuali — PLACEHOLDER (asset slot). image_url (real rasm) bo'lsa o'shani; bo'lmasa
// emoji. Haqiqiy illyustratsiyalar — kontent ishlab chiqarish (kod o'zgarmaydi).
export const WORD_EMOJI: Record<string, string> = {
  // Hayvonlar (uy)
  "кошка": "🐱",
  "собака": "🐶",
  "корова": "🐄",
  "лошадь": "🐴",
  "коза": "🐐",
  "свинья": "🐷",
  // Ranglar
  "красный": "🟥",
  "синий": "🟦",
  "зелёный": "🟩",
  "жёлтый": "🟨",
  "белый": "⬜",
  "чёрный": "⬛",
};

export const wordEmoji = (lemma: string): string => WORD_EMOJI[lemma] ?? "🔵";
