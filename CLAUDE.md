# CLAUDE.md — SKAZKA loyiha konteksti

> Bu fayl Claude Code / Cursor uchun loyiha yo'riqnomasi. Yagona haqiqat manbai: **`docs/SPEC.md`**.
> Vazifaga oid batafsil yo'riqnomalar: **`.claude/skills/`** (`backend-app`, `frontend-feature`,
> `content-model`, `srs-engine`, `docs-vault`).

## Loyiha
**SKAZKA** — 3–7 yoshli bolalar uchun rus tilini o'yin orqali o'rgatuvchi platforma (ona tili: o'zbekcha).
Maskot/yo'lboshchi: **Mishka** (🐻). Farqlovchi xususiyat — *ko'rinmas so'z-yodlash dvigateli* (SRS, §4):
o'rganilgan so'z bolaning xotira holatiga qarab keyingi o'yin ichida qayta paydo bo'ladi.

Bu loyiha **Maqola** (`/home/muhammad/projects/Maqola`) loyihasi konvensiyalarida qurilgan — Docker,
papka tuzilishi, settings, Obsidian vault va hujjat uslubi aynan o'shanga amal qiladi.

## Stek
- **Backend:** Django 5 + DRF, JWT (SimpleJWT), Celery (worker+beat), PostgreSQL 16, Redis, MinIO (S3-mos media).
- **Frontend:** Next.js 14 (App Router) + TypeScript, Tailwind, TanStack Query + Zustand, PWA.
- **Infra:** Docker Compose (dev/prod/deploy), nginx reverse proxy. Til: **o'zbekcha** (UI i18n keyin: uz/ru).

## Struktura
```
backend/   Django: config/ (settings base/dev/prod, celery, urls) + apps/ (common, accounts,
           content, learning, gamification, media, billing) — hozircha modelsiz skeleton
frontend/  Next.js: app/ (App Router) + lib/ (api, cn, toast) + components/ui/ + public/ (PWA)
docker/    backend.Dockerfile, frontend.Dockerfile (multi-stage)
nginx/     dev.conf / prod.conf / prod-http.conf + proxy_params
docs/      Obsidian vault (00-Home MOC, 01..99 papkalar) + SPEC.md (to'liq spetsifikatsiya)
.claude/   skills/ (agent yo'riqnomalari) + settings
docker-compose{,.override,.prod,.deploy}.yml · Makefile · .env.example
```

## Ishga tushirish
```bash
cp .env.example .env          # (skeleton'da .env allaqachon bor)
docker compose up -d --build  # yoki: make up
# Tekshirish:
curl http://localhost:8080/api/health/   # {"status":"ok"}
# Frontend:  http://localhost:8080/      Admin: /admin/   API docs: /api/v1/docs/
make migrate | make superuser | make logs | make test | make lint
```
Portlar: nginx **8080**, postgres **5433** (override: 5434), minio **9000/9001**.

## Asosiy invariantlar (buzilmasin)
- **Faqat skeleton:** hozir biznes-logika/modellar YO'Q. Modellar SPEC §11 fazalarida qo'shiladi (Faza 0 = bu skeleton).
- **Audio-birinchi, matnsiz, ulkan nishonlar** — bola o'qiy olmaydi (§7).
- **Walled garden:** reklama/chat/tashqi havola yo'q; bolaga alohida login yo'q (ota-ona ichida). PII minimal (§8).
- **Ko'rinmas SRS** — retrieval o'yin ichida (§4); platformaning yadrosi.
- **Konvensiyani o'ylab topma** — Maqola'dan aniqla va amal qil; noaniq bo'lsa SPEC'ga qara yoki so'ra.
- **Custom User (✅ Faza 1):** `accounts.ParentAccount` (telefon/email + parol) = `AUTH_USER_MODEL`; bolada login yo'q.
- **Kontent kontrakti (✅ Faza 2.5 — ADR-010):** `LessonStep.config_json` = `{new_items:[{type,id}], games:[{type,...params}]}` — darsning **STATIK** yangi kontenti. SRS "muddati kelgan" so'zlar config'ga **YOZILMAYDI**; runtime sessiya-navbati qatlamida qo'shiladi: `interleave(SRS.get_due(child), step.new_items)`. Distractor tanlashda `Word.confusable_with` chiqariladi (`exclude_confusable`). Batafsil: `docs/SPEC.md` §4.4.

## Sifat
- Backend: `make lint` (ruff+black), `make test` (pytest). Frontend: `npm run typecheck`, `npm run build`, `npm run lint`.
- Har faza tugagach: docs vault'ni yangila (`docs-vault` skill), vazifalarni `04-Vazifalar/Bajarilgan.md` ga ko'chir.
