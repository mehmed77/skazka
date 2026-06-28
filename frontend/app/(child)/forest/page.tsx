"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Mishka } from "@/components/Mishka";
import { BottomSheet } from "@/components/ui";
import { childTokenStore } from "@/lib/child";
import { cn } from "@/lib/cn";
import { fetchCurriculum, fetchDue, fetchForest } from "@/lib/contentApi";
import { useLocale } from "@/lib/locale";
import type { CurriculumTheme, ThemeStatus } from "@/lib/types";
import { useAudio } from "@/lib/useAudio";
import { useTimeExceeded } from "@/lib/useTimeExceeded";

// Status — RANG + IKONA (rang yagona ma'no tashuvchi emas, rang-ko'r xavfsiz)
const STATUS: Record<ThemeStatus, { icon: string; ring: string; bg: string }> = {
  locked: { icon: "🔒", ring: "ring-status-locked/50", bg: "bg-muted" },
  available: { icon: "✨", ring: "ring-status-available/60", bg: "bg-brand-100" },
  started: { icon: "▶️", ring: "ring-status-started/60", bg: "bg-accent/15" },
  done: { icon: "⭐", ring: "ring-status-done/60", bg: "bg-success/15" },
};

// Dars turi → ikona (dars-tanlovchi; matnsiz + nom audio bilan)
const LESSON_ICON: Record<string, string> = {
  word: "📚",
  letter: "🔤",
  word_build: "✍️",
  story: "📖",
  song: "🎵",
};

function themeStatus(theme: CurriculumTheme): ThemeStatus {
  const st = (theme.lessons || []).map((l) => l.progress?.status);
  if (!st.length) return "available";
  if (st.every((s) => s === "done")) return "done";
  if (st.some((s) => s === "started")) return "started";
  if (st.every((s) => s === "locked")) return "locked";
  return "available"; // Faza 6 (SRS/rivoj) real holatlarni to'ldiradi
}

export default function ForestPage() {
  const t = useTranslations("forest");
  const tr = useTranslations("review");
  const tRew = useTranslations("reward");
  const router = useRouter();
  const reduce = useReducedMotion();
  const locale = useLocale((s) => s.locale);
  const { playCue, speakName } = useAudio();
  const [pickerTheme, setPickerTheme] = useState<CurriculumTheme | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !childTokenStore.access) {
      router.replace("/profiles");
    }
  }, [router]);

  const { data, isLoading } = useQuery({
    queryKey: ["curriculum"],
    queryFn: fetchCurriculum,
    enabled: typeof window !== "undefined" && !!childTokenStore.access,
  });

  // Takrorlash uchun muddati kelgan (due) itemlar soni — Faza 6 (SRS)
  const { data: session } = useQuery({
    queryKey: ["session-due"],
    queryFn: fetchDue,
    enabled: typeof window !== "undefined" && !!childTokenStore.access,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: false,
  });
  const dueCount = session?.count ?? 0;

  // O'rmon dunyosi (Faza 8) — ochilgan bezaklar + Mishka buyumlari ("yaxshidan ajoyibga")
  const { data: forest } = useQuery({
    queryKey: ["gamification-forest"],
    queryFn: fetchForest,
    enabled: typeof window !== "undefined" && !!childTokenStore.access,
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
  const { exceeded } = useTimeExceeded();

  useEffect(() => {
    if (data) playCue("enter_map"); // ovozli ko'rsatma (audio-birinchi)
  }, [data, playCue]);

  const pick = (uz: string, ru: string) => (locale === "ru" ? ru || uz : uz);

  const openTheme = (theme: CurriculumTheme, status: ThemeStatus) => {
    const title = pick(theme.title_uz, theme.title_ru);
    speakName(title); // element bosilganda nomi yangraydi
    if (status === "locked") {
      playCue("locked");
      return;
    }
    const lessons = theme.lessons ?? [];
    if (lessons.length === 0) {
      playCue("soon"); // hali dars yo'q
      return;
    }
    if (lessons.length === 1) {
      router.push(`/lesson/${lessons[0].id}`);
      return;
    }
    setPickerTheme(theme); // >1 dars → dars-tanlovchi (so'z/ertak/qo'shiq) — Faza 9
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-b from-forest/15 via-background to-background pb-16">
      {/* Mishka yo'lboshchi + ovozli "uy" sarlavhasi (matnsiz bola zonasi: ikona+ovoz) */}
      <header className="flex flex-col items-center gap-2 pt-6">
        <Mishka state="idle" size="lg" />
        <button
          type="button"
          onClick={() => playCue("enter_map")}
          aria-label={t("title")}
          className="rounded-pill bg-forest/15 px-5 py-2 text-lg font-extrabold text-forest"
        >
          🌲 {t("title")}
        </button>
        {/* Takrorlash (SRS) — muddati kelgan so'zlar bo'lsa ko'rinadi (Faza 6) */}
        {dueCount > 0 && (
          <button
            type="button"
            onClick={() => {
              speakName(tr("title"));
              router.push("/review");
            }}
            aria-label={tr("title")}
            data-review-cta
            className="mt-1 flex items-center gap-2 rounded-pill bg-success/20 px-5 py-2 text-lg font-extrabold text-foreground active:scale-95"
          >
            ♻️ <span className="text-base">{dueCount}</span>
          </button>
        )}

        {/* Jonlangan o'rmon (Faza 8) — ochilgan bezaklar + Mishka buyumlari ("yaxshidan ajoyibga") */}
        {forest && (forest.mishka.length > 0 || forest.elements.length > 0) && (
          <div
            data-forest-world
            className="mt-2 flex max-w-md flex-wrap items-center justify-center gap-2 px-4 text-3xl"
          >
            {forest.mishka.map((m) => (
              <span key={m.key} role="img" aria-label={pick(m.title_uz, m.title_ru)} title={pick(m.title_uz, m.title_ru)}>
                {m.asset}
              </span>
            ))}
            {forest.elements.map((e) => (
              <span key={e.key} role="img" aria-label={pick(e.title_uz, e.title_ru)} title={pick(e.title_uz, e.title_ru)}>
                {e.asset}
              </span>
            ))}
          </div>
        )}

        {/* Yumshoq vaqt-limit bildirgisi — world ko'rinadi, faqat darsga kirish gate'lanadi (§6.3) */}
        {exceeded && (
          <p
            data-sleepy-banner
            className="mt-1 rounded-pill bg-muted px-4 py-1 text-sm text-muted-foreground"
          >
            💤 {tRew("sleepyShort")}
          </p>
        )}
      </header>

      {isLoading && (
        <p className="mt-10 text-center text-muted-foreground">{t("loading")}</p>
      )}
      {data && data.levels.length === 0 && (
        <p className="mt-10 text-center text-muted-foreground">{t("empty")}</p>
      )}

      {data?.levels.map((level) => (
        <section key={level.id} className="mx-auto mt-8 max-w-md px-4">
          <h2 className="mb-4 text-center text-sm font-bold uppercase tracking-wide text-forest-deep">
            🌳 {t("section", { n: level.order })}
          </h2>
          {/* O'rmon yo'li — zigzag to'xtash joylari, ulanuvchi punktir chiziq */}
          <ol className="relative flex flex-col gap-6 border-l-4 border-dashed border-path/70 pl-2">
            {level.themes.map((theme, idx) => {
              const status = themeStatus(theme);
              const s = STATUS[status];
              const title = pick(theme.title_uz, theme.title_ru);
              return (
                <motion.li
                  key={theme.id}
                  className={cn("flex", idx % 2 ? "justify-end" : "justify-start")}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: reduce ? 0 : idx * 0.06 }}
                >
                  <button
                    type="button"
                    onClick={() => openTheme(theme, status)}
                    aria-label={`${title} — ${status}`}
                    className={cn(
                      "flex w-40 flex-col items-center gap-1 rounded-blob p-4 shadow-soft ring-4 transition active:scale-95",
                      s.bg, s.ring,
                      status === "locked" ? "opacity-70" : "hover:scale-105"
                    )}
                  >
                    <span className="relative text-5xl">
                      {theme.icon || "🌲"}
                      <span aria-hidden className="absolute -right-2 -top-2 text-2xl">
                        {s.icon}
                      </span>
                    </span>
                    <span className="text-center text-base font-bold leading-tight">{title}</span>
                  </button>
                </motion.li>
              );
            })}
          </ol>
        </section>
      ))}

      {/* Dars-tanlovchi (>1 dars: so'z / ertak / qo'shiq) — Faza 9 (matnsiz ikona + nom audio) */}
      <BottomSheet open={!!pickerTheme} onClose={() => setPickerTheme(null)}>
        {pickerTheme && (
          <div className="space-y-3">
            <h2 className="text-center text-lg font-extrabold text-brand-700">
              {pick(pickerTheme.title_uz, pickerTheme.title_ru)}
            </h2>
            <div className="flex flex-col gap-2">
              {(pickerTheme.lessons ?? []).map((l) => (
                <button
                  key={l.id}
                  type="button"
                  data-lesson-kind={l.kind}
                  onClick={() => {
                    speakName(pick(l.title_uz, l.title_ru));
                    router.push(`/lesson/${l.id}`);
                  }}
                  className="flex items-center gap-3 rounded-blob bg-card p-4 shadow-soft transition active:scale-95 hover:scale-105"
                >
                  <span className="text-3xl">{LESSON_ICON[l.kind] ?? "📚"}</span>
                  <span className="text-base font-bold leading-tight">
                    {pick(l.title_uz, l.title_ru)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
