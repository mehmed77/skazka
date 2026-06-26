// Audio-birinchi yordamchi (SPEC §7.1). Skeleton: Web Speech API bilan ovozli ko'rsatma.
// Faza 3+ da jonli ovoz (native speaker) media MinIO'dan beriladi.
"use client";

import { useCallback } from "react";

export function useAudio() {
  const speak = useCallback((text: string, lang: string = "ru-RU") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.9;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {
      /* ovoz mavjud bo'lmasa jim o'tamiz */
    }
  }, []);

  return { speak };
}
