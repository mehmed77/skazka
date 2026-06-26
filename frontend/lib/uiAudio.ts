// UI-audio (navigatsiya/feedback ovozlari) — ASSET SLOT manifesti.
// Kontent audiosi (so'z/harf) /lesson API'dan keladi (Faza 3). Bu — UI ovozlari.
// Hozir: url=null → vaqtincha Web Speech (matn) fallback. Jonli ovoz tushganda url to'ladi.

export type UiCue =
  | "welcome"
  | "tap"
  | "correct"
  | "wrong"
  | "enter_map"
  | "locked"
  | "soon";

// cue → audio url (null = hali yo'q → speechSynthesis matn fallback)
export const UI_AUDIO: Record<UiCue, string | null> = {
  welcome: null,
  tap: null,
  correct: null,
  wrong: null,
  enter_map: null,
  locked: null,
  soon: null,
};

// Placeholder fallback matni (ru — audio url tushganda ishlatilmaydi)
export const UI_CUE_TEXT: Record<UiCue, string> = {
  welcome: "Привет! Давай играть!",
  tap: "",
  correct: "Молодец!",
  wrong: "Попробуй ещё раз",
  enter_map: "Лес!",
  locked: "Здесь пока закрыто",
  soon: "Скоро поиграем!",
};
