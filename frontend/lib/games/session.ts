// Sessiya navbati — Faza 6 kontrakti (ADR-010). Hozir due=[]; Faza 6 SRS due so'zlarni
// qo'shadi, GamePlayer O'ZGARMAYDI. Semantik interferensiya: confusable so'zlar yonma-yon emas.
import { shuffle } from "./distractors";
import type { ResolvedItem } from "./types";

function avoidConfusableAdjacency(items: ResolvedItem[]): ResolvedItem[] {
  const out: ResolvedItem[] = [];
  const rest = [...items];
  while (rest.length) {
    const prev = out[out.length - 1];
    let idx = rest.findIndex(
      (it) =>
        !prev ||
        !((prev.confusable_ids ?? []).includes(it.id) || (it.confusable_ids ?? []).includes(prev.id)),
    );
    if (idx === -1) idx = 0; // iloji bo'lmasa — boribir qo'shamiz (graceful)
    out.push(rest.splice(idx, 1)[0]);
  }
  return out;
}

function interleave(due: ResolvedItem[], next: ResolvedItem[]): ResolvedItem[] {
  const out: ResolvedItem[] = [];
  const max = Math.max(due.length, next.length);
  for (let i = 0; i < max; i++) {
    if (i < due.length) out.push(due[i]);
    if (i < next.length) out.push(next[i]);
  }
  return out;
}

// Faza 6: dueItems = SRS.get_due(child). Hozir bo'sh → faqat dars so'zlari (aralashtirilgan).
export function buildSessionQueue(
  newItems: ResolvedItem[],
  dueItems: ResolvedItem[] = [],
): ResolvedItem[] {
  const merged = dueItems.length ? interleave(dueItems, newItems) : shuffle(newItems);
  return avoidConfusableAdjacency(merged);
}
