import { ChildZone } from "@/components/ChildZone";
import { Guard } from "@/components/Guard";

// Bola zonasi — Guard (ota-ona kirgan bo'lishi shart) + ChildZone (devor + Parent Gate).
// Ota-ona AppBar'i (matnli Sozlamalar/Chiqish) YO'Q — faqat 🏠 → gate orqali.
export default function ChildLayout({ children }: { children: React.ReactNode }) {
  return (
    <Guard>
      <ChildZone>{children}</ChildZone>
    </Guard>
  );
}
