"use client";

import { Button } from "@/components/ui";
import { toast } from "@/lib/toast";

// SKAZKA boshlang'ich (welcome) ekrani — skeleton.
// Bola o'qiy olmaydi → audio-birinchi, ulkan nishonlar, matn minimal (§7).
// Haqiqiy bolalar qobig'i (Mishka, sayohat xaritasi, ovoz) Faza 4'da quriladi.
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-brand-50 to-background px-6 text-center">
      <div className="animate-bounce-soft text-8xl" role="img" aria-label="Mishka ayiqcha">
        🐻
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-extrabold tracking-tight text-brand-700">SKAZKA</h1>
        <p className="text-lg text-muted-foreground">
          Mishka bilan rus tilini o'yin orqali o'rganamiz
        </p>
      </div>

      <Button
        size="lg"
        onClick={() => toast.success("Mishka tayyor! 🎉 (skeleton — o'yin Faza 4'da)")}
      >
        Boshlash
      </Button>

      <footer className="absolute bottom-6 text-sm text-muted-foreground">
        Faza 0 — skeleton · Next.js + PWA · <span className="font-mono">/api/health</span>
      </footer>
    </main>
  );
}
