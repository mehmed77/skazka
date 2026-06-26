"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Confetti } from "@/components/Confetti";
import { Mishka } from "@/components/Mishka";
import { WordVisual } from "@/components/games/WordVisual";
import { useGameFeedback } from "@/components/games/useGameFeedback";
import { shuffle } from "@/lib/games/distractors";
import { registerMechanic } from "@/lib/games/registry";
import type { MechanicProps, ResolvedItem } from "@/lib/games/types";
import { useAudio } from "@/lib/useAudio";

// «Покажи …» (TPR) — sahnada bir nechta obyekt; Mishka navbat bilan so'raydi, bola topadi.
function TopibBer({ items, onResult, onDone }: MechanicProps) {
  const { speak } = useAudio();
  const { confetti, mishka, fire } = useGameFeedback();
  const scene = useMemo(() => items.slice(0, Math.min(items.length, 4)), [items]);
  // so'rash tartibi sahnadagi obyektlardan (aralash)
  const order = useMemo(() => shuffle(scene), [scene]);
  const [round, setRound] = useState(0);
  const [locked, setLocked] = useState(false);
  const startRef = useRef(Date.now());

  const target = order[round] ?? null;
  const ask = (it: ResolvedItem | null) => it && speak(`Покажи ${it.lemma}`, "ru-RU");

  useEffect(() => {
    if (target) {
      startRef.current = Date.now();
      ask(target);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.id]);

  useEffect(() => {
    if (round >= order.length) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, order.length]);

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
    // xato → JAZO YO'Q, qayta so'raladi
  };

  return (
    <div
      className="flex flex-col items-center gap-6 p-6"
      data-game="topib_ber"
      data-target={target.lemma}
    >
      <Mishka state={mishka} size="md" />
      <button
        type="button"
        onClick={() => ask(target)}
        aria-label="Qayta so'rash"
        className="rounded-pill bg-accent/15 px-7 py-4 text-2xl active:scale-95"
      >
        🔊 …?
      </button>
      <div className="flex flex-wrap justify-center gap-4">
        {scene.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => pick(o)}
            disabled={locked}
            data-option={o.lemma}
            aria-label={o.lemma}
            className="flex h-24 w-24 items-center justify-center rounded-blob bg-card shadow-soft transition active:scale-95 hover:ring-4 hover:ring-brand-300"
          >
            <WordVisual item={o} size="sm" />
          </button>
        ))}
      </div>
      <Confetti show={confetti} />
    </div>
  );
}

registerMechanic("topib_ber", TopibBer);
export default TopibBer;
