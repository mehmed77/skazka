import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

// Yumaloq, do'stona shrift (bolalarbop) — kirill + lotin
const nunito = Nunito({ subsets: ["latin", "cyrillic"], variable: "--font-nunito" });

export const metadata: Metadata = {
  title: "SKAZKA — Mishka bilan rus tili",
  description:
    "Bolalar uchun rus tilini o'yin orqali o'rgatuvchi platforma. Yo'lboshchi: Mishka 🐻",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "SKAZKA", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#f97316",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={nunito.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
