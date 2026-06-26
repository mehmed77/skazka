---
name: docs-vault
description: SKAZKA loyiha hujjatlarini (docs/ Obsidian vault) yuritish — note frontmatter, wikilink, Kanban vazifalar, ADR. Reja/vazifa/arxitektura hujjatini yangilash yoki yangi modul note'i qo'shganda ishlat.
---

# SKAZKA hujjatlar (Obsidian vault) konvensiyalari

`docs/` — Obsidian vault (Maqola konvensiyasida). Yagona haqiqat manbai: `docs/SPEC.md`.
Bosh MOC: `docs/00-Home.md`. Til: **o'zbekcha**.

## Tuzilma (raqamlangan papkalar)
`01-Loyiha` (maqsad/pedagogika/talablar) · `02-Arxitektura` (stek/tizim/ERD/SRS/API/xavfsizlik) ·
`03-Reja` (yo'l xaritasi/bosqichlar/sprintlar) · `04-Vazifalar` (Kanban) · `05-DevOps` (docker/nginx/CI/deploy) ·
`06-Modullar` (har domen moduli) · `99-Resurslar` (glossariy/havolalar/ADR).

## Note formati (har faylda)
1. YAML frontmatter: `title`, `type` (moc|loyiha|pedagogika|tahlil|arxitektura|reja|vazifa-board|modul|devops|resurs|meta), `tags`, `status` (aktiv|tasdiqlangan|rejada|qoralama), `created`. Modul note'larida `faza: Faza N` ham.
2. H1 + emoji, so'ng `> Bog'liq:` qatori 2–4 ta `[[wikilink]]` bilan.
3. Wikilink — papka-yo'l bilan: `[[06-Modullar/SRS-Learning|🧠 SRS]]`, anker: `[[03-Reja/Bosqichlar#Faza 1]]`. To'liq spec: `[[SPEC]]`.
4. Callout'lar (`> [!info|tip|warning|success|abstract|question]`), jadval, va kerak bo'lsa `​```mermaid` diagramma.

## Vazifalar (Kanban — 04-Vazifalar)
- `Backlog.md` → `Jarayonda.md` (WIP ≤3) → `Bajarilgan.md`. Vazifa: `- [ ] tavsif #modul/area #prioritet/level → [[link]]`.
- Bajarilganda `[ ]`→`[x]` va `Bajarilgan.md` ga sana bilan ko'chir.

## Qarorlar (ADR — 99-Resurslar/Qaror-Jurnali.md)
Har muhim qaror: **Holat · Kontekst · Qaror · Oqibat** (+ ixtiyoriy "Ochiq savol"). Raqamlash ketma-ket (ADR-00N).

## Qoidalar
- Taxmin qilma — kontentni `SPEC.md` dan ol. Har FR/modul kamida bitta boshqa note'ga bog'lansin (traceability).
- Faza tugaganda: tegishli modul note status'ini yangila, vazifalarni `Bajarilgan.md` ga ko'chir, kerak bo'lsa yangi ADR qo'sh.
- `.obsidian/` repo'ga commit qilinmaydi (lokal). Plaginlar README'da tavsiya etilgan.
