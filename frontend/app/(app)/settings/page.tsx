"use client";

import { useTranslations } from "next-intl";

import { ParentGate } from "@/components/ParentGate";

// Sozlamalar — Parent Gate ortida (bola tasodifan kira olmaydi, SPEC §7.4).
export default function SettingsPage() {
  const t = useTranslations("nav");
  return (
    <ParentGate>
      <div className="rounded-blob bg-card p-6 shadow-soft">
        <h1 className="text-2xl font-bold text-brand-700">⚙️ {t("settings")}</h1>
        <p className="mt-3 text-muted-foreground">
          Vaqt cheklovi, hisobot, profil boshqaruvi — Faza 8'da.
        </p>
      </div>
    </ParentGate>
  );
}
