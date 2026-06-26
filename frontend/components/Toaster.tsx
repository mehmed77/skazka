"use client";

import { cn } from "@/lib/cn";
import { useToasts } from "@/lib/toast";

const STYLES: Record<string, string> = {
  success: "bg-brand-500 text-brand-foreground",
  error: "bg-red-500 text-white",
  info: "bg-accent text-accent-foreground",
};

export function Toaster() {
  const toasts = useToasts((s) => s.toasts);
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "animate-fade-in rounded-xl2 px-5 py-3 text-base font-medium shadow-pop",
            STYLES[t.kind]
          )}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}
