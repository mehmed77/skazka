// Audio-birinchi yordamchi (SPEC §7.1). Bola o'qiy olmaydi → har element ovoz bilan.
// Bitta-ovoz: yangi ovoz oldingisini to'xtatadi. Graceful: audio bo'lmasa UI bloklanmaydi.
"use client";

import { useCallback } from "react";

import { UI_AUDIO, UI_CUE_TEXT, type UiCue } from "./uiAudio";

let _current: HTMLAudioElement | null = null;

function _stop() {
  try {
    if (_current) {
      _current.pause();
      _current = null;
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  } catch {
    /* graceful */
  }
}

export function useAudio() {
  const speak = useCallback((text: string, lang = "ru-RU") => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !text) return;
    try {
      _stop();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = lang;
      u.rate = 0.9;
      window.speechSynthesis.speak(u);
    } catch {
      /* graceful */
    }
  }, []);

  const playUrl = useCallback((url: string) => {
    if (typeof window === "undefined" || !url) return;
    try {
      _stop();
      const a = new Audio(url);
      _current = a;
      a.play().catch(() => {});
    } catch {
      /* graceful */
    }
  }, []);

  // UI cue — jonli audio bor bo'lsa o'shani, yo'q bo'lsa matn fallback
  const playCue = useCallback(
    (cue: UiCue) => {
      const url = UI_AUDIO[cue];
      if (url) playUrl(url);
      else speak(UI_CUE_TEXT[cue]);
    },
    [playUrl, speak]
  );

  // Element bosilganda nomi yangraydi (kontent audiosi bo'lsa url, bo'lmasa matn)
  const speakName = useCallback(
    (name: string, audioUrl?: string | null, lang = "ru-RU") => {
      if (audioUrl) playUrl(audioUrl);
      else speak(name, lang);
    },
    [playUrl, speak]
  );

  return { speak, playUrl, playCue, speakName, stop: _stop };
}
