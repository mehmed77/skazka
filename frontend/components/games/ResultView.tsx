"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Confetti } from "@/components/Confetti";
import { Mishka } from "@/components/Mishka";
import { Button } from "@/components/ui";
import { useAudio } from "@/lib/useAudio";

// Natija — Mishka celebrate + konfetti + yulduz + yana/uyga (jazo yo'q, doim ijobiy).
export function ResultView({
  correct,
  total,
  onReplay,
  onHome,
}: {
  correct: number;
  total: number;
  onReplay: () => void;
  onHome: () => void;
}) {
  const { playCue } = useAudio();
  const t = useTranslations("lesson");
  useEffect(() => {
    playCue("correct");
  }, [playCue]);

  const stars = total ? Math.max(1, Math.round((correct / total) * 3)) : 3;

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 text-center"
      data-phase="result"
    >
      <Confetti show />
      <Mishka state="celebrate" size="xl" />
      <div className="text-5xl" aria-label={`${stars} yulduz`}>
        {"⭐".repeat(stars)}
      </div>
      <p className="text-2xl font-bold text-brand-700">{t("done")}</p>
      <div className="flex gap-4">
        <Button size="lg" onClick={onReplay} aria-label={t("again")}>
          🔄
        </Button>
        <Button size="lg" variant="accent" onClick={onHome} aria-label={t("home")}>
          🏠
        </Button>
      </div>
    </div>
  );
}
