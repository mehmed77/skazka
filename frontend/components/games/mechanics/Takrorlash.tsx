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

const ACCEPTS: ItemType[] = ["word", "letter"]; // aralash takrorlash (word+letter)

// «Takrorlash» (mexanika #11) — aralash, FAQAT due itemlardan (ReviewPlayer beradi). Audio→bos.
// Registry plugin: GamePlayer/ReviewPlayer markaziy kodi o'zgarmaydi (ADR-012).
function Takrorlash({ items, pool, spec, ageBand, onResult, onDone }: MechanicProps) {
  const { speakName } = useAudio();
  const { confetti, mishka, fire } = useGameFeedback();
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

  useEffect(() => {
    if (target) {
      startRef.current = Date.now();
      speakName(itemLabel(target), target.audio_url);
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
  };

  return (
    <div
      className="flex flex-col items-center gap-6 p-6"
      data-game="takrorlash"
      data-target={itemLabel(target)}
    >
      <Mishka state={mishka} size="md" />
      <button
        type="button"
        onClick={() => speakName(itemLabel(target), target.audio_url)}
        aria-label="Qayta eshitish"
        className="rounded-pill bg-success/15 px-7 py-4 text-4xl active:scale-95"
      >
        ♻️🔊
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
            className="flex h-28 w-28 items-center justify-center rounded-blob bg-card shadow-soft ring-4 ring-transparent transition active:scale-95 hover:ring-success/50"
          >
            <WordVisual item={opt} size="md" />
          </button>
        ))}
      </div>
      <Confetti show={confetti} />
    </div>
  );
}

registerMechanic("takrorlash", Takrorlash, ACCEPTS);
export default Takrorlash;
