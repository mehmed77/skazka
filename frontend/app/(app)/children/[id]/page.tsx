"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button, Card, Input } from "@/components/ui";
import { api } from "@/lib/api";
import { useLocale } from "@/lib/locale";

type Summary = { seen: number; receptive_mastered: number; expressive_mastered: number };
type Progress = {
  words: Summary;
  letters: Summary;
  themes: { key: string; title_uz: string; title_ru: string; status: string }[];
  activity: { minutes_today: number; active_days_30: number };
  streak: { current: number; longest: number };
  difficult: { label: string; type: string; lapses: number }[];
};

const STATUS_ICON: Record<string, string> = {
  done: "⭐",
  started: "▶️",
  available: "✨",
  locked: "🔒",
};

function Bar({ value, max, label }: { value: number; max: number; label: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">
          {value}/{max}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-pill bg-muted">
        <div className="h-full rounded-pill bg-brand-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// Ota-ona paneli (parent zona, login ortida) — REAL SRS rivoji (Faza 6/7 ma'lumotini ochadi).
export default function ChildProgressPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("parent");
  const router = useRouter();
  const qc = useQueryClient();
  const locale = useLocale((s) => s.locale);
  const pick = (uz: string, ru: string) => (locale === "ru" ? ru || uz : uz);

  const { data, isLoading, isError } = useQuery<Progress>({
    queryKey: ["child-progress", id],
    queryFn: async () => (await api.get(`/profiles/${id}/progress/`)).data,
    retry: false,
  });
  const { data: profile } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => (await api.get(`/profiles/${id}/`)).data,
  });

  const [limit, setLimit] = useState("");
  const limitMut = useMutation({
    mutationFn: (val: number | null) =>
      api.patch(`/profiles/${id}/`, { daily_limit_minutes: val }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profile", id] }),
  });

  if (isError) {
    return (
      <div className="space-y-4 p-8 text-center">
        <p className="text-muted-foreground">{t("notFound")}</p>
        <Button size="md" onClick={() => router.push("/profiles")}>
          {t("back")}
        </Button>
      </div>
    );
  }
  if (isLoading || !data) {
    return <p className="p-8 text-center text-muted-foreground">…</p>;
  }

  const currentLimit = profile?.daily_limit_minutes ?? null;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-700">
          {t("title")}: {profile?.display_name ?? ""}
        </h1>
        <Button size="md" variant="ghost" onClick={() => router.push("/profiles")}>
          {t("back")}
        </Button>
      </div>

      <Card className="space-y-3">
        <h2 className="font-bold">{t("words")}</h2>
        <Bar value={data.words.receptive_mastered} max={Math.max(data.words.seen, 1)} label={t("receptive")} />
        <Bar value={data.words.expressive_mastered} max={Math.max(data.words.seen, 1)} label={t("expressive")} />
      </Card>

      <Card className="space-y-3">
        <h2 className="font-bold">{t("letters")}</h2>
        <Bar value={data.letters.receptive_mastered} max={Math.max(data.letters.seen, 1)} label={t("receptive")} />
        <Bar value={data.letters.expressive_mastered} max={Math.max(data.letters.seen, 1)} label={t("expressive")} />
      </Card>

      <Card className="space-y-2">
        <h2 className="font-bold">{t("themes")}</h2>
        <ul className="space-y-1 text-sm">
          {data.themes.map((th) => (
            <li key={th.key} className="flex items-center justify-between">
              <span>{pick(th.title_uz, th.title_ru)}</span>
              <span>
                {STATUS_ICON[th.status] ?? "•"} {t(`status_${th.status}` as never)}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-600">{data.activity.minutes_today}</p>
          <p className="text-sm text-muted-foreground">{t("minutesToday")}</p>
        </Card>
        <Card className="text-center">
          <p className="text-3xl font-bold text-brand-600">{data.streak.current}</p>
          <p className="text-sm text-muted-foreground">{t("streak")}</p>
        </Card>
      </div>

      {data.difficult.length > 0 && (
        <Card className="space-y-2">
          <h2 className="font-bold">{t("difficult")}</h2>
          <div className="flex flex-wrap gap-2">
            {data.difficult.map((d, i) => (
              <span key={i} className="rounded-pill bg-accent/15 px-3 py-1 text-sm">
                {d.label}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Kunlik vaqt limiti (yumshoq, §6.3) — ota-ona o'rnatadi */}
      <Card className="space-y-3">
        <h2 className="font-bold">{t("limitTitle")}</h2>
        <p className="text-sm text-muted-foreground">
          {currentLimit ? `${t("current")}: ${currentLimit} ${t("min")}` : t("noLimit")}
        </p>
        <div className="flex gap-2">
          <Input
            type="number"
            min={0}
            placeholder={t("minPlaceholder")}
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
          <Button
            size="md"
            onClick={() => limitMut.mutate(limit.trim() === "" ? null : Number(limit))}
            disabled={limitMut.isPending}
          >
            {t("save")}
          </Button>
        </div>
        <Button size="md" variant="ghost" onClick={() => limitMut.mutate(null)}>
          {t("removeLimit")}
        </Button>
      </Card>
    </div>
  );
}
