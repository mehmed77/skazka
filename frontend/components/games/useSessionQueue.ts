"use client";

import { useMemo } from "react";

import { buildSessionQueue } from "@/lib/games/session";
import type { ResolvedItem } from "@/lib/games/types";

// Sessiya navbati hook'i — GamePlayer SHU YAGONA joydan navbat oladi (ADR-010 chegarasi).
//
// FAZA 6 ulanish nuqtasi: shu hook ICHIDA SRS due so'zlar olinadi va buildSessionQueue'ga
// uzatiladi — GamePlayer O'ZGARMAYDI:
//   const dueItems = useDueItems(childId);                 // SRS.get_due (Faza 6)
//   return useMemo(() => buildSessionQueue(newItems, dueItems), [depKey, dueItems]);
//
// depKey — barqarorlik kaliti (lesson.id + step/game indeks); lesson OBYEKT referensiga
// bog'lanmaydi → refetch'da navbat qayta aralashmaydi.
export function useSessionQueue(newItems: ResolvedItem[], depKey: string): ResolvedItem[] {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildSessionQueue(newItems), [depKey]);
}
