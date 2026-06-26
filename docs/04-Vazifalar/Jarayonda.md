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
> **Faza 0, 1, 2** yakunlandi — natijalar [[04-Vazifalar/Bajarilgan|✅ Bajarilgan]]'da.
> Hozir taxta **bo'sh**: Faza 3'ga tayyorgarlik.

## 🟡 Faza 3 ga tayyorgarlik
Faza 3 ([[SPEC]] §9.2, §7.3) — Media pipeline + kontent API. Boshlashdan oldin:

- [ ] `config_json`/`schema_json` strukturasini Faza 5/6 nuqtai nazaridan ko'rib chiqish #modul/content → [[06-Modullar/Kontent|📚 Kontent]]
- [ ] Media public URL (`minio:9000`→`localhost:9000`/CDN) + RBAC download-proxy #modul/media → [[06-Modullar/Media|🎨 Media]]
- [ ] Kontent API shakli: `GET /api/v1/curriculum/`, `GET /api/v1/lesson/{id}/` (media URL bilan) #modul/content → [[02-Arxitektura/API-Dizayni|🔌 API]]

> [!tip] Pull nomzodlari (WIP ≤ 3)
> 1. Media Celery pipeline (audio normalize/transcode, rasm optimize) `#prioritet/high`
> 2. Kontent API (`/api/v1/curriculum`, `/api/v1/lesson/{id}`) + DRF serializerlar + Redis kesh/ETag `#prioritet/high`
> 3. Media RBAC download-proxy + public URL `#prioritet/medium`

## ⛔ Bloklangan (Blocked)
_(Yo'q)_

## 📋 WIP siyosati
| Qoida | Qiymat |
|---|---|
| Maksimal jarayondagi vazifa | ≤ 3 |
| Yangi tortishdan oldin | avval boshlangan vazifani yopish |
| Bloklangan vazifa | "Bloklangan"ga ko'chiriladi, WIP'dan chiqmaydi |
| Manba | faqat [[04-Vazifalar/Backlog\|📥 Backlog]] (faza tartibida) |
