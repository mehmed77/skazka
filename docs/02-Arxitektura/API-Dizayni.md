---
title: API Dizayni
type: arxitektura
tags: [arxitektura, api, rest]
status: tasdiqlangan
created: 2026-06-26
---

# 🔌 API Dizayni (REST)

> Bog'liq: [[02-Arxitektura/Tizim-Arxitekturasi]] · [[02-Arxitektura/SRS-Dvigateli]] · [[02-Arxitektura/Xavfsizlik]]

Backend **Django REST Framework** orqali JSON REST API beradi. Versiyalangan
endpointlar `/api/v1/` prefiksida. Autentifikatsiya — JWT (Bearer). SPEC §9.2.

## Konvensiyalar
- Resurslar ko'plikda / aniq nomli: `/curriculum`, `/lesson/{id}`, `/learning/event`.
- Pagination: `?page=&page_size=` (default 20).
- Saralash/filtr: `?ordering=`, `?theme=&age_band=`.
- Kontent kamdan-kam o'zgaradi → **Redis kesh + ETag** (shartli so'rov).
- Javoblar audio/rasm URL'lari bilan **to'liq** — frontend qo'shimcha so'rovsiz o'ynaydi.
- Xatolar: standart `{ "detail": ..., "errors": {...} }`.

## Asosiy endpointlar

### Tizim / Brending
| Method | Endpoint | Tavsif | Faza |
|---|---|---|:---:|
| GET | `/api/health/` | sog'liq tekshiruvi → 200 | 0 ✅ |
| GET | `/api/config/` | brending: rang, logo, feature-flag (institut bo'yicha) | 0/8 |

### Auth (ota-ona)
| Method | Endpoint | Tavsif |
|---|---|---|
| POST | `/api/v1/auth/register` | email/telefon + parol |
| POST | `/api/v1/auth/login` | → access/refresh token |
| POST | `/api/v1/auth/refresh` | tokenni yangilash (rotatsiya) |
| GET | `/api/v1/auth/me` | joriy ota-ona + bola profillari |
| POST | `/api/v1/auth/child-context` | profilga o'tish → **child-context token** (PIN) |

### Kurikulum / Dars (kontent)
| Method | Endpoint | Tavsif |
|---|---|---|
| GET | `/api/v1/curriculum/` | bola darajasiga mos Level→Theme→Lesson daraxti (rivoj bilan) |
| GET | `/api/v1/lesson/{id}/` | dars step'lari + so'z/harf/media + GameType konfiglari |

### O'rganish (SRS yadrosi)
| Method | Endpoint | Tavsif |
|---|---|---|
| GET | `/api/v1/learning/session/` | o'yin navbati — `interleave(due, yangi)` |
| POST | `/api/v1/learning/event/` | natija yozish → `ChildWordState` yangilanadi |

Batafsil mantiq → [[02-Arxitektura/SRS-Dvigateli]].

### Media
| Method | Endpoint | Tavsif |
|---|---|---|
| POST | `/api/v1/media/upload` | presigned upload (MinIO/S3) |
| GET | `/media/{key}` | Nginx RBAC-proxy orqali signed/ruxsatli URL |

## Child-context token

> [!info] Bolaga alohida login YO'Q
> Ota-ona JWT bilan kiradi → `POST /auth/child-context` (PIN bilan) → qisqa umrli
> **child-context token** olinadi. Bola rejimidagi barcha so'rovlar (`session`, `event`)
> shu token bilan — `child_id` token ichida, walled garden tamoyili → [[02-Arxitektura/Xavfsizlik]].

## OpenAPI
- `drf-spectacular` orqali `/api/v1/schema` va `/api/v1/docs` (Swagger UI).
- Frontend uchun TypeScript turlari schema'dan generatsiya (`openapi-typescript`).

> [!note] Versiyalash
> `/api/v1/` — kelajakdagi buzilishlarni ajratish uchun. `/api/health/` va `/api/config/`
> versiyasiz (infratuzilma). Yangi katta o'zgarish → `v2`.

> [!tip] Oflayn-birinchi
> Frontend oflayn `LearningEvent`'larni outbox'da to'playdi; onlayn bo'lganda
> `POST /learning/event/` **idempotent** (`session_id` + ts) yuboriladi → [[05-DevOps/Deploy]].
