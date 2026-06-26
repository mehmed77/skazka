---
title: docs vault — README
type: meta
tags: [meta, obsidian]
status: aktiv
created: 2026-06-26
---

# 📚 SKAZKA — Hujjatlar (Obsidian Vault)

> Bog'liq: [[00-Home|🏠 Bosh sahifa (MOC)]] · [[SPEC|📜 To'liq Spetsifikatsiya]] · [[03-Reja/Yol-Xaritasi|🛣️ Yo'l Xaritasi]]

Bu papka **Obsidian vault** sifatida ochilishi uchun moslangan.
Loyiha: **SKAZKA** — 3–7 yoshli bolalar uchun rus tilini o'yin orqali o'rgatuvchi
platforma (maskot — 🐻 Mishka). Stek: Django + DRF · Next.js (App Router, TS, PWA)
· PostgreSQL · Redis + Celery · MinIO · Docker.

> [!info] Yagona haqiqat manbai
> [[SPEC|📜 SPEC.md]] (vault ildizida) — loyihaning to'liq spetsifikatsiyasi
> (PRD + arxitektura + bosqichma-bosqich promtlar). Barcha notalar shunga tayanadi;
> ziddiyat bo'lsa — **SPEC ustun**. Notalar SPEC'ni takrorlamaydi, navigatsiya qiladi.

## 🚀 Qanday ochish
1. Obsidian'ni o'rnating (https://obsidian.md).
2. **Open folder as vault** → ushbu `docs/` papkasini tanlang.
3. [[00-Home]] dan boshlang (bosh MOC).

## 🔌 Tavsiya etilgan plaginlar
- **Dataview** — dinamik jadval/ro'yxatlar (masalan, faza/status bo'yicha).
- **Kanban** — vazifa doskalari ([[04-Vazifalar/Backlog]]).
- **Tasks** — `- [ ]` vazifalarni boshqarish.
- **Excalidraw** — diagrammalar (`mermaid` allaqachon ishlaydi).

## 🗂️ Tuzilma
```
docs/
├── SPEC.md                 # 📜 Yagona haqiqat manbai
├── 00-Home.md              # 🏠 Bosh MOC (shu yerdan boshlang)
├── README.md               # 📚 Shu fayl
├── 01-Loyiha/              # 🎯 Maqsad, pedagogika, rollar, talablar, SPEC tahlili
├── 02-Arxitektura/         # 🏛️ Stek, arxitektura, ERD, SRS dvigateli, API, xavfsizlik
├── 03-Reja/                # 🛣️ Roadmap, bosqichlar (fazalar), sprintlar
├── 04-Vazifalar/           # 📋 Backlog / Jarayonda / Bajarilgan (Kanban)
├── 05-DevOps/              # 🐳 Docker, Nginx, CI/CD, Deploy
├── 06-Modullar/            # 🧩 Accounts, Kontent, O'yin, SRS, Geym, Media, Billing, Dizayn
└── 99-Resurslar/           # 📚 Glossariy, havolalar, qarorlar jurnali (ADR)
```

## 🧾 Konvensiyalar
- **Frontmatter**: har faylda YAML — `title`, `type`, `tags`, `status`, `created`.
  Modul notalarida (06-Modullar) qo'shimcha `faza: Faza N` qatori.
- **Sarlavha**: frontmatterdan keyin emoji-li H1, so'ng `> Bog'liq:` blockquote (2–4 [[wikilink]]).
- **Wiki-havolalar**: `[[06-Modullar/SRS-Learning|🧠 SRS]]` — papka-to'liq yo'l + ko'rinadigan matn.
- **Teglar**: namespace bo'yicha — `#modul/srs`, `#prioritet/high`, `#faza/1`, `#loyiha`.
- **Callout**'lar: `> [!abstract]`, `> [!info]`, `> [!tip]`, `> [!warning]`, `> [!success]`, `> [!question]`.
- **Mermaid**: diagrammalar kod bloklarida (` ```mermaid `) — flowchart, erDiagram, stateDiagram, gantt.
- **Til**: O'zbek (lotin). Kontent tili — rus (maqsad) + o'zbek (L1 yordam).

## 📌 Loyiha holati
> [!success] Faza 0 ✅ tugadi
> Skeleton + Docker tayyor (`/api/health/` → 200). Modellar va biznes-logika
> keyingi fazalarda — [[03-Reja/Bosqichlar|🪜 Bosqichlar]] ga qarang.
> Joriy maqsad: [[03-Reja/Bosqichlar#Faza 1|Faza 1 — Auth + profillar]].
