import { LanguageToggle } from "@/components/LanguageToggle";

// Ota-ona auth zonasi — sodda, kattalar uchun (bolalar UI emas).
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-brand-50 to-background">
      <header className="flex items-center justify-between p-4">
        <span className="text-xl font-extrabold text-brand-700">SKAZKA 🐻</span>
        <LanguageToggle />
      </header>
      <main className="flex flex-1 items-center justify-center p-4">
        <div className="w-full max-w-sm rounded-blob bg-card p-7 shadow-soft">{children}</div>
      </main>
    </div>
  );
}
