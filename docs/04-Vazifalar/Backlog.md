---
title: Backlog — Qilinadigan ishlar
type: vazifa-board
tags: [vazifa, backlog, todo]
status: aktiv
created: 2026-06-26
---

# 📥 Backlog — Qilinadigan ishlar

> Bog'liq: [[04-Vazifalar/Jarayonda|🔄 Jarayonda]] · [[04-Vazifalar/Bajarilgan|✅ Bajarilgan]] · [[03-Reja/Bosqichlar|🪜 Bosqichlar]] · [[SPEC]]
> Bu fayl **Obsidian Tasks** formatida. Vazifa boshlanganda `[ ]` qoladi, [[04-Vazifalar/Jarayonda|Jarayonda]]'ga
> ko'chiriladi; tugaganda `[x]` qilinib [[04-Vazifalar/Bajarilgan|Bajarilgan]]'ga o'tadi.
> Teglar: #modul/... (sohasi) + #prioritet/high|med|low. Fazalar — [[SPEC]] §12.
> **Faza 0** allaqachon bajarilgan → bu yerda yo'q, [[04-Vazifalar/Bajarilgan|Bajarilgan]]'da.

## 🟦 Faza 1 — Auth + ota-ona akkaunti + bola profillari
- [ ] Toza DB'da custom `AUTH_USER_MODEL` ga o'tish (skeleton standart User'dan) #modul/accounts #prioritet/high → [[06-Modullar/Accounts|👤 Accounts]]
- [ ] `ParentAccount` modeli (email/telefon + parol) #modul/accounts #prioritet/high → [[06-Modullar/Accounts]]
- [ ] JWT (SimpleJWT): register / login / refresh / me #modul/accounts #prioritet/high → [[02-Arxitektura/API-Dizayni|🔌 API dizayni]]
- [ ] `ChildProfile` modeli (display_name, avatar_id, age_band, l1_locale, ixtiyoriy PIN) #modul/accounts #prioritet/high
- [ ] Profil CRUD + "profilga o'tish" (child-context token) API #modul/accounts #prioritet/high → [[01-Loyiha/Foydalanuvchi-Rollari|👥 Rollar]]
- [ ] Frontend: ota-ona ro'yxat/kirish ekranlari #modul/frontend #prioritet/high
- [ ] Frontend: bolabop profil tanlash (kartochka + avatar + ovozli salom) #modul/frontend
- [ ] Parent Gate komponenti (uzoq bosish yoki matematik misol) #modul/frontend #prioritet/high → [[02-Arxitektura/Xavfsizlik|🔐 Xavfsizlik]]
- [ ] i18n karkasi (next-intl) — UI o'zbek, RU tarjimaga tayyor #modul/frontend #prioritet/low

## 🟦 Faza 2 — Kontent modeli + Admin + seed
- [ ] Modellar: Language, Level, Theme/Unit, Lesson, LessonStep(intro|practice|mastery) #modul/kontent #prioritet/high → [[06-Modullar/Kontent|📚 Kontent]]
- [ ] Modellar: Letter, Word, Phrase, GameType, Story, StoryNode, Song, Media #modul/kontent #prioritet/high → [[02-Arxitektura/Malumotlar-Bazasi|🗄️ Ma'lumotlar bazasi]]
- [ ] Django Admin inline'lar (Lesson↔Step, Theme↔Lesson) + media yuklash #modul/kontent
- [ ] `seed_content` management buyrug'i: ru tili + Level 1 #modul/kontent #prioritet/high
- [ ] Seed: 1-harf guruhi (А О К М Т С Н И) char/sound/placeholder media bilan #modul/kontent
- [ ] Seed: 2 mavzu ("Hayvonlar", "Ranglar") — lemma, translit, uz tarjima, is_cognate_uz #modul/kontent
- [ ] GameType katalogi — §5 jadvalidagi 11 mexanika (key, skill, min_age_band, schema_json) #modul/oyin → [[06-Modullar/Oyin-Mexanikalari|🎮 O'yin mexanikalari]]

## 🟦 Faza 3 — Media pipeline + kontent API
- [ ] MinIO/S3 ga yuklash + `Media` (storage_key, duration, meta) #modul/media #prioritet/high → [[06-Modullar/Media|🎨 Media]]
- [ ] Celery task: audio normalize/transcode (mp3/ogg), rasm resize/optimize #modul/media → [[05-DevOps/Docker-Setup|🐳 Docker]]
- [ ] `GET /api/curriculum/` — bola darajasiga mos Level→Theme→Lesson daraxti (rivoj holati) #modul/kontent #prioritet/high → [[02-Arxitektura/API-Dizayni]]
- [ ] `GET /api/lesson/{id}/` — step'lar + so'z/harf/media + GameType konfiglari #modul/kontent #prioritet/high
- [ ] Javoblar media URL'lari bilan to'liq (frontend qo'shimcha so'rovsiz o'ynaydi) #modul/kontent
- [ ] Kesh (Redis) + ETag — kontent kamdan-kam o'zgaradi #modul/kontent #prioritet/med

## 🟦 Faza 4 — Dizayn tizimi + bolalar UI qobig'i (PWA)
- [ ] Dizayn tokenlari (palitra, yumaloq shakl, spacing, radius, soya) #modul/dizayn #prioritet/high → [[06-Modullar/Dizayn-Tizimi|🎨 Dizayn tizimi]]
- [ ] Komponentlar: ulkan tugma (80–100px), kartochka, modal #modul/dizayn
- [ ] Mishka maskot komponenti (idle/cheer/think/celebrate — Lottie/sprite) #modul/dizayn #prioritet/high → [[06-Modullar/Geymifikatsiya|🐻 Geymifikatsiya]]
- [ ] `useAudio` hook — audio-birinchi, har element bosilganda nomi yangraydi #modul/frontend #prioritet/high
- [ ] Uy ekrani: Mishka + sayohat xaritasi (Level→Theme orol ko'rinishida) #modul/frontend
- [ ] Maskot/ikona navigatsiya (matnli menyu emas) + Framer Motion o'tishlar #modul/frontend
- [ ] PWA: o'rnatiladigan, to'liq ekran, splash #modul/frontend #prioritet/med

## 🟦 Faza 5 — O'yin dvigateli + dastlabki 3 mexanika
- [ ] Umumiy "GamePlayer" arxitekturasi (mexanika kontentdan mustaqil) #modul/oyin #prioritet/high → [[06-Modullar/Oyin-Mexanikalari]]
- [ ] Dars oqimi: intro → practice → mastery → natija ekrani #modul/oyin #prioritet/high
- [ ] Feedback: to'g'ri (Mishka quvonadi/konfetti) / xato (jazo yo'q, maslahat) #modul/oyin
- [ ] Mexanika 1 — "Eshit va bos" (audio → to'g'ri rasmni bos) #modul/oyin #prioritet/high
- [ ] Mexanika 2 — "Juftla" (memory: rasm↔audio/rasm↔rasm) #modul/oyin
- [ ] Mexanika 3 — "Topib ber" (TPR: "Покажи кошку!") #modul/oyin
- [ ] Javob lokal holatga yoziladi (Faza 6'da backendga ulanadi) #modul/frontend #prioritet/med

## 🟦 Faza 6 — SRS dvigateli (ko'rinmas takrorlash) — yadro
- [ ] `ChildWordState` (Leitner box 1–6, due_at, exposures, last_result, mastery) #modul/srs #prioritet/high → [[06-Modullar/SRS-Learning|🧠 SRS dvigateli]]
- [ ] `ChildLetterState` (harflar uchun shunga o'xshash) #modul/srs → [[02-Arxitektura/SRS-Dvigateli|🧠 SRS dizayni]]
- [ ] `LearningEvent` (child, item, game_type, is_correct, latency_ms, hint_used, session_id, ts) #modul/srs #prioritet/high
- [ ] SRS xizmati: `record_result` / `get_due` / `get_session_queue` (interleave + interferensiya) #modul/srs #prioritet/high
- [ ] `POST /api/learning/event/` + `GET /api/learning/session/` #modul/srs #prioritet/high → [[02-Arxitektura/API-Dizayni]]
- [ ] Frontend: sessiya navbati olinadi; har javob POST event (offline → outbox) #modul/frontend
- [ ] FSRS-lite (stability/difficulty) ga o'tish uchun interfeysni moslash #modul/srs #prioritet/low

## 🟦 Faza 7 — Kirill treki (harflar, yozish, fonetika)
- [ ] Harf chizish (tracing): Canvas/SVG kontur + yo'nalish ko'rsatkichi + Mishka rag'bati #modul/kontent #prioritet/high → [[06-Modullar/Kontent]]
- [ ] Harf o'yinlari: "Harf ovi", "Qaysi tovush?", mnemonik tasvir #modul/oyin
- [ ] "Bo'g'in/So'z qur" (6+): harf/bo'g'indan so'z yig'ish #modul/oyin #prioritet/med
- [ ] Harflarni SRS'ga ulash (`ChildLetterState`) #modul/srs

## 🟦 Faza 8 — Geymifikatsiya + ota-ona paneli
- [ ] Mukofotlar: stiker/yulduzcha (kamtarona), yig'iladigan dunyo (bog'/zoo/xona) #modul/geymifikatsiya #prioritet/high → [[06-Modullar/Geymifikatsiya]]
- [ ] Mishka customization + sayohat xaritasida vizual ilgarilash #modul/geymifikatsiya
- [ ] ANTI-naqsh tekshiruvi: ball/liderboard/jazo/streak ayblovi yo'q #modul/geymifikatsiya #prioritet/high → [[01-Loyiha/Pedagogik-Asos|📖 Pedagogik asos]]
- [ ] Ota-ona paneli: har bola rivoji (o'rganilgan/o'zlashtirilgan, mastery %, faollik) #modul/accounts #prioritet/high → [[06-Modullar/Accounts]]
- [ ] Vaqt cheklovi (kunlik limit) + haftalik hisobot xulosalari #modul/accounts
- [ ] Profil/avatar boshqaruvi (Parent Gate ortida) #modul/accounts

## 🟦 Faza 9 — Ertak rejimi (TPRS) + qo'shiqlar
- [ ] Ertak rejimi (Story/StoryNode): tanlovli interaktiv ertaklar (RICH tamoyili) #modul/kontent #prioritet/med → [[06-Modullar/Kontent]]
- [ ] Har sahna: rasm + audio + tanlov #modul/kontent
- [ ] Qo'shiq rejimi: tematik audio + animatsiya + so'z urg'usi #modul/media → [[06-Modullar/Media]]
- [ ] Ertak/qo'shiq so'zlarini LearningEvent + SRS'ga ulash #modul/srs → [[06-Modullar/SRS-Learning]]

## 🟦 Faza 10 — Offline/PWA + sync + sayqal + analitika
- [ ] Service Worker: joriy mavzu darslari + media keshlanadi (oflayn o'yin) #modul/frontend #prioritet/high
- [ ] Outbox/sync: oflayn LearningEvent saqlanadi, onlayn bo'lganda idempotent yuboriladi #modul/srs #prioritet/high → [[06-Modullar/SRS-Learning]]
- [ ] Konflikt yechimi (last-write yoki server-merge) SRS holati uchun #modul/srs
- [ ] Analitika dashboard (faollik, o'zlashtirish egri chizig'i, qiyin so'zlar) #modul/accounts #prioritet/med
- [ ] Umumiy sayqal: yuklanish, animatsiya, audio kechikishi, xatoliklar #modul/frontend

## 🟦 Faza 11 — Kelajak (ixtiyoriy kengaytmalar)
- [ ] Ovoz tanish (ASR) — "Aytib ber" o'yini (ekspressiv mastery) #modul/srs #prioritet/low
- [ ] AI-tutor (Claude API): shaxsiy rag'bat, adaptiv hikoya #modul/oyin #prioritet/low
- [ ] B2B brending paneli (`/api/config/`, `ModuleLicense`) #modul/billing #prioritet/low → [[06-Modullar/Billing|💳 Billing]]
- [ ] Ko'p o'yinchi (ota-ona–bola rejimi) #modul/oyin #prioritet/low
- [ ] Adaptiv qiyinlik (LearningEvent'dan tempo moslash) #modul/srs #prioritet/low
