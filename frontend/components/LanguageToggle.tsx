"use client";

import { useLocale, type Locale } from "@/lib/locale";
import { cn } from "@/lib/cn";

const LOCALES: { key: Locale; label: string }[] = [
  { key: "uz", label: "O'z" },
  { key: "ru", label: "Ру" },
];

export function LanguageToggle() {
  const { locale, setLocale } = useLocale();
  return (
    <div className="inline-flex overflow-hidden rounded-xl2 border border-border">
      {LOCALES.map((l) => (
        <button
          key={l.key}
          type="button"
          onClick={() => setLocale(l.key)}
          aria-pressed={locale === l.key}
          className={cn(
            "px-3 py-1.5 text-sm font-semibold transition",
            locale === l.key
              ? "bg-brand-500 text-brand-foreground"
              : "bg-card text-muted-foreground hover:bg-muted"
          )}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
