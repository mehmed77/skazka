"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Confetti } from "@/components/Confetti";
import { Mishka } from "@/components/Mishka";
import { WordVisual } from "@/components/games/WordVisual";
import { useGameFeedback } from "@/components/games/useGameFeedback";
import { Button } from "@/components/ui";
import { buildOptions, optionCountForAge } from "@/lib/games/distractors";
import { registerMechanic } from "@/lib/games/registry";
import { itemLabel, type ItemType, type MechanicProps, type ResolvedItem } from "@/lib/games/types";
import { useAudio } from "@/lib/useAudio";

const ACCEPTS: ItemType[] = ["word"];

// «Сказка» (TPRS, RESEPTIV) — CHIZIQLI ertak: narration sahnalar + comprehension gate (to'g'ri
// so'zni tanla → keyingi sahna; xato → qayta, jazo yo'q). Distraktor §4.4 (buildOptions qayta
// ishlatiladi — ertak qo'lda distraktor yozmaydi). Kontent spec.story'da (item emas).
function SehrliErtak({ items, pool, spec, ageBand, onResult, onDone }: MechanicProps) {
  const { speak, speakName, stop } = useAudio();
  const { confetti, mishka, fire } = useGameFeedback();
  const nodes = spec.story?.nodes ?? [];
  const distractorPool = pool.length ? pool : items;

  const [idx, setIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const startRef = useRef(Date.now());
  const advTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const node = nodes[idx] ?? null;
  const target = node?.prompt_word ?? null;
  const optionCount = optionCountForAge(ageBand, [2, 4]);
  const options = useMemo(
    () => (target ? buildOptions(target, distractorPool, optionCount, true) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [target?.id, optionCount]
  );

  const narrate = (n: typeof node) => {
    if (!n) return;
    if (n.prompt_word) {
      // comprehension gate — TARGET so'z (ru): bola ruscha so'zni eshitib topadi
      speakName(itemLabel(n.prompt_word), n.prompt_word.audio_url ?? undefined);
    } else if (n.audio_url) {
      speakName("", n.audio_url); // real narration audiosi (asset slot)
    } else if (n.text) {
      speak(n.text, "uz-UZ"); // narration = L1 (o'zbek) scaffolding — TTS placeholder
    }
  };

  useEffect(() => {
    startRef.current = Date.now();
    narrate(node);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  // unmount: davom-taymerini tozala + narration audiosini to'xtat (sahnalararo sizib chiqmasin)
  useEffect(
    () => () => {
      if (advTimer.current) clearTimeout(advTimer.current);
      stop();
    },
    [stop]
  );

  useEffect(() => {
    if (!nodes.length) onDone(); // bo'sh ertak — boshi-berk emas
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes.length]);

  useEffect(() => {
    if (nodes.length && idx >= nodes.length) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, nodes.length]);

  if (!node) return null;

  const pick = (opt: ResolvedItem) => {
    if (locked || !target) return;
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
      advTimer.current = setTimeout(() => {
        setLocked(false);
        setIdx((i) => i + 1);
      }, 1300);
    }
    // xato → JAZO YO'Q, o'sha sahnada qayta urinish
  };

  return (
    <div
      className="flex flex-col items-center gap-6 p-6"
      data-game="sehrli_ertak"
      data-node={node.order}
      data-target={target ? itemLabel(target) : ""}
    >
      <Mishka state={mishka} size="md" />

      {/* Sahna illustratsiyasi = ASSET SLOT (real rasm keyin). Hozir narration uchun emoji placeholder. */}
      {node.image_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={node.image_url}
          alt=""
          className="h-40 w-40 rounded-blob object-cover shadow-soft"
        />
      ) : !target ? (
        <div className="text-7xl" aria-hidden>
          📖
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => narrate(node)}
        aria-label="Eshitish"
        className="rounded-pill bg-accent/15 px-7 py-4 text-3xl active:scale-95"
      >
        📖🔊
      </button>

      {target ? (
        // Comprehension gate — Mishka so'raydi (audio), bola to'g'ri so'zni tanlaydi (matnsiz)
        <div className="grid grid-cols-2 gap-4" data-story-gate>
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
      ) : (
        // Narration sahnasi — davom etish
        <Button size="lg" onClick={() => setIdx((i) => i + 1)} aria-label="Davom etish">
          ▶️
        </Button>
      )}
      <Confetti show={confetti} />
    </div>
  );
}

registerMechanic("sehrli_ertak", SehrliErtak, ACCEPTS);
export default SehrliErtak;
