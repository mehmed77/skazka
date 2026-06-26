"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { NextIntlClientProvider } from "next-intl";
import { useState } from "react";

import { ServiceWorkerRegister } from "@/components/ServiceWorkerRegister";
import { Toaster } from "@/components/Toaster";
import { useLocale } from "@/lib/locale";
import uz from "@/messages/uz.json";
import ru from "@/messages/ru.json";

const MESSAGES = { uz, ru } as const;

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());
  const locale = useLocale((s) => s.locale);

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={MESSAGES[locale]}
      timeZone="Asia/Tashkent"
    >
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <QueryClientProvider client={client}>
          {children}
          <Toaster />
          <ServiceWorkerRegister />
        </QueryClientProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
