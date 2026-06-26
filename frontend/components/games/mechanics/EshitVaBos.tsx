"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Confetti } from "@/components/Confetti";
import { Mishka } from "@/components/Mishka";
import { WordVisual } from "@/components/games/WordVisual";
import { useGameFeedback } from "@/components/games/useGameFeedback";
import { buildOptions, optionCountForAge } from "@/lib/games/distractors";
import { registerMechanic } from "@/lib/games/registry";
import type { MechanicProps, ResolvedItem } from "@/lib/games/types";
import { useAudio } from "@/lib/useAudio";

// «Слушай и нажми» — audio yangraydi, bola to'g'ri rasmni bosadi. Distraktor §4.4.
function EshitVaBos({ items, pool, spec, ageBand, onResult, onDone }: MechanicProps) {
  const { speakName } = useAudio();
  const { confetti, mishka, fire } = useGameFeedback();
  const [round, setRound] = useState(0);
  const [locked, setLocked] = useState(false);
  const startRef = useRef(Date.now());

  const target = items[round] ?? null;
  const optionCount = optionCountForAge(ageBand, (spec.schema?.option_count as number[]) ?? [2, 4]);
  const options = useMemo(
    () =>
      target
        ? buildOptions(target, pool, optionCount, spec.distractors?.exclude_confusable ?? true)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target?.id, optionCount]
  );

  useEffect(() => {
    if (target) {
      startRef.current = Date.now();
      speakName(target.lemma, target.audio_url);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.id]);

  useEffect(() => {
    if (round >= items.length) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, items.length]);

  if (!target) return null;

  const pick = (opt: ResolvedItem) => {
    if (locked) return;
    const correct = opt.id === target.id;
    fire(correct);
    onResult({
      itemId: target.id,
      itemType: target.type,
      correct,
      latencyMs: Date.now() - startRef.current,
      hintUsed: false,
    });
    if (correct) {
      setLocked(true);
      setTimeout(() => {
        setLocked(false);
        setRound((r) => r + 1);
      }, 1300);
    }
    // xato → JAZO YO'Q, qayta urinish (round o'zgarmaydi)
  };

  return (
    <div
      className="flex flex-col items-center gap-6 p-6"
      data-game="eshit_va_bos"
      data-target={target.lemma}
    >
      <Mishka state={mishka} size="md" />
      <button
        type="button"
        onClick={() => speakName(target.lemma, target.audio_url)}
        aria-label="Qayta eshitish"
        className="rounded-pill bg-accent/15 px-7 py-4 text-4xl active:scale-95"
      >
        🔊
      </button>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => pick(opt)}
            disabled={locked}
            data-option={opt.lemma}
            aria-label={opt.lemma}
            className="flex h-28 w-28 items-center justify-center rounded-blob bg-card shadow-soft ring-4 ring-transparent transition active:scale-95 hover:ring-brand-300"
          >
            <WordVisual item={opt} size="md" />
          </button>
        ))}
      </div>
      <Confetti show={confetti} />
    </div>
  );
}

registerMechanic("eshit_va_bos", EshitVaBos);
export default EshitVaBos;
