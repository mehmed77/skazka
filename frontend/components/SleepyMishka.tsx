"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { Mishka } from "@/components/Mishka";
import { Button } from "@/components/ui";
import { useAudio } from "@/lib/useAudio";

// Yumshoq to'xtatish (kunlik limit yetganda) — JAZO emas (§6.3). Mishka charchadi, ertaga yana.
// Joriy o'yinni o'rtada uzmaydi: faqat chegara nuqtalarida (dars-boshi) ko'rsatiladi.
export function SleepyMishka() {
  const router = useRouter();
  const t = useTranslations("reward");
  const { speak } = useAudio();
  useEffect(() => {
    speak("Мишка устал. Поиграем завтра!", "ru-RU"); // ovozli (matnsiz bola zonasi)
  }, [speak]);

  return (
    <div
      className="flex min-h-[70vh] flex-col items-center justify-center gap-6 p-6 text-center"
      data-sleepy
    >
      <Mishka state="think" size="xl" />
      <div className="text-5xl" aria-hidden>
        💤
      </div>
      <p className="text-xl font-bold text-brand-700">{t("sleepy")}</p>
      <Button size="lg" onClick={() => router.push("/forest")} aria-label={t("home")}>
        🏠
      </Button>
    </div>
  );
}
