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
> **Faza 0, 1, 2, 2.5, 3, 4, 5, 6** yakunlandi — natijalar [[04-Vazifalar/Bajarilgan|✅ Bajarilgan]]'da.
> Hozir taxta **bo'sh**: Faza 7'ga tayyorgarlik.

## 🟡 Faza 7 ga tayyorgarlik
Faza 7 ([[SPEC]] §5) — Harf/alifbo mexanikalari (harf_ovi, harf_chiz, qaysi_tovush, so'z_qur). Boshlashdan oldin:

- [ ] **Letter kontenti** seed + `/lesson` resolve (ResolvedLetterSerializer allaqachon bor) #modul/content → [[06-Modullar/Kontent]]
- [ ] **Harf mexanikalari = registry plugin** (ADR-012): harf_ovi, qaysi_tovush (reseptiv) + harf_chiz (motor), so'z_qur (ekspressiv) #modul/games → [[06-Modullar/Oyin-Mexanikalari|🎮 O'yinlar]]
- [ ] **SRS `letter` polimorfizmi:** `ItemState`/`recordResult` `item_type="letter"` (model TAYYOR — ADR-013); **ekspressiv_strength** so'z_qur'da haydaladi #modul/srs → [[06-Modullar/SRS-Learning]]

> [!tip] Pull nomzodlari (WIP ≤ 3)
> 1. Letter seed + lesson resolve + harf reseptiv mexanikalari (harf_ovi, qaysi_tovush) `#prioritet/high`
> 2. harf_chiz (motor — chizish) + so'z_qur (bo'g'in/harfdan so'z, ekspressiv) `#prioritet/high`
> 3. SRS letter polimorfizmi + ekspressiv_strength haydash `#prioritet/medium`
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
