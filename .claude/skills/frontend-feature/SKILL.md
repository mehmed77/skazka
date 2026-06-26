---
name: frontend-feature
description: SKAZKA Next.js frontend'ida yangi sahifa, komponent yoki API-ulanish qo'shish. App Router, UI kit, TanStack Query, Zustand, axios yoki PWA ustida ishlaganda ishlat.
---

# SKAZKA frontend (Next.js + TypeScript) konvensiyalari

Maqola konvensiyalarini takrorlaydi + bolalar UX (SPEC §7). Yangi kod mavjud naqshga mos bo'lsin.

## Struktura
- `frontend/app/` — **App Router**. `layout.tsx` (metadata, Inter font latin+cyrillic, `viewport.themeColor`),
  `providers.tsx` (ThemeProvider + QueryClientProvider + Toaster + ServiceWorkerRegister), `globals.css` (dizayn tokenlari), `page.tsx`.
  Himoyalangan/auth oqimlar uchun route-group'lar: `(app)`, `(auth)` (Maqola kabi) — Faza 1+.
- `frontend/lib/` — `api.ts` (axios + JWT interceptor + 401 refresh; tokenlar `skazka_access`/`skazka_refresh`),
  `cn.ts` (clsx+tailwind-merge), `toast.ts` (Zustand). Yangi: `auth.ts`, `hooks.ts`, `types.ts` (Maqola kabi).
- `frontend/components/ui/` — custom UI kit (CVA variantlar, `forwardRef`, `cn()`), barrel `index.ts`. `'use client'`.

## Qoidalar
- Paket menejeri: **npm** (`package-lock.json`). pnpm/yarn EMAS.
- Tailwind: semantik token'lar `globals.css` CSS o'zgaruvchilarida (`--bg`, `--brand-*`, `--accent`). `tailwind.config.ts` `v()` orqali o'qiydi. Rang qiymatini globals.css da o'zgartir.
- Server holati: **TanStack Query**. Lokal/UI holati: **Zustand**. API: `@/lib/api` (`api` instance).
- Komponent fayllari: `PascalCase.tsx`; util: `camelCase.ts`. Import alias: `@/*`.
- Icons: `lucide-react`. Sinov: Playwright (`tests/e2e/`, `make`/`npm run e2e`).

## Bolalar UX (SPEC §7) — kritik
- **Audio-birinchi, matnsiz:** bola o'qiy olmaydi. Ko'rsatma ovozli; element bosilganda nomi yangraydi (`useAudio` hook — Faza 4).
- **Ulkan teginish nishonlari:** min ~80–100px (`Button size="lg"`), keng oraliq.
- **Yumaloq, do'stona shakllar**, issiq/yorqin palitra; rang yagona ma'no tashuvchi emas (+shakl/ikona).
- **Darhol feedback:** har amalda animatsiya+tovush. Xatoda jazo yo'q (Mishka "qayta urinaylik").
- **Maskot-navigatsiya** (Mishka), matnli menyu emas. Framer Motion (Faza 4'da qo'shiladi).

## PWA (SPEC §9.3)
- `public/manifest.json` + `public/sw.js` + `components/ServiceWorkerRegister.tsx`. Offline-birinchi dars pleyeri + outbox sync — Faza 10.

## Build
- `npm run dev` (Docker `frontend` dev target). `npm run typecheck`, `npm run build`, `npm run lint`.
- `NEXT_PUBLIC_API_URL` — backend bazaviy manzil (dev: `http://localhost:8080/api/v1`, nginx orqali).
