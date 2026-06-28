"use client";

import { useEffect, useRef, useState } from "react";

import { Mishka } from "@/components/Mishka";
import { WordVisual } from "@/components/games/WordVisual";
import { Button } from "@/components/ui";
import { cn } from "@/lib/cn";
import { registerMechanic } from "@/lib/games/registry";
import { type ItemType, type MechanicProps, type ResolvedItem } from "@/lib/games/types";
import { recordExposure } from "@/lib/learningEvents";
import { useAudio } from "@/lib/useAudio";

const ACCEPTS: ItemType[] = ["word"];
const LINE_MS = 2600; // har satr taxminan (real qo'shiq audiosi tushganda timing'ga moslanadi)

// «Песенка» (ko'p sezgili, RESEPTIV-exposure) — lyrics satrlari ketma-ket yangraydi + so'z HIGHLIGHT.
// Audio = ASSET SLOT (real qo'shiq keyin; hozir TTS placeholder). Exposure = intro kabi (Faza 6):
// so'z ItemState'ga kiradi, strength OSHMAYDI (passiv tinglash tanishtiradi, retrieval mustahkamlaydi).
function Qoshiq({ spec, onDone }: MechanicProps) {
  const { speak, speakName, stop } = useAudio();
  const song = spec.song ?? null;
  const lines = song?.lyrics_json ?? [];
  const words: ResolvedItem[] = song?.words ?? [];
  const [active, setActive] = useState(-1); // joriy yorqin satr
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Exposure (intro kabi) — so'zlar SRS'ga kiradi, strength oshmaydi (passiv)
  useEffect(() => {
    words.forEach((w) => recordExposure({ id: w.id, type: w.type }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song?.id]);

  useEffect(() => {
    if (!song) onDone(); // qo'shiqsiz — boshi-berk emas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [song]);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
      stop();
    },
    [stop]
  );

  if (!song) return null;

  const wordFor = (wid?: string) => words.find((w) => w.id === wid) ?? null;

  const playFrom = (i: number) => {
    if (i >= lines.length) {
      setActive(-1);
      return;
    }
    setActive(i);
    const l = lines[i];
    if (song.audio_url && i === 0) speakName("", song.audio_url); // real qo'shiq (kelajak)
    else speak(l.text, "ru-RU"); // TTS placeholder
    timer.current = setTimeout(() => playFrom(i + 1), LINE_MS);
  };
  const start = () => {
    if (timer.current) clearTimeout(timer.current);
    playFrom(0);
  };

  return (
    <div className="flex flex-col items-center gap-5 p-6" data-game="qoshiq">
      <Mishka state={active >= 0 ? "cheer" : "idle"} size="lg" />
      <button
        type="button"
        onClick={start}
        aria-label="Kuylash"
        className="rounded-pill bg-accent/15 px-7 py-4 text-3xl active:scale-95"
      >
        🎵 ▶️
      </button>

      {/* Lyrics — MATNSIZ (§7): so'z EMOJI/rasm asosiy vizual + highlight (audio+vizual sinxron).
          Matn (l.text) faqat TTS + a11y (aria-label/data) — bola o'qiy olmaydi, ko'rinadigan matn yo'q. */}
      <div className="flex flex-col items-center gap-2" data-lyrics>
        {lines.map((l, i) => {
          const w = wordFor(l.word_id);
          return (
            <div
              key={i}
              data-line={i}
              data-active={active === i}
              aria-label={l.text}
              data-line-text={l.text}
              className={cn(
                "flex items-center justify-center rounded-blob px-4 py-2 transition",
                active === i ? "scale-125 bg-accent/25" : "opacity-60"
              )}
            >
              {w ? <WordVisual item={w} size="md" /> : <span className="text-4xl">🎵</span>}
            </div>
          );
        })}
      </div>

      {/* Bola istalgan vaqtda tugatadi (jazo yo'q, passiv tinglash) */}
      <Button size="lg" variant="accent" onClick={onDone} aria-label="Tugatish">
        ✓
      </Button>
    </div>
  );
}

registerMechanic("qoshiq", Qoshiq, ACCEPTS);
export default Qoshiq;
