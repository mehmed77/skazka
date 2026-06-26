"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import "@/components/games/mechanics"; // side-effect: mexanikalarni ro'yxatga olish
import { IntroView } from "@/components/games/IntroView";
import { ResultView } from "@/components/games/ResultView";
import { useSessionQueue } from "@/components/games/useSessionQueue";
import { useChild } from "@/lib/child";
import { fetchLesson } from "@/lib/contentApi";
import { getMechanic } from "@/lib/games/registry";
import type { AnswerResult, GameSpec, ResolvedItem } from "@/lib/games/types";
import { recordResult } from "@/lib/learningEvents";
import type { AgeBand } from "@/lib/types";

type Step = { id: string; kind: string; new_items: ResolvedItem[]; games: GameSpec[] };

// O'yin dvigateli — oqim: intro → practice → mastery → natija. Mexanikalar REGISTRY'dan
// (markaziy if/elif YO'Q). Faza 6 due so'zlarni qo'shsa — bu fayl O'ZGARMAYDI (ADR-010).
export function GamePlayer({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const child = useChild((s) => s.child);
  const ageBand = (child?.age_band ?? "3-4") as AgeBand;

  const { data: lesson, isLoading } = useQuery({
    queryKey: ["lesson", lessonId],
    queryFn: () => fetchLesson(lessonId),
    staleTime: 5 * 60 * 1000, // navbat refetch'da qayta aralashmasin (barqaror sessiya)
    refetchOnWindowFocus: false,
  });

  const [stepIdx, setStepIdx] = useState(0);
  const [gameIdx, setGameIdx] = useState(0);
  // "Jazo yo'q" (§7): yulduz xato urinishlardan EMAS — birinchi urinishda yutilgan itemlar
  // (firstTryWins) / yakunlangan itemlar (itemsDone). Xato faqat firstTry'ni o'tkazib yuboradi.
  const [firstTryWins, setFirstTryWins] = useState(0);
  const [itemsDone, setItemsDone] = useState(0);
  const pendingWrong = useRef(0); // joriy item uchun xato urinishlar (correct'da nollanadi)
  const [finished, setFinished] = useState(false);

  const steps: Step[] = lesson?.steps ?? [];
  const step = steps[stepIdx];
  const isPlay = !!step && step.kind !== "intro";
  const games = isPlay ? step.games ?? [] : [];
  const game = games[gameIdx];
  const Mechanic = game ? getMechanic(game.type) : null;

  // Sessiya navbati — har o'yin uchun barqaror. Faza 6 due+new interleave SHU hook ichida
  // ulanadi (GamePlayer o'zgarmaydi — ADR-010). depKey lesson.id ga bog'liq (obyekt ref emas).
  const sessionItems = useSessionQueue(
    isPlay && step ? step.new_items : [],
    `${lesson?.id ?? ""}:${stepIdx}:${gameIdx}`
  );

  const advanceStep = useCallback(() => {
    const next = stepIdx + 1;
    if (next >= steps.length) setFinished(true);
    else {
      setStepIdx(next);
      setGameIdx(0);
    }
  }, [stepIdx, steps.length]);

  const advanceGame = useCallback(() => {
    const next = gameIdx + 1;
    if (next >= games.length) advanceStep();
    else setGameIdx(next);
  }, [gameIdx, games.length, advanceStep]);

  // Graceful skip — boshi-berk holatlardan saqlaydi (bola zonasi matnsiz, chiqib keta olmaydi):
  //  · bo'sh play-step (games yo'q) → butun step'ni o'tkaz
  //  · ro'yxatda yo'q mexanika (Faza 7/9) → o'yinni o'tkaz
  //  · bo'sh sessiya navbati (new_items yo'q) → o'yinni o'tkaz (har mexanikani himoyalaydi)
  useEffect(() => {
    if (!isPlay) return;
    if (games.length === 0) advanceStep();
    else if (game && (!Mechanic || sessionItems.length === 0)) advanceGame();
  }, [isPlay, games.length, game, Mechanic, sessionItems.length, advanceGame, advanceStep]);

  const onResult = useCallback(
    (r: Omit<AnswerResult, "gameType">) => {
      recordResult({ ...r, gameType: game?.type ?? "" }); // Faza 6: POST /learning/event/ (BARCHA urinishlar)
      if (r.correct) {
        setItemsDone((n) => n + 1);
        if (pendingWrong.current === 0) setFirstTryWins((n) => n + 1);
        pendingWrong.current = 0; // item yakunlandi → keyingi item uchun nollanadi
      } else {
        pendingWrong.current += 1; // jazo yo'q — faqat firstTry'ni o'tkazib yuboradi
      }
    },
    [game?.type]
  );

  const replay = () => {
    setStepIdx(0);
    setGameIdx(0);
    setFirstTryWins(0);
    setItemsDone(0);
    pendingWrong.current = 0;
    setFinished(false);
  };

  if (isLoading || !lesson) {
    return <div className="p-10 text-center text-5xl" aria-label="loading">🐻…</div>;
  }
  if (finished) {
    return (
      <ResultView
        correct={firstTryWins}
        total={itemsDone}
        onReplay={replay}
        onHome={() => router.push("/forest")}
      />
    );
  }
  if (!step) return null;
  if (step.kind === "intro") return <IntroView items={step.new_items} onDone={advanceStep} />;
  if (!Mechanic) return null; // effect advanceGame qiladi

  return (
    <Mechanic
      key={`${stepIdx}-${gameIdx}`}
      items={sessionItems}
      pool={step.new_items}
      spec={game}
      ageBand={ageBand}
      onResult={onResult}
      onDone={advanceGame}
    />
  );
}
