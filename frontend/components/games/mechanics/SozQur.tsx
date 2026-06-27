"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Confetti } from "@/components/Confetti";
import { Mishka } from "@/components/Mishka";
import { useGameFeedback } from "@/components/games/useGameFeedback";
import { shuffle } from "@/lib/games/distractors";
import { registerMechanic } from "@/lib/games/registry";
import { itemLabel, type ItemType, type MechanicProps } from "@/lib/games/types";
import { useAudio } from "@/lib/useAudio";

const ACCEPTS: ItemType[] = ["word"];
type Tile = { id: number; ch: string };

// «Собери слово» (EKSPRESSIV) — so'z HARFLARI aralash beriladi → bola to'g'ri tartibda joylashtiradi
// (tap-ketma-ketlik). Segmentatsiya yo'q — lemma'dan harflar (Qaror 2). To'g'ri → audio.
function SozQur({ items: rawItems, onResult, onDone }: MechanicProps) {
  const { speak, speakName } = useAudio();
  const { confetti, mishka, fire } = useGameFeedback();
  const items = useMemo(() => rawItems.filter((i) => (ACCEPTS as string[]).includes(i.type)), [rawItems]);
  const [round, setRound] = useState(0);
  const [placed, setPlaced] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const hadMistake = useRef(false);
  const startRef = useRef(Date.now());

  const target = items[round] ?? null;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const expected = useMemo(() => (target ? itemLabel(target).split("") : []), [target?.id]);
  const tiles = useMemo<Tile[]>(
    () => shuffle(expected.map((ch, i) => ({ id: i, ch }))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target?.id]
  );

  useEffect(() => {
    setPlaced([]);
    hadMistake.current = false;
    setLocked(false);
    startRef.current = Date.now();
    if (target) speakName(itemLabel(target), target.audio_url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.id]);

  useEffect(() => {
    if (round >= items.length) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, items.length]);

  if (!target) return null;

  const tap = (tile: Tile) => {
    if (locked || placed.includes(tile.id)) return;
    if (tile.ch === expected[placed.length]) {
      const next = [...placed, tile.id];
      setPlaced(next);
      speak(tile.ch, "ru-RU");
      if (next.length === expected.length) {
        setLocked(true);
        fire(true);
        speakName(itemLabel(target), target.audio_url);
        onResult({
          itemId: target.id,
          itemType: target.type,
          correct: true,
          latencyMs: Date.now() - startRef.current,
          hintUsed: hadMistake.current,
        });
        setTimeout(() => setRound((r) => r + 1), 1400);
      }
    } else {
      // Noto'g'ri tartib → JAZO YO'Q, faqat ishora (Mishka think); SRS event yozilmaydi.
      hadMistake.current = true;
      fire(false);
    }
  };

  const placedChars = placed.map((id) => tiles.find((t) => t.id === id)?.ch ?? "");

  return (
    <div
      className="flex flex-col items-center gap-6 p-6"
      data-game="soz_qur"
      data-target={itemLabel(target)}
    >
      <Mishka state={mishka} size="md" />
      <button
        type="button"
        onClick={() => speakName(itemLabel(target), target.audio_url)}
        aria-label="Eshitish"
        className="rounded-pill bg-accent/15 px-7 py-4 text-3xl active:scale-95"
      >
        🔊
      </button>
      {/* javob qatori (bo'sh kataklar to'ldiriladi) */}
      <div className="flex min-h-[4.5rem] items-center gap-2" data-answer-row>
        {expected.map((_, i) => (
          <span
            key={i}
            className="flex h-16 w-12 items-center justify-center rounded-xl2 border-4 border-dashed border-path/50 text-4xl font-extrabold text-brand-700"
          >
            {placedChars[i] ?? ""}
          </span>
        ))}
      </div>
      {/* aralash harf plitkalari */}
      <div className="flex flex-wrap justify-center gap-3">
        {tiles.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => tap(t)}
            disabled={locked || placed.includes(t.id)}
            data-tile={t.ch}
            aria-label={t.ch}
            className="flex h-16 w-14 items-center justify-center rounded-xl2 bg-card text-4xl font-extrabold text-brand-700 shadow-soft active:scale-95 disabled:opacity-30"
          >
            {t.ch}
          </button>
        ))}
      </div>
      <Confetti show={confetti} />
    </div>
  );
}

registerMechanic("soz_qur", SozQur, ACCEPTS);
export default SozQur;
