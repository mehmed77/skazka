---
title: Funksional Talablar
type: tahlil
tags: [loyiha, talablar, funksional, prioritet/high]
status: tasdiqlangan
created: 2026-06-26
---

# ✅ Funksional Talablar (FR)

> [!abstract] Bog'liq: [[01-Loyiha/SPEC-Tahlili|📄 SPEC tahlili]] · [[01-Loyiha/Nofunksional-Talablar|⚙️ NFR]] · [[03-Reja/Bosqichlar|🪜 Bosqichlar]] · barcha [[06-Modullar/Accounts|modullar]]

Har talab `FR-XX` kodiga ega, modul/fazaga bog'lanadi. Manba: [[SPEC]] §1–§10.

## 🔐 FR-01 — Auth + ota-ona akkaunti
Email/telefon + parol, JWT (register/login/refresh/me); Parent Gate → [[06-Modullar/Accounts]].

## 👤 FR-02 — Bola profillari
Bir ota-ona → ko'p `ChildProfile` (display_name, avatar, age_band, l1=uz, PIN); profilga o'tish (child-context).

## 📚 FR-03 — Kontent modeli + Admin
Language→Level→Theme→Lesson→LessonStep, Letter, Word, Phrase, GameType, Story, Song; Django Admin + `seed_content` → [[06-Modullar/Kontent]].

## 🔌 FR-04 — Media pipeline + kontent API
MinIO yuklash, Celery transcode/resize; `GET /api/curriculum/`, `GET /api/lesson/{id}/` (media URL bilan) → [[06-Modullar/Media]], [[02-Arxitektura/API-Dizayni]].

## 🎨 FR-05 — Bolalar UI qobig'i (audio-first, PWA)
Mishka, sayohat xaritasi, ulkan nishon (80–100px), `useAudio`, matnsiz → [[06-Modullar/Dizayn-Tizimi]].

## 🎮 FR-06 — O'yin dvigateli (data-driven)
Umumiy GamePlayer; intro→practice→mastery oqimi; 11 mexanika kontentdan mustaqil → [[06-Modullar/Oyin-Mexanikalari]].

## 🧠 FR-07 — SRS (ko'rinmas takrorlash)
`ChildWordState`/`ChildLetterState` (Leitner), `LearningEvent`, `get_session_queue` (due+yangi interleave) → [[02-Arxitektura/SRS-Dvigateli]], [[06-Modullar/SRS-Learning]].

## 🔤 FR-08 — Kirill treki
Tracing (Canvas), harf o'yinlari, fonetika; harflar SRS'ga ulanadi → [[06-Modullar/Oyin-Mexanikalari#Kirill]].

## ✅ FR-09 — Geymifikatsiya + ota-ona panel
Stiker/kolleksiya/Mishka customization (ichki-yo'naltirilgan); rivoj, vaqt cheklovi, hisobot → [[06-Modullar/Geymifikatsiya]].

## 📖 FR-10 — Ertak (TPRS) + qo'shiqlar
Tanlovli Story/StoryNode, tematik qo'shiq; so'zlar LearningEvent + SRS'ga ulanadi → [[06-Modullar/Kontent#Ertak]].

## ♻️ FR-11 — Offline / sync
Service Worker kesh (joriy mavzu + media); outbox/sync (idempotent); konflikt yechimi → [[05-DevOps/Docker-Setup]], [[06-Modullar/SRS-Learning#Offline]].

## 💳 FR-12 — Billing / B2B (kelajak)
Subscription, Institution, ModuleLicense, BrandingConfig (`/api/config/`) → [[06-Modullar/Billing]].

## 🔗 Talablarni kuzatish (Traceability)

| FR | Modul | Faza | Holat |
|---|---|---|---|
| FR-01 | [[06-Modullar/Accounts]] | [[03-Reja/Bosqichlar#Faza 1]] | 🔲 |
| FR-02 | [[06-Modullar/Accounts]] | [[03-Reja/Bosqichlar#Faza 1]] | 🔲 |
| FR-03 | [[06-Modullar/Kontent]] | [[03-Reja/Bosqichlar#Faza 2]] | 🔲 |
| FR-04 | [[06-Modullar/Media]] | [[03-Reja/Bosqichlar#Faza 3]] | 🔲 |
| FR-05 | [[06-Modullar/Dizayn-Tizimi]] | [[03-Reja/Bosqichlar#Faza 4]] | 🔲 |
| FR-06 | [[06-Modullar/Oyin-Mexanikalari]] | [[03-Reja/Bosqichlar#Faza 5]] | 🔲 |
| FR-07 | [[06-Modullar/SRS-Learning]] | [[03-Reja/Bosqichlar#Faza 6]] | 🔲 |
| FR-08 | [[06-Modullar/Oyin-Mexanikalari]] | [[03-Reja/Bosqichlar#Faza 7]] | 🔲 |
| FR-09 | [[06-Modullar/Geymifikatsiya]] | [[03-Reja/Bosqichlar#Faza 8]] | 🔲 |
| FR-10 | [[06-Modullar/Kontent]] | [[03-Reja/Bosqichlar#Faza 9]] | 🔲 |
| FR-11 | [[06-Modullar/SRS-Learning]] | [[03-Reja/Bosqichlar#Faza 10]] | 🔲 |
| FR-12 | [[06-Modullar/Billing]] | [[03-Reja/Bosqichlar#Faza 11]] | 🔲 |

> Belgilar: 🔲 rejada · 🟡 jarayonda · ✅ bajarilgan. Faza 0 (skeleton) ✅ → [[03-Reja/Bosqichlar#Faza 0]].
