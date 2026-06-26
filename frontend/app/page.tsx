"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { Button } from "@/components/ui";
import { tokenStore } from "@/lib/api";

// SKAZKA boshlang'ich (welcome). Kirgan ota-ona bo'lsa → profillar.
export default function Home() {
  const t = useTranslations("common");
  const router = useRouter();

  useEffect(() => {
    if (tokenStore.access) router.replace("/profiles");
  }, [router]);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-brand-50 to-background px-6 text-center">
      <div className="absolute right-4 top-4">
        <LanguageToggle />
      </div>

      <div className="animate-bounce-soft text-8xl" role="img" aria-label="Mishka ayiqcha">
        🐻
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight text-brand-700">SKAZKA</h1>
        <p className="text-lg text-muted-foreground">
          Mishka bilan rus tilini o'yin orqali o'rganamiz
        </p>
      </div>

      <Button size="lg" onClick={() => router.push("/login")}>
        {t("start")}
      </Button>
    </main>
  );
}
