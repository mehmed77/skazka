"use client";

import { useQuery } from "@tanstack/react-query";

import { childTokenStore } from "./child";
import { fetchTimeCheck } from "./contentApi";

// Kunlik vaqt limiti tekshiruvi (Faza 8, §6.3 yumshoq). Chegara nuqtalarida (forest-kirish,
// dars-boshi) ishlatiladi — o'rta-o'yinda EMAS.
export function useTimeExceeded() {
  const { data, isLoading } = useQuery({
    queryKey: ["timecheck"],
    queryFn: fetchTimeCheck,
    enabled: typeof window !== "undefined" && !!childTokenStore.access,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  return { exceeded: !!data?.exceeded, isLoading };
}
