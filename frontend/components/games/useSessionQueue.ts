"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { childTokenStore } from "@/lib/child";
import { fetchDue } from "@/lib/contentApi";
import { buildSessionQueue } from "@/lib/games/session";
import type { ResolvedItem } from "@/lib/games/types";

// Sessiya navbati hook'i — GamePlayer SHU YAGONA joydan navbat oladi (ADR-010 chegarasi).
// Faza 6: SRS due so'zlar GET /learning/session/ dan olinadi va buildSessionQueue'ga uzatiladi
// (interleave + §4.4 confusable-adjacency shu qatlamda). GamePlayer O'ZGARMAYDI.
// depKey — barqarorlik kaliti (lesson.id + step/game) → refetch'da qayta aralashmaydi.
export function useSessionQueue(newItems: ResolvedItem[], depKey: string): ResolvedItem[] {
  const { data } = useQuery({
    queryKey: ["session-due"],
    queryFn: fetchDue,
    enabled: typeof window !== "undefined" && !!childTokenStore.access,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const due = data?.due ?? [];
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useMemo(() => buildSessionQueue(newItems, due), [depKey, due.length]);
}
