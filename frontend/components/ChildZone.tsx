"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { LanguageToggle } from "@/components/LanguageToggle";
import { ParentGate } from "@/components/ParentGate";
import { BottomSheet, Button } from "@/components/ui";
import { useAuth } from "@/lib/auth";
import { useChild } from "@/lib/child";

// Bola zonasi qobig'i (SPEC §7.4/§8 — "devor bilan o'ralgan bog'"). Matnli ota-ona
// boshqaruvi YO'Q. Faqat kichik 🏠 → Parent Gate (Faza 1) → kattalar menyusi.
// Gate o'tmasa — bola zonasiga qaytadi (chiqib keta olmaydi).
export function ChildZone({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const router = useRouter();
  const [gateOpen, setGateOpen] = useState(false);
  const logout = useAuth((s) => s.logout);
  const exitChild = useChild((s) => s.exit);

  const switchProfile = () => {
    exitChild();
    router.push("/profiles");
  };
  const doLogout = async () => {
    exitChild();
    await logout();
    router.replace("/login");
  };

  return (
    <div className="relative min-h-screen">
      {children}

      {/* Kichik ota-ona darvozasi — bola e'tibor tortmaydi, ota-ona topadi */}
      <button
        type="button"
        onClick={() => setGateOpen(true)}
        aria-label={t("childExit.parentArea")}
        className="fixed right-3 top-3 z-40 flex h-12 w-12 items-center justify-center rounded-pill bg-card/80 text-2xl shadow-soft backdrop-blur active:scale-95"
      >
        🏠
      </button>

      {/* Parent Gate (QAYTA ISHLATILGAN, Faza 1) — yechilsa kattalar menyusi chiqadi.
          Yopilsa / yechilmasa → bola zonasiga qaytadi (devor saqlanadi). */}
      <BottomSheet open={gateOpen} onClose={() => setGateOpen(false)}>
        <ParentGate>
          <div className="space-y-4 text-center">
            <h2 className="text-xl font-bold text-brand-700">{t("childExit.title")}</h2>
            <Button size="md" className="w-full" onClick={switchProfile}>
              {t("childExit.switch")}
            </Button>
            <Button size="md" variant="ghost" className="w-full" onClick={doLogout}>
              {t("auth.logout")}
            </Button>
            <div className="flex justify-center pt-2">
              <LanguageToggle />
            </div>
          </div>
        </ParentGate>
      </BottomSheet>
    </div>
  );
}
