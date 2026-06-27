// Distraktor (chalg'ituvchi) tanlash — §4.4. FRONTEND'da (lesson javobida confusable + pool bor).
import type { AgeBand } from "@/lib/types";

import type { ResolvedItem } from "./types";

const AGE_OPTION: Record<AgeBand, number> = { "3-4": 2, "5-6": 3, "6-7": 4 };

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Variantlar soni: age_band bo'yicha, schema [min,max] diapazoniga clamp (config'da QOTIRILMAGAN).
export function optionCountForAge(ageBand: AgeBand, range: number[] = [2, 4]): number {
  const want = AGE_OPTION[ageBand] ?? 2;
  const [min, max] = [range[0] ?? 2, range[1] ?? 4];
  return Math.min(Math.max(want, min), max);
}

// To'g'ri + distraktorlar (aralashtirilgan). confusable §4.4 istisno; graceful (kamida 2).
export function buildOptions(
  target: ResolvedItem,
  pool: ResolvedItem[],
  optionCount: number,
  excludeConfusable = true,
): ResolvedItem[] {
  const conf = new Set(excludeConfusable ? target.confusable_ids ?? [] : []);
  // Distraktorlar TARGET TURI bilan bir xil (so'z↔so'z, harf↔harf) — aralash navbatda ham to'g'ri
  let candidates = pool.filter(
    (i) => i.id !== target.id && i.type === target.type && !conf.has(i.id),
  );
  // Graceful 1: confusable istisno tufayli nomzod qolmasa — istisnoni bo'shat (bir xil tur).
  if (candidates.length === 0)
    candidates = pool.filter((i) => i.id !== target.id && i.type === target.type);
  // Graceful 2 (oxirgi chora — aralash review'da yagona-tur): bir xil turdagi nomzod YO'Q bo'lsa,
  // TRIVIAL bitta-variantli javob (SRS'ni soxta to'g'ri bilan buzadi) o'rniga cross-type distraktor.
  if (candidates.length === 0) candidates = pool.filter((i) => i.id !== target.id);
  const distractors = shuffle(candidates).slice(0, Math.max(1, optionCount - 1));
  return shuffle([target, ...distractors]); // ≥2 (pool'da ≥1 boshqa item bo'lsa)
}
