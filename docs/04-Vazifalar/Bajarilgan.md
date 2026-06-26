---
title: Bajarilgan — Done
type: vazifa-board
tags: [vazifa, bajarilgan, done]
status: aktiv
created: 2026-06-26
---

# ✅ Bajarilgan — Done

> Bog'liq: [[04-Vazifalar/Backlog|📥 Backlog]] · [[04-Vazifalar/Jarayonda|🔄 Jarayonda]] · [[03-Reja/Bosqichlar#Faza 0|🪜 Faza 0]]
> Tugagan vazifalar shu yerga sana bilan ko'chiriladi (eng yangisi tepada).

## ✅ Faza 2 — Kontent modeli + Django Admin + seed (2026-06-27)
[[SPEC]] §3, §10 — kurikulum modeli, admin, demo kontent. **Additiv** (accounts buzilmadi). **Bajarildi.**

- [x] `media.Media` (kind/file/duration/meta) + MinIO yuklash (end-to-end tasdiqlandi) ✅ 2026-06-27 #modul/media → [[06-Modullar/Media|🎨 Media]]
- [x] `content` modellari: Language→Level→Theme→Lesson→LessonStep (config_json) ✅ 2026-06-27 #modul/content → [[06-Modullar/Kontent|📚 Kontent]]
- [x] Trek A `Letter` (char, sound_ipa, group_no) + Trek B `Word` (stress_index, l1_translation_json, gender, freq_rank, is_cognate_uz) ✅ 2026-06-27 #modul/content
- [x] `Phrase` / `Story`+`StoryNode` / `Song` (TPRS/qo'shiq) ✅ 2026-06-27 #modul/content
- [x] `GameType` katalogi — **11 mexanika** + `schema_json` (data-driven poydevor) ✅ 2026-06-27 #modul/content → [[06-Modullar/Oyin-Mexanikalari|🎮 O'yinlar]]
- [x] `media.0001` + `content.0001` **additiv** migratsiya (accounts saqlandi) ✅ 2026-06-27 #modul/backend
- [x] Django Admin: Theme▸Lesson▸LessonStep inline, Word filtrlari, Media preview ✅ 2026-06-27 #modul/backend
- [x] `seed_content` (**idempotent** get_or_create): 12 so'z, 8 harf, 11 GameType, 2 dars, 6 qadam ✅ 2026-06-27 #modul/content
- [x] 5 yangi pytest (jami **21** yashil); `seed_demo`→`seed_content` (Makefile + release.sh) ✅ 2026-06-27
- [x] Tuzatildi: admin CSS (`collectstatic`), CSRF (`CSRF_TRUSTED_ORIGINS=localhost:8080`) ✅ 2026-06-27 #modul/devops

> [!success] Faza 2 qabul mezonlari bajarildi
> Admin'da kurikulum daraxti boshqariladi, `make seed` idempotent demo kontent yaratadi, GameType
> katalogi 11 mexanika. Media FK'lar nullable (jonli ovoz/rasm — Faza 3). Keyingi: **Faza 3**
> (media pipeline + kontent API) → [[04-Vazifalar/Backlog#🟦 Faza 3|Backlog Faza 3]].

## ✅ Faza 1 — Auth + ota-ona akkaunti + bola profillari (2026-06-27)
[[SPEC]] §8, §2.8 — autentifikatsiya, ota-ona akkaunti, bola profillari. **Bajarildi, sinovdan o'tdi, xavfsizlik ko'rib chiqildi.**

- [x] Custom `AUTH_USER_MODEL = accounts.ParentAccount` — **toza DB** ustida, migratsiya OK ✅ 2026-06-27 #modul/accounts → [[06-Modullar/Accounts|🔐 Accounts]]
- [x] `ParentAccount` (telefon/email + parol, `AbstractBaseUser` + custom manager) ✅ 2026-06-27 #modul/accounts
- [x] `ChildProfile` (avatar, `age_band`, `l1_locale`, PIN-**hash**, bolaga login yo'q) ✅ 2026-06-27 #modul/accounts
- [x] JWT: `register` / `login` (telefon **yoki** email) / `refresh` / `logout` (blacklist) / `me` ✅ 2026-06-27 #modul/accounts
- [x] `/api/v1/profiles/` CRUD — **object-level** (faqat o'z bolalari; begona → 404) ✅ 2026-06-27 #modul/accounts
- [x] `/profiles/{id}/enter/` — **bola-kontekst token** (`parent_id`+`active_child_id`), PIN tekshiruvi ✅ 2026-06-27 #modul/accounts
- [x] `next-intl` (uz/ru) + ota-ona auth ekranlari + profil tanlash (avatar kartochka, `useAudio` salom) ✅ 2026-06-27 #modul/frontend
- [x] PIN-pad + **Parent Gate** (§7.4, matematik) + Guard ✅ 2026-06-27 #modul/frontend → [[06-Modullar/Dizayn-Tizimi|🎨 Dizayn]]
- [x] **16 pytest** + **2 Playwright** (happy path) yashil; Swagger 8 endpoint ✅ 2026-06-27
- [x] Adversarial security review (49 agent, 5 lens) → 16 topilma; arzonlari **tuzatildi va live tasdiqlandi** ✅ 2026-06-27 → [[99-Resurslar/Qaror-Jurnali#ADR-009 — Faza 1 xavfsizlik qotirish va kechiktirilgan elementlar|ADR-009]]
  - PIN brute-force throttle (5/min → **429**), Django parol validatorlari, prod `SECRET_KEY` majburiy, telefon normalizatsiyasi, PIN aniq 4-raqam, admin'da ota-ona PII kamaytirildi

> [!success] Faza 1 qabul mezonlari bajarildi
> Ota-ona ro'yxat/kirish/refresh/me, 2+ bola profili, profilga kirish, object-level izolyatsiya,
> Parent Gate, uz↔ru — hammasi ishlaydi va testlangan. Keyingi: **Faza 2** (kontent modeli + Django Admin + seed) →
> [[04-Vazifalar/Backlog#🟦 Faza 2|Backlog Faza 2]].

## ✅ Faza 0 — Skeleton (2026-06-26)
[[SPEC]] §12 Faza 0 — "Repo + Docker skeleton". Qabul mezoni: `docker compose up` →
API health 200, frontend ochiladi, migratsiyalar o'tadi, Celery worker ulanadi. **Bajarildi.**

- [x] Git repo + monorepo struktura (`.gitignore`, `.env.example`) ✅ 2026-06-26 #modul/devops
- [x] `docker-compose.yml` — **8 servis** (db, redis, minio, backend, worker, beat, frontend, nginx) + backup #modul/devops #prioritet/high ✅ 2026-06-26 → [[05-DevOps/Docker-Setup|🐳 Docker setup]]
- [x] Volume + healthcheck (Postgres 16, Redis 7, MinIO) ✅ 2026-06-26 #modul/devops
- [x] Django skeleton — **7 app** (common, accounts, content, learning, gamification, media, billing) — hozircha modelsiz ✅ 2026-06-26 #modul/backend → [[02-Arxitektura/Tizim-Arxitekturasi|🏛️ Arxitektura]]
- [x] settings env-asosli (django-environ): dev/prod ajratilgan ✅ 2026-06-26 #modul/backend
- [x] DRF + **drf-spectacular** (OpenAPI/Swagger) sozlandi ✅ 2026-06-26 #modul/backend → [[02-Arxitektura/API-Dizayni|🔌 API dizayni]]
- [x] `/api/health/` endpoint **200** qaytaradi ✅ 2026-06-26 #modul/backend
- [x] Celery **worker + beat** Redis broker bilan ulanadi ✅ 2026-06-26 #modul/devops
- [x] Next.js (App Router, TS) + Tailwind + **PWA** bosh sahifa ochiladi ✅ 2026-06-26 #modul/frontend → [[06-Modullar/Dizayn-Tizimi|🎨 Dizayn tizimi]]
- [x] TanStack Query + Zustand qo'shildi (skeleton holatida) ✅ 2026-06-26 #modul/frontend
- [x] Nginx reverse proxy (dev) — frontend + api yo'naltirish ✅ 2026-06-26 #modul/devops → [[05-DevOps/Nginx-Konfiguratsiya|🌐 Nginx]]
- [x] `backup` servisi (kunlik pg_dump zaxira) ✅ 2026-06-26 #modul/devops → [[05-DevOps/Deploy|🚀 Deploy]]
- [x] Dockerfile'lar (backend + frontend multi-stage) ✅ 2026-06-26 #modul/devops
- [x] CI/CD pipeline (lint + build) ✅ 2026-06-26 #modul/devops → [[05-DevOps/CI-CD|♻️ CI/CD]]
- [x] Makefile (up/down/migrate/seed/logs qisqartmalari) ✅ 2026-06-26 #modul/devops
- [x] README — lokal ishga tushirish yo'riqnomasi ✅ 2026-06-26 #modul/devops
- [x] Obsidian docs vault yaratildi ✅ 2026-06-26 #modul/loyiha → [[00-Home|🏠 Bosh sahifa]]
- [x] Claude Code skills sozlandi (loyiha konvensiyalari) ✅ 2026-06-26 #modul/devops
- [x] Tekshiruv: `docker compose up` → health 200, frontend ochildi, migratsiyalar o'tdi, worker ulandi ✅ 2026-06-26

> [!success] Qabul mezonlari bajarildi
> Ishlaydigan, biznes-logikasiz **skeleton** tayyor. Modellar va biznes-logika keyingi
> fazalarda ([[SPEC]] §11/§12) qo'shiladi. Keyingi: [[04-Vazifalar/Backlog#🟦 Faza 1 — Auth + ota-ona akkaunti + bola profillari|Faza 1 — Auth]].

## 📦 Rejalashtirish (2026-06-26)
- [x] [[SPEC]] to'liq tahlil qilindi ✅ 2026-06-26 #modul/loyiha → [[01-Loyiha/SPEC-Tahlili|📖 SPEC tahlili]]
- [x] Pedagogik asos hujjatlashtirildi (TPR, comprehensible input, dual coding, SRS) ✅ 2026-06-26 #modul/loyiha → [[01-Loyiha/Pedagogik-Asos|📖 Pedagogik asos]]
- [x] Texnologiyalar steki tasdiqlandi (Django+DRF, Next.js/TS/PWA, Postgres, Redis+Celery, MinIO, Docker) ✅ 2026-06-26 #modul/arxitektura → [[02-Arxitektura/Texnologiyalar-Steki|⚙️ Stek]]
- [x] SRS dvigateli arxitekturasi loyihalandi (Leitner + FSRS-lite) ✅ 2026-06-26 #modul/arxitektura → [[02-Arxitektura/SRS-Dvigateli|🧠 SRS dizayni]]
- [x] Yo'l xaritasi va 11 faza rejalashtirildi ✅ 2026-06-26 #modul/loyiha → [[03-Reja/Yol-Xaritasi|🛣️ Yo'l xaritasi]]

## 📊 Statistika
- Bajarilgan: rejalashtirish (**5**) + Faza 0 (**19**) + Faza 1 (**10**) + Faza 2 (**10**) = **44**
- Joriy bosqich: **Faza 2 tugadi** → Faza 3'ga (media pipeline + kontent API) tayyorgarlik
- Keyingi: [[04-Vazifalar/Jarayonda|🔄 Jarayonda]] · [[04-Vazifalar/Backlog|📥 Backlog]]
