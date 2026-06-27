"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Confetti } from "@/components/Confetti";
import { Mishka } from "@/components/Mishka";
import { Button } from "@/components/ui";
import { fetchForest, markForestSeen } from "@/lib/contentApi";
import { flushOutbox } from "@/lib/learningEvents";
import { useLocale } from "@/lib/locale";
import { useAudio } from "@/lib/useAudio";

// Natija — Mishka celebrate + konfetti + yulduz + yana/uyga (jazo yo'q, doim ijobiy).
// Faza 8: yangi mukofot ochilsa "🌳 yangi do'st!" (alohida query → evaluate + recent).
export function ResultView({
  correct,
  total,
  onReplay,
  onHome,
}: {
  correct: number;
  total: number;
  onReplay: () => void;
  onHome: () => void;
}) {
  const { playCue, speak } = useAudio();
  const t = useTranslations("lesson");
  const tRew = useTranslations("reward");
  const locale = useLocale((s) => s.locale);
  const pick = (uz: string, ru: string) => (locale === "ru" ? ru || uz : uz);
  const qc = useQueryClient();

  // Avval oxirgi javob event'lari sync bo'lsin (outbox flush) — keyin forest GET evaluate qilsin.
  // Aks holda yangi o'zlashtirilgan so'z hali backend ItemState'ga yetmay "yangi do'st" o'tkazib yuboriladi.
  const [syncReady, setSyncReady] = useState(false);
  useEffect(() => {
    flushOutbox().finally(() => setSyncReady(true));
  }, []);

  // Dars tugadi → evaluate_rewards (gamification GET, read-only) → yangi ochilganlar (recent)
  const { data: forest } = useQuery({
    queryKey: ["gamification-result"],
    queryFn: fetchForest,
    enabled: syncReady,
    staleTime: 0,
  });
  const recent = forest?.recent ?? [];

  useEffect(() => {
    playCue("correct");
  }, [playCue]);

  useEffect(() => {
    if (recent.length) {
      speak("Новый друг в твоём лесу!", "ru-RU"); // ovozli (matnsiz)
      void markForestSeen(); // "ko'rildi" ack (GET endi belgilamaydi → idempotent)
      qc.invalidateQueries({ queryKey: ["gamification-forest"] }); // xarita dunyosi yangilanadi
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recent.length]);

  const stars = total ? Math.max(1, Math.round((correct / total) * 3)) : 3;

  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-6 p-6 text-center"
      data-phase="result"
    >
      <Confetti show />
      <Mishka state="celebrate" size="xl" />
      <div className="text-5xl" aria-label={`${stars} yulduz`}>
        {"⭐".repeat(stars)}
      </div>
      <p className="text-2xl font-bold text-brand-700">{t("done")}</p>

      {/* Yangi mukofot ochildi — o'rmoning boyidi (Faza 8) */}
      {recent.length > 0 && (
        <div data-new-reward className="flex flex-col items-center gap-1">
          <p className="text-lg font-bold text-forest">🌳 {tRew("newFriend")}</p>
          <div className="flex flex-wrap justify-center gap-2 text-4xl">
            {recent.map((r, i) => (
              <span key={i} role="img" aria-label={pick(r.title_uz, r.title_ru)}>
                {r.asset}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <Button size="lg" onClick={onReplay} aria-label={t("again")}>
          🔄
        </Button>
        <Button size="lg" variant="accent" onClick={onHome} aria-label={t("home")}>
          🏠
        </Button>
      </div>
    </div>
  );
}
