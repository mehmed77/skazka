"use client";

import { useParams } from "next/navigation";

import { GamePlayer } from "@/components/games/GamePlayer";

// Dars o'ynash sahifasi (bola zonasi) — GamePlayer (intro→practice→mastery→natija).
export default function LessonPlayPage() {
  const { lessonId } = useParams<{ lessonId: string }>();
  return <GamePlayer lessonId={lessonId} />;
}
