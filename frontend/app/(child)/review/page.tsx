"use client";

import { ReviewPlayer } from "@/components/games/ReviewPlayer";
import { SleepyMishka } from "@/components/SleepyMishka";
import { useTimeExceeded } from "@/lib/useTimeExceeded";

// Takrorlash sahifasi (bola zonasi) — due itemlardan SRS takrorlash sessiyasi.
export default function ReviewPage() {
  const { exceeded, isLoading } = useTimeExceeded();
  if (isLoading) return <div className="p-10 text-center text-5xl">🐻…</div>;
  if (exceeded) return <SleepyMishka />;
  return <ReviewPlayer />;
}
