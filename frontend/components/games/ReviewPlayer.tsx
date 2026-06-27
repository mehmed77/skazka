"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

import "@/components/games/mechanics"; // side-effect: registry (takrorlash)
import { Mishka } from "@/components/Mishka";
import { ResultView } from "@/components/games/ResultView";
import { Button } from "@/components/ui";
import { useChild } from "@/lib/child";
import { fetchDue } from "@/lib/contentApi";
import { getMechanic } from "@/lib/games/registry";
import type { AnswerResult } from "@/lib/games/types";
import { recordResult } from "@/lib/learningEvents";
import type { AgeBand } from "@/lib/types";

// Takrorlash sessiyasi — FAQAT due itemlardan (GET /learning/session/). Takrorlash mexanikasini
// (registry plugin) ishlatadi. GamePlayer'ga tegmaydi (alohida thin orkestrator).
export function ReviewPlayer() {
  const router = useRouter();
  const t = useTranslations("review");
  const child = useChild((s) => s.child);
  const ageBand = (child?.age_band ?? "3-4") as AgeBand;

  const { data, isLoading } = useQuery({
    queryKey: ["session-due"],
    queryFn: fetchDue,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const due = data?.due ?? [];

  const [firstTryWins, setFirstTryWins] = useState(0);
  const [itemsDone, setItemsDone] = useState(0);
  const pendingWrong = useRef(0);
  const [done, setDone] = useState(false);

  const Mechanic = getMechanic("takrorlash");

  const onResult = (r: Omit<AnswerResult, "gameType">) => {
    recordResult({ ...r, gameType: "takrorlash" });
    if (r.correct) {
      setItemsDone((n) => n + 1);
      if (pendingWrong.current === 0) setFirstTryWins((n) => n + 1);
      pendingWrong.current = 0;
    } else {
      pendingWrong.current += 1; // jazo yo'q
    }
  };

  if (isLoading) {
    return <div className="p-10 text-center text-5xl" aria-label="loading">🐻…</div>;
  }
  if (done) {
    return (
      <ResultView
        correct={firstTryWins}
        total={itemsDone}
        onReplay={() => router.push("/forest")}
        onHome={() => router.push("/forest")}
      />
    );
  }
  if (due.length === 0 || !Mechanic) {
    return (
      <div
        className="flex min-h-[60vh] flex-col items-center justify-center gap-5 p-6 text-center"
        data-review="empty"
      >
        <Mishka state="idle" size="xl" />
        <p className="text-xl font-bold text-brand-700">{t("empty")}</p>
        <Button size="lg" onClick={() => router.push("/forest")} aria-label={t("home")}>
          🏠
        </Button>
      </div>
    );
  }
  return (
    <Mechanic
      items={due}
      pool={due}
      spec={{ type: "takrorlash" }}
      ageBand={ageBand}
      onResult={onResult}
      onDone={() => setDone(true)}
    />
  );
}
