"use client";

import { useCallback, useRef, useState } from "react";

import type { MishkaState } from "@/lib/mishka";
import { useAudio } from "@/lib/useAudio";

// O'yin feedback'i (Faza 4 komponentlari): to'g'ri→cheer+confetti+ovoz; xato→think (JAZO YO'Q).
export function useGameFeedback() {
  const { playCue } = useAudio();
  const [confetti, setConfetti] = useState(false);
  const [mishka, setMishka] = useState<MishkaState>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fire = useCallback(
    (correct: boolean) => {
      if (timer.current) clearTimeout(timer.current);
      if (correct) {
        setConfetti(true);
        setMishka("cheer");
        playCue("correct");
      } else {
        setMishka("think");
        playCue("wrong");
      }
      timer.current = setTimeout(() => {
        setConfetti(false);
        setMishka("idle");
      }, 1300);
    },
    [playCue]
  );

  return { confetti, mishka, fire };
}
