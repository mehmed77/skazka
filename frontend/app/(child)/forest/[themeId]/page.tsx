"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Mishka } from "@/components/Mishka";
import { Button } from "@/components/ui";
import { useAudio } from "@/lib/useAudio";

// Theme to'xtash joyi — STUB (o'yin dvigateli Faza 5). Hozir: Mishka + ovozli "tez orada".
export default function ThemeStopPage() {
  const t = useTranslations("stop");
  const router = useRouter();
  const sp = useSearchParams();
  const { playCue } = useAudio();
  const title = sp.get("t") || "";
  const icon = sp.get("i") || "🌲";

  useEffect(() => {
    playCue("soon");
  }, [playCue]);

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-6 bg-gradient-to-b from-brand-50 to-background px-6 text-center">
      <div className="text-7xl" aria-hidden>
        {icon}
      </div>
      <Mishka state="celebrate" size="lg" />
      {title && <h1 className="text-2xl font-extrabold text-brand-700">{title}</h1>}
      <p className="text-lg text-muted-foreground">{t("soon")}</p>
      <Button
        size="lg"
        variant="accent"
        onClick={() => router.push("/forest")}
        aria-label={t("back")}
      >
        🏠
      </Button>
    </main>
  );
}
