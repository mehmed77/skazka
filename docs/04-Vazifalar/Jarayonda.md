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
> **Faza 0 (Skeleton va Docker) yakunlandi** — barcha natijalar [[04-Vazifalar/Bajarilgan#✅ Faza 0 — Skeleton (2026-06-26)|Bajarilgan]]'da.
> Hozir taxta **bo'sh**: ✅ Faza 1'ga tayyorgarlik bosqichi.

## 🟡 Faza 1 ga tayyorgarlik
Faza 1 ([[SPEC]] §12) — Auth + ota-ona akkaunti + bola profillari. Boshlashdan oldin:

- [ ] Toza DB rejasi: custom `AUTH_USER_MODEL` ni qachon kiritish (migratsiyalar tartibi) #modul/accounts → [[06-Modullar/Accounts|👤 Accounts]]
- [ ] `ParentAccount` / `ChildProfile` maydonlarini [[02-Arxitektura/Malumotlar-Bazasi|🗄️ baza]] bilan moslashtirish #modul/accounts
- [ ] Parent Gate UX qarori (uzoq bosish vs matematik misol) — [[06-Modullar/Dizayn-Tizimi|🎨 dizayn]] bilan #modul/frontend

> [!tip] Pull nomzodlari (WIP ≤ 3)
> Tayyorgarlik tugagach, [[04-Vazifalar/Backlog#🟦 Faza 1 — Auth + ota-ona akkaunti + bola profillari|Backlog Faza 1]]'dan birinchi tortiladigan vazifalar:
> 1. Custom `AUTH_USER_MODEL` ga o'tish (toza DB ustida) `#prioritet/high`
> 2. `ParentAccount` modeli + JWT (register/login/refresh/me) `#prioritet/high`
> 3. `ChildProfile` modeli + "profilga o'tish" child-context token `#prioritet/high`

## ⛔ Bloklangan (Blocked)
_(Yo'q)_

## 📋 WIP siyosati
| Qoida | Qiymat |
|---|---|
| Maksimal jarayondagi vazifa | ≤ 3 |
| Yangi tortishdan oldin | avval boshlangan vazifani yopish |
| Bloklangan vazifa | "Bloklangan"ga ko'chiriladi, WIP'dan chiqmaydi |
| Manba | faqat [[04-Vazifalar/Backlog\|📥 Backlog]] (faza tartibida) |
