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
> **Faza 0, 1, 2, 2.5, 3, 4, 5** yakunlandi — natijalar [[04-Vazifalar/Bajarilgan|✅ Bajarilgan]]'da.
> Hozir taxta **bo'sh**: Faza 6'ga tayyorgarlik.

## 🟡 Faza 6 ga tayyorgarlik
Faza 6 ([[SPEC]] §4) — SRS (FSRS-lite) + rivoj + Takrorlash o'yini. Boshlashdan oldin:

- [ ] **Backend:** `LearningEvent` qabul (`POST /learning/event/`, bola-kontekst, idempotent) + SRS holati (`ItemState`) #modul/srs → [[06-Modullar/SRS-Learning|🔁 SRS]]
- [ ] **`get_due` / session navbat:** due+new interleave; `/curriculum` `progress.status` REAL (locked/started/done) #modul/srs
- [ ] **Frontend ulanish (GamePlayer O'ZGARMAYDI — ADR-010):** `recordResult` → `POST /learning/event/` (outbox sync); `buildSessionQueue` due so'zlarni oladi #modul/games
- [ ] Takrorlash o'yini (mexanika #11 — aralash due) registry plugin sifatida #modul/games

> [!tip] Pull nomzodlari (WIP ≤ 3)
> 1. Backend SRS (`ItemState` + FSRS-lite `get_due` + `LearningEvent` endpoint) `#prioritet/high`
> 2. Frontend ulanish: outbox→event sync + `buildSessionQueue(due)` + REAL progress `#prioritet/high`
> 3. Rivoj/progress ko'rsatish (xaritada status) + Takrorlash o'yini plugin `#prioritet/medium`

## ⛔ Bloklangan (Blocked)
_(Yo'q)_

## 📋 WIP siyosati
| Qoida | Qiymat |
|---|---|
| Maksimal jarayondagi vazifa | ≤ 3 |
| Yangi tortishdan oldin | avval boshlangan vazifani yopish |
| Bloklangan vazifa | "Bloklangan"ga ko'chiriladi, WIP'dan chiqmaydi |
| Manba | faqat [[04-Vazifalar/Backlog\|📥 Backlog]] (faza tartibida) |
