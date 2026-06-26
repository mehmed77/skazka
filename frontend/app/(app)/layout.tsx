import { AppBar } from "@/components/AppBar";
import { Guard } from "@/components/Guard";

// Ota-ona zonasi — Guard himoyalaydi (kirmagan → /login).
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <Guard>
      <div className="min-h-screen bg-background">
        <AppBar />
        <main className="mx-auto max-w-3xl p-4">{children}</main>
      </div>
    </Guard>
  );
}
