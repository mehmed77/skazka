// UI tili (next-intl) — Zustand'da, localStorage'ga saqlanadi. Default: o'zbek.
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Locale = "uz" | "ru";

type LocaleState = { locale: Locale; setLocale: (l: Locale) => void };

export const useLocale = create<LocaleState>()(
  persist((set) => ({ locale: "uz", setLocale: (locale) => set({ locale }) }), {
    name: "skazka_locale",
  })
);
