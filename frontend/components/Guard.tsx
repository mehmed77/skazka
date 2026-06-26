"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { useAuth } from "@/lib/auth";

// Ota-ona zonasi himoyasi — kirmagan bo'lsa /login ga yo'naltiradi.
export function Guard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const t = useTranslations("common");
  const { parent, ready, fetchMe } = useAuth();

  useEffect(() => {
    if (!ready) fetchMe();
  }, [ready, fetchMe]);

  useEffect(() => {
    if (ready && !parent) router.replace("/login");
  }, [ready, parent, router]);

  if (!ready || !parent) {
    return (
      <div className="flex min-h-screen items-center justify-center text-muted-foreground">
        {t("loading")}
      </div>
    );
  }
  return <>{children}</>;
}
