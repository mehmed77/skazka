"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Confetti } from "@/components/Confetti";
import { Mishka } from "@/components/Mishka";
import { WordVisual } from "@/components/games/WordVisual";
import { useGameFeedback } from "@/components/games/useGameFeedback";
import { buildOptions, optionCountForAge } from "@/lib/games/distractors";
import { registerMechanic } from "@/lib/games/registry";
import { itemLabel, type ItemType, type MechanicProps, type ResolvedItem } from "@/lib/games/types";
import { useAudio } from "@/lib/useAudio";

const ACCEPTS: ItemType[] = ["letter"];

// «Какой звук?» (RESEPTIV, fonetika) — tovush yangraydi → bola to'g'ri harfni tanlaydi.
// Rus FONETIK afzalligi (1 harf ≈ 1 tovush) — shuni o'rgatadi.
function QaysiTovush({ items: rawItems, pool, spec, ageBand, onResult, onDone }: MechanicProps) {
  const { speak, speakName } = useAudio();
  const { confetti, mishka, fire } = useGameFeedback();
  const items = useMemo(() => rawItems.filter((i) => (ACCEPTS as string[]).includes(i.type)), [rawItems]);
  const [round, setRound] = useState(0);
  const [locked, setLocked] = useState(false);
  const startRef = useRef(Date.now());

  const target = items[round] ?? null;
  const optionCount = optionCountForAge(ageBand, (spec.schema?.option_count as number[]) ?? [2, 4]);
  const options = useMemo(
    () => (target ? buildOptions(target, pool, optionCount, true) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target?.id, optionCount]
  );

  // tovushni yangratish: jonli audio bo'lsa o'shani, bo'lmasa harf nomini (TTS)
  const playSound = (it: ResolvedItem) => speakName(itemLabel(it), it.audio_url);

  useEffect(() => {
    if (target) {
      startRef.current = Date.now();
      playSound(target);
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
    if (correct) speak(itemLabel(opt), "ru-RU"); // tanlangan harf nomi
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
  };

  return (
    <div
      className="flex flex-col items-center gap-6 p-6"
      data-game="qaysi_tovush"
      data-target={itemLabel(target)}
    >
      <Mishka state={mishka} size="md" />
      <button
        type="button"
        onClick={() => playSound(target)}
        aria-label="Tovushni qayta eshitish"
        className="rounded-pill bg-accent/15 px-7 py-4 text-3xl active:scale-95"
      >
        🔉 ?
      </button>
      <div className="grid grid-cols-2 gap-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => pick(opt)}
            disabled={locked}
            data-option={itemLabel(opt)}
            aria-label={itemLabel(opt)}
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

registerMechanic("qaysi_tovush", QaysiTovush, ACCEPTS);
export default QaysiTovush;
