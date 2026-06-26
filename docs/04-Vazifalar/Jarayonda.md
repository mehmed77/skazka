---
title: Jarayonda — In Progress
type: vazifa-board
tags: [vazifa, jarayonda, wip]
status: aktiv
created: 2026-06-26
---

# 🔄 Jarayonda — In Progress

> Bog'liq: [[04-Vazifalar/Backlog|📥 Backlog]] · [[04-Vazifalar/Bajarilgan|✅ Bajarilgan]] · [[03-Reja/Sprintlar|🏃 Sprintlar]]
> WIP limiti: bir vaqtda **≤ 3** vazifa. Vazifa boshlanganda [[04-Vazifalar/Backlog|Backlog]]'dan
> bu yerga ko'chiriladi, tugaganda `[x]` qilinib [[04-Vazifalar/Bajarilgan|Bajarilgan]]'ga o'tadi.

> [!info] Hozirgi holat
> **Faza 0 (Skeleton)** va **Faza 1 (Auth + ota-ona + bola profillari)** yakunlandi —
> natijalar [[04-Vazifalar/Bajarilgan|✅ Bajarilgan]]'da. Hozir taxta **bo'sh**: Faza 2'ga tayyorgarlik.

## 🟡 Faza 2 ga tayyorgarlik
Faza 2 ([[SPEC]] §3, §10) — Kontent modeli + Django Admin + seed. Boshlashdan oldin:

- [ ] Kontent ierarxiyasini aniqlash: Language→Level→Theme→Lesson→LessonStep #modul/kontent → [[06-Modullar/Kontent|📚 Kontent]]
- [ ] Trek A (Letter) + Trek B (Word) maydonlarini [[02-Arxitektura/Malumotlar-Bazasi|🗄️ baza]] bilan moslashtirish #modul/kontent
- [ ] `GameType` katalogi sxemasi (§5 — 11 mexanika) #modul/kontent → [[06-Modullar/Oyin-Mexanikalari|🎮 O'yinlar]]

> [!tip] Pull nomzodlari (WIP ≤ 3)
> 1. `content` modellari (Language..Song) + migratsiya `#prioritet/high`
> 2. Django Admin (inline'lar: Lesson↔LessonStep, Theme↔Lesson) + media maydonlari `#prioritet/high`
> 3. `seed_demo` — ru Level 1, 1-harf guruhi, 2 mavzu, GameType katalogi `#prioritet/high`

## ⛔ Bloklangan (Blocked)
_(Yo'q)_

## 📋 WIP siyosati
| Qoida | Qiymat |
|---|---|
| Maksimal jarayondagi vazifa | ≤ 3 |
| Yangi tortishdan oldin | avval boshlangan vazifani yopish |
| Bloklangan vazifa | "Bloklangan"ga ko'chiriladi, WIP'dan chiqmaydi |
| Manba | faqat [[04-Vazifalar/Backlog\|📥 Backlog]] (faza tartibida) |
