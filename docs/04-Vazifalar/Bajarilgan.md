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

## ✅ Faza 7 — Trek A: kirill alifbo/fonetika mexanikalari (2026-06-27)
[[SPEC]] §3 Trek A + §5 (#4–7). **Additiv.** Ekspressiv strength SHU fazada ishga tushdi.

- [x] **Letter seed:** 1-guruh (8 harf) + mavzu so'zlari harflari (23 jami); qisqa so'zlar (кот/сон/нос) + **alifbo darslari** (harf + so'z qurish) ✅ 2026-06-27 #modul/content
- [x] **`GameType.dimension`** (receptive|expressive) + **`schedule(dimension)`** — ekspressiv strength ishga tushdi; izolyatsiya parametr orqali ✅ 2026-06-27 #modul/srs → [[99-Resurslar/Qaror-Jurnali#ADR-014 — Harf mexanikalari: acceptsItemTypes + schedule(dimension) + yumshoq tracing|ADR-014]]
- [x] **4 mexanika (registry plugin):** harf_ovi, qaysi_tovush (reseptiv) · harf_chiz (ekspressiv, Canvas yumshoq) · so'z_qur (ekspressiv, harflardan) ✅ 2026-06-27 #modul/games
- [x] **`acceptsItemTypes`** (mexanika-darajasi routing): get_due aralash (word+letter); buildOptions bir xil tur; takrorlash aralashni "bepul" to'g'ri qiladi ✅ 2026-06-27 #modul/games
- [x] **harf_chiz** yumshoq baholash (kontur qoplanishi ostonasi — bitta konstanta); touch-birlamchi + responsive ✅ 2026-06-27 #modul/games
- [x] Letterlar SRS'ga kiradi (polimorfik) + takrorlashga; **GamePlayer O'ZGARMADI** ✅ 2026-06-27 #modul/srs
- [x] Murakkab harflar (ж,ц,ч,ш,щ,ы,ъ,ь) faqat record (drill keyin — §3); mnemonik = asset slot ✅ 2026-06-27
- [x] pytest **48/48** + Playwright (alifbo, so'z_qur, harf_chiz; Faza 5/6 saqlandi) ✅ 2026-06-27

> [!success] Faza 7 qabul mezonlari bajarildi
> Bola harf chizadi (yumshoq), tovushni harf bilan bog'laydi, harf topadi, so'z quradi; 4 mexanika =
> registry plugin (GamePlayer o'zgarmadi); ekspressiv (so'z_qur/harf_chiz) ↔ reseptiv (harf_ovi/
> qaysi_tovush) strength ajratilgan; letterlar SRS+takrorlashda. Keyingi: **Faza 8** (geymifikatsiya) yoki
> **Faza 9** (ertak/qo'shiq mexanikalari).

## ✅ Faza 6 — Ko'rinmas SRS dvigateli (2026-06-27)
[[SPEC]] §4 — platformaning ilmiy yadrosi. **Additiv** (DB reset yo'q). Backend + frontend ulanish.

- [x] **`learning` app:** `ItemState` (POLIMORFIK word|letter, FSRS-tayyor + reseptiv/ekspressiv kuch) + `LearningEvent` (`event_id` unique) ✅ 2026-06-27 #modul/srs → [[99-Resurslar/Qaror-Jurnali#ADR-013 — SRS dvigateli: izolyatsiyalangan scheduler + idempotent event + polimorfik ItemState|ADR-013]]
- [x] **`schedule()` izolyatsiya** (`scheduler.py`): MVP konservativ SM-2-lite (to'g'ri→1,3,7,×2.2; xato→~10daq). Almashtiriladigan — model/event o'zgarmaydi ✅ 2026-06-27 #modul/srs
- [x] **`record_event` IDEMPOTENT** (`event_id` → dublikat ignore, state qayta o'zgarmaydi) + `get_due` ✅ 2026-06-27 #modul/srs
- [x] **Endpointlar:** `POST /learning/event/` (idempotent) + `GET /learning/session/` (due) — bola-kontekst ✅ 2026-06-27 #modul/srs
- [x] **Progress REAL + LINEER:** 1-mavzu ochiq, done(≥60% so'z reseptiv≥0.5 — yumshoq)→keyingisi; curriculum overlay + ETag stamp ✅ 2026-06-27 #modul/srs
- [x] **Frontend (GamePlayer O'ZGARMADI):** `recordResult` event_id+**outbox→sync** (online listener), `useSessionQueue` due interleave, `IntroView` exposure ✅ 2026-06-27 #modul/games
- [x] **Takrorlash** (#11) registry plugin + `/review` ReviewPlayer + forest "♻️" tugmasi (due>0) ✅ 2026-06-27 #modul/games
- [x] pytest **44/44** (12 yangi: schedule, idempotentlik, due, lineer progress, authz) + Playwright (Faza 5 saqlandi) ✅ 2026-06-27

> [!success] Faza 6 qabul mezonlari bajarildi
> Bola so'z o'rgansa keyingi sessiyalarda kengayuvchi intervalda qaytadi (xato→tezroq); event idempotent
> (outbox dublikat state buzmaydi); ItemState polimorfik (reseptiv haydaladi, ekspressiv bo'sh); progress
> REAL+LINEER; takrorlash due'dan; `recordResult` outbox→sync (Faza 10 poydevori), **GamePlayer o'zgarmadi**.
> Keyingi: **Faza 7** (harf/alifbo mexanikalari — ItemState `letter` polimorfizmini ishlatadi).

## ✅ Faza 5 — O'yin dvigateli + 3 mexanika (2026-06-27)
[[SPEC]] §5 + §4.4 — data-driven dvigatel; bola nihoyat so'z o'rgana boshlaydi. **Asosan frontend** (additiv, DB reset yo'q).

- [x] **Registry plugin arxitekturasi** (markaziy if/elif YO'Q): `registerMechanic(key, Component)`; `GamePlayer` faqat `MechanicProps` kontrakti beradi ✅ 2026-06-27 #modul/games → [[99-Resurslar/Qaror-Jurnali#ADR-012 — O'yin dvigateli: registry plugin + frontend distraktor|ADR-012]]
- [x] **GamePlayer oqimi:** intro → practice → mastery → natija (REAL `/lesson` kontentidan; `steps[]`/`new_items`/`games[]`) ✅ 2026-06-27 #modul/games
- [x] **3 mexanika (plugin):** Eshit va bos (eshit_va_bos), Juftla (juftla, memory), Topib ber (topib_ber, TPR) ✅ 2026-06-27 #modul/games
- [x] **Distraktor §4.4 (frontend):** mavzu manbai, `confusable_ids` istisno (кошка↛коза), `option_count` age_band bo'yicha (3-4→2), graceful ≥2 ✅ 2026-06-27 #modul/games
- [x] **Feedback (Faza 4 komponentlari):** to'g'ri→Mishka cheer + Confetti + ovoz; xato→JAZO YO'Q, think + qayta imkon ✅ 2026-06-27 #modul/games
- [x] **Faza 6 kontrakti tayyor (ADR-010):** `buildSessionQueue(new, due=[])` + `recordResult(...)` (lokal outbox) — GamePlayer o'zgarmaydi ✅ 2026-06-27 #modul/srs → [[06-Modullar/SRS-Learning]]
- [x] So'z vizuali asset-slot (`image_url` real → rasm; yo'q → emoji placeholder); matnsiz + ulkan nishon ✅ 2026-06-27 #modul/frontend
- [x] Forest theme → `/lesson/{id}` (stub o'rniga); typecheck + lint + build ✓; **12/12 Playwright** ✅ 2026-06-27
- [x] **Adversarial review** (commit oldidan, 4 o'lcham × tasdiqlash): 25 topilma → 5 tuzatildi (2 boshi-berk guard, "jazo yo'q" yulduz, ≥2 variant, refetch barqarorlik); `useSessionQueue` hook ✅ 2026-06-27 → [[99-Resurslar/Qaror-Jurnali#ADR-012 — O'yin dvigateli: registry plugin + frontend distraktor|ADR-012]]

> [!success] Faza 5 qabul mezonlari bajarildi
> Bola haqiqiy darsni boshidan oxiriga o'ynaydi; mexanika = registry plugin (yangi = 1 qator);
> distraktor §4.4 (confusable istisno, age_band son); to'g'ri→cheer+Confetti, xato→jazosiz qayta imkon;
> `onResult` lokal yoziladi, Faza 6 interfeysi tayyor. Keyingi: **Faza 6** (SRS + rivoj + Takrorlash o'yini).

## ✅ Faza 4 — Dizayn tizimi + bolalar UI qobig'i (2026-06-27)
[[SPEC]] §7 — audio-birinchi, matnsiz, ulkan nishonlar; o'rmon xaritasi. **Frontend.**

- [x] Dizayn tokenlari (Maqola `v()`/`cn()`/barrel mexanizmi + bolalar qiymatlari): yorqin **rang-ko'r xavfsiz** orange+blue palitra, status=rang+ikona, **Nunito** shrift, blob radius, iliq soyalar ✅ 2026-06-27 #modul/design → [[06-Modullar/Dizayn-Tizimi|🎨 Dizayn]]
- [x] Komponentlar (ui-kit): Mishka (4 holat), Confetti, Card, BottomSheet, ulkan Button + **Framer Motion** (reduced-motion) ✅ 2026-06-27 #modul/frontend
- [x] **Asset-slot** konvensiyasi: `MISHKA_MANIFEST` + `UI_AUDIO` — haqiqiy render/audio kod o'zgarmasdan tushadi ✅ 2026-06-27 #modul/frontend
- [x] `useAudio` (audio-birinchi): element nomi yangraydi, bitta-ovoz, graceful ✅ 2026-06-27 #modul/frontend
- [x] **`/forest`** o'rmon yo'li xaritasi — REAL `/api/v1/curriculum`dan (Level=qism, Theme=to'xtash, status ikona, Mishka) ✅ 2026-06-27 #modul/frontend
- [x] `/forest/[theme]` stub (o'yin Faza 5); `contentApi` (bola-kontekst token) ✅ 2026-06-27 #modul/frontend
- [x] **Bola zonasi devor bilan o'ralgan** (`(child)` route-group, AppBar yo'q; 🏠→Parent Gate→chiqish) ✅ 2026-06-27 #modul/frontend → [[06-Modullar/Accounts]]
- [x] PWA (standalone, manifest); i18n (uz/ru); **7/7 Playwright** + build ✓ ✅ 2026-06-27

> [!success] Faza 4 qabul mezonlari bajarildi
> Bola o'rmon xaritasida yuradi (REAL curriculum), mavzu tanlaydi, teginish→ovoz+animatsiya; Mishka
> holatlari (placeholder asset+real slot); matnsiz+ulkan nishon; devor bilan o'ralgan (Parent Gate).
> Keyingi: **Faza 5** (o'yin dvigateli + 3 mexanika) → [[04-Vazifalar/Backlog#🟦 Faza 5|Backlog]].

## ✅ Faza 3 — Media pipeline + kontent API (2026-06-27)
[[SPEC]] §9.2, §7.3 — frontend kontentni o'qiy oladigan birinchi faza. **Additiv.** Security review o'tdi.

- [x] Media Celery pipeline: `optimize_image` (Pillow: thumb/full, WebP+PNG, o'lcham), `normalize_audio` (mutagen duration + ffmpeg mp3/ogg, **tolerant**) ✅ 2026-06-27 #modul/media → [[06-Modullar/Media|🎨 Media]]
- [x] `post_save` auto-enqueue (transaction.on_commit, tolerant, loop-himoya) + `init_storage` **public-read** policy ✅ 2026-06-27 #modul/media
- [x] Media **PUBLIC URL** (download-proxy yo'q): `AWS_S3_CUSTOM_DOMAIN`, `QUERYSTRING_AUTH=False`, UUID `upload_to` ✅ 2026-06-27 #modul/media
- [x] `ChildProfile.current_level` FK (additiv) ✅ 2026-06-27 #modul/accounts
- [x] `GET /api/v1/curriculum/` — bola-kontekst (`active_child_id`, EGALIK tekshiruvi), **age_band filtri**, progress stub ✅ 2026-06-27 #modul/content → [[02-Arxitektura/API-Dizayni|🔌 API]]
- [x] `GET /api/v1/lesson/{id}/` — `config_json` to'liq RESOLVE (so'z/harf + absolyut media URL + games+schema + confusable), age_band 403 ✅ 2026-06-27 #modul/content
- [x] Redis kesh (`content_version`) + **ETag/304** + invalidatsiya signali ✅ 2026-06-27 #modul/content
- [x] **Adversarial security review** (28 agent, 4 lens) → 15 topilma; tuzatildi: MIME content-verify (SVG-XSS), Pillow bomb (`MAX_IMAGE_PIXELS`), file size cap, content throttle ✅ 2026-06-27 → [[99-Resurslar/Qaror-Jurnali#ADR-011 — Faza 3 xavfsizlik review + public-media xulosasi|ADR-011]]
- [x] 9 yangi pytest (jami **32** yashil); ffmpeg+Pillow+mutagen image rebuild ✅ 2026-06-27

> [!success] Faza 3 qabul mezonlari bajarildi
> Media MinIO'ga yuklanadi+ishlanadi (anonim public GET 200, LIST/PUT/DELETE→403); curriculum age_band
> daraxti; lesson to'liq resolve (media URL bilan); kesh+ETag. **Public-media qaror XAVFSIZ deb tasdiqlandi**
> (ADR-011). Keyingi: **Faza 4** (dizayn tizimi + bolalar UI qobig'i) → [[04-Vazifalar/Backlog#🟦 Faza 4|Backlog]].

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
- Bajarilgan: rejalashtirish (**5**) + Faza 0 (**19**) + Faza 1 (**10**) + Faza 2 (**10**) + Faza 2.5 (**4**) + Faza 3 (**9**) + Faza 4 (**8**) + Faza 5 (**8**) + Faza 6 (**8**) + Faza 7 (**8**) = **89**
- Joriy bosqich: **Faza 7 tugadi** → Faza 8 (geymifikatsiya) / Faza 9 (ertak/qo'shiq) tayyorgarlik
- Keyingi: [[04-Vazifalar/Jarayonda|🔄 Jarayonda]] · [[04-Vazifalar/Backlog|📥 Backlog]]
