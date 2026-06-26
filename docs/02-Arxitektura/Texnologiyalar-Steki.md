---
title: Texnologiyalar Steki
type: arxitektura
tags: [arxitektura, stek, texnologiya]
status: tasdiqlangan
created: 2026-06-26
---

# 🧱 Texnologiyalar Steki

> Bog'liq: [[02-Arxitektura/Tizim-Arxitekturasi]] · [[05-DevOps/Docker-Setup]] · [[01-Loyiha/SPEC-Tahlili]]

SPEC (§9) "Texnik arxitektura" bo'limidan tanlangan **yakuniy stek**. Tamoyil:
audio-birinchi, oflayn-birinchi PWA + modulli Django backend + ko'rinmas SRS dvigateli.
Faza 0 (skeleton + Docker) allaqachon **bajarilgan** → [[03-Reja/Bosqichlar#Faza 0]].

## Tanlangan stek

| Qatlam | Texnologiya | Sabab |
|---|---|---|
| **Frontend** | Next.js 14+ (App Router) + **TypeScript** | PWA, oflayn dars pleyeri, type-xavfsizlik |
| PWA | next-pwa / Service Worker | O'zbekistonda beqaror internet → oflayn-birinchi |
| UI | Tailwind CSS + dizayn tokenlari | Iliq, bolabop, izchil identitet → [[06-Modullar/Dizayn-Tizimi]] |
| Holat boshqaruvi | TanStack Query + Zustand | Server-state + lokal/UI state ajratilgan |
| Audio | Web Audio API | Past kechikishli (audio-birinchi UX) |
| Animatsiya | Framer Motion / GSAP | Yumshoq, o'ynoqi o'tishlar (Mishka) |
| Yozuv | Canvas / SVG | Harf chizish (tracing), kirill treki |
| i18n | next-intl | UI: uz (lotin) + ru; kontent: ru + uz (L1 scaffolding) |
| **Backend** | **Django 5** + Django REST Framework | Tez CRUD, Admin (kontent), modulli ekotizim |
| Auth | SimpleJWT | JWT access/refresh, ota-ona + child-context |
| Fon vazifalar | **Celery (worker + beat)** | Audio transcode, SRS qayta hisob, bildirishnoma |
| **DB** | **PostgreSQL 16** | JSONB, FTS; `LearningEvent` partitioning (kelajak) |
| Kesh / broker | **Redis 7** | Kesh (kontent) + Celery broker |
| **Fayl saqlash** | **MinIO** (S3-mos) | Media (audio/rasm/lottie); dev=MinIO, prod=S3+CDN |
| **Reverse proxy** | **Nginx** | TLS, static/media, media RBAC-proxy |
| Konteyner | **Docker + Docker Compose** | Bir xil muhit, `docker compose up` |

> [!note] Nega audio-birinchi + PWA?
> Bola **o'qiy olmaydi** (3–7 yosh) → har ekran ovozli, matnga tayanmaydi.
> Internet beqaror → joriy birlik darslari + media oflayn keshlanadi, rivoj
> ulanish tiklanganda **outbox pattern** orqali sync bo'ladi. SPEC §7.1, §9.3.

> [!note] Nega modulli Django (TALIM g'oyasi)?
> `bounded-context` app'lar — konfiguratsiya-asoslangan brending (`/api/config/`)
> bir platforma, ko'p mijoz (B2B litsenziya) imkonini beradi. SPEC §9.2.

## Versiyalar (taxminiy)
- Python 3.12, Django 5.x, DRF 3.15+, SimpleJWT, drf-spectacular
- Node 20 LTS, Next.js 14+, React 18, TypeScript 5
- PostgreSQL 16, Redis 7, Nginx 1.27, MinIO (so'nggi)
- Docker Engine 24+, Compose v2

## Repozitoriy tuzilishi (monorepo)

```
ruscha/  (SKAZKA)
├── backend/                # Django + DRF
│   ├── apps/
│   │   ├── common/         # /api/health, /api/config, umumiy
│   │   ├── accounts/       # ParentAccount, ChildProfile, JWT (Faza 1)
│   │   ├── content/        # kurikulum: Language→Level→Theme→Lesson, Word, Letter
│   │   ├── learning/       # SRS yadrosi: ChildWordState, LearningEvent
│   │   ├── gamification/   # Reward, kolleksiya, streak
│   │   ├── media/          # Media (MinIO), audio/rasm pipeline
│   │   └── billing/        # Subscription, Institution, BrandingConfig (B2B)
│   ├── config/             # settings (django-environ), urls, celery
│   └── manage.py
├── frontend/               # Next.js + TS + PWA
│   ├── app/                # bola rejimi + ota-ona panel
│   ├── components/
│   ├── lib/                # api client, useAudio hook, outbox sync
│   └── public/             # manifest, SW, ikonalar
├── nginx/                  # Nginx konfiglar
├── docker/                 # Dockerfile'lar (multi-stage)
├── docker-compose.yml      # db, redis, minio, api, worker, beat, web, nginx, backup
└── docs/                   # Ushbu Obsidian vault
```

> [!info] Faza 0 holati
> Skeleton **modelsiz** — barcha app'lar bo'sh skeleton; `/api/health/` 200 qaytaradi.
> Modellar/biznes-logika keyingi fazalarda. To'liq spetsifikatsiya: [[SPEC]].

Batafsil komponent oqimi: [[02-Arxitektura/Tizim-Arxitekturasi]].
