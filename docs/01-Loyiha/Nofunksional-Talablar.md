---
title: Nofunksional Talablar
type: tahlil
tags: [loyiha, talablar, nofunksional, nfr]
status: tasdiqlangan
created: 2026-06-26
---

# ⚙️ Nofunksional Talablar (NFR)

> [!abstract] Bog'liq: [[01-Loyiha/Funksional-Talablar|✅ Funksional talablar]] · [[02-Arxitektura/Xavfsizlik|🔐 Xavfsizlik]] · [[06-Modullar/Dizayn-Tizimi|🎨 Dizayn tizimi]] · [[SPEC]]

## 🐻 NFR — Bolalar xavfsizligi (walled garden)
> [!warning] Eng yuqori ustuvorlik
> - Reklama, chat, tashqi havola, ochiq internet, ijtimoiy funksiya **YO'Q** (SPEC §1, §8).
> - Sozlama/xaridga **Parent Gate** (kattalar tekshiruvi) → [[06-Modullar/Accounts]].
> - Stresssiz: yutqazish/jazo/taymer yo'q; xato → yumshoq qayta urinish.

## 🔊 NFR — Audio past kechikish
- **Web Audio API** bilan past kechikishli (low-latency) tovush; teginish → darhol ovoz.
- Audio oldindan keshlanadi; har element bosilganda nomi yangraydi (audio-first).
- Native speaker audio (ishlab chiqarishda jonli ovoz; dev'da TTS placeholder) → [[06-Modullar/Media]].

## ♻️ NFR — Offline / beqaror internet
- O'zbekistonda internet beqaror → **offline-birinchi dars pleyeri** muhim.
- Service Worker: joriy mavzu darslari + media keshlanadi → bola oflayn o'ynaydi.
- Outbox/sync: oflayn `LearningEvent`'lar saqlanadi, onlayn bo'lganda **idempotent** yuboriladi → [[06-Modullar/SRS-Learning#Offline]].

## ♿ NFR — Qulaylik (Accessibility)
- Ulkan teginish nishonlari (min ~80–100px), keng oraliq (kichik barmoqlar uchun).
- Audio-asos + kam matn = o'z-o'zidan inklyuziv; sekin/tez audio rejimi.
- Rang yagona ma'no tashuvchi emas (doim + shakl/ikona); colorblind-xavfsiz palitra → [[06-Modullar/Dizayn-Tizimi]].

## 🔐 NFR — Maxfiylik (COPPA/GDPR-K)
- Bolalardan **minimal ma'lumot**; tahlil anonim/agregat.
- Parollar `argon2`/`bcrypt`; JWT (access+refresh); HTTPS majburiy (Nginx+TLS).
- Media ruxsat tekshiruvi (signed URL / proxy) → [[02-Arxitektura/Xavfsizlik]].

## 🚀 NFR — Ishlash (Performance)
- Kontent API javobi < 300ms (p95); kontent kamdan-kam o'zgaradi → Redis kesh + ETag.
- Dars/o'yin javoblari uzilishsiz (animatsiya silliq, audio kechikishi minimal).

## 🔄 NFR — Ishonchlilik / Backup
- PostgreSQL kunlik `pg_dump`; MinIO media versiyalash; `backup` xizmati compose'da → [[05-DevOps/Deploy#Backup]].
- Stateless backend → horizontal scaling; Celery (worker+beat) fon vazifalari uchun.
- Maqsadli uptime: 99.5%.

## 🔧 NFR — Maintainability / Observability
- TypeScript (frontend) + type hints (Python) + linterlar; avtotestlar (pytest / Vitest+Playwright).
- Markazlashgan loglar, xatolar (Sentry), metrikalar → [[05-DevOps/CI-CD]].

> [!info] Faza 0 holati
> Skeleton'da `/api/health/` 200; Docker xizmatlari (db, redis, minio, backend, worker, beat, frontend, nginx, backup) ko'tariladi → [[05-DevOps/Docker-Setup]].
