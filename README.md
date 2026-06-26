# SKAZKA 🐻

**Bolalar uchun rus tili o'rgatuvchi platforma** (3–7 yosh, ona tili: o'zbekcha).
O'yin orqali, professional metodika (TPR, comprehensible input, interval takrorlash) bilan —
bola o'ynaydi, tizim uning xotirasini ko'rinmas SRS dvigateli orqali mustahkamlaydi. Yo'lboshchi: **Mishka**.

> **Stek:** Django 5 + DRF · Next.js 14 (App Router, TS, PWA) · PostgreSQL 16 · Redis + Celery · MinIO · Docker + nginx
> **Yagona haqiqat manbai:** [`docs/SPEC.md`](docs/SPEC.md). Loyiha hujjatlari: `docs/` (Obsidian vault, [00-Home](docs/00-Home.md)).
>
> ⚙️ Joriy holat: **Faza 0 — ishlaydigan skeleton** (biznes-logika/modellar keyingi fazalarda).

## Tezkor boshlash (lokal)

Talab: Docker + Docker Compose.

```bash
git clone <repo> skazka && cd skazka
cp .env.example .env        # qiymatlarni moslang (skeleton'da tayyor .env bor)
docker compose up -d --build   # yoki: make up
```

Hammasi ko'tarilgach:

| Nima | Manzil |
|---|---|
| Frontend (bosh sahifa) | http://localhost:8080/ |
| API health | http://localhost:8080/api/health/ → `{"status":"ok"}` |
| API config (brending) | http://localhost:8080/api/config/ |
| API docs (Swagger) | http://localhost:8080/api/v1/docs/ |
| Django admin | http://localhost:8080/admin/ |
| MinIO konsoli | http://localhost:9001/ |

```bash
make superuser   # admin yaratish (admin panelga kirish uchun)
make migrate     # migratsiyalar
make logs        # backend loglar
make test        # pytest
make lint        # ruff + black
make down        # to'xtatish
```

## Servislar (`docker compose`)

`db` (postgres:16) · `redis` (7) · `minio` (S3-mos media) · `backend` (Django) · `worker` (celery) ·
`beat` (celery beat) · `frontend` (Next.js) · `nginx` (reverse proxy) · `backup` (kunlik pg_dump).

Portlar: nginx **8080**, postgres **5433**, minio **9000/9001**.

## Tuzilma

```
backend/   Django (config/ + apps/: common, accounts, content, learning, gamification, media, billing)
frontend/  Next.js (app/ + lib/ + components/ + public/ PWA)
docker/    Dockerfile'lar (multi-stage)   nginx/  reverse proxy konfiglar
docs/      Obsidian vault + SPEC.md        .claude/skills/  agent yo'riqnomalari
docker-compose{,.override,.prod,.deploy}.yml · Makefile · .env.example
```

## Qabul mezonlari (Faza 0)
- ✅ `docker compose up` — barcha servis ko'tariladi.
- ✅ `/api/health/` 200 qaytaradi; migratsiyalar o'tadi; Celery worker redis'ga ulanadi.
- ✅ Frontend bosh sahifa ochiladi (Mishka, PWA).
- ✅ Obsidian vault (`docs/`) mavjud, `docs/SPEC.md` unga ulangan.

## Hujjatlar
- 📜 To'liq spetsifikatsiya: [`docs/SPEC.md`](docs/SPEC.md)
- 🏠 Vault bosh sahifa (MOC): [`docs/00-Home.md`](docs/00-Home.md)
- 🤖 Agent konteksti: [`CLAUDE.md`](CLAUDE.md) · vazifaga oid skills: [`.claude/skills/`](.claude/skills/)

## Litsenziya / brending
Brending konfiguratsiya orqali boshqariladi (`/api/config/`) — bir platforma, ko'p brending (B2B-ready, SPEC §10).
