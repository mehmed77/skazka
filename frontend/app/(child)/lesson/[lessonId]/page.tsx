"use client";

import { useParams } from "next/navigation";

import { GamePlayer } from "@/components/games/GamePlayer";
import { SleepyMishka } from "@/components/SleepyMishka";
import { useTimeExceeded } from "@/lib/useTimeExceeded";

// Dars o'ynash sahifasi (bola zonasi) — GamePlayer (intro→practice→mastery→natija).
// Vaqt limiti dars-BOSHIDA tekshiriladi (yumshoq, §6.3) — GamePlayer o'zgarmaydi.
export default function LessonPlayPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const { exceeded, isLoading } = useTimeExceeded();
  if (isLoading) return <div className="p-10 text-center text-5xl">🐻…</div>;
  if (exceeded) return <SleepyMishka />;
  return <GamePlayer lessonId={lessonId} />;
}
