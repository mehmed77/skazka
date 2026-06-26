---
name: backend-app
description: SKAZKA Django/DRF backend'ida yangi app yaratish yoki model/serializer/view/url qo'shish. Backend struktura, settings, Celery, migratsiya yoki API endpoint ustida ishlaganda ishlat.
---

# SKAZKA backend (Django + DRF) konvensiyalari

SKAZKA backend'i Maqola loyihasi konvensiyalarini takrorlaydi. Yangi kod yozishdan oldin
mavjud `apps/` strukturasiga qara va aynan o'shanga amal qil. To'liq mahsulot talablari: [docs/SPEC.md](../../../docs/SPEC.md).

## Struktura
- `backend/config/` — `settings/{base,dev,prod}.py` (env: `django-environ`), `urls.py`, `celery.py`, `wsgi.py`, `asgi.py`.
- `backend/apps/<app>/` — har app self-contained: `__init__.py, apps.py, models.py, serializers.py, views.py, urls.py, admin.py, tests.py, migrations/`.
- `apps/common/` — `BaseModel` (UUID + `created_at/updated_at`), `DefaultPagination`, `permissions.py`. Yangi modellar **BaseModel'dan meros oladi**.
- Bounded-context'lar: `accounts, content, learning, gamification, media, billing` (+`common`).

## Yangi app qo'shish (qadamlar)
1. `backend/apps/<app>/` papkasini standart fayllar bilan yarat (yuqoridagi ro'yxat).
2. `apps.py`:
   ```python
   class XConfig(AppConfig):
       default_auto_field = "django.db.models.BigAutoField"
       name = "apps.x"
       verbose_name = "<O'zbekcha nom>"
   ```
3. `config/settings/base.py` → `LOCAL_APPS` ro'yxatiga `"apps.x"` qo'sh.
4. Modelni yoz, `make makemigrations && make migrate`.
5. ViewSet'ni `urls.py` da `DefaultRouter` bilan ro'yxatdan o'tkaz, `config/urls.py` `api_v1` ga ulang.

## Model qoidalari
- `class X(BaseModel):` — UUID PK + vaqt belgilari avtomatik keladi.
- Holat/enum maydonlar: `models.TextChoices`, label'lar **o'zbekcha**. `verbose_name` o'zbekcha.
- Bola ma'lumotini minimal sақла (SPEC §8 — COPPA/GDPR-K ruhi). PII yig'ma.

## API / DRF qoidalari
- `REST_FRAMEWORK` `base.py` da: JWT auth, `IsAuthenticated` default, `DefaultPagination` (200/sahifa), `DjangoFilterBackend`+search+ordering.
- Versiyalash: `/api/v1/...`. OpenAPI: `/api/v1/schema/`, Swagger `/api/v1/docs/`.
- ViewSet'larda `select_related`/`prefetch_related` ishlat. RBAC: `apps.common.permissions` + (kelajakda) scoping funksiyalari.
- `/api/health/` va `/api/config/` — oddiy Django view (auth talab qilmaydi), `config/urls.py` da.

## Celery
- Vazifa: `apps/<app>/tasks.py` da `@shared_task`. `config/celery.py` autodiscover qiladi.
- Rejalashtirilgan: `CELERY_BEAT_SCHEDULE` (base.py), `crontab(...)`. Beat — `DatabaseScheduler`.
- SRS qayta hisob (Faza 6), media transcode (Faza 3) — shu yerda.

## Sifat
- Lint/format: `make lint` (ruff + black), `make fmt`. `pyproject.toml` da sozlangan (line 88, migrations chiqarilgan).
- Test: `make test` (pytest, `--reuse-db`). `conftest.py` fixture'lari (`api`, `admin_user`). Test fayl: `tests.py` yoki `test_*.py`.

## ⚠️ Custom User (muhim)
Skeleton'da Django standart `User` ishlatilmoqda. Faza 1'da `accounts` ga `ParentAccount` (email-asosli)
joriy qilinganda `AUTH_USER_MODEL` ni belgila va buni **TOZA DB ustida** qil (`docker compose down -v`),
chunki migratsiyadan keyin user modelini almashtirish og'riqli. Batafsil: `docs/06-Modullar/Accounts.md`.
