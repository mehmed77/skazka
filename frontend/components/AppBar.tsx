"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { LanguageToggle } from "@/components/LanguageToggle";
import { useAuth } from "@/lib/auth";

export function AppBar() {
  const t = useTranslations();
  const router = useRouter();
  const logout = useAuth((s) => s.logout);

  const onLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <Link href="/profiles" className="text-lg font-extrabold text-brand-700">
        SKAZKA 🐻
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link href="/settings" className="text-muted-foreground hover:text-foreground">
          {t("nav.settings")}
        </Link>
        <LanguageToggle />
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl2 bg-muted px-3 py-1.5 font-semibold hover:bg-brand-100"
        >
          {t("auth.logout")}
        </button>
      </nav>
    </header>
  );
}
