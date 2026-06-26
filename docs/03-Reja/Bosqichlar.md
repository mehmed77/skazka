---
title: Bosqichlar (Fazalar)
type: reja
tags: [reja, bosqich, faza]
status: aktiv
created: 2026-06-26
---

# 🪜 Bosqichlar (Fazalar)

> [!abstract] Bog'liq
> [[03-Reja/Yol-Xaritasi|🛣️ Yo'l Xaritasi]] · [[03-Reja/Sprintlar|🏃 Sprintlar]] · [[04-Vazifalar/Backlog|📥 Backlog]] · [[SPEC]]

> [!info] Manba
> Fazalar SPEC §11 jadvali va §12 promtlaridan olingan. Har faza: maqsad, asosiy ishlar va **Tugadi mezoni** (acceptance).

## Faza 0
### ✅ Faza 0 — Skeleton va Docker (TUGADI)
**Maqsad:** `docker compose up` bilan butun stek ko'tariladigan ishlaydigan skelet (biznes-logikasiz).
- [x] Monorepo: `/backend` (Django+DRF), `/frontend` (Next.js+PWA), `/docker`.
- [x] Django apps skeleti: `common`, `accounts`, `content`, `learning`, `gamification`, `media`, `billing` (hozircha modelsiz).
- [x] Docker Compose: db (postgres:16), redis:7, minio, backend, worker, beat, frontend, nginx, backup → [[05-DevOps/Docker-Setup]].
- [x] Next.js + TypeScript + Tailwind + PWA + TanStack Query + Zustand.
- [x] `/api/health/` → 200; frontend asosiy sahifa ochiladi.
- **Tugadi mezoni:** `docker compose up` → API health 200, frontend ochiladi, migratsiyalar o'tadi, Celery worker ulanadi. ✅

## Faza 1
### 🟡 Faza 1 — Autentifikatsiya + ota-ona akkaunti + bola profillari
**Maqsad:** Ota-ona ro'yxatdan o'tib kiradi, bir nechta bola profili yaratadi (SPEC §8).
- [ ] `ParentAccount` modeli (email/telefon + parol), JWT (SimpleJWT): register/login/refresh/me → [[06-Modullar/Accounts]].
- [ ] **Custom `AUTH_USER_MODEL`** (toza DB ustida) — skeleton'dagi standart User o'rniga.
- [ ] `ChildProfile` (parentga bog'liq: display_name, avatar_id, age_band, l1_locale, ixtiyoriy PIN).
- [ ] API: profil CRUD + "profilga o'tish" (parent sessiyasi ichida child-context token); bolaga alohida login YO'Q.
- [ ] Frontend: ro'yxat/kirish ekranlari + bolabop profil tanlash (avatar, ovozli salom).
- [ ] Parent Gate komponenti ("uzoq bosib turing" / matematik misol) → [[01-Loyiha/Foydalanuvchi-Rollari]].
- **Tugadi mezoni:** Ota-ona ro'yxatdan o'tadi/kiradi, 2+ bola profili yaratadi, profilga o'tadi; Parent Gate'siz sozlamaga kirib bo'lmaydi.

## Faza 2
### 🔲 Faza 2 — Kontent modeli + Django Admin + seed
**Maqsad:** Admin'da so'z/harf/dars kiritish va demo kontent (SPEC §3, §10).
- [ ] Modellar (content): Language, Level, Theme/Unit, Lesson, LessonStep(intro|practice|mastery), Letter, Word, Phrase, GameType, Story, StoryNode, Song, Media → [[06-Modullar/Kontent]].
- [ ] Django Admin inline'lar (Theme→Lesson→LessonStep), media yuklash maydonlari.
- [ ] `seed_content`: ru/Level 1, 1-harf guruhi (А,О,К,М,Т,С,Н,И), 2 mavzu (Hayvonlar (uy), Ranglar), GameType katalogi (11 mexanika) → [[06-Modullar/Oyin-Mexanikalari]].
- **Tugadi mezoni:** Admin'da kontent ko'rinadi/tahrirlanadi; `seed_content` demo darslarni yaratadi; GameType katalogi to'la.

## Faza 3
### 🔲 Faza 3 — Media pipeline + kontent API
**Maqsad:** Frontend kontentni media URL'lari bilan to'liq o'qiy oladi (SPEC §9.2, §7.3).
- [ ] MinIO/S3 yuklash; `Media`(storage_key, duration, meta); Celery: audio normalize/transcode (mp3/ogg), rasm resize → [[06-Modullar/Media]].
- [ ] `GET /api/curriculum/` — bola darajasiga mos Level→Theme→Lesson daraxti (rivoj holati bilan).
- [ ] `GET /api/lesson/{id}/` — step'lar + so'z/harf/media + GameType konfiglari → [[02-Arxitektura/API-Dizayni]].
- [ ] Optimallashtirish: Redis kesh + ETag (kontent kamdan-kam o'zgaradi).
- **Tugadi mezoni:** Frontend `/api/curriculum` va `/api/lesson` orqali to'liq kontentni (media URL'lari bilan) oladi.

## Faza 4
### 🔲 Faza 4 — Dizayn tizimi + bolalar UI qobig'i (PWA)
**Maqsad:** Ovozli, animatsiyali, bolabop, navigatsiyali qobiq (SPEC §7).
- [ ] Dizayn tokenlari (CSS o'zgaruvchilari): issiq/rang-ko'r xavfsiz palitra, yumaloq shakllar, spacing/radius → [[06-Modullar/Dizayn-Tizimi]].
- [ ] Komponentlar: ulkan tugma (80–100px), kartochka, modal, Mishka maskot (idle/cheer/think/celebrate).
- [ ] Audio-birinchi: `useAudio` hook — har element bosilganda nomi yangraydi; matnga tayanmaslik.
- [ ] Uy ekrani: Mishka + sayohat xaritasi (Level→Theme vizual yo'l/orol); Framer Motion o'tishlar; PWA o'rnatiladigan, splash screen.
- **Tugadi mezoni:** Bola xaritada yuradi, mavzu tanlaydi, har teginish ovoz+animatsiya beradi; ulkan nishonlar; matnga tayanmaydi; PWA o'rnatiladi.

## Faza 5
### 🔲 Faza 5 — O'yin dvigateli + dastlabki 3 mexanika
**Maqsad:** Bola haqiqiy darsni boshidan oxiriga o'ynaydi (SPEC §5).
- [ ] Data-driven "GamePlayer" (mexanika kontentdan mustaqil); oqim: intro → practice → mastery → natija → [[06-Modullar/Oyin-Mexanikalari]].
- [ ] Feedback: to'g'ri (Mishka quvonadi, konfetti, tovush) / xato (jazo yo'q, maslahat, qayta urinish).
- [ ] 3 mexanika: Eshit va bos, Juftla (memory), Topib ber (TPR). 3–4 yosh: 2 variant, taymer yo'q.
- [ ] Har javob lokal holatga yoziladi (Faza 6'da backendga ulanadi).
- **Tugadi mezoni:** Bola darsni 3 mexanika bilan o'ynaydi, to'g'ri/xato feedback ishlaydi, natija ekrani chiqadi.

## Faza 6
### 🔲 Faza 6 — SRS dvigateli (ko'rinmas takrorlash) — 🧠 YADRO
**Maqsad:** Ko'rinmas, kengayuvchi intervalli takrorlash ishlaydi — loyihaning yuragi (SPEC §4).
- [ ] `ChildWordState` (Leitner box 1–6, due_at, exposures, last_result, receptive/expressive mastery), `ChildLetterState` → [[06-Modullar/SRS-Learning]].
- [ ] `LearningEvent` (child, item, game_type, is_correct, latency_ms, hint_used, session_id, ts).
- [ ] SRS xizmati: `record_result`, `get_due(limit)`, `get_session_queue` = interleave(due, yangi) semantik interferensiyani oldini olib → [[02-Arxitektura/SRS-Dvigateli]].
- [ ] API: `POST /api/learning/event/`, `GET /api/learning/session/`; frontend outbox/sync.
- [ ] MVP: Leitner; interfeys FSRS-lite'ga o'tishga tayyor.
- **Tugadi mezoni:** O'rganilgan so'z kengayuvchi intervallarda qaytadi; xato so'z tezroq qaytadi; barcha javoblar `LearningEvent`'ga yoziladi; navbat due+yangi'ni aralashtiradi.

## Faza 7
### 🔲 Faza 7 — Kirill treki (harflar, yozish, fonetika)
**Maqsad:** Alifbo o'rganish to'liq (SPEC §3 Trek A, §5 #4–7).
- [ ] Harf chizish (tracing): Canvas/SVG kontur bo'ylab, yo'nalish ko'rsatkichi, Mishka rag'bati.
- [ ] Harf o'yinlari: "Harf ovi", "Qaysi tovush?", mnemonik tasvir bilan tanishtirish; "Bo'g'in/So'z qur" (6+).
- [ ] Harflar SRS'ga ulanadi (`ChildLetterState`); guruhlash tartibi oson→qiyin → [[06-Modullar/SRS-Learning]].
- **Tugadi mezoni:** Bola harf chizadi, tovushni harf bilan bog'laydi, harf o'yinlarini o'ynaydi; harflar SRS bo'yicha takrorlanadi.

## Faza 8
### 🔲 Faza 8 — Geymifikatsiya + ota-ona paneli
**Maqsad:** Muvozanatli motivatsiya + ota-ona nazorati (SPEC §6, §8).
- [ ] Mukofotlar: stiker/yulduzcha (kamtarona), yig'iladigan dunyo (bog'/zoo/xona), Mishka customization → [[06-Modullar/Geymifikatsiya]].
- [ ] Sayohat xaritasida vizual ilgarilash, Mishka boy reaksiyalar; ANTI-naqsh: ball/liderboard yo'q (kichiklar).
- [ ] Ota-ona paneli (Parent Gate ortida): rivoj/mastery foizi, vaqt cheklovi, haftalik hisobot, profil boshqaruvi.
- **Tugadi mezoni:** Bola mukofot oladi, dunyosini quradi; ota-ona panelda aniq rivojni ko'radi va vaqtni boshqaradi.

## Faza 9
### 🔲 Faza 9 — Ertak rejimi (TPRS) + qo'shiqlar
**Maqsad:** Kontekstli o'rganish (SPEC §2.3, §5 #8–9).
- [ ] Ertak (TPRS): tanlovli (choose-your-path) qisqa ertaklar (Story/StoryNode), RICH tamoyili; har sahna rasm+audio+tanlov → [[06-Modullar/Kontent]].
- [ ] Qo'shiq rejimi: tematik qo'shiqlar (audio + animatsiya + so'z urg'usi).
- [ ] Ertak/qo'shiqdagi so'zlar `LearningEvent` + SRS'ga ulanadi → [[06-Modullar/SRS-Learning]].
- **Tugadi mezoni:** Bola tanlovli ertakni o'ynaydi, qo'shiq tinglaydi; kontentdagi so'zlar takrorlash dvigateliga qo'shiladi.

## Faza 10
### 🔲 Faza 10 — Offline/PWA + sync + sayqal + analitika
**Maqsad:** Beqaror internetda ishlaydi, hisobotlar (SPEC §9.3).
- [ ] Service Worker: joriy mavzu darslari + media keshlanadi → oflayn o'yin.
- [ ] Outbox/sync: oflayn `LearningEvent`'lar saqlanadi, onlayn bo'lganda idempotent yuboriladi; konflikt yechimi (SRS holati).
- [ ] Analitika dashboard (ichki): faollik, o'zlashtirish egri chizig'i, qiyin so'zlar; umumiy sayqal (yuklanish, animatsiya, audio kechikishi).
- **Tugadi mezoni:** Internetsiz bola o'ynaydi; ulanish tiklanganda rivoj sync bo'ladi; analitika ko'rsatkichlari ishlaydi.

## Faza 11
### 🔲 Faza 11 — Kelajak (ixtiyoriy kengaytmalar)
**Maqsad:** Mahsulotni kengaytirish (SPEC §11, §12).
- [ ] Ovoz tanish (ASR): "Aytib ber" o'yini — ekspressiv mastery.
- [ ] AI-tutor: Claude API orqali shaxsiy rag'bat, adaptiv hikoya.
- [ ] B2B brending paneli: `/api/config/`, `ModuleLicense` → [[06-Modullar/Billing]].
- [ ] Ko'p o'yinchi; adaptiv qiyinlik (`LearningEvent` ma'lumotidan).
- **Tugadi mezoni:** Kamida bitta kengaytma (ASR yoki B2B brending) ishlab chiqarishda.

## 📊 Holat jadvali

| Faza | Holat | Maqsadli sana |
|---|---|---|
| Faza 0 — Skeleton + Docker | ✅ tugadi | 2026-06-25 |
| Faza 1 — Auth + profillar | 🟡 boshlanmoqda | 2026-07-10 |
| Faza 2 — Kontent + Admin + seed | 🔲 rejada | 2026-07-24 |
| Faza 3 — Media + kontent API | 🔲 rejada | 2026-08-07 |
| Faza 4 — Dizayn + bolalar qobig'i | 🔲 rejada | 2026-08-21 |
| Faza 5 — O'yin dvigateli (3 mexanika) | 🔲 rejada | 2026-09-04 |
| Faza 6 — SRS dvigateli (yadro) | 🔲 rejada | 2026-09-25 |
| Faza 7 — Kirill treki | 🔲 rejada | 2026-10-09 |
| Faza 8 — Geymifikatsiya + ota-ona paneli | 🔲 rejada | 2026-10-23 |
| Faza 9 — Ertak (TPRS) + qo'shiqlar | 🔲 rejada | 2026-11-06 |
| Faza 10 — Offline/PWA + sync + analitika | 🔲 rejada | 2026-11-20 |
| Faza 11 — Kelajak (ASR/AI/B2B) | 🔲 rejada | 2026-12+ |
