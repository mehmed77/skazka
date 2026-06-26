"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Button } from "@/components/ui";
import { avatarEmoji } from "@/lib/avatars";
import { useChild } from "@/lib/child";
import { useAudio } from "@/lib/useAudio";

// Bola-kontekst stub (enter'dan keyin). Haqiqiy o'yin qobig'i — Faza 4.
export default function PlayPage() {
  const t = useTranslations("play");
  const router = useRouter();
  const { child, exit } = useChild();
  const { speak } = useAudio();

  useEffect(() => {
    if (!child) {
      router.replace("/profiles");
      return;
    }
    speak(`Привет, ${child.display_name}!`, "ru-RU");
  }, [child, router, speak]);

  if (!child) return null;

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <div className="animate-bounce-soft text-8xl">{avatarEmoji(child.avatar_id)}</div>
      <h1 className="text-3xl font-extrabold text-brand-700">
        {t("hi", { name: child.display_name })}
      </h1>
      <p className="text-muted-foreground">{t("soon")}</p>
      <Button
        size="md"
        variant="ghost"
        onClick={() => {
          exit();
          router.replace("/profiles");
        }}
      >
        {t("exit")}
      </Button>
    </div>
  );
}
