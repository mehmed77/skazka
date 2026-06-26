import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: "--font-inter" });

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
    <html lang="uz" className={inter.variable} suppressHydrationWarning>
      <body className="font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
