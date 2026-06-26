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

type Card = { key: string; item: ResolvedItem; kind: "image" | "audio" };

// «Juftla» (memory) — rasm↔audio juftlarini ochish. Ochilgan audio karta nomini yangratadi.
function Juftla({ items, spec, onResult, onDone }: MechanicProps) {
  const { speakName } = useAudio();
  const { confetti, mishka, fire } = useGameFeedback();

  // grid schema'dan ([4,6] → juftlar soni); kichik mavzu → graceful
  const pairRange = (spec.schema?.grid as number[]) ?? [4, 6];
  const maxPairs = Math.floor((pairRange[1] ?? 6) / 2);
  const chosen = useMemo(() => items.slice(0, Math.min(items.length, maxPairs, 3)), [items, maxPairs]);

  const cards = useMemo<Card[]>(
    () =>
      shuffle(
        chosen.flatMap((it) => [
          { key: `${it.id}-i`, item: it, kind: "image" as const },
          { key: `${it.id}-a`, item: it, kind: "audio" as const },
        ])
      ),
    [chosen]
  );
  const totalPairs = chosen.length;

  const [flipped, setFlipped] = useState<string[]>([]);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [locked, setLocked] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    // bo'sh holat (totalPairs=0) ham yakunlaydi — qardosh mexanikalar konvensiyasi (boshi-berk emas)
    if (totalPairs === 0 || matched.size === totalPairs) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matched, totalPairs]);

  const flip = (card: Card) => {
    if (locked || matched.has(card.item.id) || flipped.includes(card.key)) return;
    if (card.kind === "audio") speakName(card.item.lemma, card.item.audio_url);
    const next = [...flipped, card.key];
    setFlipped(next);
    if (next.length === 2) {
      setLocked(true);
      const [a, b] = next.map((k) => cards.find((c) => c.key === k)!);
      const correct = a.item.id === b.item.id && a.kind !== b.kind;
      fire(correct);
      onResult({
        itemId: a.item.id,
        itemType: a.item.type,
        correct,
        latencyMs: Date.now() - startRef.current,
        hintUsed: false,
      });
      setTimeout(() => {
        if (correct) setMatched((m) => new Set(m).add(a.item.id));
        setFlipped([]);
        setLocked(false);
        startRef.current = Date.now();
      }, 1100);
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 p-6" data-game="juftla">
      <Mishka state={mishka} size="sm" />
      <div className="grid grid-cols-3 gap-3">
        {cards.map((card) => {
          const up = flipped.includes(card.key) || matched.has(card.item.id);
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => flip(card)}
              disabled={locked || matched.has(card.item.id)}
              data-card={card.item.lemma}
              data-kind={card.kind}
              data-up={up}
              className="flex h-20 w-20 items-center justify-center rounded-xl2 bg-card text-3xl shadow-soft active:scale-95 disabled:opacity-70"
            >
              {up ? card.kind === "image" ? <WordVisual item={card.item} size="sm" /> : "🔊" : "❔"}
            </button>
          );
        })}
      </div>
      <Confetti show={confetti} />
    </div>
  );
}

registerMechanic("juftla", Juftla);
export default Juftla;
