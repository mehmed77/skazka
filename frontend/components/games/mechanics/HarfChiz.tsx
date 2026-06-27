"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { Confetti } from "@/components/Confetti";
import { Mishka } from "@/components/Mishka";
import { useGameFeedback } from "@/components/games/useGameFeedback";
import { Button } from "@/components/ui";
import { registerMechanic } from "@/lib/games/registry";
import { itemLabel, type ItemType, type MechanicProps } from "@/lib/games/types";
import { useAudio } from "@/lib/useAudio";

const ACCEPTS: ItemType[] = ["letter"];
// ⚠️ Qoplanish ostonasi — YUMSHOQ (§6.3, perfeksionizm yo'q). 4 yosh barmog'i uchun qurilmada
// QO'LDA sozlanadi (juda qattiqmi/yumshoqmi — faqat sinab bilamiz). Bitta joyda — shu konstanta.
const TRACE_COVERAGE_THRESHOLD = 0.18;
const GRID = 8;
const SIZE = 280;

// «Обведи букву» (EKSPRESSIV, motor) — kontur ustida barmoq bilan chizish. Touch-birlamchi +
// responsive (sichqoncha ham). Yumshoq baholash: yetarli katak qoplansa qabul (kalligrafiya emas).
function HarfChiz({ items: rawItems, onResult, onDone }: MechanicProps) {
  const { speakName } = useAudio();
  const { confetti, mishka, fire } = useGameFeedback();
  const items = useMemo(() => rawItems.filter((i) => (ACCEPTS as string[]).includes(i.type)), [rawItems]);
  const [round, setRound] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const target = items[round] ?? null;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const covered = useRef<Set<number>>(new Set());
  const last = useRef<{ x: number; y: number } | null>(null);
  const startRef = useRef(Date.now());

  const clearCanvas = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (ctx) ctx.clearRect(0, 0, SIZE, SIZE);
  };

  useEffect(() => {
    covered.current = new Set();
    last.current = null;
    setAccepted(false);
    startRef.current = Date.now();
    clearCanvas();
    if (target) speakName(itemLabel(target), target.audio_url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target?.id]);

  useEffect(() => {
    if (round >= items.length) onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [round, items.length]);

  if (!target) return null;

  const toCanvas = (e: React.PointerEvent) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * SIZE, y: ((e.clientY - r.top) / r.height) * SIZE };
  };
  const mark = (x: number, y: number) => {
    const cell = GRID / SIZE;
    const cx = Math.min(GRID - 1, Math.max(0, Math.floor(x * cell)));
    const cy = Math.min(GRID - 1, Math.max(0, Math.floor(y * cell)));
    covered.current.add(cy * GRID + cx);
  };
  const down = (e: React.PointerEvent) => {
    if (accepted) return;
    drawing.current = true;
    const p = toCanvas(e);
    last.current = p;
    mark(p.x, p.y);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };
  const move = (e: React.PointerEvent) => {
    if (!drawing.current || accepted) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    const p = toCanvas(e);
    ctx.strokeStyle = "#f97316";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    if (last.current) ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    mark(p.x, p.y);
  };
  const up = () => {
    if (!drawing.current || accepted) return;
    drawing.current = false;
    last.current = null;
    const ratio = covered.current.size / (GRID * GRID);
    if (ratio >= TRACE_COVERAGE_THRESHOLD) {
      setAccepted(true);
      fire(true);
      onResult({
        itemId: target.id,
        itemType: target.type,
        correct: true,
        latencyMs: Date.now() - startRef.current,
        hintUsed: false,
      });
      setTimeout(() => setRound((r) => r + 1), 1300);
    }
  };
  const retry = () => {
    covered.current = new Set();
    last.current = null;
    clearCanvas();
  };

  return (
    <div
      className="flex flex-col items-center gap-4 p-6"
      data-game="harf_chiz"
      data-target={itemLabel(target)}
    >
      <Mishka state={mishka} size="sm" />
      <div className="relative rounded-blob bg-card shadow-soft" style={{ width: SIZE, height: SIZE }}>
        {/* yo'naltiruvchi (faint) harf + boshlanish nuqtasi (yo'nalish) */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[11rem] font-extrabold leading-none text-brand-300"
        >
          {target.char}
        </span>
        <span aria-hidden className="pointer-events-none absolute left-3 top-3 text-xl">
          🟢
        </span>
        <canvas
          ref={canvasRef}
          width={SIZE}
          height={SIZE}
          data-trace-canvas
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerLeave={up}
          onPointerCancel={up}
          className="absolute inset-0 h-full w-full touch-none rounded-blob"
        />
      </div>
      <Button size="md" variant="ghost" onClick={retry} aria-label="Qayta chizish">
        ♻️
      </Button>
      <Confetti show={confetti} />
    </div>
  );
}

registerMechanic("harf_chiz", HarfChiz, ACCEPTS);
export default HarfChiz;
