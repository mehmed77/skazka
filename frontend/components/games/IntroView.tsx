"use client";

import { useTranslations } from "next-intl";

import { Mishka } from "@/components/Mishka";
import { WordVisual } from "@/components/games/WordVisual";
import { Button } from "@/components/ui";
import type { ResolvedItem } from "@/lib/games/types";
import { recordExposure } from "@/lib/learningEvents";
import { useAudio } from "@/lib/useAudio";

// Intro — yangi so'zlarni tanishtirish (reseptiv): rasm + tap→nomi yangraydi. Matnsiz (§7).
export function IntroView({ items, onDone }: { items: ResolvedItem[]; onDone: () => void }) {
  const { speakName } = useAudio();
  const t = useTranslations("lesson");

  // So'z intro'da KO'RILDI (exposure) → SRS'ga kiradi (ItemState yaratiladi). Faza 6.
  const start = () => {
    items.forEach((it) => recordExposure({ id: it.id, type: it.type }));
    onDone();
  };

  return (
    <div className="flex flex-col items-center gap-6 p-6" data-phase="intro">
      <Mishka state="idle" size="md" />
      <div className="grid grid-cols-3 gap-4">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            onClick={() => speakName(it.lemma, it.audio_url)}
            aria-label={it.lemma}
            data-intro-item={it.lemma}
            className="flex h-24 w-24 items-center justify-center rounded-blob bg-card shadow-soft active:scale-95"
          >
            <WordVisual item={it} size="sm" />
          </button>
        ))}
      </div>
      <Button size="lg" onClick={start} aria-label={t("start")}>
        ▶️
      </Button>
    </div>
  );
}
